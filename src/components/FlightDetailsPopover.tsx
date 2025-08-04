import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Info, Plane, Clock, MapPin, ExternalLink } from 'lucide-react';
import { generateBookingUrl } from '@/utils/bookingUrls';

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

interface FlightDetailsPopoverProps {
  flight: FlightResult;
  origin: string;
  destination: string;
  departureDate: string;
  cabinClass: string;
}

const FlightDetailsPopover: React.FC<FlightDetailsPopoverProps> = ({
  flight,
  origin,
  destination,
  departureDate,
  cabinClass
}) => {
  const getStopsText = (stops: number) => {
    if (stops === 0) return 'Direct Flight';
    if (stops === 1) return '1 Stop';
    return `${stops} Stops`;
  };

  const handleBookFlight = () => {
    const bookingUrl = flight.bookingUrl || generateBookingUrl(
      flight.airline,
      flight.flight,
      {
        origin,
        destination,
        departureDate,
        cabinClass,
        passengers: 1
      }
    );
    
    window.open(bookingUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <Info className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-none shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Plane className="h-4 w-4 text-primary" />
              Flight Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Flight Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Flight</span>
                <span className="font-medium text-foreground">{flight.flight}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Airline</span>
                <span className="font-medium text-foreground">{flight.airline}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Aircraft</span>
                <span className="font-medium text-foreground">{flight.aircraft}</span>
              </div>
            </div>

            {/* Route & Time */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Route
                </span>
                <span className="font-medium text-foreground">{origin} → {destination}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Time
                </span>
                <span className="font-medium text-foreground">{flight.departure} - {flight.arrival}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Duration</span>
                <span className="font-medium text-foreground">{flight.duration}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Stops</span>
                <Badge variant="outline" className="text-xs">
                  {getStopsText(flight.stops)}
                </Badge>
              </div>
            </div>

            {/* Cost */}
            <div className="bg-accent/50 rounded-lg p-3 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Points Required</span>
                <span className="text-lg font-bold text-foreground">
                  {flight.pointsCost.toLocaleString()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Taxes & Fees</span>
                <span className="font-medium text-foreground">
                  ${flight.cashCost}
                </span>
              </div>
            </div>

            {/* Book Button */}
            <Button 
              onClick={handleBookFlight}
              className="w-full"
              size="lg"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Book on {flight.airline}
            </Button>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default FlightDetailsPopover;