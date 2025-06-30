
import React from 'react';
import { useMapboxGlobe } from '@/hooks/useMapboxGlobe';
import MapControls from './MapControls';
import MapInstructions from './MapInstructions';
import type { Tables } from '@/integrations/supabase/types';

type Airport = Tables<'airports'>;

interface MapboxGlobeProps {
  onDestinationSelect?: (airport: Airport) => void;
  homeAirport?: Airport | null;
  onHomeAirportChange?: (airport: Airport) => void;
}

const MapboxGlobe: React.FC<MapboxGlobeProps> = ({ 
  onDestinationSelect, 
  homeAirport,
  onHomeAirportChange 
}) => {
  const { mapContainer } = useMapboxGlobe({
    homeAirport,
    onDestinationSelect,
    onHomeAirportChange
  });

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden border border-slate-700">
      <div ref={mapContainer} className="w-full h-full" />
      
      <MapControls homeAirport={homeAirport} />
      <MapInstructions />
    </div>
  );
};

export default MapboxGlobe;
