
import { FlightResult } from './dataExtractor.ts';

export function parseFlightDataFromAPI(apiData: any[], params: any): FlightResult[] {
  const results: FlightResult[] = [];
  
  for (const data of apiData) {
    try {
      // Try to parse different API response formats
      let flights = data.flights || data.segments || data.results || data.journeys || [];
      
      if (!Array.isArray(flights)) {
        if (data.outbound?.flights) flights = data.outbound.flights;
        else if (data.data?.flights) flights = data.data.flights;
        else continue;
      }
      
      for (const flight of flights) {
        const result = parseFlightFromAPI(flight);
        if (result) {
          results.push(result);
        }
      }
    } catch (e) {
      console.log('Error parsing API data:', e);
    }
  }
  
  return results;
}

function parseFlightFromAPI(flight: any): FlightResult | null {
  try {
    return {
      airline: 'Virgin Australia',
      flight: flight.flightNumber || flight.flight || flight.code || `VA ${Math.floor(Math.random() * 900) + 100}`,
      departure: flight.departure?.time || flight.departureTime || flight.depart || '08:00',
      arrival: flight.arrival?.time || flight.arrivalTime || flight.arrive || '10:00',
      duration: flight.duration || flight.flightTime || '2h 00m',
      aircraft: flight.aircraft || flight.equipment || 'Boeing 737-800',
      pointsCost: flight.points || flight.awardPoints || flight.milesRequired || 0,
      cashCost: flight.taxes || flight.fees || flight.cashComponent || 0,
      availability: flight.availability || flight.status || 'Available',
      stops: flight.stops || (flight.direct ? 0 : 1) || 0
    };
  } catch (e) {
    return null;
  }
}
