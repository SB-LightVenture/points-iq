
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Star, Zap } from "lucide-react";

export const ModernPricing = () => {
  const plans = [
    {
      name: "Explorer",
      price: "$0",
      period: "forever",
      description: "Perfect for occasional travelers",
      features: [
        "Search up to 3 airlines",
        "Basic availability alerts",
        "Community support",
        "Mobile app access"
      ],
      cta: "Start Free",
      popular: false,
      icon: Star
    },
    {
      name: "Traveler",
      price: "$19",
      period: "per month",
      description: "Most popular for frequent flyers",
      features: [
        "Search all 50+ airlines",
        "Real-time availability alerts",
        "Advanced search filters",
        "Priority customer support",
        "Points value tracking",
        "Calendar view"
      ],
      cta: "Start Free Trial",
      popular: true,
      icon: Zap
    },
    {
      name: "Explorer Pro",
      price: "$49",
      period: "per month",
      description: "For travel enthusiasts and professionals",
      features: [
        "Everything in Traveler",
        "Multi-user account sharing",
        "Advanced analytics dashboard",
        "API access",
        "Custom integrations",
        "White-label options"
      ],
      cta: "Contact Sales",
      popular: false,
      icon: Star
    }
  ];

  return (
    <section className="py-20 bg-muted/30" id="pricing">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your travel needs. All plans include a 7-day free trial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card key={index} className={`card-hover relative ${plan.popular ? 'border-primary shadow-lg scale-105' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground px-4 py-1">
                    Most Popular
                  </Badge>
                </div>
              )}
              
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center">
                  <plan.icon className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="mb-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground ml-2">{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>
              
              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <Button 
                  className={`w-full ${plan.popular ? 'bg-primary hover:bg-primary/90' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}
                  size="lg"
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            All plans include 7-day free trial • No credit card required • Cancel anytime
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>24/7 customer support</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Enterprise solutions available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
