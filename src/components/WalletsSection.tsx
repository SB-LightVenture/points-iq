
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Wallet, CheckSquare, Square } from 'lucide-react';
import WalletCard from '@/components/WalletCard';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface WalletsSectionProps {
  wallets: PointsWallet[];
  loading: boolean;
  selectedWalletIds: string[];
  onAddWallet: () => void;
  onEditWallet: (wallet: PointsWallet) => void;
  onDeleteWallet: (walletId: string) => void;
  onToggleWalletSelection: (walletId: string) => void;
  onSelectAllWallets: () => void;
  onDeselectAllWallets: () => void;
}

const WalletsSection: React.FC<WalletsSectionProps> = ({
  wallets,
  loading,
  selectedWalletIds,
  onAddWallet,
  onEditWallet,
  onDeleteWallet,
  onToggleWalletSelection,
  onSelectAllWallets,
  onDeselectAllWallets
}) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Your Points Wallets</h2>
          <p className="text-muted-foreground">Select wallets to search for flights across multiple programs</p>
        </div>
        <div className="flex items-center space-x-3">
          {wallets.length > 0 && (
            <>
              <Button
                variant="ghost"
                onClick={selectedWalletIds.length === wallets.length ? onDeselectAllWallets : onSelectAllWallets}
                className="text-muted-foreground hover:text-foreground"
              >
                {selectedWalletIds.length === wallets.length ? (
                  <>
                    <Square className="w-4 h-4 mr-2" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <CheckSquare className="w-4 h-4 mr-2" />
                    Select All
                  </>
                )}
              </Button>
              <div className="text-sm text-muted-foreground">
                {selectedWalletIds.length} of {wallets.length} selected
              </div>
            </>
          )}
          <Button
            onClick={onAddWallet}
            className="bg-gradient-to-r from-[hsl(var(--blue-brand))] to-[hsl(var(--orange-brand))] hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Wallet
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your wallets...</p>
        </div>
      ) : wallets.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center shadow-sm">
          <Wallet className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">No Wallets Yet</h3>
          <p className="text-muted-foreground mb-6">
            Add your first frequent flyer wallet to start searching for flights
          </p>
          <Button
            onClick={onAddWallet}
            className="bg-gradient-to-r from-[hsl(var(--blue-brand))] to-[hsl(var(--orange-brand))] hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Wallet
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <WalletCard
              key={wallet.id}
              wallet={wallet}
              isSelected={selectedWalletIds.includes(wallet.id)}
              onEdit={onEditWallet}
              onDelete={onDeleteWallet}
              onToggleSelect={onToggleWalletSelection}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default WalletsSection;
