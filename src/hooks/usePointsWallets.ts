
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';
import { ErrorHandler } from '@/utils/errorUtils';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

type FrequentFlyerProgram = Tables<'frequent_flyer_programs'>;

export const usePointsWallets = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<PointsWallet[]>([]);
  const [programs, setPrograms] = useState<FrequentFlyerProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWalletIds, setSelectedWalletIds] = useState<string[]>([]);

  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from('frequent_flyer_programs')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching programs:', error);
      return;
    }
    
    setPrograms(data || []);
  };

  const fetchWallets = async () => {
    if (!user) return;
    
    setLoading(true);
    const { data, error } = await supabase
      .from('points_wallets')
      .select(`
        *,
        frequent_flyer_programs (*)
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching wallets:', error);
      setLoading(false);
      return;
    }
    
    const walletsData = data as PointsWallet[];
    setWallets(walletsData || []);
    setLoading(false);
  };

  const createWallet = async (programId: string, pointsBalance: number, statusLevel: string) => {
    if (!user) {
      const authError = ErrorHandler.getUserFriendlyError(new Error('User not authenticated'), 'auth-session');
      return { userFriendlyError: authError };
    }
    
    const { data, error } = await supabase
      .from('points_wallets')
      .insert({
        user_id: user.id,
        program_id: programId,
        points_balance: pointsBalance,
        status_level: statusLevel,
        is_active: false
      })
      .select(`
        *,
        frequent_flyer_programs (*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating wallet:', error);
      const userFriendlyError = ErrorHandler.getUserFriendlyError(error, 'wallet-create');
      return { userFriendlyError };
    }
    
    await fetchWallets();
    return { data };
  };

  const updateWallet = async (walletId: string, updates: Partial<PointsWallet>) => {
    const { error } = await supabase
      .from('points_wallets')
      .update(updates)
      .eq('id', walletId);
    
    if (error) {
      console.error('Error updating wallet:', error);
      const userFriendlyError = ErrorHandler.getUserFriendlyError(error, 'wallet-update');
      return { userFriendlyError };
    }
    
    await fetchWallets();
    return { userFriendlyError: null };
  };

  const deleteWallet = async (walletId: string) => {
    const { error } = await supabase
      .from('points_wallets')
      .delete()
      .eq('id', walletId);
    
    if (error) {
      console.error('Error deleting wallet:', error);
      const userFriendlyError = ErrorHandler.getUserFriendlyError(error, 'wallet-delete');
      return { userFriendlyError };
    }
    
    // Remove from selected wallets if it was selected
    setSelectedWalletIds(prev => prev.filter(id => id !== walletId));
    await fetchWallets();
    return { userFriendlyError: null };
  };

  const toggleWalletSelection = (walletId: string) => {
    setSelectedWalletIds(prev => 
      prev.includes(walletId) 
        ? prev.filter(id => id !== walletId)
        : [...prev, walletId]
    );
  };

  const selectAllWallets = () => {
    setSelectedWalletIds(wallets.map(wallet => wallet.id));
  };

  const deselectAllWallets = () => {
    setSelectedWalletIds([]);
  };

  const getSelectedWallets = () => {
    return wallets.filter(wallet => selectedWalletIds.includes(wallet.id));
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  useEffect(() => {
    if (user) {
      fetchWallets();
    }
  }, [user]);

  return {
    wallets,
    programs,
    loading,
    selectedWalletIds,
    createWallet,
    updateWallet,
    deleteWallet,
    toggleWalletSelection,
    selectAllWallets,
    deselectAllWallets,
    getSelectedWallets,
    refetch: fetchWallets
  };
};
