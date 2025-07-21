
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plane, ArrowRight, Clock, Calendar } from "lucide-react";

export const FlightPathDemo = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Maximize Your <span className="gradient-text">Frequent Flyer Points</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            See exactly how far your points can take you with real examples and live pricing
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Card className="overflow-hidden card-hover">
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                {/* Flight Route Visualization */}
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                        <Plane className="w-8 h-8 text-blue-600" />
                      </div>
                      <h3 className="font-semibold">MEL</h3>
                      <p className="text-sm text-muted-foreground">Melbourne</p>
                    </div>
                    
                    <div className="flex-1 relative mx-8">
                      <div className="h-0.5 bg-gradient-to-r from-blue-500 to-orange-500 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full border-2 border-blue-500 flex items-center justify-center">
                          <Plane className="w-4 h-4 text-blue-600 transform rotate-45" />
                        </div>
                      </div>
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          Direct Flight
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                        <Plane className="w-8 h-8 text-orange-600" />
                      </div>
                      <h3 className="font-semibold">SFO</h3>
                      <p className="text-sm text-muted-foreground">San Francisco</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>14h 30m</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Apr 15, 2025</span>
                    </div>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                    <div>
                      <h4 className="font-semibold text-green-800">Business Class</h4>
                      <p className="text-sm text-green-600">Qantas QF93</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-800">85,000</p>
                      <p className="text-sm text-green-600">points + $120</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Cash Price</span>
                      <span className="text-sm line-through text-muted-foreground">$4,200</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-muted-foreground">Your Points Value</span>
                      <span className="text-sm font-semibold text-green-600">$4,080 saved</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">Total Cost</span>
                      <span className="font-bold text-primary">85,000 pts + $120</span>
                    </div>
                  </div>

                  <Button className="w-full" size="lg">
                    Book This Flight
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
