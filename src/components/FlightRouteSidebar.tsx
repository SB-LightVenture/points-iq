
import React, { useState, useEffect } from 'react';
import { MapPin, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import FlightRouteCard from './FlightRouteCard';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

type Airport = Tables<'airports'>;
type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface FlightRoute {
  destination: Airport;
  pointsCost: number;
  cabinClass: string;
  airline: string;
  availability: 'Available' | 'Waitlist' | 'Sold Out';
}

interface FlightRouteSidebarProps {
  homeAirport: Airport | null;
  selectedWallets: PointsWallet[];
  onRouteSelect: (origin: string, destination: string) => void;
}

const FlightRouteSidebar: React.FC<FlightRouteSidebarProps> = ({ 
  homeAirport, 
  selectedWallets, 
  onRouteSelect 
}) => {
  const [routes, setRoutes] = useState<{ [programId: string]: FlightRoute[] }>({});
  const [loading, setLoading] = useState(false);
  const [classFilter, setClassFilter] = useState<string>('all');
  const [maxPoints, setMaxPoints] = useState<string>('all');

  // Mock flight routes data - in real implementation, this would come from an API
  const generateMockRoutes = (destinations: Airport[], wallet: PointsWallet): FlightRoute[] => {
    const cabinClasses = ['Economy', 'Premium Economy', 'Business', 'First'];
    const airlines = ['American Airlines', 'United Airlines', 'Delta Air Lines', 'British Airways', 'Lufthansa'];
    const availabilityOptions: ('Available' | 'Waitlist' | 'Sold Out')[] = ['Available', 'Available', 'Available', 'Waitlist', 'Sold Out'];
    
    return destinations.slice(0, 8).map(destination => ({
      destination,
      pointsCost: Math.floor(Math.random() * 100000) + 25000,
      cabinClass: cabinClasses[Math.floor(Math.random() * cabinClasses.length)],
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      availability: availabilityOptions[Math.floor(Math.random() * availabilityOptions.length)]
    }));
  };

  useEffect(() => {
    if (!homeAirport || selectedWallets.length === 0) return;

    const loadRoutes = async () => {
      setLoading(true);
      try {
        // Get destinations (excluding home airport)
        const { data: destinations } = await supabase
          .from('airports')
          .select('*')
          .eq('is_major', true)
          .neq('id', homeAirport.id)
          .limit(20);

        if (destinations) {
          const routesByProgram: { [programId: string]: FlightRoute[] } = {};
          
          selectedWallets.forEach(wallet => {
            routesByProgram[wallet.id] = generateMockRoutes(destinations, wallet);
          });

          setRoutes(routesByProgram);
        }
      } catch (error) {
        console.error('Error loading routes:', error);
      } finally {
        setLoading(false);
      }
    };

    loadRoutes();
  }, [homeAirport, selectedWallets]);

  const getFilteredRoutes = () => {
    const allRoutes: Array<{ route: FlightRoute; wallet: PointsWallet }> = [];
    
    Object.entries(routes).forEach(([walletId, walletRoutes]) => {
      const wallet = selectedWallets.find(w => w.id === walletId);
      if (wallet) {
        walletRoutes.forEach(route => {
          allRoutes.push({ route, wallet });
        });
      }
    });

    return allRoutes.filter(({ route }) => {
      if (classFilter !== 'all' && route.cabinClass.toLowerCase() !== classFilter) return false;
      if (maxPoints !== 'all') {
        const maxPointsNum = parseInt(maxPoints);
        if (route.pointsCost > maxPointsNum) return false;
      }
      return true;
    }).sort((a, b) => a.route.pointsCost - b.route.pointsCost);
  };

  if (!homeAirport) {
    return (
      <div className="w-80 bg-slate-900/50 backdrop-blur-sm border-l border-slate-700 p-4">
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Set Home Airport</h3>
          <p className="text-gray-300 text-sm">
            Click on an airport on the map to set it as your home airport and see available routes.
          </p>
        </div>
      </div>
    );
  }

  if (selectedWallets.length === 0) {
    return (
      <div className="w-80 bg-slate-900/50 backdrop-blur-sm border-l border-slate-700 p-4">
        <div className="text-center py-8">
          <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Select Wallets</h3>
          <p className="text-gray-300 text-sm">
            Select one or more frequent flyer program wallets to see available routes from {homeAirport.iata_code}.
          </p>
        </div>
      </div>
    );
  }

  const filteredRoutes = getFilteredRoutes();

  return (
    <div className="w-80 bg-slate-900/50 backdrop-blur-sm border-l border-slate-700 flex flex-col h-full">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center space-x-2 mb-4">
          <MapPin className="w-5 h-5 text-blue-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Routes from {homeAirport.iata_code}</h3>
            <p className="text-sm text-gray-400">{homeAirport.city}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-xs text-gray-400 block mb-1">Cabin Class</label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white text-xs">All Classes</SelectItem>
                <SelectItem value="economy" className="text-white text-xs">Economy</SelectItem>
                <SelectItem value="premium economy" className="text-white text-xs">Premium Economy</SelectItem>
                <SelectItem value="business" className="text-white text-xs">Business</SelectItem>
                <SelectItem value="first" className="text-white text-xs">First</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-xs text-gray-400 block mb-1">Max Points</label>
            <Select value={maxPoints} onValueChange={setMaxPoints}>
              <SelectTrigger className="bg-slate-800 border-slate-600 text-white h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700">
                <SelectItem value="all" className="text-white text-xs">Any Amount</SelectItem>
                <SelectItem value="50000" className="text-white text-xs">Under 50k</SelectItem>
                <SelectItem value="75000" className="text-white text-xs">Under 75k</SelectItem>
                <SelectItem value="100000" className="text-white text-xs">Under 100k</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-blue-400" />
            <span className="ml-2 text-gray-300">Loading routes...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredRoutes.length > 0 ? (
              filteredRoutes.map(({ route, wallet }, index) => (
                <FlightRouteCard
                  key={`${route.destination.id}-${wallet.id}-${index}`}
                  origin={homeAirport}
                  route={route}
                  programName={wallet.frequent_flyer_programs.code}
                  onSelect={() => onRouteSelect(homeAirport.iata_code, route.destination.iata_code)}
                />
              ))
            ) : (
              <div className="text-center py-8">
                <Filter className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-300 text-sm">No routes match your filters</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightRouteSidebar;
