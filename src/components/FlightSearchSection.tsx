
import React, { useState, useEffect } from 'react';
import { Search, Plane } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import FlightSearchResults from '@/components/FlightSearchResults';
import FlightSearchForm from '@/components/FlightSearchForm';
import FlightSearchSummary from '@/components/FlightSearchSummary';
import PartnerNetworksDisplay from '@/components/PartnerNetworksDisplay';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface FlightSearchSectionProps {
  selectedWallets: PointsWallet[];
  initialSearchParams?: {
    origin?: string;
    destination?: string;
  } | null;
}

const FlightSearchSection: React.FC<FlightSearchSectionProps> = ({ 
  selectedWallets, 
  initialSearchParams 
}) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cabinClass, setCabinClass] = useState('economy');
  const [passengers, setPassengers] = useState(1);

  const { searchResults, loading, error, searchFlights, clearResults } = useFlightSearch();

  // Update search fields when initial parameters change
  useEffect(() => {
    if (initialSearchParams) {
      if (initialSearchParams.origin) {
        setOrigin(initialSearchParams.origin);
      }
      if (initialSearchParams.destination) {
        setDestination(initialSearchParams.destination);
      }
    }
  }, [initialSearchParams]);

  const handleSearch = () => {
    if (!origin.trim() || !destination.trim() || !departureDate) {
      return;
    }

    searchFlights({
      origin: origin.trim().toUpperCase(),
      destination: destination.trim().toUpperCase(),
      departureDate,
      returnDate: returnDate || undefined,
      cabinClass,
      passengers,
      selectedWallets
    });
  };

  const handleNewSearch = () => {
    clearResults();
    setOrigin('');
    setDestination('');
    setDepartureDate('');
    setReturnDate('');
    setCabinClass('economy');
    setPassengers(1);
  };

  const getTotalPrograms = () => {
    return selectedWallets.length;
  };

  // Show results if we have them
  if (searchResults) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-white">Flight Search Results</h3>
          <Button
            onClick={handleNewSearch}
            className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white"
          >
            New Search
          </Button>
        </div>
        <FlightSearchResults searchResults={searchResults} loading={loading} />
      </div>
    );
  }

  if (selectedWallets.length === 0) {
    return (
      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
        <Plane className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Select Wallets to Search</h3>
        <p className="text-gray-300">
          Choose one or more wallets above to start searching for flight availability
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
          <Search className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">Flight Search</h3>
          <p className="text-sm text-gray-400">
            Searching across {getTotalPrograms()} program{getTotalPrograms() !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      <FlightSearchSummary selectedWallets={selectedWallets} />

      <FlightSearchForm
        origin={origin}
        destination={destination}
        departureDate={departureDate}
        returnDate={returnDate}
        cabinClass={cabinClass}
        passengers={passengers}
        loading={loading}
        error={error}
        onOriginChange={setOrigin}
        onDestinationChange={setDestination}
        onDepartureDateChange={setDepartureDate}
        onReturnDateChange={setReturnDate}
        onCabinClassChange={setCabinClass}
        onPassengersChange={setPassengers}
        onSearch={handleSearch}
      />

      <PartnerNetworksDisplay selectedWallets={selectedWallets} />
    </div>
  );
};

export default FlightSearchSection;
