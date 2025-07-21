
import React from 'react';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface PartnerNetworksDisplayProps {
  selectedWallets: PointsWallet[];
}

const PartnerNetworksDisplay: React.FC<PartnerNetworksDisplayProps> = ({ selectedWallets }) => {
  const getUniquePartners = () => {
    const allPartners = new Set<string>();
    selectedWallets.forEach(wallet => {
      wallet.frequent_flyer_programs.partner_programs?.forEach(partner => {
        allPartners.add(partner);
      });
    });
    return Array.from(allPartners);
  };

  const uniquePartners = getUniquePartners();

  if (uniquePartners.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 border border-border">
      <h4 className="text-sm font-semibold text-foreground mb-2">Available Partner Networks</h4>
      <div className="flex flex-wrap gap-2">
        {uniquePartners.map((partner) => (
          <span
            key={partner}
            className="px-2 py-1 bg-gradient-to-r from-[hsl(var(--blue-brand))]/10 to-[hsl(var(--orange-brand))]/10 text-[hsl(var(--blue-brand))] text-xs rounded-full border border-[hsl(var(--blue-brand))]/20"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PartnerNetworksDisplay;
