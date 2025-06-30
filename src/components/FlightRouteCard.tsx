
import React from 'react';
import { Plane, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Tables } from '@/integrations/supabase/types';

type Airport = Tables<'airports'>;

interface FlightRoute {
  destination: Airport;
  pointsCost: number;
  cabinClass: string;
  airline: string;
  availability: 'Available' | 'Waitlist' | 'Sold Out';
}

interface FlightRouteCardProps {
  origin: Airport;
  route: FlightRoute;
  onSelect: () => void;
  programName: string;
}

const FlightRouteCard: React.FC<FlightRouteCardProps> = ({ 
  origin, 
  route, 
  onSelect,
  programName 
}) => {
  const getAvailabilityColor = () => {
    switch (route.availability) {
      case 'Available': return 'text-green-400';
      case 'Waitlist': return 'text-yellow-400';
      default: return 'text-red-400';
    }
  };

  const getCabinIcon = () => {
    switch (route.cabinClass.toLowerCase()) {
      case 'first': return '✈️';
      case 'business': return '🛩️';
      case 'premium-economy': return '✈️';
      default: return '🛫';
    }
  };

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-lg p-4 hover:border-blue-500/50 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1 text-sm text-gray-300">
            <MapPin className="w-3 h-3" />
            <span className="font-mono font-bold">{origin.iata_code}</span>
          </div>
          <Plane className="w-4 h-4 text-blue-400" />
          <div className="flex items-center space-x-1 text-sm text-gray-300">
            <span className="font-mono font-bold">{route.destination.iata_code}</span>
            <MapPin className="w-3 h-3" />
          </div>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-blue-400">
            {route.pointsCost.toLocaleString()}
          </div>
          <div className="text-xs text-gray-400">points</div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="text-sm font-medium text-white">
            {route.destination.city}, {route.destination.country}
          </div>
          <div className="text-xs text-gray-400">
            {route.destination.name}
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center space-x-1">
            <span>{getCabinIcon()}</span>
            <span className="text-sm text-gray-300">{route.cabinClass}</span>
          </div>
          <div className="text-xs text-gray-400">{route.airline}</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className={`text-xs font-medium ${getAvailabilityColor()}`}>
            {route.availability}
          </span>
          <span className="text-xs text-gray-500">via {programName}</span>
        </div>
        <Button
          onClick={onSelect}
          size="sm"
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-xs px-3 py-1"
        >
          Search Flights
        </Button>
      </div>
    </div>
  );
};

export default FlightRouteCard;
