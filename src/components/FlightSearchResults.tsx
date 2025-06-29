
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, Clock, MapPin, Users, AlertCircle } from 'lucide-react';

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
        return 'bg-green-500/20 text-green-300';
      case 'waitlist':
        return 'bg-yellow-500/20 text-yellow-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
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
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Searching for flights...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      <Card className="bg-slate-800/30 border-slate-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center space-x-2">
            <Plane className="w-5 h-5" />
            <span>Search Results</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Route</p>
              <p className="text-white font-semibold">
                {searchResults.origin} → {searchResults.destination}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Departure</p>
              <p className="text-white font-semibold">{searchResults.departureDate}</p>
            </div>
            <div>
              <p className="text-gray-400">Cabin Class</p>
              <p className="text-white font-semibold capitalize">{searchResults.cabinClass}</p>
            </div>
            <div>
              <p className="text-gray-400">Programs</p>
              <p className="text-white font-semibold">{searchResults.results.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results by Program */}
      {searchResults.results.map((programResult) => (
        <Card key={programResult.programId} className="bg-slate-800/30 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span>{programResult.programName}</span>
              <Badge variant="outline" className="text-gray-300 border-gray-600">
                {programResult.programCode}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {programResult.availability.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                <p>No flights found for this program</p>
              </div>
            ) : (
              <div className="space-y-4">
                {programResult.availability.map((flight, index) => (
                  <div
                    key={index}
                    className="bg-slate-700/30 rounded-lg p-4 border border-slate-600/50"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Flight Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Plane className="w-4 h-4 text-blue-400" />
                          <span className="text-white font-semibold">{flight.flight}</span>
                        </div>
                        <p className="text-sm text-gray-300">{flight.airline}</p>
                        <p className="text-xs text-gray-400">{flight.aircraft}</p>
                      </div>

                      {/* Time Info */}
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-green-400" />
                          <span className="text-white">{flight.departure} - {flight.arrival}</span>
                        </div>
                        <p className="text-sm text-gray-300">{flight.duration}</p>
                        <Badge 
                          variant="outline" 
                          className="text-xs text-gray-300 border-gray-600"
                        >
                          {getStopsText(flight.stops)}
                        </Badge>
                      </div>

                      {/* Cost Info */}
                      <div className="space-y-2">
                        <div className="text-white font-semibold">
                          {flight.pointsCost.toLocaleString()} pts
                        </div>
                        <div className="text-sm text-gray-300">
                          + ${flight.cashCost}
                        </div>
                      </div>

                      {/* Availability */}
                      <div className="flex items-center justify-end">
                        <Badge className={getAvailabilityColor(flight.availability)}>
                          {flight.availability}
                        </Badge>
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
