import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { usePointsWallets } from '@/hooks/usePointsWallets';
import { useToast } from '@/hooks/use-toast';
import WalletModal from '@/components/WalletModal';
import DashboardHeader from '@/components/DashboardHeader';
import WalletsSection from '@/components/WalletsSection';
import FlightSearchContainer from '@/components/FlightSearchContainer';
import GlobeSection from '@/components/GlobeSection';
import ScrapingDebugMonitor from '@/components/ScrapingDebugMonitor';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
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
    getSelectedWallets
  } = usePointsWallets();

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);
  const [flightSearchParams, setFlightSearchParams] = useState<{origin?: string, destination?: string} | null>(null);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const handleCreateWallet = async (programId: string, pointsBalance: number, statusLevel: string) => {
    const result = await createWallet(programId, pointsBalance, statusLevel);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      return { error: result.error };
    }
    
    toast({
      title: "Wallet Created",
      description: "Your points wallet has been added successfully.",
    });
    return { error: null };
  };

  const handleUpdateWallet = async (walletId: string, updates: any) => {
    const result = await updateWallet(walletId, updates);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
      return { error: result.error };
    }
    
    toast({
      title: "Wallet Updated",
      description: "Your points wallet has been updated successfully.",
    });
    return { error: null };
  };

  const handleDeleteWallet = async (walletId: string) => {
    if (confirm('Are you sure you want to delete this wallet?')) {
      const result = await deleteWallet(walletId);
      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Wallet Deleted",
          description: "Your points wallet has been removed.",
        });
      }
    }
  };

  const handleEditWallet = (wallet: any) => {
    setEditingWallet(wallet);
    setIsWalletModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsWalletModalOpen(false);
    setEditingWallet(null);
  };

  const handleDestinationSelect = (origin: string, destination: string) => {
    setFlightSearchParams({ origin, destination });
    toast({
      title: "Route Selected",
      description: `Flight search updated: ${origin} → ${destination}`,
    });
  };

  const selectedWallets = getSelectedWallets();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      <DashboardHeader 
        userEmail={user?.email || ''} 
        onSignOut={handleSignOut} 
      />

      <main className="container mx-auto px-4 py-8">
        <WalletsSection
          wallets={wallets}
          loading={loading}
          selectedWalletIds={selectedWalletIds}
          onAddWallet={() => setIsWalletModalOpen(true)}
          onEditWallet={handleEditWallet}
          onDeleteWallet={handleDeleteWallet}
          onToggleWalletSelection={toggleWalletSelection}
          onSelectAllWallets={selectAllWallets}
          onDeselectAllWallets={deselectAllWallets}
        />

        <FlightSearchContainer 
          selectedWallets={selectedWallets} 
          initialSearchParams={flightSearchParams}
        />

        {/* Temporarily hidden - Globe Dashboard not working */}
        {/* <GlobeSection 
          selectedWallets={selectedWallets}
          onDestinationSelect={handleDestinationSelect} 
        /> */}
      </main>

      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={handleCloseModal}
        onSave={handleCreateWallet}
        onUpdate={handleUpdateWallet}
        programs={programs}
        wallet={editingWallet}
      />

      <ScrapingDebugMonitor />
    </div>
  );
};

export default Dashboard;
