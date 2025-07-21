
import React from 'react';
import { Button } from '@/components/ui/button';
import { Wallet, Edit, Trash2, Check } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

interface WalletCardProps {
  wallet: PointsWallet;
  isSelected: boolean;
  onEdit: (wallet: PointsWallet) => void;
  onDelete: (walletId: string) => void;
  onToggleSelect: (walletId: string) => void;
}

const WalletCard: React.FC<WalletCardProps> = ({ 
  wallet, 
  isSelected, 
  onEdit, 
  onDelete, 
  onToggleSelect 
}) => {
  const formatPoints = (points: number) => {
    return points.toLocaleString();
  };

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'Bronze': 'text-orange-400',
      'Silver': 'text-gray-300',
      'Gold': 'text-yellow-400',
      'Platinum': 'text-purple-400',
      'Diamond': 'text-blue-300',
      'Red': 'text-red-400',
      'Blue': 'text-blue-400',
      'Green': 'text-green-400'
    };
    
    return statusColors[status] || 'text-muted-foreground';
  };

  return (
    <div className={`bg-card border rounded-xl p-6 transition-all hover:shadow-md cursor-pointer ${
      isSelected ? 'border-primary ring-1 ring-primary/20' : 'border-border'
    }`} onClick={() => onToggleSelect(wallet.id)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-[hsl(var(--blue-brand))] to-[hsl(var(--orange-brand))] rounded-xl flex items-center justify-center">
            <Wallet className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{wallet.frequent_flyer_programs.name}</h3>
            <p className="text-sm text-muted-foreground">{wallet.frequent_flyer_programs.code}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
            isSelected 
              ? 'bg-primary border-primary' 
              : 'border-muted-foreground'
          }`}>
            {isSelected && <Check className="w-3 h-3 text-primary-foreground" />}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(wallet);
            }}
            className="text-muted-foreground hover:text-foreground"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(wallet.id);
            }}
            className="text-muted-foreground hover:text-destructive"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-sm text-muted-foreground">Points Balance</p>
          <p className="text-2xl font-bold text-foreground">{formatPoints(wallet.points_balance)}</p>
        </div>
        
        <div>
          <p className="text-sm text-muted-foreground">Status Level</p>
          <p className={`font-semibold ${getStatusColor(wallet.status_level)}`}>
            {wallet.status_level}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalletCard;
