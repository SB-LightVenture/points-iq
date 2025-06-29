
import React from 'react';
import { Globe } from 'lucide-react';

const GlobeSection: React.FC = () => {
  return (
    <>
      {/* Interactive Globe Section */}
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Interactive <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Globe Dashboard</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Coming soon: visualize destinations and compare redemption options across your selected wallets
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
            The Interactive Globe will show destinations available through your selected programs, 
            with separate point costs for each frequent flyer program.
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
            <h4 className="text-lg font-semibold text-white mb-2">Ready for Launch</h4>
            <p className="text-gray-300">
              Your wallets are set up and ready. The Interactive Globe Dashboard will be available soon!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default GlobeSection;
