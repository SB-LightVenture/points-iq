
import { supabase } from '@/integrations/supabase/client';

export interface ScrapingResult {
  success: boolean;
  results: any[];
  scraped_at: string;
  airline: string;
  error?: string;
}

export class FlightScrapingService {
  private static instance: FlightScrapingService;
  
  static getInstance(): FlightScrapingService {
    if (!FlightScrapingService.instance) {
      FlightScrapingService.instance = new FlightScrapingService();
    }
    return FlightScrapingService.instance;
  }

  async scrapeAmericanAirlines(params: any): Promise<ScrapingResult> {
    try {
      console.log('Calling American Airlines scraper...');
      
      const { data, error } = await supabase.functions.invoke('scrape-american-airlines', {
        body: params
      });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    } catch (error) {
      console.error('AA scraping failed:', error);
      return {
        success: false,
        results: [],
        scraped_at: new Date().toISOString(),
        airline: 'American Airlines',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async scrapeMultipleAirlines(params: any, airlineCodes: string[]): Promise<ScrapingResult[]> {
    const results: ScrapingResult[] = [];
    
    // For now, we only have AA scraper implemented
    if (airlineCodes.includes('AA')) {
      const aaResult = await this.scrapeAmericanAirlines(params);
      results.push(aaResult);
    }

    // TODO: Add other airline scrapers
    // if (airlineCodes.includes('BA')) {
    //   const baResult = await this.scrapeBritishAirways(params);
    //   results.push(baResult);
    // }

    return results;
  }

  // Helper method to get airline codes from selected wallets
  getAirlineCodesFromWallets(selectedWallets: any[]): string[] {
    const codes = selectedWallets.map(wallet => wallet.frequent_flyer_programs.code);
    return [...new Set(codes)]; // Remove duplicates
  }
}

export const flightScraper = FlightScrapingService.getInstance();
