
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
    <div className="bg-slate-700/20 rounded-lg p-4">
      <h4 className="text-sm font-semibold text-gray-300 mb-2">Available Partner Networks</h4>
      <div className="flex flex-wrap gap-2">
        {uniquePartners.map((partner) => (
          <span
            key={partner}
            className="px-2 py-1 bg-blue-500/20 text-blue-300 text-xs rounded-full"
          >
            {partner}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PartnerNetworksDisplay;
