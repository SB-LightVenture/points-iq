
import React from 'react';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface FlightSearchSummaryProps {
  selectedWallets: PointsWallet[];
}

const FlightSearchSummary: React.FC<FlightSearchSummaryProps> = ({ selectedWallets }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {selectedWallets.map((wallet) => (
        <div key={wallet.id} className="bg-white rounded-lg p-4 border border-border shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-foreground text-sm">{wallet.frequent_flyer_programs.name}</h4>
            <span className="text-xs text-muted-foreground">{wallet.frequent_flyer_programs.code}</span>
          </div>
          <p className="text-lg font-bold bg-gradient-to-r from-[hsl(var(--blue-brand))] to-[hsl(var(--orange-brand))] bg-clip-text text-transparent">
            {wallet.points_balance.toLocaleString()} pts
          </p>
          <p className="text-xs text-muted-foreground">{wallet.status_level}</p>
        </div>
      ))}
    </div>
  );
};

export default FlightSearchSummary;
