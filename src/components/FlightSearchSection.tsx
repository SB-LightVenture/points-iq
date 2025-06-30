import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plane, MapPin, Calendar } from 'lucide-react';
import { useFlightSearch } from '@/hooks/useFlightSearch';
import FlightSearchResults from '@/components/FlightSearchResults';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface FlightSearchSectionProps {
  selectedWallets: PointsWallet[];
}

const FlightSearchSection: React.FC<FlightSearchSectionProps> = ({ selectedWallets }) => {
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [cabinClass, setCabinClass] = useState('economy');
  const [passengers, setPassengers] = useState(1);

  const { searchResults, loading, error, searchFlights, clearResults } = useFlightSearch();

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

  const getUniquePartners = () => {
    const allPartners = new Set<string>();
    selectedWallets.forEach(wallet => {
      wallet.frequent_flyer_programs.partner_programs?.forEach(partner => {
        allPartners.add(partner);
      });
    });
    return Array.from(allPartners);
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

      {/* Selected Wallets Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {selectedWallets.map((wallet) => (
          <div key={wallet.id} className="bg-slate-700/30 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-white text-sm">{wallet.frequent_flyer_programs.name}</h4>
              <span className="text-xs text-gray-400">{wallet.frequent_flyer_programs.code}</span>
            </div>
            <p className="text-lg font-bold text-blue-400">{wallet.points_balance.toLocaleString()} pts</p>
            <p className="text-xs text-gray-400">{wallet.status_level}</p>
          </div>
        ))}
      </div>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="origin" className="text-gray-300">Origin</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="origin"
              type="text"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 pl-10"
              placeholder="e.g., LAX, JFK, DFW"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="destination" className="text-gray-300">Destination</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 pl-10"
              placeholder="e.g., NRT, LHR, CDG"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="departure" className="text-gray-300">Departure Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="departure"
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="return" className="text-gray-300">Return Date (Optional)</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="return"
              type="date"
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cabin" className="text-gray-300">Cabin Class</Label>
          <Select value={cabinClass} onValueChange={setCabinClass}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="economy" className="text-white hover:bg-slate-700">Economy</SelectItem>
              <SelectItem value="premium-economy" className="text-white hover:bg-slate-700">Premium Economy</SelectItem>
              <SelectItem value="business" className="text-white hover:bg-slate-700">Business</SelectItem>
              <SelectItem value="first" className="text-white hover:bg-slate-700">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="passengers" className="text-gray-300">Passengers</Label>
          <Select value={passengers.toString()} onValueChange={(value) => setPassengers(parseInt(value))}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()} className="text-white hover:bg-slate-700">
                  {num} {num === 1 ? 'Passenger' : 'Passengers'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={handleSearch}
          disabled={!origin.trim() || !destination.trim() || !departureDate || loading}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <Search className="w-4 h-4 mr-2" />
          {loading ? 'Searching...' : 'Search Flights'}
        </Button>
        
        {error && (
          <div className="text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Partner Networks Info */}
      {getUniquePartners().length > 0 && (
        <div className="bg-slate-700/20 rounded-lg p-4">
          <h4 className="text-sm font-semibold text-gray-300 mb-2">Available Partner Networks</h4>
          <div className="flex flex-wrap gap-2">
            {getUniquePartners().map((partner) => (
              <span
                key={partner}
                className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
              >
                {partner}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FlightSearchSection;
