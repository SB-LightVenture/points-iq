
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export const AvailabilityShowcase = () => {
  const availabilityData = [
    { date: "Apr 15", economy: { available: true, points: 45000 }, business: { available: true, points: 85000 }, first: { available: false, points: 0 } },
    { date: "Apr 16", economy: { available: true, points: 45000 }, business: { available: false, points: 0 }, first: { available: false, points: 0 } },
    { date: "Apr 17", economy: { available: true, points: 45000 }, business: { available: true, points: 85000 }, first: { available: true, points: 150000 } },
    { date: "Apr 18", economy: { available: true, points: 45000 }, business: { available: true, points: 85000 }, first: { available: false, points: 0 } },
    { date: "Apr 19", economy: { available: false, points: 0 }, business: { available: false, points: 0 }, first: { available: false, points: 0 } },
    { date: "Apr 20", economy: { available: true, points: 45000 }, business: { available: true, points: 85000 }, first: { available: true, points: 150000 } },
  ];

  const getStatusIcon = (available: boolean) => {
    if (available) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <XCircle className="w-4 h-4 text-red-500" />;
  };

  const getStatusColor = (available: boolean) => {
    if (available) return "bg-green-100 text-green-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="gradient-text">Real Availability</span>, Real Time
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No more daily searching. See actual available reward seats across different dates and cabin classes instantly.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <Card className="card-hover">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Melbourne to San Francisco - April 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-semibold">Date</th>
                      <th className="text-center p-4 font-semibold">Economy</th>
                      <th className="text-center p-4 font-semibold">Business</th>
                      <th className="text-center p-4 font-semibold">First</th>
                    </tr>
                  </thead>
                  <tbody>
                    {availabilityData.map((row, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium">{row.date}</span>
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            {getStatusIcon(row.economy.available)}
                            {row.economy.available && (
                              <Badge variant="secondary" className={getStatusColor(row.economy.available)}>
                                {row.economy.points.toLocaleString()} pts
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            {getStatusIcon(row.business.available)}
                            {row.business.available && (
                              <Badge variant="secondary" className={getStatusColor(row.business.available)}>
                                {row.business.points.toLocaleString()} pts
                              </Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-2">
                            {getStatusIcon(row.first.available)}
                            {row.first.available && (
                              <Badge variant="secondary" className={getStatusColor(row.first.available)}>
                                {row.first.points.toLocaleString()} pts
                              </Badge>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-blue-800">Live Updates</h4>
                </div>
                <p className="text-sm text-blue-700">
                  Availability refreshed every 30 minutes. Set alerts for your preferred dates and classes.
                </p>
              </div>

              <div className="mt-6 text-center">
                <Button size="lg" className="px-8">
                  Set Up Availability Alerts
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
