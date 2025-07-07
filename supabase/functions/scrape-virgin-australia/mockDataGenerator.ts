
import { FlightResult } from './dataExtractor.ts';
import { FlightSearchParams } from './urlBuilder.ts';

export async function generateEnhancedVirginAustraliaData(params: FlightSearchParams): Promise<FlightResult[]> {
  const { origin, destination, cabinClass, passengers } = params;
  
  // Enhanced route-based flight generation
  const routeInfo = getRouteInfo(origin, destination);
  const cabinMultiplier = getCabinMultiplier(cabinClass);
  
  const results: FlightResult[] = [];
  const numFlights = Math.floor(Math.random() * 3) + 2; // 2-4 flights
  
  for (let i = 0; i < numFlights; i++) {
    const flightTimes = generateRealisticFlightTimes(routeInfo.duration);
    const basePointsCost = routeInfo.basePoints;
    const pointsCost = Math.floor(basePointsCost * cabinMultiplier * (0.9 + Math.random() * 0.2));
    
    results.push({
      airline: 'Virgin Australia',
      flight: `VA ${routeInfo.flightNumberRange.min + Math.floor(Math.random() * (routeInfo.flightNumberRange.max - routeInfo.flightNumberRange.min))}`,
      departure: flightTimes.departure,
      arrival: flightTimes.arrival,
      duration: routeInfo.duration,
      aircraft: getRealisticVirginAircraftForRoute(routeInfo.type),
      pointsCost,
      cashCost: Math.floor(pointsCost * 0.012) + Math.floor(Math.random() * 60) + 89,
      availability: getRealisticAvailability(cabinClass),
      stops: routeInfo.stops
    });
  }

  // Sort by departure time
  results.sort((a, b) => a.departure.localeCompare(b.departure));

  return results;
}

interface RouteInfo {
  type: 'domestic' | 'trans_tasman' | 'pacific' | 'international';
  duration: string;
  basePoints: number;
  stops: number;
  flightNumberRange: { min: number; max: number };
}

function getRouteInfo(origin: string, destination: string): RouteInfo {
  const australianCities = ['SYD', 'MEL', 'BNE', 'PER', 'ADL', 'CBR', 'DRW', 'HBA', 'CNS', 'TSV', 'OOL'];
  const newZealandCities = ['AKL', 'CHC', 'WLG', 'ZQN'];
  const pacificCities = ['NAN', 'VLI', 'APW', 'NOU'];
  const usCities = ['LAX', 'SFO', 'DFW', 'HNL'];

  const isOriginAus = australianCities.includes(origin);
  const isDestAus = australianCities.includes(destination);
  const isOriginNZ = newZealandCities.includes(origin);
  const isDestNZ = newZealandCities.includes(destination);
  const isOriginPacific = pacificCities.includes(origin);
  const isDestPacific = pacificCities.includes(destination);
  const isOriginUS = usCities.includes(origin);
  const isDestUS = usCities.includes(destination);

  // Domestic Australia
  if (isOriginAus && isDestAus) {
    const distance = getAustralianDistance(origin, destination);
    return {
      type: 'domestic',
      duration: distance.duration,
      basePoints: distance.points,
      stops: distance.stops,
      flightNumberRange: { min: 300, max: 999 }
    };
  }

  // Trans-Tasman (Australia <-> New Zealand)
  if ((isOriginAus && isDestNZ) || (isOriginNZ && isDestAus)) {
    return {
      type: 'trans_tasman',
      duration: '3h 15m',
      basePoints: 18000,
      stops: 0,
      flightNumberRange: { min: 100, max: 199 }
    };
  }

  // Pacific Islands
  if ((isOriginAus && isDestPacific) || (isOriginPacific && isDestAus)) {
    return {
      type: 'pacific',
      duration: '2h 45m',
      basePoints: 22000,
      stops: 0,
      flightNumberRange: { min: 1300, max: 1399 }
    };
  }

  // US routes
  if ((isOriginAus && isDestUS) || (isOriginUS && isDestAus)) {
    return {
      type: 'international',
      duration: '13h 30m',
      basePoints: 65000,
      stops: 0,
      flightNumberRange: { min: 1, max: 99 }
    };
  }

  // Default international
  return {
    type: 'international',
    duration: '8h 45m',
    basePoints: 45000,
    stops: Math.random() > 0.6 ? 0 : 1,
    flightNumberRange: { min: 200, max: 299 }
  };
}

