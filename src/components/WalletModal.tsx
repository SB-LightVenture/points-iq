
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X, Wallet } from 'lucide-react';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

type FrequentFlyerProgram = Tables<'frequent_flyer_programs'>;

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (programId: string, pointsBalance: number, statusLevel: string) => Promise<{ error?: string }>;
  programs: FrequentFlyerProgram[];
  wallet?: PointsWallet | null;
  onUpdate?: (walletId: string, updates: Partial<PointsWallet>) => Promise<{ error?: string | null }>;
}

const WalletModal: React.FC<WalletModalProps> = ({
  isOpen,
  onClose,
  onSave,
  programs,
  wallet,
  onUpdate
}) => {
  const [selectedProgram, setSelectedProgram] = useState('');
  const [pointsBalance, setPointsBalance] = useState('');
  const [statusLevel, setStatusLevel] = useState('');
  const [loading, setLoading] = useState(false);
  const [availableStatuses, setAvailableStatuses] = useState<string[]>([]);

  useEffect(() => {
    if (wallet) {
      setSelectedProgram(wallet.program_id);
      setPointsBalance(wallet.points_balance.toString());
      setStatusLevel(wallet.status_level);
    } else {
      setSelectedProgram('');
      setPointsBalance('');
      setStatusLevel('');
    }
  }, [wallet]);

  useEffect(() => {
    if (selectedProgram) {
      const program = programs.find(p => p.id === selectedProgram);
      if (program) {
        setAvailableStatuses(program.status_levels);
        if (!wallet) {
          setStatusLevel(program.status_levels[0]);
        }
      }
    }
  }, [selectedProgram, programs, wallet]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProgram || !pointsBalance || !statusLevel) return;

    setLoading(true);
    
    let result;
    if (wallet && onUpdate) {
      result = await onUpdate(wallet.id, {
        program_id: selectedProgram,
        points_balance: parseInt(pointsBalance),
        status_level: statusLevel
      });
    } else {
      result = await onSave(selectedProgram, parseInt(pointsBalance), statusLevel);
    }

    if (!result.error) {
      onClose();
      setSelectedProgram('');
      setPointsBalance('');
      setStatusLevel('');
    }
    
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-[hsl(var(--blue-brand))] to-[hsl(var(--orange-brand))] rounded-lg flex items-center justify-center">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-foreground">
              {wallet ? 'Edit Wallet' : 'Add New Wallet'}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="program" className="text-foreground">Frequent Flyer Program</Label>
            <Select value={selectedProgram} onValueChange={setSelectedProgram}>
              <SelectTrigger>
                <SelectValue placeholder="Select a program" />
              </SelectTrigger>
              <SelectContent>
                {programs.map((program) => (
                  <SelectItem key={program.id} value={program.id}>
                    {program.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="points" className="text-foreground">Points Balance</Label>
            <Input
              id="points"
              type="number"
              value={pointsBalance}
              onChange={(e) => setPointsBalance(e.target.value)}
              placeholder="e.g., 108000"
              min="0"
              required
            />
          </div>

          <div>
            <Label htmlFor="status" className="text-foreground">Status Level</Label>
            <Select value={statusLevel} onValueChange={setStatusLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Select status level" />
              </SelectTrigger>
              <SelectContent>
                {availableStatuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !selectedProgram || !pointsBalance || !statusLevel}
              className="flex-1 bg-gradient-to-r from-[hsl(var(--blue-brand))] to-[hsl(var(--orange-brand))] hover:opacity-90"
            >
              {loading ? 'Saving...' : wallet ? 'Update Wallet' : 'Add Wallet'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WalletModal;
