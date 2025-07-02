
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass: string;
  passengers: number;
  selectedWallets: PointsWallet[];
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

interface SearchResult {
  searchId: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass: string;
  results: {
    programId: string;
    programName: string;
    programCode: string;
    availability: FlightResult[];
    scraped: boolean;
    error?: string | null;
  }[];
}

export const useFlightSearch = () => {
  const { user } = useAuth();
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchFlights = async (params: FlightSearchParams) => {
    if (!user) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Starting flight search with scraping...');
      
      const { data, error: functionError } = await supabase.functions.invoke('flight-search', {
        body: params
      });

      if (functionError) {
        throw new Error(functionError.message);
      }

      console.log('Flight search completed:', data);
      setSearchResults(data);
      
      // Log scraping success/failure for each program
      if (data.results) {
        data.results.forEach((result: any) => {
          if (result.scraped) {
            console.log(`✅ Successfully scraped ${result.programCode}: ${result.availability.length} flights found`);
          } else {
            console.log(`❌ Failed to scrape ${result.programCode}:`, result.error);
          }
        });
      }
      
    } catch (err) {
      console.error('Flight search error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred during search');
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setSearchResults(null);
    setError(null);
  };

  return {
    searchResults,
    loading,
    error,
    searchFlights,
    clearResults
  };
};
