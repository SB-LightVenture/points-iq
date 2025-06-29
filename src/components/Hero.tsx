
import { Button } from "@/components/ui/button";
import { ArrowDown, Lock, LogIn } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const scrollToSignup = () => {
    const ctaSection = document.querySelector('[data-section="cta"]');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAuthClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Globe Animation - Mobile Optimized */}
      <div className="absolute inset-0 opacity-10 sm:opacity-20">
        <div className="w-48 h-48 sm:w-64 sm:h-64 md:w-96 md:h-96 mx-auto mt-10 sm:mt-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-2xl sm:blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 rounded-full border-2 sm:border-4 border-blue-400 border-dashed animate-spin opacity-20 sm:opacity-30"></div>
          <div className="absolute top-4 left-4 sm:top-8 sm:left-8 w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 rounded-full border border-purple-400 sm:border-2 border-dotted animate-spin opacity-10 sm:opacity-20" style={{ animationDirection: 'reverse', animationDuration: '20s' }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-4 sm:mb-6 leading-tight">
          <span className="text-white">Points</span>
          <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">IQ</span>
        </h1>
        
        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-gray-300 mb-6 sm:mb-8 font-medium">
          Travel intelligence for your miles
        </p>
        
        <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-6 sm:mb-8 max-w-2xl lg:max-w-3xl mx-auto leading-relaxed px-2">
          Be among the first to discover exactly where your frequent flyer points can take you with our revolutionary interactive platform. 
          Limited early access spots available - secure yours now.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8 sm:mb-12">
          <Button 
            size="lg" 
            onClick={handleAuthClick}
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-semibold rounded-full shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 w-full max-w-xs sm:w-auto"
          >
            {user ? (
              <>
                <ArrowDown className="w-4 h-4 sm:w-5 sm:h-5 mr-2 rotate-45" />
                Go to Dashboard
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                Login / Sign Up
              </>
            )}
          </Button>
          
          {!user && (
            <Button 
              size="lg" 
              onClick={scrollToSignup}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 w-full max-w-xs sm:w-auto"
            >
              <Lock className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Secure Early Access
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl sm:max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">5,000+</div>
            <div className="text-sm sm:text-base text-gray-300">Early Access Spots</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-purple-400 mb-1 sm:mb-2">Limited</div>
            <div className="text-sm sm:text-base text-gray-300">Beta Access</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-blue-400 mb-1 sm:mb-2">Q3 2025</div>
            <div className="text-sm sm:text-base text-gray-300">Launch Timeline</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
      </div>
    </section>
  );
};
