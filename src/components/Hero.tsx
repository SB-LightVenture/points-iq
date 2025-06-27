
import { Button } from "@/components/ui/button";
import { ArrowDown, Lock } from "lucide-react";

export const Hero = () => {
  const scrollToSignup = () => {
    const ctaSection = document.querySelector('[data-section="cta"]');
    if (ctaSection) {
      ctaSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Globe Animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-96 h-96 mx-auto mt-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-64 h-64 rounded-full border-4 border-blue-400 border-dashed animate-spin opacity-30"></div>
          <div className="absolute top-8 left-8 w-48 h-48 rounded-full border-2 border-purple-400 border-dotted animate-spin opacity-20" style={{ animationDirection: 'reverse', animationDuration: '20s' }}></div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          <span className="text-white">Points</span>
          <span className="bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-transparent">IQ</span>
        </h1>
        
        <p className="text-2xl md:text-3xl text-gray-300 mb-8 font-medium">
          Travel intelligence for your miles
        </p>
        
        <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto leading-relaxed">
          Be among the first to discover exactly where your frequent flyer points can take you with our revolutionary interactive platform. 
          Limited early access spots available - secure yours now.
        </p>
        
        <div className="flex justify-center mb-12">
          <Button 
            size="lg" 
            onClick={scrollToSignup}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-10 py-5 text-xl font-semibold rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <Lock className="w-5 h-5 mr-2" />
            Secure Early Access
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">5,000+</div>
            <div className="text-gray-300">Early Access Spots</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">Limited</div>
            <div className="text-gray-300">Beta Access</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">Q3 2025</div>
            <div className="text-gray-300">Launch Timeline</div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <ArrowDown className="w-6 h-6 text-blue-400" />
      </div>
    </section>
  );
};
