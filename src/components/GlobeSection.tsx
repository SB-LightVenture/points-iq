
import React, { useState } from 'react';
import { Globe, MapPin, Plane } from 'lucide-react';
import InteractiveGlobeMap from './InteractiveGlobeMap';
import { Button } from '@/components/ui/button';
import type { Tables } from '@/integrations/supabase/types';

type Airport = Tables<'airports'>;

interface GlobeSectionProps {
  onDestinationSelect?: (origin: string, destination: string) => void;
}

const GlobeSection: React.FC<GlobeSectionProps> = ({ onDestinationSelect }) => {
  const [showMap, setShowMap] = useState(false);

  const handleDestinationSelect = (airport: Airport) => {
    if (onDestinationSelect) {
      // For now, we'll use a default origin (LAX) - this should be the user's home airport
      onDestinationSelect('LAX', airport.iata_code);
    }
  };

  if (showMap) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Interactive <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Globe Dashboard</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl">
              Explore destinations and flight routes from your home airport
            </p>
          </div>
          <Button
            onClick={() => setShowMap(false)}
            variant="outline"
            className="border-slate-600 text-gray-300 hover:text-white"
          >
            Hide Map
          </Button>
        </div>

        <InteractiveGlobeMap onDestinationSelect={handleDestinationSelect} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Interactive Exploration</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Click on airports to explore destinations and see real-time flight route options from your home base.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Plane className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Route Visualization</h3>
            </div>
            <p className="text-gray-300 text-sm">
              See flight routes color-coded by point cost, helping you identify the best value destinations for your points.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white">Global Coverage</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Explore major airports worldwide and discover new destinations available through your frequent flyer programs.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Interactive Globe Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Interactive <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Globe Dashboard</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
          Visualize destinations and explore flight routes from your home airport with our interactive map
        </p>
        <Button
          onClick={() => setShowMap(true)}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg"
        >
          <Globe className="w-5 h-5 mr-2" />
          Launch Interactive Map
        </Button>
      </div>

      {/* Globe Feature Overview */}
      <div className="max-w-4xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 text-center">
          <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
            <Globe className="w-16 h-16 text-white animate-spin" style={{ animationDuration: '10s' }} />
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-4">
            Explore with Interactive Globe
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            The Interactive Globe shows destinations available through your selected programs, 
            with real-time point costs and route visualization from your home airport.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-blue-400 mb-2">Visualize Destinations</h4>
              <p className="text-gray-300 text-sm">See exactly where your points can take you on an interactive 3D globe with real airport data</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-purple-400 mb-2">Route Planning</h4>
              <p className="text-gray-300 text-sm">Explore flight routes from your home airport with color-coded cost indicators</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-green-400 mb-2">Smart Selection</h4>
              <p className="text-gray-300 text-sm">Click destinations to automatically populate your flight search with optimal routing</p>
            </div>
            <div className="bg-slate-700/30 rounded-xl p-4">
              <h4 className="text-lg font-semibold text-orange-400 mb-2">Home Airport Setup</h4>
              <p className="text-gray-300 text-sm">Set your primary home airport to see personalized route recommendations</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/30">
            <h4 className="text-lg font-semibold text-white mb-2">Ready to Explore</h4>
            <p className="text-gray-300">
              Your wallets are connected and the globe is ready to show you the world of possibilities with your points!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobeSection;
