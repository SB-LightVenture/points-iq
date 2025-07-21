
import React from 'react';
import FlightSearchSection from './FlightSearchSection';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface FlightSearchContainerProps {
  selectedWallets: PointsWallet[];
  initialSearchParams?: {
    origin?: string;
    destination?: string;
  } | null;
}

const FlightSearchContainer: React.FC<FlightSearchContainerProps> = ({ 
  selectedWallets, 
  initialSearchParams 
}) => {
  return (
    <div className="mb-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Flight <span className="bg-gradient-to-r from-[hsl(var(--blue-brand))] to-[hsl(var(--orange-brand))] bg-clip-text text-transparent">Search</span>
        </h2>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Search award flights across your selected frequent flyer programs
        </p>
      </div>

      <FlightSearchSection 
        selectedWallets={selectedWallets} 
        initialSearchParams={initialSearchParams}
      />
    </div>
  );
};

export default FlightSearchContainer;
