
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plane, Globe, Link, CheckCircle } from "lucide-react";

export const AirlineSupport = () => {
  const airlines = [
    { name: "Qantas", program: "Frequent Flyer", logo: "🇦🇺", color: "bg-red-100 text-red-800", status: "connected" },
    { name: "Virgin Australia", program: "Velocity", logo: "🇦🇺", color: "bg-red-100 text-red-800", status: "connected" },
    { name: "Singapore Airlines", program: "KrisFlyer", logo: "🇸🇬", color: "bg-blue-100 text-blue-800", status: "connected" },
    { name: "American Airlines", program: "AAdvantage", logo: "🇺🇸", color: "bg-blue-100 text-blue-800", status: "connected" },
    { name: "United Airlines", program: "MileagePlus", logo: "🇺🇸", color: "bg-blue-100 text-blue-800", status: "connected" },
    { name: "Air Canada", program: "Aeroplan", logo: "🇨🇦", color: "bg-red-100 text-red-800", status: "connected" },
  ];

  const features = [
    "Automatic balance sync",
    "Real-time award availability",
    "Multi-program search",
    "Cross-alliance bookings",
    "Points transfer optimization",
    "Expiration tracking"
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Multi-Program</span> Support
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect all your frequent flyer accounts and manage them from one intelligent dashboard
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Airline Cards */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {airlines.map((airline, index) => (
                  <Card key={index} className="airline-card">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center text-2xl border">
                          {airline.logo}
                        </div>
                        <div>
                          <h3 className="font-semibold">{airline.name}</h3>
                          <p className="text-sm text-muted-foreground">{airline.program}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                        <Link className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card className="border-dashed border-2 border-muted-foreground/20">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                    <Plane className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">More Airlines Coming Soon</h3>
                  <p className="text-sm text-muted-foreground">Emirates, Cathay Pacific, JAL, and more</p>
                </CardContent>
              </Card>
            </div>

            {/* Features */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Unified Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-50 to-orange-50 border-blue-200">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">Smart Recommendations</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Get personalized suggestions for the best use of your points across all your programs
                  </p>
                  <Button variant="outline" className="w-full">
                    Connect Your Accounts
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
