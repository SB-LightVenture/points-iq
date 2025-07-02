
interface CacheEntry {
  data: any;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

class FlightScrapingCache {
  private cache = new Map<string, CacheEntry>();
  private readonly DEFAULT_TTL = 15 * 60 * 1000; // 15 minutes

  generateKey(params: any): string {
    const keyData = {
      origin: params.origin,
      destination: params.destination,
      departureDate: params.departureDate,
      returnDate: params.returnDate,
      cabinClass: params.cabinClass,
      passengers: params.passengers,
      airline: params.airline || 'unknown'
    };
    return btoa(JSON.stringify(keyData));
  }

  set(key: string, data: any, ttl: number = this.DEFAULT_TTL): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  clear(): void {
    this.cache.clear();
  }

  cleanExpired(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }

  getStats(): { size: number; keys: string[] } {
    this.cleanExpired();
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

export const flightScrapingCache = new FlightScrapingCache();

// Clean expired entries every 5 minutes
setInterval(() => {
  flightScrapingCache.cleanExpired();
}, 5 * 60 * 1000);
