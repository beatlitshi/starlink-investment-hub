import axios from 'axios';
import { supabase } from '@/lib/supabase';

interface StockQuote {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  lastUpdated: string;
}

interface StockData {
  '01. symbol': string;
  '05. price': string;
  '09. change': string;
  '10. change percent': string;
}

interface StockControl {
  symbol: string;
  target_change_percent: number;
  duration_minutes: number;
  start_time: string;
  is_active: boolean;
}

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Base prices for stocks (used as starting point)
const BASE_PRICES: Record<string, number> = {
  'STLK': 245.67,
  'TECH': 189.45,
  'SPACE': 567.89,
  'IBM': 142.35,
  'AAPL': 178.92,
};

export class StockPriceService {
  private static instance: StockPriceService;
  private cache: Map<string, { data: StockQuote; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute cache
  private stockControls: Map<string, StockControl> = new Map();
  private lastControlsFetch: number = 0;
  private lastPriceCache: Map<string, number> = new Map();

  private constructor() {
    this.loadStockControls();
  }

  static getInstance(): StockPriceService {
    if (!StockPriceService.instance) {
      StockPriceService.instance = new StockPriceService();
    }
    return StockPriceService.instance;
  }

  /**
   * Load stock controls from database (with error safety and timeout)
   */
  private async loadStockControls() {
    try {
      console.log('[Stocks] Loading controls...');
      
      // Create timeout promise to prevent hanging
      const timeoutPromise = new Promise<null>((resolve) => {
        setTimeout(() => {
          console.warn('[Stocks] Controls load timeout');
          resolve(null);
        }, 3000);
      });

      // Create query promise
      const queryPromise = supabase
        .from('stock_controls')
        .select('*')
        .eq('is_active', true);

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]) as any;

      if (error) {
        console.warn('[Stocks] Controls table error:', error.message);
        return; // Silently fail
      }

      if (data && Array.isArray(data)) {
        console.log('[Stocks] Loaded', data.length, 'controls');
        data.forEach((control: StockControl) => {
          this.stockControls.set(control.symbol, control);
        });
      }
    } catch (error) {
      console.warn('[Stocks] Load error:', error instanceof Error ? error.message : String(error));
    }
  }

  /**
   * Calculate gradual price change based on admin control
   */
  private calculateGradualChange(symbol: string, basePrice: number): number {
    const control = this.stockControls.get(symbol);
    if (!control) {
      // No control - use very small stable variation
      const seed = symbol.charCodeAt(0) + symbol.charCodeAt(symbol.length - 1);
      const variation = ((seed % 21) - 10) * 0.001; // -0.1% to +0.1%
      return basePrice * (1 + variation);
    }

    const now = Date.now();
    const startTime = new Date(control.start_time).getTime();
    const elapsedMinutes = (now - startTime) / (1000 * 60);
    
    if (elapsedMinutes >= control.duration_minutes) {
      this.stockControls.delete(symbol);
      return basePrice * (1 + control.target_change_percent / 100);
    }

    const progress = elapsedMinutes / control.duration_minutes;
    const currentChangePercent = control.target_change_percent * progress;
    
    return basePrice * (1 + currentChangePercent / 100);
  }

  /**
   * Refresh stock controls from database
   */
  async refreshControls() {
    await this.loadStockControls();
  }

  /**
   * Fetch real-time stock quote from Alpha Vantage API
   */
  async fetchStockQuote(symbol: string): Promise<StockQuote> {
    try {
      // Refresh controls every 60 seconds (less frequent to avoid issues)
      if (Date.now() - this.lastControlsFetch > 60000) {
        console.log('[Stocks] Refreshing controls...');
        // Don't await - let it load in background
        this.loadStockControls().catch(err => console.warn('[Stocks] Refresh error:', err));
        this.lastControlsFetch = Date.now();
      }

      // Check cache first
      const cached = this.cache.get(symbol);
      if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
        return cached.data;
      }

      try {
        // Try real API first
        const response = await axios.get(BASE_URL, {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol: symbol,
            apikey: API_KEY,
          },
          timeout: 5000,
        });

        const globalQuote = response.data['Global Quote'];
        
        if (globalQuote && globalQuote['01. symbol']) {
          const quote: StockQuote = {
            symbol: globalQuote['01. symbol'],
            price: parseFloat(globalQuote['05. price']),
            change: parseFloat(globalQuote['09. change']),
            changePercent: parseFloat(globalQuote['10. change percent'].replace('%', '')),
            lastUpdated: new Date().toISOString(),
          };

          this.cache.set(symbol, { data: quote, timestamp: Date.now() });
          return quote;
        }

        return this.getMockData(symbol);
      } catch (error) {
        console.warn(`[Stocks] Failed to fetch real data for ${symbol}:`, error instanceof Error ? error.message : String(error));
        return this.getMockData(symbol);
      }
    } catch (error) {
      console.error('[Stocks] Error in fetchStockQuote:', error);
      return this.getMockData(symbol);
    }
  }

  /**
   * Fetch multiple stock quotes in batch
   */
  async fetchMultipleQuotes(symbols: string[]): Promise<StockQuote[]> {
    const promises = symbols.map(symbol => this.fetchStockQuote(symbol));
    return Promise.all(promises);
  }

  /**
   * Get mock data with gradual admin-controlled changes
   */
  private getMockData(symbol: string): StockQuote {
    try {
      const basePrice = BASE_PRICES[symbol] || 100 + Math.random() * 400;
      const currentPrice = this.calculateGradualChange(symbol, basePrice);
      
      const lastPrice = this.lastPriceCache.get(symbol);
      if (lastPrice !== undefined && Math.abs(currentPrice - lastPrice) < 0.01) {
        const change = lastPrice - basePrice;
        const changePercent = (change / basePrice) * 100;
        
        return {
          symbol,
          price: lastPrice,
          change: parseFloat(change.toFixed(2)),
          changePercent: parseFloat(changePercent.toFixed(4)),
          lastUpdated: new Date().toISOString(),
        };
      }

      this.lastPriceCache.set(symbol, currentPrice);
      const change = currentPrice - basePrice;
      const changePercent = (change / basePrice) * 100;

      return {
        symbol,
        price: parseFloat(currentPrice.toFixed(2)),
        change: parseFloat(change.toFixed(2)),
        changePercent: parseFloat(changePercent.toFixed(4)),
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.warn('[Stocks] Error in getMockData:', error);
      return {
        symbol,
        price: BASE_PRICES[symbol] || 100,
        change: 0,
        changePercent: 0,
        lastUpdated: new Date().toISOString(),
      };
    }
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const stockPriceService = StockPriceService.getInstance();
