
import { FlightSearchParams } from './urlBuilder.ts';
import { FlightResult, extractFlightDataFromPage } from './dataExtractor.ts';
import { parseFlightDataFromAPI } from './apiParser.ts';

export async function scrapeVirginAustraliaAwardFlights(params: FlightSearchParams): Promise<FlightResult[]> {
  const { chromium } = await import("npm:playwright@1.40.0");
  
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor'
    ]
  });

  try {
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      viewport: { width: 1920, height: 1080 },
      locale: 'en-AU'
    });

    const page = await context.newPage();
    
    // Network interception to capture API calls
    const apiCalls: any[] = [];
    const flightData: any[] = [];
    
    page.on('response', async (response) => {
      const url = response.url();
      
      // Capture Virgin Australia booking API calls
      if (url.includes('/api/') || url.includes('/booking/') || url.includes('/flight/') || url.includes('/search/')) {
        try {
          const responseData = await response.json();
          apiCalls.push({
            url,
            status: response.status(),
            data: responseData
          });
          
          // Look for flight data in responses
          if (responseData.flights || responseData.segments || responseData.results) {
            flightData.push(responseData);
          }
        } catch (e) {
          console.log('Non-JSON response from:', url);
        }
      }
    });

    // Build the correct Virgin Australia award booking URL
    const { buildVirginAustraliaAwardUrl } = await import('./urlBuilder.ts');
    const searchUrl = buildVirginAustraliaAwardUrl(params);
    console.log('Navigating to Virgin Australia award booking URL:', searchUrl);

    await page.goto(searchUrl, {
      waitUntil: 'networkidle',
      timeout: 45000
    });

    // Wait for the React SPA to load and render
    await page.waitForTimeout(5000);

    // Wait for flight results to appear - look for various possible selectors
    const possibleSelectors = [
      '[data-testid*="flight"]',
      '[data-testid*="award"]',
      '[data-testid*="availability"]',
      '.flight-result',
      '.flight-option',
      '.segment',
      '.journey-option',
      '.award-availability',
      '[class*="flight"]',
      '[class*="segment"]',
      '[class*="journey"]',
      '[class*="award"]'
    ];

    let resultsLoaded = false;
    for (const selector of possibleSelectors) {
      try {
        await page.waitForSelector(selector, { timeout: 10000 });
        console.log(`Found flight results with selector: ${selector}`);
        resultsLoaded = true;
        break;
      } catch (e) {
        console.log(`Selector ${selector} not found, trying next...`);
      }
    }

    if (!resultsLoaded) {
      console.log('No standard flight result selectors found, checking for error messages or alternative layouts');
      
      // Check for error messages or no results
      const pageContent = await page.content();
      if (pageContent.includes('no flights') || pageContent.includes('No flights') || 
          pageContent.includes('not available') || pageContent.includes('sorry')) {
        throw new Error('No award flights available for this route and date');
      }
    }

    // Additional wait for dynamic content loading
    await page.waitForTimeout(3000);

    // Try to extract flight data using multiple strategies
    let flights = await extractFlightDataFromPage(page);

    // If page extraction fails, try to use intercepted API data
    if (flights.length === 0 && flightData.length > 0) {
      console.log('Page extraction failed, trying to parse intercepted API data');
      flights = parseFlightDataFromAPI(flightData, params);
    }

    console.log(`Extracted ${flights.length} award flights from Virgin Australia`);
    console.log('API calls intercepted:', apiCalls.length);
    
    // Log useful API endpoints for future optimization
    apiCalls.forEach(call => {
      if (call.url.includes('flight') || call.url.includes('search') || call.url.includes('booking')) {
        console.log(`Useful API endpoint: ${call.url} - Status: ${call.status}`);
      }
    });

    if (flights.length === 0) {
      throw new Error('No award flights found on Virgin Australia website for the specified criteria');
    }

    return flights;
    
  } finally {
    await browser.close();
  }
}
