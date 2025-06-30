
import React from 'react';
import { Home, Plane } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type Airport = Tables<'airports'>;

interface MapControlsProps {
  homeAirport?: Airport | null;
}

const MapControls: React.FC<MapControlsProps> = ({ homeAirport }) => {
  return (
    <div className="absolute top-4 left-4 space-y-2">
      <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
        <div className="flex items-center space-x-2 mb-2">
          <Home className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Home Airport</span>
        </div>
        {homeAirport ? (
          <div className="text-xs text-gray-300">
            <div className="font-medium text-green-400">{homeAirport.iata_code}</div>
            <div>{homeAirport.city}</div>
          </div>
        ) : (
          <div className="text-xs text-gray-400">
            Click an airport to set as home
          </div>
        )}
      </div>

      <div className="bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700">
        <div className="flex items-center space-x-2 mb-2">
          <Plane className="w-4 h-4 text-green-400" />
          <span className="text-sm font-medium text-white">Routes</span>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-green-500"></div>
            <span className="text-gray-300">25k-50k pts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-yellow-500"></div>
            <span className="text-gray-300">50k-75k pts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-0.5 bg-red-500"></div>
            <span className="text-gray-300">75k+ pts</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapControls;
