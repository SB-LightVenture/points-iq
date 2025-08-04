export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass: string;
  passengers?: number;
}

export function generateBookingUrl(
  airline: string, 
  flightNumber: string, 
  params: FlightSearchParams
): string {
  const airlineCode = airline.toLowerCase().replace(/\s+/g, '-');
  
  switch (airlineCode) {
    case 'american-airlines':
    case 'american':
      return generateAmericanAirlinesUrl(params);
    
    case 'virgin-australia':
    case 'virgin':
      return generateVirginAustraliaUrl(params);
    
    case 'united-airlines':
    case 'united':
      return generateUnitedUrl(params);
    
    case 'delta':
    case 'delta-air-lines':
      return generateDeltaUrl(params);
    
    case 'qantas':
      return generateQantasUrl(params);
    
    default:
      // Fallback to airline's main website
      return getAirlineMainWebsite(airline);
  }
}

function generateAmericanAirlinesUrl(params: FlightSearchParams): string {
  const baseUrl = 'https://www.aa.com/booking/flight-search';
  const searchParams = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
    passengers: (params.passengers || 1).toString(),
    cabin: mapCabinClass(params.cabinClass),
    awardBooking: 'true'
  });
  
  if (params.returnDate) {
    searchParams.append('returnDate', params.returnDate);
    searchParams.append('tripType', 'roundTrip');
  } else {
    searchParams.append('tripType', 'oneWay');
  }
  
  return `${baseUrl}?${searchParams.toString()}`;
}

function generateVirginAustraliaUrl(params: FlightSearchParams): string {
  const baseUrl = 'https://book.virginaustralia.com/dx/VADX/#/flight-selection';
  const searchParams = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    date: formatDateForVirgin(params.departureDate),
    ADT: (params.passengers || 1).toString(),
    class: mapCabinClassForVirgin(params.cabinClass),
    awardBooking: 'true',
    pos: 'au-en'
  });
  
  if (params.returnDate) {
    searchParams.append('returnDate', formatDateForVirgin(params.returnDate));
    searchParams.append('journeyType', 'return');
  } else {
    searchParams.append('journeyType', 'one-way');
  }
  
  return `${baseUrl}?${searchParams.toString()}`;
}

function generateUnitedUrl(params: FlightSearchParams): string {
  const baseUrl = 'https://www.united.com/en/us/fsr/choose-flights';
  const searchParams = new URLSearchParams({
    f: params.origin,
    t: params.destination,
    d: params.departureDate,
    tt: params.returnDate ? 'rt' : 'ow',
    px: (params.passengers || 1).toString(),
    cc: mapCabinClass(params.cabinClass),
    awardTravel: 'true'
  });
  
  if (params.returnDate) {
    searchParams.append('r', params.returnDate);
  }
  
  return `${baseUrl}?${searchParams.toString()}`;
}

function generateDeltaUrl(params: FlightSearchParams): string {
  const baseUrl = 'https://www.delta.com/flight-search/book-a-flight';
  const searchParams = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
    passengers: (params.passengers || 1).toString(),
    cabin: mapCabinClass(params.cabinClass),
    awardTravel: 'true'
  });
  
  return `${baseUrl}?${searchParams.toString()}`;
}

function generateQantasUrl(params: FlightSearchParams): string {
  const baseUrl = 'https://www.qantas.com/au/en/booking/flight-search.html';
  const searchParams = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
    departureDate: params.departureDate,
    passengers: (params.passengers || 1).toString(),
    cabin: mapCabinClass(params.cabinClass),
    pointsBooking: 'true'
  });
  
  return `${baseUrl}?${searchParams.toString()}`;
}

function mapCabinClass(cabinClass: string): string {
  const classMap: Record<string, string> = {
    'economy': 'economy',
    'premium-economy': 'premium',
    'business': 'business',
    'first': 'first'
  };
  return classMap[cabinClass.toLowerCase()] || 'economy';
}

function mapCabinClassForVirgin(cabinClass: string): string {
  const classMap: Record<string, string> = {
    'economy': 'Economy',
    'premium-economy': 'Premium',
    'business': 'Business',
    'first': 'First'
  };
  return classMap[cabinClass.toLowerCase()] || 'Economy';
}

function formatDateForVirgin(dateString: string): string {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

function getAirlineMainWebsite(airline: string): string {
  const websiteMap: Record<string, string> = {
    'american airlines': 'https://www.aa.com',
    'virgin australia': 'https://www.virginaustralia.com',
    'united airlines': 'https://www.united.com',
    'delta': 'https://www.delta.com',
    'qantas': 'https://www.qantas.com',
    'southwest': 'https://www.southwest.com',
    'jetblue': 'https://www.jetblue.com',
    'alaska airlines': 'https://www.alaskaair.com'
  };
  
  const normalizedAirline = airline.toLowerCase();
  return websiteMap[normalizedAirline] || `https://www.google.com/search?q=${encodeURIComponent(airline + ' flights')}`;
}