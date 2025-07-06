
import { supabase } from '@/integrations/supabase/client';
import { flightScrapingCache } from './flightScrapingCache';

export interface ScrapingResult {
  success: boolean;
  results: any[];
  scraped_at: string;
  airline: string;
  error?: string;
  live_scraping?: boolean;
  source?: 'live' | 'mock' | 'cache' | 'error';
  debug?: any;
}

export class FlightScrapingService {
  private static instance: FlightScrapingService;
  
  static getInstance(): FlightScrapingService {
    if (!FlightScrapingService.instance) {
      FlightScrapingService.instance = new FlightScrapingService();
    }
    return FlightScrapingService.instance;
  }

  private dispatchDebugEvent(info: any) {
    // Dispatch custom event for debug monitor
    const event = new CustomEvent('flightSearchDebug', {
      detail: { debugInfo: info }
    });
    window.dispatchEvent(event);
  }

  async scrapeAmericanAirlines(params: any): Promise<ScrapingResult> {
    const cacheKey = flightScrapingCache.generateKey({ ...params, airline: 'AA' });
    
    // Check cache first
    const cachedResult = flightScrapingCache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached AA results');
      
      this.dispatchDebugEvent({
        timestamp: new Date().toISOString(),
        airline: 'American Airlines',
        status: 'success',
        source: 'cache',
        responseTime: 50,
        debug: {
          data_source: 'cached_data',
          route: `${params.origin}-${params.destination}`
        }
      });

      return {
        ...cachedResult,
        source: 'cache'
      };
    }

    const startTime = performance.now();

    try {
      console.log('Calling American Airlines scraper...');
      
      const { data, error } = await supabase.functions.invoke('scrape-american-airlines', {
        body: params
      });

      if (error) {
        throw new Error(error.message);
      }

      // Cache successful results
      flightScrapingCache.set(cacheKey, data);
      
      const responseTime = performance.now() - startTime;
      console.log(`AA scraping completed in ${responseTime.toFixed(0)}ms`);
      
      this.dispatchDebugEvent({
        timestamp: new Date().toISOString(),
        airline: 'American Airlines',
        status: 'success',
        source: data.source || 'mock',
        responseTime: Math.round(responseTime),
        debug: {
          ...data.debug,
          response_time_ms: responseTime.toFixed(0)
        }
      });
      
      return {
        ...data,
        debug: {
          ...data.debug,
          response_time_ms: responseTime.toFixed(0)
        }
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      console.error('AA scraping failed:', error);
      
      this.dispatchDebugEvent({
        timestamp: new Date().toISOString(),
        airline: 'American Airlines',
        status: 'error',
        source: 'error',
        responseTime: Math.round(responseTime),
        error: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          error_type: 'scraping_failure',
          response_time_ms: responseTime.toFixed(0),
          error_details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      
      return {
        success: false,
        results: [],
        scraped_at: new Date().toISOString(),
        airline: 'American Airlines',
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'error',
        debug: {
          error_type: 'scraping_failure',
          response_time_ms: responseTime.toFixed(0),
          error_details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async scrapeVirginAustralia(params: any): Promise<ScrapingResult> {
    const cacheKey = flightScrapingCache.generateKey({ ...params, airline: 'VA' });
    
    // Check cache first
    const cachedResult = flightScrapingCache.get(cacheKey);
    if (cachedResult) {
      console.log('Returning cached Virgin Australia results');
      
      this.dispatchDebugEvent({
        timestamp: new Date().toISOString(),
        airline: 'Virgin Australia',
        status: 'success',
        source: 'cache',
        responseTime: 45,
        debug: {
          data_source: 'cached_data',
          route: `${params.origin}-${params.destination}`
        }
      });

      return {
        ...cachedResult,
        source: 'cache'
      };
    }

    const startTime = performance.now();

    try {
      console.log('Calling Virgin Australia Playwright scraper...');
      
      const { data, error } = await supabase.functions.invoke('scrape-virgin-australia', {
        body: params
      });

      if (error) {
        throw new Error(error.message);
      }

      // Cache successful results (even enhanced mock data for consistency)
      if (data.success) {
        flightScrapingCache.set(cacheKey, data);
      }
      
      const responseTime = performance.now() - startTime;
      const isLiveScraping = data.source === 'live_scraping';
      const isEnhancedMock = data.source === 'enhanced_mock';
      
      console.log(`Virgin Australia scraping completed in ${responseTime.toFixed(0)}ms - Source: ${data.source}`);
      
      this.dispatchDebugEvent({
        timestamp: new Date().toISOString(),
        airline: 'Virgin Australia',
        status: data.success ? 'success' : 'error',
        source: data.source || 'enhanced_mock',
        responseTime: Math.round(responseTime),
        error: data.error || undefined,
        debug: {
          ...data.debug,
          response_time_ms: responseTime.toFixed(0),
          scraping_method: isLiveScraping ? 'playwright_browser_automation' : 'realistic_simulation',
          fallback_reason: isEnhancedMock ? data.debug?.fallback_reason : undefined
        }
      });
      
      return {
        ...data,
        debug: {
          ...data.debug,
          response_time_ms: responseTime.toFixed(0)
        }
      };
    } catch (error) {
      const responseTime = performance.now() - startTime;
      console.error('Virgin Australia scraping failed:', error);
      
      this.dispatchDebugEvent({
        timestamp: new Date().toISOString(),
        airline: 'Virgin Australia',
        status: 'error',
        source: 'error',
        responseTime: Math.round(responseTime),
        error: error instanceof Error ? error.message : 'Unknown error',
        debug: {
          error_type: 'scraping_failure',
          response_time_ms: responseTime.toFixed(0),
          error_details: error instanceof Error ? error.message : 'Unknown error'
        }
      });
      
      return {
        success: false,
        results: [],
        scraped_at: new Date().toISOString(),
        airline: 'Virgin Australia',
        error: error instanceof Error ? error.message : 'Unknown error',
        source: 'error',
        debug: {
          error_type: 'scraping_failure',
          response_time_ms: responseTime.toFixed(0),
          error_details: error instanceof Error ? error.message : 'Unknown error'
        }
      };
    }
  }

  async scrapeMultipleAirlines(params: any, airlineCodes: string[]): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    
    // American Airlines scraper
    if (airlineCodes.includes('AA')) {
      const aaResult = await this.scrapeAmericanAirlines(params);
      results.push(aaResult);
    }

    // Virgin Australia scraper (now with enhanced mock data)
    if (airlineCodes.includes('VA')) {
      const vaResult = await this.scrapeVirginAustralia(params);
      results.push(vaResult);
    }

    // TODO: Add other airline scrapers
    // if (airlineCodes.includes('QF')) {
    //   const qfResult = await this.scrapeQantas(params);
    //   results.push(qfResult);
    // }

    return results;
  }

  // Helper method to get airline codes from selected wallets
  getAirlineCodesFromWallets(selectedWallets: any[]): string[] {
    const codes = selectedWallets.map(wallet => wallet.frequent_flyer_programs.code);
    return [...new Set(codes)]; // Remove duplicates
  }

  // Get cache statistics
  getCacheStats() {
    return flightScrapingCache.getStats();
  }

  // Clear cache manually
  clearCache() {
    flightScrapingCache.clear();
  }
}

export const flightScraper = FlightScrapingService.getInstance();
