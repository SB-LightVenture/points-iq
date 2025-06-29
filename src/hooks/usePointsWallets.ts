
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Tables } from '@/integrations/supabase/types';

type PointsWallet = Tables<'points_wallets'> & {
  frequent_flyer_programs: Tables<'frequent_flyer_programs'>;
};

type FrequentFlyerProgram = Tables<'frequent_flyer_programs'>;

export const usePointsWallets = () => {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<PointsWallet[]>([]);
  const [programs, setPrograms] = useState<FrequentFlyerProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeWallet, setActiveWallet] = useState<PointsWallet | null>(null);

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
    
    // Set active wallet
    const active = walletsData?.find(wallet => wallet.is_active);
    setActiveWallet(active || null);
    
    setLoading(false);
  };

  const createWallet = async (programId: string, pointsBalance: number, statusLevel: string) => {
    if (!user) return { error: 'User not authenticated' };
    
    const { data, error } = await supabase
      .from('points_wallets')
      .insert({
        user_id: user.id,
        program_id: programId,
        points_balance: pointsBalance,
        status_level: statusLevel,
        is_active: wallets.length === 0 // Make first wallet active by default
      })
      .select(`
        *,
        frequent_flyer_programs (*)
      `)
      .single();
    
    if (error) {
      console.error('Error creating wallet:', error);
      return { error: error.message };
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
      return { error: error.message };
    }
    
    await fetchWallets();
    return { error: null };
  };

  const deleteWallet = async (walletId: string) => {
    const { error } = await supabase
      .from('points_wallets')
      .delete()
      .eq('id', walletId);
    
    if (error) {
      console.error('Error deleting wallet:', error);
      return { error: error.message };
    }
    
    await fetchWallets();
    return { error: null };
  };

  const setActiveWalletById = async (walletId: string) => {
    const { error } = await supabase
      .from('points_wallets')
      .update({ is_active: true })
      .eq('id', walletId);
    
    if (error) {
      console.error('Error setting active wallet:', error);
      return { error: error.message };
    }
    
    await fetchWallets();
    return { error: null };
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
    activeWallet,
    createWallet,
    updateWallet,
    deleteWallet,
    setActiveWalletById,
    refetch: fetchWallets
  };
};
