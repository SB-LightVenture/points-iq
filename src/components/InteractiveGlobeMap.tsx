
import React from 'react';
import MapboxGlobe from './MapboxGlobe';
import type { Tables } from '@/integrations/supabase/types';

type Airport = Tables<'airports'>;

interface InteractiveGlobeMapProps {
  onDestinationSelect?: (airport: Airport) => void;
  homeAirport?: Airport | null;
  onHomeAirportChange?: (airport: Airport) => void;
}

const InteractiveGlobeMap: React.FC<InteractiveGlobeMapProps> = ({ 
  onDestinationSelect, 
  homeAirport,
  onHomeAirportChange 
}) => {
  return (
    <MapboxGlobe
      onDestinationSelect={onDestinationSelect}
      homeAirport={homeAirport}
      onHomeAirportChange={onHomeAirportChange}
    />
  );
};

export default InteractiveGlobeMap;
