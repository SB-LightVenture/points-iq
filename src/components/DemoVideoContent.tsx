
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, ArrowRight, Clock, Users, DollarSign, Globe } from "lucide-react";
import { useEffect, useState } from "react";

export const DemoVideoContent = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(true);

  const steps = [
    {
      title: "Your points are worth more than you think",
      subtitle: "Stop guessing where your points can take you",
      icon: <Globe className="w-12 h-12 text-primary" />,
      color: "from-blue-500 to-purple-500"
    },
    {
      title: "Melbourne to San Francisco",
      subtitle: "Business Class • Direct Flight",
      icon: <Plane className="w-12 h-12 text-orange-500" />,
      color: "from-orange-500 to-red-500"
    },
    {
      title: "85,000 points + $120",
      subtitle: "Save $4,080 vs cash price",
      icon: <DollarSign className="w-12 h-12 text-green-500" />,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "10,000+ travelers helped",
      subtitle: "$2.3M+ saved • 50+ airlines",
      icon: <Users className="w-12 h-12 text-blue-500" />,
      color: "from-blue-500 to-cyan-500"
    }
  ];

  useEffect(() => {
    if (!isAnimating) return;

    const interval = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % steps.length);
    }, 2500);

    return () => clearInterval(interval);
  }, [isAnimating, steps.length]);

  return (
    <div className="relative w-full h-full bg-gradient-to-br from-background to-muted/30 flex items-center justify-center p-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-32 h-32 bg-blue-500/20 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-40 h-40 bg-orange-500/20 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-purple-500/20 rounded-full animate-pulse delay-500"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="text-foreground">Points</span>
            <span className="gradient-text">IQ</span>
          </h1>
          <p className="text-xl text-muted-foreground">Travel intelligence for your miles</p>
        </div>

        {/* Animated Step Content */}
        <div className="transition-all duration-500 ease-in-out">
          <Card className="card-hover bg-card/80 backdrop-blur-sm border-2">
            <CardContent className="p-8">
              <div className={`w-24 h-24 rounded-full bg-gradient-to-r ${steps[currentStep].color} flex items-center justify-center mx-auto mb-6`}>
                {steps[currentStep].icon}
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-foreground">
                {steps[currentStep].title}
              </h2>
              
              <p className="text-lg text-muted-foreground mb-6">
                {steps[currentStep].subtitle}
              </p>

              {/* Progress Indicators */}
              <div className="flex justify-center gap-2 mb-6">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>

              {/* Feature Examples */}
              {currentStep === 1 && (
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>14h 30m</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    <span>Direct</span>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Cash Price:</span>
                    <span className="line-through text-muted-foreground">$4,200</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">Your Cost:</span>
                    <span className="font-semibold text-primary">85,000 pts + $120</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-muted-foreground">You Save:</span>
                    <span className="font-bold text-green-600">$4,080</span>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">10K+</div>
                    <div className="text-sm text-muted-foreground">Travelers</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-orange-500">$2.3M+</div>
                    <div className="text-sm text-muted-foreground">Saved</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-500">50+</div>
                    <div className="text-sm text-muted-foreground">Airlines</div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-8">
          <Badge variant="secondary" className="mb-4">
            Get Started Free - Limited Beta Access
          </Badge>
          <p className="text-muted-foreground">
            Join thousands of smart travelers maximizing their points
          </p>
        </div>
      </div>
    </div>
  );
};
