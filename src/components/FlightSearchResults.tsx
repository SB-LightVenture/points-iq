
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Clock, MapPin, Users, AlertCircle } from 'lucide-react';
import FlightDetailsPopover from '@/components/FlightDetailsPopover';

interface FlightResult {
  airline: string;
  flight: string;
  departure: string;
  arrival: string;
  duration: string;
  aircraft: string;
  pointsCost: number;
  cashCost: number;
  availability: string;
  stops: number;
  bookingUrl?: string;
}

interface SearchResult {
  searchId: string;
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass: string;
  results: {
    programId: string;
    programName: string;
    programCode: string;
    availability: FlightResult[];
  }[];
}

interface FlightSearchResultsProps {
  searchResults: SearchResult;
  loading?: boolean;
}

const FlightSearchResults: React.FC<FlightSearchResultsProps> = ({ 
  searchResults, 
  loading = false 
}) => {
  const getAvailabilityColor = (availability: string) => {
    switch (availability.toLowerCase()) {
      case 'available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'waitlist':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStopsText = (stops: number) => {
    if (stops === 0) return 'Direct';
    if (stops === 1) return '1 Stop';
    return `${stops} Stops`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8">
          <div className="w-8 h-8 border-4 border-[hsl(var(--blue-brand))] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Searching for flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <Card className="bg-white border-border shadow-sm">
        <CardHeader>
          <CardTitle className="text-foreground flex items-center space-x-2">
            <Plane className="w-5 h-5" />
            <span>Search Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Route</p>
              <p className="text-foreground font-semibold">
                {searchResults.origin} → {searchResults.destination}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Departure</p>
              <p className="text-foreground font-semibold">{searchResults.departureDate}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Cabin Class</p>
              <p className="text-foreground font-semibold capitalize">{searchResults.cabinClass}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Programs</p>
              <p className="text-foreground font-semibold">{searchResults.results.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results by Program */}
      {searchResults.results.map((programResult) => (
        <Card key={programResult.programId} className="bg-white border-border shadow-sm">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center justify-between">
              <span>{programResult.programName}</span>
              <Badge variant="outline" className="text-muted-foreground border-border">
                {programResult.programCode}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {programResult.availability.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No flights found for this program</p>
              </div>
            ) : (
              <div className="space-y-4">
                {programResult.availability.map((flight, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 border border-border"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Flight Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Plane className="w-4 h-4 text-[hsl(var(--blue-brand))]" />
                          <span className="text-foreground font-semibold">{flight.flight}</span>
                        </div>
                        <p className="text-sm text-foreground">{flight.airline}</p>
                        <p className="text-xs text-muted-foreground">{flight.aircraft}</p>
                      </div>

                      {/* Time Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-green-600" />
                          <span className="text-foreground">{flight.departure} - {flight.arrival}</span>
                        </div>
                        <p className="text-sm text-foreground">{flight.duration}</p>
                        <Badge 
                          variant="outline" 
                          className="text-xs text-muted-foreground border-border"
                        >
                          {getStopsText(flight.stops)}
                        </Badge>
                      </div>

                      {/* Cost Info */}
                      <div className="space-y-2">
                        <div className="text-foreground font-semibold">
                          {flight.pointsCost.toLocaleString()} pts
                        </div>
                        <div className="text-sm text-foreground">
                          + ${flight.cashCost}
                        </div>
                      </div>

                      {/* Flight Details */}
                      <div className="flex items-center justify-end">
                        <FlightDetailsPopover
                          flight={flight}
                          origin={searchResults.origin}
                          destination={searchResults.destination}
                          departureDate={searchResults.departureDate}
                          cabinClass={searchResults.cabinClass}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FlightSearchResults;
