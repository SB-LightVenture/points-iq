
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { FlightSearchParams } from './urlBuilder.ts';
import { FlightResult } from './dataExtractor.ts';
import { scrapeVirginAustraliaAwardFlights } from './browserScraper.ts';
import { generateEnhancedVirginAustraliaData } from './mockDataGenerator.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { origin, destination, departureDate, returnDate, cabinClass, passengers }: FlightSearchParams = await req.json();

    console.log(`Virgin Australia Award Flights Search: ${origin} -> ${destination} on ${departureDate}`);

    // Try HTTP-based live scraping first, then Playwright, then fallback to enhanced mock data
    let scrapedResults: FlightResult[];
    let dataSource = 'live_scraping';
    let errorMessage = null;

    try {
      scrapedResults = await scrapeVirginAustraliaAwardFlights({
        origin,
        destination,
        departureDate,
        returnDate,
        cabinClass,
        passengers
      });
      
      if (scrapedResults.length === 0) {
        throw new Error('No award flights found via live scraping');
      }
      
      console.log(`Live award scraping successful: Found ${scrapedResults.length} flights`);
    } catch (scrapeError) {
      console.log('Live award scraping failed, falling back to enhanced mock data:', scrapeError.message);
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
        scraping_method: dataSource === 'live_scraping' ? 'http_then_playwright_award_booking' : 'realistic_simulation',
        fallback_reason: errorMessage,
        award_booking: true,
        approach: 'http_first_then_browser_fallback'
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in Virgin Australia award scraper:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message,
        results: [],
        source: 'error',
        debug: {
          error_type: 'award_scraper_failure',
          error_details: error.message,
          approach: 'http_first_then_browser_fallback'
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
