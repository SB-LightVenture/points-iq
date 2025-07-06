import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass: string;
  passengers: number;
}

interface FlightResult {
  airline: string;
  flight: string;
  departure: string;
  arrival: string;
  duration: string;
  aircraft: string;
  pointsCost: number;
  cashCost: number;
  availability: string;
  stops: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { origin, destination, departureDate, returnDate, cabinClass, passengers }: FlightSearchParams = await req.json();

    console.log(`Scraping Virgin Australia: ${origin} -> ${destination} on ${departureDate}`);

    // Try live scraping first, fallback to enhanced mock data
    let scrapedResults: FlightResult[];
    let dataSource = 'live_scraping';
    let errorMessage = null;

    try {
      scrapedResults = await scrapeVirginAustraliaLive({
        origin,
        destination,
        departureDate,
        returnDate,
        cabinClass,
        passengers
      });
      
      if (scrapedResults.length === 0) {
        throw new Error('No flights found via live scraping');
      }
      
      console.log(`Live scraping successful: Found ${scrapedResults.length} flights`);
    } catch (scrapeError) {
      console.log('Live scraping failed, falling back to enhanced mock data:', scrapeError.message);
      dataSource = 'enhanced_mock';
      errorMessage = scrapeError.message;
      
      // Fallback to enhanced mock data
      scrapedResults = await generateEnhancedVirginAustraliaData({
        origin,
        destination,
        departureDate,
        returnDate,
        cabinClass,
        passengers
      });
    }

    return new Response(JSON.stringify({
      success: true,
      results: scrapedResults,
      scraped_at: new Date().toISOString(),
      airline: 'Virgin Australia',
      live_scraping: dataSource === 'live_scraping',
      source: dataSource,
      error: errorMessage,
      debug: {
        data_source: dataSource,
        route: `${origin}-${destination}`,
        cabin_class: cabinClass,
        scraping_method: dataSource === 'live_scraping' ? 'playwright_browser_automation' : 'realistic_simulation',
        fallback_reason: errorMessage
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Virgin Australia scraper:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        results: [],
        source: 'error',
        debug: {
          error_type: 'scraper_failure',
          error_details: error.message
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function scrapeVirginAustraliaLive(params: FlightSearchParams): Promise<FlightResult[]> {
  // Import Playwright for Deno
  const { chromium } = await import("npm:playwright@1.40.0");
  
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ]
  });

  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 }
    });

    const page = await context.newPage();
    
    // Set up network interception to capture API calls
    const apiCalls: any[] = [];
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('api') || url.includes('flight') || url.includes('search')) {
        try {
          const responseData = await response.json();
          apiCalls.push({
            url,
            status: response.status(),
            data: responseData
          });
        } catch (e) {
          // Response might not be JSON
        }
      }
    });

    // Navigate to Virgin Australia booking page
    await page.goto('https://www.virginaustralia.com/au/en/booking/flight-booking/', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    // Fill in search form
    await page.waitForSelector('[data-testid="search-form"]', { timeout: 10000 });
    
    // Fill origin
    await page.click('[data-testid="departure-airport-input"]');
    await page.fill('[data-testid="departure-airport-input"]', params.origin);
    await page.waitForTimeout(1000);
    
    // Fill destination
    await page.click('[data-testid="arrival-airport-input"]');
    await page.fill('[data-testid="arrival-airport-input"]', params.destination);
    await page.waitForTimeout(1000);
    
    // Fill departure date
    await page.click('[data-testid="departure-date-input"]');
    await page.fill('[data-testid="departure-date-input"]', formatDateForVA(params.departureDate));
    
    // Fill return date if provided
    if (params.returnDate) {
      await page.click('[data-testid="return-date-input"]');
      await page.fill('[data-testid="return-date-input"]', formatDateForVA(params.returnDate));
    }
    
    // Set passengers
    if (params.passengers > 1) {
      await page.click('[data-testid="passenger-selector"]');
      // Add passenger logic here
    }
    
    // Set cabin class
    if (params.cabinClass !== 'economy') {
      await page.click('[data-testid="cabin-class-selector"]');
      await page.click(`[data-testid="cabin-${params.cabinClass}"]`);
    }

    // Submit search
    await page.click('[data-testid="search-flights-button"]');
    
    // Wait for results to load
    await page.waitForSelector('[data-testid="flight-results"]', { timeout: 30000 });
    await page.waitForTimeout(3000); // Wait for all results to load

    // Extract flight data
    const flights = await page.evaluate(() => {
      const flightElements = document.querySelectorAll('[data-testid="flight-option"]');
      const results: any[] = [];
      
      flightElements.forEach((element) => {
        try {
          const flightNumber = element.querySelector('[data-testid="flight-number"]')?.textContent?.trim() || '';
          const departure = element.querySelector('[data-testid="departure-time"]')?.textContent?.trim() || '';
          const arrival = element.querySelector('[data-testid="arrival-time"]')?.textContent?.trim() || '';
          const duration = element.querySelector('[data-testid="flight-duration"]')?.textContent?.trim() || '';
          const aircraft = element.querySelector('[data-testid="aircraft-type"]')?.textContent?.trim() || '';
          const pointsText = element.querySelector('[data-testid="points-cost"]')?.textContent?.trim() || '';
          const cashText = element.querySelector('[data-testid="cash-cost"]')?.textContent?.trim() || '';
          const availabilityText = element.querySelector('[data-testid="availability"]')?.textContent?.trim() || '';
          const stopsText = element.querySelector('[data-testid="stops"]')?.textContent?.trim() || '';
          
          // Extract numeric values
          const pointsCost = parseInt(pointsText.replace(/[^\d]/g, '')) || 0;
          const cashCost = parseInt(cashText.replace(/[^\d]/g, '')) || 0;
          const stops = stopsText.includes('Direct') ? 0 : 1;
          
          if (flightNumber && departure && arrival) {
            results.push({
              airline: 'Virgin Australia',
              flight: flightNumber,
              departure,
              arrival,
              duration,
              aircraft: aircraft || 'Boeing 737-800',
              pointsCost,
              cashCost,
              availability: availabilityText || 'Available',
              stops
            });
          }
        } catch (e) {
          console.log('Error parsing flight element:', e);
        }
      });
      
      return results;
    });

    console.log(`Scraped ${flights.length} flights from Virgin Australia`);
    console.log('API calls intercepted:', apiCalls.length);
    
    // Log API calls for future direct integration
    apiCalls.forEach(call => {
      console.log(`API Call: ${call.url} - Status: ${call.status}`);
    });

    if (flights.length === 0) {
      throw new Error('No flights found on Virgin Australia website');
    }

    return flights;
    
  } finally {
    await browser.close();
  }
}

