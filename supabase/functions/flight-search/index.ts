
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { 
      origin, 
      destination, 
      departureDate, 
      returnDate, 
      cabinClass = 'economy',
      passengers = 1,
      selectedWallets = []
    } = await req.json();

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid user token');
    }

    // Store search request in database
    const searchParams = {
      origin,
      destination,
      departureDate,
      returnDate,
      cabinClass,
      passengers,
      selectedWallets: selectedWallets.map((w: any) => w.id)
    };

    const { data: searchRecord, error: insertError } = await supabase
      .from('flight_searches')
      .insert({
        user_id: user.id,
        origin_airport: origin,
        destination_airport: destination,
        departure_date: departureDate,
        return_date: returnDate,
        cabin_class: cabinClass,
        passengers,
        search_parameters: searchParams,
        status: 'searching'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error storing search:', insertError);
      throw new Error('Failed to store search request');
    }

    // Update or create flight route record
    await supabase
      .from('flight_routes')
      .upsert({
        origin_airport: origin,
        destination_airport: destination,
        route_name: `${origin} → ${destination}`,
        search_count: 1,
        last_searched_at: new Date().toISOString()
      }, {
        onConflict: 'origin_airport,destination_airport'
      });

    // Start scraping process
    console.log('Starting flight scraping process...');
    const scrapingResults = await scrapeFlightsForWallets({
      origin,
      destination,
      departureDate,
      returnDate,
      cabinClass,
      passengers,
      selectedWallets
    });

    // Format results for frontend
    const formattedResults = {
      searchId: searchRecord.id,
      origin,
      destination,
      departureDate,
      returnDate,
      cabinClass,
      results: scrapingResults
    };

    // Update search record with results
    await supabase
      .from('flight_searches')
      .update({
        api_response: formattedResults,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', searchRecord.id);

    return new Response(JSON.stringify(formattedResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in flight-search function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function scrapeFlightsForWallets(params: any) {
  const results = [];
  
  for (const wallet of params.selectedWallets) {
    const programCode = wallet.frequent_flyer_programs.code;
    let scrapingResult = null;

    console.log(`Scraping flights for ${programCode}...`);

    try {
      // Only scrape for American Airlines for now
      if (programCode === 'AA') {
        const { data, error } = await supabase.functions.invoke('scrape-american-airlines', {
          body: {
            origin: params.origin,
            destination: params.destination,
            departureDate: params.departureDate,
            returnDate: params.returnDate,
            cabinClass: params.cabinClass,
            passengers: params.passengers
          }
        });

        if (error) {
          console.error(`Error scraping ${programCode}:`, error);
          scrapingResult = {
            success: false,
            results: [],
            error: error.message
          };
        } else {
          scrapingResult = data;
        }
      } else {
        // For other airlines, use mock data for now
        console.log(`${programCode} scraper not implemented yet, using mock data`);
        scrapingResult = {
          success: true,
          results: generateMockFlights(programCode, params),
          scraped_at: new Date().toISOString(),
          airline: wallet.frequent_flyer_programs.name
        };
      }

      results.push({
        programId: wallet.program_id,
        programName: wallet.frequent_flyer_programs.name,
        programCode: programCode,
        availability: scrapingResult.success ? scrapingResult.results : [],
        scraped: scrapingResult.success,
        error: scrapingResult.error || null
      });
      
    } catch (error) {
      console.error(`Failed to scrape ${programCode}:`, error);
      results.push({
        programId: wallet.program_id,
        programName: wallet.frequent_flyer_programs.name,
        programCode: programCode,
        availability: [],
        scraped: false,
        error: error.message
      });
    }
  }

  return results;
}

function generateMockFlights(programCode: string, params: any) {
  // Generate mock data for airlines we haven't implemented scraping for yet
  const airlines = {
    'QF': 'Qantas',
    'VA': 'Virgin Australia', 
    'BA': 'British Airways',
    'EK': 'Emirates',
    'SQ': 'Singapore Airlines',
    'CX': 'Cathay Pacific'
  };

  const airlineName = airlines[programCode as keyof typeof airlines] || 'Unknown';
  
  return [
    {
      airline: airlineName,
      flight: `${programCode} ${Math.floor(Math.random() * 9000) + 100}`,
      departure: '09:30',
      arrival: '15:45',
      duration: '6h 15m',
      aircraft: 'Boeing 777',
      pointsCost: Math.floor(Math.random() * 50000) + 30000,
      cashCost: Math.floor(Math.random() * 200) + 100,
      availability: Math.random() > 0.4 ? 'Available' : 'Waitlist',
      stops: Math.random() > 0.7 ? 0 : 1
    }
  ];
}
