
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Globe, LogOut, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
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
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Interactive <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Globe Dashboard</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Visualize your points potential on our revolutionary 3D globe interface
          </p>
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
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              The Interactive Globe Dashboard is currently in development. This revolutionary feature will allow you to:
            </p>
            
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
              <h4 className="text-lg font-semibold text-white mb-2">Early Access Confirmed</h4>
              <p className="text-gray-300">
                You're all set! We'll notify you as soon as the Interactive Globe Dashboard is ready to use.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
