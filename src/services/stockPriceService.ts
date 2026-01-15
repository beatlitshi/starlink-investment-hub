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
  private readonly CACHE_DURATION = 60000; // 1 minute cache (changed from random to gradual)
  private stockControls: Map<string, StockControl> = new Map();
  private lastFetchTime: number = Date.now();

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
   * Load stock controls from database
   */
  private async loadStockControls() {
    try {
      const { data, error } = await supabase
        .from('stock_controls')
        .select('*')
        .eq('is_active', true);

      if (!error && data) {
        data.forEach((control: StockControl) => {
          this.stockControls.set(control.symbol, control);
        });
      }
    } catch (error) {
      console.warn('Could not load stock controls:', error);
    }
  }

  /**
   * Calculate gradual price change based on admin control
   */
  private calculateGradualChange(symbol: string, basePrice: number): number {
    const control = this.stockControls.get(symbol);
    if (!control) {
      // No control - use small random variation (±0.5%)
      return basePrice * (1 + (Math.random() - 0.5) * 0.01);
    }

    const now = Date.now();
    const startTime = new Date(control.start_time).getTime();
    const elapsedMinutes = (now - startTime) / (1000 * 60);
    
    if (elapsedMinutes >= control.duration_minutes) {
      // Target reached, deactivate control
      this.stockControls.delete(symbol);
      return basePrice * (1 + control.target_change_percent / 100);
    }

    // Gradual change: linearly interpolate to target
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

        // Cache the result
        this.cache.set(symbol, { data: quote, timestamp: Date.now() });
        return quote;
      }

      // Fallback to mock data if API returns empty
      return this.getMockData(symbol);
    } catch (error) {
      console.warn(`Failed to fetch real data for ${symbol}, using mock data:`, error);
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
    const basePrice = BASE_PRICES[symbol] || 100 + Math.random() * 400;
    
    // Calculate price with gradual change based on admin control
    const currentPrice = this.calculateGradualChange(symbol, basePrice);
    const change = currentPrice - basePrice;
    const changePercent = (change / basePrice) * 100;

    return {
      symbol,
      price: currentPrice,
      change,
      changePercent,
      lastUpdated: new Date().toISOString(),
    };
  }

  /**
   * Clear cache (useful for forcing refresh)
   */
  clearCache(): void {
    this.cache.clear();
  }
}

export const stockPriceService = StockPriceService.getInstance();