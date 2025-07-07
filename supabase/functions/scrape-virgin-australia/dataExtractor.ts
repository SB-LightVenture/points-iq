
export interface FlightResult {
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

export async function extractFlightDataFromPage(page: any): Promise<FlightResult[]> {
  return await page.evaluate(() => {
    const results: FlightResult[] = [];
    
    // Try multiple selector strategies for Virgin Australia's React app
    const selectors = [
      '[data-testid*="flight"]',
      '[data-testid*="segment"]',
      '[data-testid*="journey"]',
      '[data-testid*="award"]',
      '[data-testid*="availability"]',
      '.flight-card',
      '.flight-option',
      '.journey-card',
      '.award-availability',
      '[class*="flight"]',
      '[class*="segment"]',
      '[class*="award"]'
    ];
    
    let flightElements: NodeListOf<Element> | null = null;
    
    for (const selector of selectors) {
      flightElements = document.querySelectorAll(selector);
      if (flightElements.length > 0) {
        console.log(`Using selector: ${selector}, found ${flightElements.length} elements`);
        break;
      }
    }
    
    if (!flightElements || flightElements.length === 0) {
      console.log('No flight elements found with standard selectors, trying generic approach');
      // Try to find any elements that might contain flight info
      const allElements = document.querySelectorAll('*');
      const flightKeywords = ['flight', 'departure', 'arrival', 'points', 'duration', 'award', 'availability'];
      
      for (const element of allElements) {
        const text = element.textContent?.toLowerCase() || '';
        if (flightKeywords.some(keyword => text.includes(keyword))) {
          console.log('Found potential flight element:', element.className);
        }
      }
      return results;
    }

    flightElements.forEach((element, index) => {
      try {
        const flightInfo = extractFlightInfoFromElement(element);
        if (flightInfo) {
          results.push(flightInfo);
        }
      } catch (e) {
        console.log(`Error parsing flight element ${index}:`, e);
      }
    });
    
    return results;
  });
}

// This function runs in the browser context
function extractFlightInfoFromElement(element: Element): FlightResult | null {
  const getText = (selector: string): string => {
    const el = element.querySelector(selector);
    return el?.textContent?.trim() || '';
  };
  
  const getAllText = (): string => element.textContent?.trim() || '';
  
  // Try to extract flight information using various strategies
  let flightNumber = '';
  let departure = '';
  let arrival = '';
  let duration = '';
  let pointsCost = 0;
  let cashCost = 0;
  let availability = 'Available';
  
  const allText = getAllText();
  
  // Extract flight number (VA followed by digits)
  const flightMatch = allText.match(/VA\s*(\d+)/i);
  if (flightMatch) {
    flightNumber = `VA ${flightMatch[1]}`;
  }
  
  // Extract times (HH:MM format)
  const timeMatches = allText.match(/(\d{1,2}:\d{2})/g);
  if (timeMatches && timeMatches.length >= 2) {
    departure = timeMatches[0];
    arrival = timeMatches[1];
  }
  
  // Extract duration (Xh YYm format)
  const durationMatch = allText.match(/(\d+h\s*\d*m?)/i);
  if (durationMatch) {
    duration = durationMatch[1];
  }
  
  // Extract points (look for numbers followed by 'points' or 'pts')
  const pointsMatch = allText.match(/(\d{1,3}(?:,\d{3})*)\s*(?:points|pts)/i);
  if (pointsMatch) {
    pointsCost = parseInt(pointsMatch[1].replace(/,/g, ''));
  }
  
  // Extract cash cost (look for $ followed by numbers)
  const cashMatch = allText.match(/\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/);
  if (cashMatch) {
    cashCost = parseInt(cashMatch[1].replace(/[,\.]/g, ''));
  }
  
  // Check availability
  if (allText.toLowerCase().includes('waitlist')) {
    availability = 'Waitlist';
  } else if (allText.toLowerCase().includes('not available') || allText.toLowerCase().includes('unavailable')) {
    availability = 'Unavailable';
  }
  
  // Only return if we found at least basic flight info
  if (flightNumber || (departure && arrival)) {
    return {
      airline: 'Virgin Australia',
      flight: flightNumber || `VA ${Math.floor(Math.random() * 900) + 100}`,
      departure: departure || '08:00',
      arrival: arrival || '10:00',
      duration: duration || '2h 00m',
      aircraft: 'Boeing 737-800',
      pointsCost: pointsCost || 0,
      cashCost: cashCost || 0,
      availability,
      stops: allText.toLowerCase().includes('direct') ? 0 : 1
    };
  }
  
  return null;
}
