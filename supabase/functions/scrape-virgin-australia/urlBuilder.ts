
export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  cabinClass: string;
  passengers: number;
}

export function buildVirginAustraliaAwardUrl(params: FlightSearchParams): string {
  const baseUrl = 'https://book.virginaustralia.com/dx/VADX/#/flight-selection';
  const date = formatDateForVirginAustralia(params.departureDate);
  const month = formatMonthForVirginAustralia(params.departureDate);
  
  // Map cabin classes to Virgin Australia's format
  const cabinMap: Record<string, string> = {
    'economy': 'Economy',
    'premium-economy': 'Premium',
    'business': 'Business',
    'first': 'First'
  };
  
  const cabin = cabinMap[params.cabinClass.toLowerCase()] || 'Economy';
  
  const urlParams = new URLSearchParams({
    'ADT': params.passengers.toString(),
    'class': cabin,
    'awardBooking': 'true', // Critical for award flights
    'pos': 'au-en',
    'channel': '',
    'activeMonth': month,
    'journeyType': params.returnDate ? 'return' : 'one-way',
    'date': date,
    'origin': params.origin,
    'destination': params.destination
  });
  
  if (params.returnDate) {
    urlParams.append('returnDate', formatDateForVirginAustralia(params.returnDate));
  }
  
  return `${baseUrl}?${urlParams.toString()}`;
}

function formatDateForVirginAustralia(dateString: string): string {
  // Convert YYYY-MM-DD to MM-DD-YYYY format
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-${day}-${year}`;
}

function formatMonthForVirginAustralia(dateString: string): string {
  // Convert YYYY-MM-DD to MM-DD-YYYY format for activeMonth
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${month}-01-${year}`;
}
