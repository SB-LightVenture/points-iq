
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Globe, LogOut, User, Plus, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePointsWallets } from '@/hooks/usePointsWallets';
import WalletModal from '@/components/WalletModal';
import WalletCard from '@/components/WalletCard';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    wallets,
    programs,
    loading,
    activeWallet,
    createWallet,
    updateWallet,
    deleteWallet,
    setActiveWalletById
  } = usePointsWallets();

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [editingWallet, setEditingWallet] = useState(null);

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

  const handleSetActive = async (walletId: string) => {
    const result = await setActiveWalletById(walletId);
    if (result.error) {
      toast({
        title: "Error",
        description: result.error,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Active Wallet Updated",
        description: "Your active wallet has been changed.",
      });
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700 bg-slate-800/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">
              <span className="text-white">Points</span>
              <span className="text-orange-400">IQ</span>
            </h1>
            <span className="text-gray-400">Dashboard</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-300">
              <User className="w-4 h-4" />
              <span className="text-sm">{user?.email}</span>
            </div>
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="text-gray-400 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Points Wallets Section */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Your Points Wallets</h2>
              <p className="text-gray-300">Manage your frequent flyer points and status levels</p>
            </div>
            <Button
              onClick={() => setIsWalletModalOpen(true)}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Wallet
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-300">Loading your wallets...</p>
            </div>
          ) : wallets.length === 0 ? (
            <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl p-8 text-center">
              <Wallet className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Wallets Yet</h3>
              <p className="text-gray-300 mb-6">
                Add your first frequent flyer wallet to start exploring destinations
              </p>
              <Button
                onClick={() => setIsWalletModalOpen(true)}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
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
                  onEdit={handleEditWallet}
                  onDelete={handleDeleteWallet}
                  onSetActive={handleSetActive}
                />
              ))}
            </div>
          )}
        </div>

        {/* Interactive Globe Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Interactive <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Globe Dashboard</span>
          </h2>
          {activeWallet ? (
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Explore destinations with your <span className="text-blue-400 font-semibold">{activeWallet.frequent_flyer_programs.name}</span> points
            </p>
          ) : (
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Add a points wallet to start exploring destinations
            </p>
          )}
        </div>

        {/* Globe Feature Placeholder */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              <Globe className="w-16 h-16 text-white animate-spin" style={{ animationDuration: '10s' }} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-4">
              Globe Feature Coming Soon
            </h3>
            {activeWallet ? (
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Once the Interactive Globe is ready, you'll be able to explore destinations using your{' '}
                <span className="text-blue-400 font-semibold">{activeWallet.frequent_flyer_programs.name}</span>{' '}
                points ({activeWallet.points_balance.toLocaleString()} available).
              </p>
            ) : (
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Add a points wallet above to see how many destinations you can explore with your points.
              </p>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-blue-400 mb-2">Visualize Destinations</h4>
                <p className="text-gray-300 text-sm">See exactly where your points can take you on an interactive 3D globe</p>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-purple-400 mb-2">Real-Time Availability</h4>
                <p className="text-gray-300 text-sm">Check live reward seat availability across multiple airlines</p>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-green-400 mb-2">Multi-Class Comparison</h4>
                <p className="text-gray-300 text-sm">Compare Economy, Business, and First Class options instantly</p>
              </div>
              <div className="bg-slate-700/30 rounded-xl p-4">
                <h4 className="text-lg font-semibold text-orange-400 mb-2">Points Optimization</h4>
                <p className="text-gray-300 text-sm">Maximize the value of your frequent flyer points</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
              <h4 className="text-lg font-semibold text-white mb-2">Ready for Launch</h4>
              <p className="text-gray-300">
                Your wallets are set up and ready. The Interactive Globe Dashboard will be available soon!
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Wallet Modal */}
      <WalletModal
        isOpen={isWalletModalOpen}
        onClose={handleCloseModal}
        onSave={handleCreateWallet}
        onUpdate={handleUpdateWallet}
        programs={programs}
        wallet={editingWallet}
      />
    </div>
  );
};

export default Dashboard;
