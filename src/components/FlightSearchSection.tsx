
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Plane, MapPin } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface FlightSearchSectionProps {
  selectedWallets: PointsWallet[];
}

const FlightSearchSection: React.FC<FlightSearchSectionProps> = ({ selectedWallets }) => {
  const [destination, setDestination] = useState('');
  const [cabinClass, setCabinClass] = useState('economy');

  const handleSearch = () => {
    console.log('Searching flights with:', { destination, cabinClass, selectedWallets });
    // Flight search implementation will go here
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              placeholder="e.g., Tokyo, LAX, LHR"
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

        <div className="flex items-end">
          <Button
            onClick={handleSearch}
            disabled={!destination.trim()}
            className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          >
            <Search className="w-4 h-4 mr-2" />
            Search Flights
          </Button>
        </div>
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
