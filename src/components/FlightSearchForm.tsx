
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, Calendar } from 'lucide-react';

interface FlightSearchFormProps {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate: string;
  cabinClass: string;
  passengers: number;
  loading: boolean;
  error: any;
  onOriginChange: (value: string) => void;
  onDestinationChange: (value: string) => void;
  onDepartureDateChange: (value: string) => void;
  onReturnDateChange: (value: string) => void;
  onCabinClassChange: (value: string) => void;
  onPassengersChange: (value: number) => void;
  onSearch: () => void;
}

const FlightSearchForm: React.FC<FlightSearchFormProps> = ({
  origin,
  destination,
  departureDate,
  returnDate,
  cabinClass,
  passengers,
  loading,
  error,
  onOriginChange,
  onDestinationChange,
  onDepartureDateChange,
  onReturnDateChange,
  onCabinClassChange,
  onPassengersChange,
  onSearch
}) => {
  return (
    <>
      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="origin" className="text-gray-300">Origin</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="origin"
              type="text"
              value={origin}
              onChange={(e) => onOriginChange(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 pl-10"
              placeholder="e.g., LAX, JFK, DFW"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="destination" className="text-gray-300">Destination</Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="destination"
              type="text"
              value={destination}
              onChange={(e) => onDestinationChange(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 pl-10"
              placeholder="e.g., NRT, LHR, CDG"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="departure" className="text-gray-300">Departure Date</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="departure"
              type="date"
              value={departureDate}
              onChange={(e) => onDepartureDateChange(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="return" className="text-gray-300">Return Date (Optional)</Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              id="return"
              type="date"
              value={returnDate}
              onChange={(e) => onReturnDateChange(e.target.value)}
              className="bg-slate-700/50 border-slate-600 text-white placeholder-gray-400 pl-10"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="cabin" className="text-gray-300">Cabin Class</Label>
          <Select value={cabinClass} onValueChange={onCabinClassChange}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              <SelectItem value="economy" className="text-white hover:bg-slate-700">Economy</SelectItem>
              <SelectItem value="premium-economy" className="text-white hover:bg-slate-700">Premium Economy</SelectItem>
              <SelectItem value="business" className="text-white hover:bg-slate-700">Business</SelectItem>
              <SelectItem value="first" className="text-white hover:bg-slate-700">First Class</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="passengers" className="text-gray-300">Passengers</Label>
          <Select value={passengers.toString()} onValueChange={(value) => onPassengersChange(parseInt(value))}>
            <SelectTrigger className="bg-slate-700/50 border-slate-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <SelectItem key={num} value={num.toString()} className="text-white hover:bg-slate-700">
                  {num} {num === 1 ? 'Passenger' : 'Passengers'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <Button
          onClick={onSearch}
          disabled={!origin.trim() || !destination.trim() || !departureDate || loading}
          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
        >
          <Search className="w-4 h-4 mr-2" />
          {loading ? 'Searching...' : 'Search Flights'}
        </Button>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-400">
            <div className="font-medium text-sm mb-1">{error.title}</div>
            <div className="text-xs opacity-90 mb-2">{error.message}</div>
            {error.actions && error.actions.length > 0 && (
              <div className="text-xs opacity-80">
                <div className="mb-1">Try:</div>
                <ul className="space-y-1">
                  {error.actions.map((action: string, index: number) => (
                    <li key={index} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default FlightSearchForm;
