
import React from 'react';
import FlightSearchSection from '@/components/FlightSearchSection';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface FlightSearchContainerProps {
  selectedWallets: PointsWallet[];
}

const FlightSearchContainer: React.FC<FlightSearchContainerProps> = ({ selectedWallets }) => {
  return (
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-2">Flight Search</h2>
        <p className="text-gray-300">Search for award flights using your selected frequent flyer programs</p>
      </div>
      
      <FlightSearchSection selectedWallets={selectedWallets} />
    </div>
  );
};

export default FlightSearchContainer;