function getAustralianDistance(origin: string, destination: string) {
  const distances: Record<string, Record<string, { duration: string; points: number; stops: number }>> = {
    'SYD': {
      'MEL': { duration: '1h 25m', points: 8000, stops: 0 },
      'BNE': { duration: '1h 20m', points: 8000, stops: 0 },
      'PER': { duration: '5h 15m', points: 15000, stops: 0 },
      'ADL': { duration: '2h 5m', points: 10000, stops: 0 }
    },
    'MEL': {
      'SYD': { duration: '1h 25m', points: 8000, stops: 0 },
      'BNE': { duration: '2h 15m', points: 12000, stops: 0 },
      'PER': { duration: '3h 45m', points: 15000, stops: 0 },
      'ADL': { duration: '1h 20m', points: 8000, stops: 0 }
    }
  };

  return distances[origin]?.[destination] || { duration: '2h 30m', points: 12000, stops: 0 };
}

function getCabinMultiplier(cabinClass: string): number {
  switch (cabinClass.toLowerCase()) {
    case 'economy': return 1;
    case 'premium-economy': return 1.6;
    case 'business': return 2.8;
    case 'first': return 4.2;
    default: return 1;
  }
}

function generateRealisticFlightTimes(duration: string): { departure: string; arrival: string } {
  const commonDepartureTimes = [
    '06:00', '06:30', '07:15', '08:00', '08:45', '09:30',
    '10:15', '11:00', '12:30', '13:45', '15:00', '16:15',
    '17:30', '18:45', '19:30', '20:15', '21:00'
  ];

  const departure = commonDepartureTimes[Math.floor(Math.random() * commonDepartureTimes.length)];
  
  // Parse duration and calculate arrival
  const durationMatch = duration.match(/(\d+)h\s*(\d+)m/);
  const hours = parseInt(durationMatch?.[1] || '2');
  const minutes = parseInt(durationMatch?.[2] || '0');
  
  const [depHour, depMin] = departure.split(':').map(Number);
  const totalMinutes = depHour * 60 + depMin + hours * 60 + minutes;
  const arrHour = Math.floor(totalMinutes / 60) % 24;
  const arrMin = totalMinutes % 60;
  
  const arrival = `${arrHour.toString().padStart(2, '0')}:${arrMin.toString().padStart(2, '0')}`;

  return { departure, arrival };
}

function getRealisticVirginAircraftForRoute(routeType: string): string {
  const aircraft = {
    'domestic': ['Boeing 737-800', 'Boeing 737-700', 'ATR 72-600', 'Embraer E190'],
    'trans_tasman': ['Boeing 737-800', 'Boeing 777-300ER'],
    'pacific': ['Boeing 737-800', 'Boeing 777-300ER'],
    'international': ['Boeing 777-300ER', 'Airbus A330-200']
  };

  const availableAircraft = aircraft[routeType as keyof typeof aircraft] || aircraft.domestic;
  return availableAircraft[Math.floor(Math.random() * availableAircraft.length)];
}

function getRealisticAvailability(cabinClass: string): string {
  const availabilityRates = {
    'economy': { available: 0.8, waitlist: 0.15, unavailable: 0.05 },
    'premium-economy': { available: 0.7, waitlist: 0.2, unavailable: 0.1 },
    'business': { available: 0.5, waitlist: 0.3, unavailable: 0.2 },
    'first': { available: 0.3, waitlist: 0.4, unavailable: 0.3 }
  };

  const rates = availabilityRates[cabinClass as keyof typeof availabilityRates] || availabilityRates.economy;
  const rand = Math.random();
  
  if (rand < rates.available) return 'Available';
  if (rand < rates.available + rates.waitlist) return 'Waitlist';
  return 'Unavailable';
}
