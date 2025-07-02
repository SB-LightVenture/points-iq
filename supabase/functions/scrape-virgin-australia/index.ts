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

    console.log(`Scraping Virgin Australia flights: ${origin} -> ${destination} on ${departureDate}`);

    // Simulate scraping Virgin Australia Velocity website
    // In production, this would use a headless browser like Puppeteer
    const scrapedResults = await scrapeVirginAustralia({
      origin,
      destination,
      departureDate,
      returnDate,
      cabinClass,
      passengers
    });

    return new Response(JSON.stringify({
      success: true,
      results: scrapedResults,
      scraped_at: new Date().toISOString(),
      airline: 'Virgin Australia'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error scraping Virgin Australia:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        results: []
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function scrapeVirginAustralia(params: FlightSearchParams): Promise<FlightResult[]> {
  // Simulate network delay for Virgin Australia website
  await new Promise(resolve => setTimeout(resolve, 1500 + Math.random() * 2500));

  console.log('Simulating Virgin Australia Velocity website scraping...');
  
  // Mock scraping results based on parameters - Virgin Australia specific
  const cabinMultiplier = getCabinMultiplier(params.cabinClass);
  const routeMultiplier = getRouteMultiplier(params.origin, params.destination);
  
  const results: FlightResult[] = [];
  
  // Generate 1-3 mock flight options (Virgin Australia tends to have fewer options)
  const numFlights = Math.floor(Math.random() * 3) + 1;
  
  for (let i = 0; i < numFlights; i++) {
    const basePointsCost = 18000 + Math.floor(Math.random() * 35000); // VA points tend to be slightly lower
    const pointsCost = Math.floor(basePointsCost * cabinMultiplier * routeMultiplier);
    
    results.push({
      airline: 'Virgin Australia',
      flight: `VA ${100 + Math.floor(Math.random() * 2000)}`, // VA flight numbers are typically lower
      departure: generateRandomTime(),
      arrival: generateRandomTime(true),
      duration: generateDuration(),
      aircraft: getRandomVirginAircraftType(),
      pointsCost,
      cashCost: Math.floor(pointsCost * 0.011) + Math.floor(Math.random() * 80), // Slightly lower fees
      availability: Math.random() > 0.25 ? 'Available' : 'Waitlist', // Better availability than some airlines
      stops: Math.random() > 0.7 ? 0 : Math.random() > 0.6 ? 1 : 2
    });
  }

  console.log(`Found ${results.length} Virgin Australia flights`);
  return results;
}

function getCabinMultiplier(cabinClass: string): number {
  switch (cabinClass.toLowerCase()) {
    case 'economy': return 1;
    case 'premium-economy': return 1.4; // VA's premium economy is competitive
    case 'business': return 2.2; // VA business class pricing
    case 'first': return 3.5; // Limited first class options
    default: return 1;
  }
}

function getRouteMultiplier(origin: string, destination: string): number {
  // Australian domestic routes are Virgin Australia's strength
  const australianCities = ['SYD', 'MEL', 'BNE', 'PER', 'ADL', 'CBR', 'DRW', 'HBA', 'CNS'];
  if (australianCities.includes(origin) && australianCities.includes(destination)) {
    return 0.5; // Very competitive domestic pricing
  }
  
  // Trans-Pacific routes (Virgin Australia's international focus)
  const transPacificCities = ['LAX', 'SFO', 'NAN', 'VLI'];
  if ((australianCities.includes(origin) && transPacificCities.includes(destination)) ||
      (transPacificCities.includes(origin) && australianCities.includes(destination))) {
    return 0.9;
  }
  
  // Other international routes (limited)
  return 1.3 + Math.random() * 0.3;
}

function generateRandomTime(isArrival = false): string {
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function generateDuration(): string {
  const hours = Math.floor(Math.random() * 15) + 1; // Virgin Australia operates some long routes
  const minutes = Math.floor(Math.random() * 4) * 15;
  return `${hours}h ${minutes}m`;
}

function getRandomVirginAircraftType(): string {
  const aircraft = ['Boeing 737-800', 'Boeing 777-300ER', 'Airbus A330-200', 'ATR 72-600', 'Embraer E190'];
  return aircraft[Math.floor(Math.random() * aircraft.length)];
}