function formatDateForVA(dateString: string): string {
  // Convert YYYY-MM-DD to DD/MM/YYYY format for Virgin Australia
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

async function generateEnhancedVirginAustraliaData(params: FlightSearchParams): Promise<FlightResult[]> {
  const { origin, destination, cabinClass, passengers } = params;
  
  // Enhanced route-based flight generation
  const routeInfo = getRouteInfo(origin, destination);
  const cabinMultiplier = getCabinMultiplier(cabinClass);
  
  const results: FlightResult[] = [];
  const numFlights = Math.floor(Math.random() * 3) + 2; // 2-4 flights
  
  for (let i = 0; i < numFlights; i++) {
    const flightTimes = generateRealisticFlightTimes(routeInfo.duration);
    const basePointsCost = routeInfo.basePoints;
    const pointsCost = Math.floor(basePointsCost * cabinMultiplier * (0.9 + Math.random() * 0.2));
    
    results.push({
      airline: 'Virgin Australia',
      flight: `VA ${routeInfo.flightNumberRange.min + Math.floor(Math.random() * (routeInfo.flightNumberRange.max - routeInfo.flightNumberRange.min))}`,
      departure: flightTimes.departure,
      arrival: flightTimes.arrival,
      duration: routeInfo.duration,
      aircraft: getRealisticVirginAircraftForRoute(routeInfo.type),
      pointsCost,
      cashCost: Math.floor(pointsCost * 0.012) + Math.floor(Math.random() * 60) + 89,
      availability: getRealisticAvailability(cabinClass),
      stops: routeInfo.stops
    });
  }

  // Sort by departure time
  results.sort((a, b) => a.departure.localeCompare(b.departure));

  return results;
}

interface RouteInfo {
  type: 'domestic' | 'trans_tasman' | 'pacific' | 'international';
  duration: string;
  basePoints: number;
  stops: number;
  flightNumberRange: { min: number; max: number };
}

function getRouteInfo(origin: string, destination: string): RouteInfo {
  const australianCities = ['SYD', 'MEL', 'BNE', 'PER', 'ADL', 'CBR', 'DRW', 'HBA', 'CNS', 'TSV', 'OOL'];
  const newZealandCities = ['AKL', 'CHC', 'WLG', 'ZQN'];
  const pacificCities = ['NAN', 'VLI', 'APW', 'NOU'];
  const usCities = ['LAX', 'SFO', 'DFW', 'HNL'];

  const isOriginAus = australianCities.includes(origin);
  const isDestAus = australianCities.includes(destination);
  const isOriginNZ = newZealandCities.includes(origin);
  const isDestNZ = newZealandCities.includes(destination);
  const isOriginPacific = pacificCities.includes(origin);
  const isDestPacific = pacificCities.includes(destination);
  const isOriginUS = usCities.includes(origin);
  const isDestUS = usCities.includes(destination);

  // Domestic Australia
  if (isOriginAus && isDestAus) {
    const distance = getAustralianDistance(origin, destination);
    return {
      type: 'domestic',
      duration: distance.duration,
      basePoints: distance.points,
      stops: distance.stops,
      flightNumberRange: { min: 300, max: 999 }
    };
  }

  // Trans-Tasman (Australia <-> New Zealand)
  if ((isOriginAus && isDestNZ) || (isOriginNZ && isDestAus)) {
    return {
      type: 'trans_tasman',
      duration: '3h 15m',
      basePoints: 18000,
      stops: 0,
      flightNumberRange: { min: 100, max: 199 }
    };
  }

  // Pacific Islands
  if ((isOriginAus && isDestPacific) || (isOriginPacific && isDestAus)) {
    return {
      type: 'pacific',
      duration: '2h 45m',
      basePoints: 22000,
      stops: 0,
      flightNumberRange: { min: 1300, max: 1399 }
    };
  }

  // US routes
  if ((isOriginAus && isDestUS) || (isOriginUS && isDestAus)) {
    return {
      type: 'international',
      duration: '13h 30m',
      basePoints: 65000,
      stops: 0,
      flightNumberRange: { min: 1, max: 99 }
    };
  }

  // Default international
  return {
    type: 'international',
    duration: '8h 45m',
    basePoints: 45000,
    stops: Math.random() > 0.6 ? 0 : 1,
    flightNumberRange: { min: 200, max: 299 }
  };
}

function getAustralianDistance(origin: string, destination: string) {
  const distances: Record<string, Record<string, { duration: string; points: number; stops: number }>> = {
    'SYD': {
      'MEL': { duration: '1h 25m', points: 8000, stops: 0 },
      'BNE': { duration: '1h 20m', points: 8000, stops: 0 },
      'PER': { duration: '5h 15m', points: 15000, stops: 0 },
      'ADL': { duration: '2h 5m', points: 10000, stops: 0 }
    },
    'MEL': {
      'SYD': { duration: '1h 25m', points: 8000, stops: 0 },
      'BNE': { duration: '2h 15m', points: 12000, stops: 0 },
      'PER': { duration: '3h 45m', points: 15000, stops: 0 },
      'ADL': { duration: '1h 20m', points: 8000, stops: 0 }
    }
  };

  return distances[origin]?.[destination] || { duration: '2h 30m', points: 12000, stops: 0 };
}

function getCabinMultiplier(cabinClass: string): number {
  switch (cabinClass.toLowerCase()) {
    case 'economy': return 1;
    case 'premium-economy': return 1.6;
    case 'business': return 2.8;
    case 'first': return 4.2;
    default: return 1;
  }
}

function generateRealisticFlightTimes(duration: string): { departure: string; arrival: string } {
  const commonDepartureTimes = [
    '06:00', '06:30', '07:15', '08:00', '08:45', '09:30',
    '10:15', '11:00', '12:30', '13:45', '15:00', '16:15',
    '17:30', '18:45', '19:30', '20:15', '21:00'
  ];

  const departure = commonDepartureTimes[Math.floor(Math.random() * commonDepartureTimes.length)];
  
  // Parse duration and calculate arrival
  const durationMatch = duration.match(/(\d+)h\s*(\d+)m/);
  const hours = parseInt(durationMatch?.[1] || '2');
  const minutes = parseInt(durationMatch?.[2] || '0');
  
  const [depHour, depMin] = departure.split(':').map(Number);
  const totalMinutes = depHour * 60 + depMin + hours * 60 + minutes;
  const arrHour = Math.floor(totalMinutes / 60) % 24;
  const arrMin = totalMinutes % 60;
  
  const arrival = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;

  return { departure, arrival };
}

function getRealisticVirginAircraftForRoute(routeType: string): string {
  const aircraft = {
    'domestic': ['Boeing 737-800', 'Boeing 737-700', 'ATR 72-600', 'Embraer E190'],
    'trans_tasman': ['Boeing 737-800', 'Boeing 777-300ER'],
    'pacific': ['Boeing 737-800', 'Boeing 777-300ER'],
    'international': ['Boeing 777-300ER', 'Airbus A330-200']
  };

  const availableAircraft = aircraft[routeType as keyof typeof aircraft] || aircraft.domestic;
  return availableAircraft[Math.floor(Math.random() * availableAircraft.length)];
}

function getRealisticAvailability(cabinClass: string): string {
  const availabilityRates = {
    'economy': { available: 0.8, waitlist: 0.15, unavailable: 0.05 },
    'premium-economy': { available: 0.7, waitlist: 0.2, unavailable: 0.1 },
    'business': { available: 0.5, waitlist: 0.3, unavailable: 0.2 },
    'first': { available: 0.3, waitlist: 0.4, unavailable: 0.3 }
  };

  const rates = availabilityRates[cabinClass as keyof typeof availabilityRates] || availabilityRates.economy;
  const rand = Math.random();
  
  if (rand < rates.available) return 'Available';
  if (rand < rates.available + rates.waitlist) return 'Waitlist';
  return 'Unavailable';
}
