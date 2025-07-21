
import { Button } from "@/components/ui/button";
import { ArrowRight, Plane, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { VideoModal } from "@/components/VideoModal";
import { DemoVideoContent } from "@/components/DemoVideoContent";

export const ModernHero = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <section className="relative min-h-screen bg-background overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-orange-50 opacity-30"></div>
      <div className="absolute top-20 right-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-72 h-72 bg-orange-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse delay-300"></div>

      <div className="relative z-10">
        {/* Navigation */}
        <nav className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Globe className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">
                Points<span className="text-orange-500">IQ</span>
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">How it Works</a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
              <Button variant="outline" onClick={handleGetStarted}>
                {user ? 'Dashboard' : 'Sign In'}
              </Button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Your points are worth
              <br />
              <span className="gradient-text">more than you think</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stop guessing. Start flying. See exactly where your frequent flyer points can take you with our intelligent travel platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button size="lg" onClick={handleGetStarted} className="px-8 py-6 text-lg">
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              
              <VideoModal
                trigger={
                  <Button size="lg" variant="outline" className="px-8 py-6 text-lg group hover:bg-primary hover:text-primary-foreground transition-all duration-300">
                    Watch Demo
                    <Plane className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </Button>
                }
              />
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>10,000+ travelers helped</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>$2.3M+ saved in flight costs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <span>50+ airlines supported</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
