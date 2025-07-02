
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

    console.log(`Scraping AA flights: ${origin} -> ${destination} on ${departureDate}`);

    // Simulate scraping American Airlines website
    // In production, this would use a headless browser like Puppeteer
    const scrapedResults = await scrapeAmericanAirlines({
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
      airline: 'American Airlines'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error scraping American Airlines:', error);
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

async function scrapeAmericanAirlines(params: FlightSearchParams): Promise<FlightResult[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));

  console.log('Simulating AA website scraping...');
  
  // Mock scraping results based on parameters
  const cabinMultiplier = getCabinMultiplier(params.cabinClass);
  const routeMultiplier = getRouteMultiplier(params.origin, params.destination);
  
  const results: FlightResult[] = [];
  
  // Generate 2-4 mock flight options
  const numFlights = Math.floor(Math.random() * 3) + 2;
  
  for (let i = 0; i < numFlights; i++) {
    const basePointsCost = 25000 + Math.floor(Math.random() * 40000);
    const pointsCost = Math.floor(basePointsCost * cabinMultiplier * routeMultiplier);
    
    results.push({
      airline: 'American Airlines',
      flight: `AA ${100 + Math.floor(Math.random() * 9000)}`,
      departure: generateRandomTime(),
      arrival: generateRandomTime(true),
      duration: generateDuration(),
      aircraft: getRandomAircraft(),
      pointsCost,
      cashCost: Math.floor(pointsCost * 0.012) + Math.floor(Math.random() * 100), // Taxes and fees
      availability: Math.random() > 0.3 ? 'Available' : 'Waitlist',
      stops: Math.random() > 0.6 ? 0 : Math.random() > 0.5 ? 1 : 2
    });
  }

  console.log(`Found ${results.length} AA flights`);
  return results;
}

function getCabinMultiplier(cabinClass: string): number {
  switch (cabinClass.toLowerCase()) {
    case 'economy': return 1;
    case 'premium-economy': return 1.5;
    case 'business': return 2.5;
    case 'first': return 4;
    default: return 1;
  }
}

function getRouteMultiplier(origin: string, destination: string): number {
  // Domestic US routes are cheaper
  const usCities = ['LAX', 'JFK', 'DFW', 'ORD', 'ATL', 'MIA', 'SEA', 'SFO', 'BOS', 'IAD'];
  if (usCities.includes(origin) && usCities.includes(destination)) {
    return 0.6;
  }
  
  // International routes cost more
  return 1.2 + Math.random() * 0.4;
}

function generateRandomTime(isArrival = false): string {
  const hour = Math.floor(Math.random() * 24);
  const minute = Math.floor(Math.random() * 4) * 15; // 0, 15, 30, 45
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
}

function generateDuration(): string {
  const hours = Math.floor(Math.random() * 12) + 2;
  const minutes = Math.floor(Math.random() * 4) * 15;
  return `${hours}h ${minutes}m`;
}

function getRandomAircraft(): string {
  const aircraft = ['Boeing 737', 'Boeing 777', 'Boeing 787', 'Airbus A320', 'Airbus A330', 'Airbus A350'];
  return aircraft[Math.floor(Math.random() * aircraft.length)];
}
