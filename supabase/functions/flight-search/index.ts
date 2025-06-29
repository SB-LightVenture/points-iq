
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

    // TODO: Replace with actual Amadeus API integration
    // For now, return mock data structure
    const mockResults = {
      searchId: searchRecord.id,
      origin,
      destination,
      departureDate,
      returnDate,
      cabinClass,
      results: selectedWallets.map((wallet: any) => ({
        programId: wallet.program_id,
        programName: wallet.frequent_flyer_programs.name,
        programCode: wallet.frequent_flyer_programs.code,
        availability: [
          {
            airline: 'American Airlines',
            flight: 'AA 100',
            departure: '08:00',
            arrival: '14:30',
            duration: '6h 30m',
            aircraft: 'Boeing 737',
            pointsCost: Math.floor(Math.random() * 50000) + 25000,
            cashCost: Math.floor(Math.random() * 200) + 50,
            availability: Math.random() > 0.3 ? 'Available' : 'Waitlist',
            stops: 0
          },
          {
            airline: 'United Airlines',
            flight: 'UA 250',
            departure: '10:15',
            arrival: '17:45',
            duration: '7h 30m',
            aircraft: 'Boeing 787',
            pointsCost: Math.floor(Math.random() * 60000) + 30000,
            cashCost: Math.floor(Math.random() * 300) + 75,
            availability: Math.random() > 0.4 ? 'Available' : 'Waitlist',
            stops: 1
          }
        ]
      }))
    };

    // Update search record with results
    await supabase
      .from('flight_searches')
      .update({
        api_response: mockResults,
        status: 'completed',
        updated_at: new Date().toISOString()
      })
      .eq('id', searchRecord.id);

    return new Response(JSON.stringify(mockResults), {
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
