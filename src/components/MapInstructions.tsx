
import React from 'react';
import { MapPin } from 'lucide-react';

const MapInstructions: React.FC = () => {
  return (
    <div className="absolute bottom-4 right-4 bg-slate-800/90 backdrop-blur-sm rounded-lg p-3 border border-slate-700 max-w-xs">
      <div className="flex items-center space-x-2 mb-2">
        <MapPin className="w-4 h-4 text-purple-400" />
        <span className="text-sm font-medium text-white">How to Use</span>
      </div>
      <div className="text-xs text-gray-300 space-y-1">
        <div>• Hover over airports to see details</div>
        <div>• Click "Set Home" to set home airport</div>
        <div>• Click "Select Route" for flight search</div>
        <div>• Routes show from your home airport</div>
      </div>
    </div>
  );
};

export default MapInstructions;
