
import React, { useState } from 'react';
import { Globe } from 'lucide-react';
import InteractiveGlobeMap from './InteractiveGlobeMap';
import FlightRouteSidebar from './FlightRouteSidebar';
import { useAirports } from '@/hooks/useAirports';
import { useToast } from '@/hooks/use-toast';
import type { Tables } from '@/integrations/supabase/types';

type Airport = Tables<'airports'>;
type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface GlobeSectionProps {
  selectedWallets: PointsWallet[];
  onDestinationSelect?: (origin: string, destination: string) => void;
}

const GlobeSection: React.FC<GlobeSectionProps> = ({ 
  selectedWallets,
  onDestinationSelect 
}) => {
  const { toast } = useToast();
  const { primaryHomeAirport, addHomeAirport, setPrimaryHome } = useAirports();

  const handleDestinationSelect = (airport: Airport) => {
    if (onDestinationSelect && primaryHomeAirport) {
      onDestinationSelect(primaryHomeAirport.iata_code, airport.iata_code);
      toast({
        title: "Route Selected",
        description: `Flight search updated: ${primaryHomeAirport.iata_code} → ${airport.iata_code}`,
      });
    }
  };

  const handleHomeAirportChange = async (airport: Airport) => {
    const result = await addHomeAirport(airport.id, true);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Home Airport Set",
        description: `${airport.name} is now your primary home airport.`,
      });
    }
  };

  const handleRouteSelect = (origin: string, destination: string) => {
    if (onDestinationSelect) {
      onDestinationSelect(origin, destination);
      toast({
        title: "Route Selected",
        description: `Flight search updated: ${origin} → ${destination}`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Interactive <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Globe Dashboard</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Explore destinations and flight routes from your home airport with real-time availability
        </p>
      </div>

      <div className="flex h-[600px] rounded-xl overflow-hidden border border-slate-700">
        {/* Globe Map */}
        <div className="flex-1">
          <InteractiveGlobeMap 
            onDestinationSelect={handleDestinationSelect}
            homeAirport={primaryHomeAirport}
            onHomeAirportChange={handleHomeAirportChange}
          />
        </div>

        {/* Flight Routes Sidebar */}
        <FlightRouteSidebar
          homeAirport={primaryHomeAirport}
          selectedWallets={selectedWallets}
          onRouteSelect={handleRouteSelect}
        />
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Real-time Routes</h3>
          </div>
          <p className="text-gray-300 text-sm">
            View available flight routes from your home airport with live point costs and availability across your selected programs.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Smart Filtering</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Filter routes by cabin class and point cost to find the best value destinations that match your preferences.
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Quick Search</h3>
          </div>
          <p className="text-gray-300 text-sm">
            Click any route card to instantly populate the flight search with your selected origin and destination.
          </p>
        </div>
      </div>
    </div>
  );
};

export default GlobeSection;
