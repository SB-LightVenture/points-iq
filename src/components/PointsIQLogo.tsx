
import React from 'react';

interface PointsIQLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'full' | 'icon' | 'stacked';
  className?: string;
}

export const PointsIQLogo: React.FC<PointsIQLogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-12',
    lg: 'h-16',
    xl: 'h-20'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  if (variant === 'icon') {
    return (
      <div className={`${sizeClasses[size]} ${className}`}>
        <svg viewBox="0 0 80 80" className="w-full h-full">
          {/* Globe base */}
          <circle 
            cx="40" 
            cy="40" 
            r="32" 
            fill="url(#globeGradient)" 
            stroke="#1e3a8a" 
            strokeWidth="2"
          />
          
          {/* Globe grid lines */}
          <path 
            d="M 8 40 Q 40 20 72 40 Q 40 60 8 40" 
            fill="none" 
            stroke="#1e3a8a" 
            strokeWidth="1.5" 
            opacity="0.6"
          />
          <path 
            d="M 8 40 Q 40 60 72 40 Q 40 20 8 40" 
            fill="none" 
            stroke="#1e3a8a" 
            strokeWidth="1.5" 
            opacity="0.6"
          />
          <line 
            x1="40" 
            y1="8" 
            x2="40" 
            y2="72" 
            stroke="#1e3a8a" 
            strokeWidth="1.5" 
            opacity="0.6"
          />
          
          {/* Flight trajectory paths */}
          <path 
            d="M 15 25 Q 40 15 65 35" 
            fill="none" 
            stroke="#f97316" 
            strokeWidth="2.5" 
            strokeDasharray="4,2"
          />
          <path 
            d="M 20 55 Q 50 45 70 50" 
            fill="none" 
            stroke="#f97316" 
            strokeWidth="2" 
            strokeDasharray="3,2"
          />
          
          {/* Airplane icon */}
          <path 
            d="M 45 30 L 50 28 L 52 32 L 48 34 L 45 30 Z" 
            fill="#f97316"
          />
          <circle cx="47" cy="31" r="1.5" fill="#f97316" />
          
          {/* Gradient definitions */}
          <defs>
            <radialGradient id="globeGradient" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#1e40af" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
            </radialGradient>
          </defs>
        </svg>
      </div>
    );
  }

  if (variant === 'stacked') {
    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className={sizeClasses[size]}>
          <svg viewBox="0 0 80 80" className="w-full h-full">
            {/* Same SVG content as icon variant */}
            <circle cx="40" cy="40" r="32" fill="url(#globeGradient2)" stroke="#1e3a8a" strokeWidth="2"/>
            <path d="M 8 40 Q 40 20 72 40 Q 40 60 8 40" fill="none" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.6"/>
            <path d="M 8 40 Q 40 60 72 40 Q 40 20 8 40" fill="none" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.6"/>
            <line x1="40" y1="8" x2="40" y2="72" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.6"/>
            <path d="M 15 25 Q 40 15 65 35" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="4,2"/>
            <path d="M 20 55 Q 50 45 70 50" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3,2"/>
            <path d="M 45 30 L 50 28 L 52 32 L 48 34 L 45 30 Z" fill="#f97316"/>
            <circle cx="47" cy="31" r="1.5" fill="#f97316"/>
            <defs>
              <radialGradient id="globeGradient2" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="70%" stopColor="#1e40af" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
              </radialGradient>
            </defs>
          </svg>
        </div>
        <div className={`${textSizes[size]} font-bold mt-2`}>
          <span className="text-white">Points</span>
          <span className="text-orange-400">IQ</span>
        </div>
      </div>
    );
  }

  // Full horizontal logo
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={sizeClasses[size]}>
        <svg viewBox="0 0 80 80" className="w-full h-full">
          {/* Globe with flight paths */}
          <circle cx="40" cy="40" r="32" fill="url(#globeGradient3)" stroke="#1e3a8a" strokeWidth="2"/>
          <path d="M 8 40 Q 40 20 72 40 Q 40 60 8 40" fill="none" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.6"/>
          <path d="M 8 40 Q 40 60 72 40 Q 40 20 8 40" fill="none" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.6"/>
          <line x1="40" y1="8" x2="40" y2="72" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.6"/>
          <path d="M 15 25 Q 40 15 65 35" fill="none" stroke="#f97316" strokeWidth="2.5" strokeDasharray="4,2"/>
          <path d="M 20 55 Q 50 45 70 50" fill="none" stroke="#f97316" strokeWidth="2" strokeDasharray="3,2"/>
          <path d="M 45 30 L 50 28 L 52 32 L 48 34 L 45 30 Z" fill="#f97316"/>
          <circle cx="47" cy="31" r="1.5" fill="#f97316"/>
          <defs>
            <radialGradient id="globeGradient3" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="70%" stopColor="#1e40af" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.1" />
            </radialGradient>
          </defs>
        </svg>
      </div>
      <div className={`${textSizes[size]} font-bold`}>
        <span className="text-white">Points</span>
        <span className="text-orange-400">IQ</span>
      </div>
    </div>
  );
};
