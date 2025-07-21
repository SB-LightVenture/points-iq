
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Zap, Shield, BarChart3, Bell, Smartphone } from "lucide-react";

export const ModernFeatures = () => {
  const features = [
    {
      icon: MapPin,
      title: "Interactive Globe Dashboard",
      description: "Visualize your travel possibilities on a stunning 3D globe interface with real-time data.",
      badge: "Popular",
      color: "text-blue-600"
    },
    {
      icon: Zap,
      title: "Lightning Fast Search",
      description: "Search across 50+ airlines and find available reward seats in seconds, not hours.",
      badge: "Fast",
      color: "text-yellow-600"
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your data is encrypted and secure. We never store your login credentials.",
      badge: "Secure",
      color: "text-green-600"
    },
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Track your points value over time and get insights on the best redemption strategies.",
      badge: "Insights",
      color: "text-purple-600"
    },
    {
      icon: Bell,
      title: "Availability Alerts",
      description: "Get notified the moment award seats become available for your dream destinations.",
      badge: "Alerts",
      color: "text-orange-600"
    },
    {
      icon: Smartphone,
      title: "Mobile Optimized",
      description: "Search and book on the go with our fully responsive mobile experience.",
      badge: "Mobile",
      color: "text-pink-600"
    }
  ];

  return (
    <section className="py-20" id="features">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Everything you need to
            <br />
            <span className="gradient-text">travel smarter</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you maximize your points and find the best award flights
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-hover group">
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg bg-background border-2 flex items-center justify-center ${feature.color} group-hover:scale-110 transition-transform`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-50 to-orange-50 border-blue-200">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of travelers who are already maximizing their points with PointsIQ
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Start Free Trial
                </button>
                <button className="px-8 py-3 border border-border rounded-lg font-medium hover:bg-accent transition-colors">
                  Schedule Demo
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
