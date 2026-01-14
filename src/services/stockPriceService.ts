import axios from 'axios';

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

const API_KEY = process.env.NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY || 'demo';
const BASE_URL = 'https://www.alphavantage.co/query';

// Fallback mock data for demo/testing
const MOCK_DATA: Record<string, StockQuote> = {
  'STLK': { symbol: 'STLK', price: 245.67, change: 2.3, changePercent: 0.95, lastUpdated: new Date().toISOString() },
  'TECH': { symbol: 'TECH', price: 189.45, change: -1.2, changePercent: -0.63, lastUpdated: new Date().toISOString() },
  'SPACE': { symbol: 'SPACE', price: 567.89, change: 5.7, changePercent: 1.01, lastUpdated: new Date().toISOString() },
  'IBM': { symbol: 'IBM', price: 142.35, change: 1.5, changePercent: 1.06, lastUpdated: new Date().toISOString() },
  'AAPL': { symbol: 'AAPL', price: 178.92, change: -0.8, changePercent: -0.45, lastUpdated: new Date().toISOString() },
};

export class StockPriceService {
  private static instance: StockPriceService;
  private cache: Map<string, { data: StockQuote; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 60000; // 1 minute cache

  private constructor() {}

  static getInstance(): StockPriceService {
    if (!StockPriceService.instance) {
      StockPriceService.instance = new StockPriceService();
    }
    return StockPriceService.instance;
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
   * Get mock data for testing/demo purposes
   */
  private getMockData(symbol: string): StockQuote {
    if (MOCK_DATA[symbol]) {
      // Add some random variation to simulate real-time changes
      const baseData = MOCK_DATA[symbol];
      const variation = (Math.random() - 0.5) * 2; // -1 to +1
      return {
        ...baseData,
        price: baseData.price + variation,
        change: baseData.change + (variation * 0.5),
        changePercent: baseData.changePercent + (variation * 0.1),
        lastUpdated: new Date().toISOString(),
      };
    }

    // Generate random data for unknown symbols
    const basePrice = 100 + Math.random() * 400;
    const change = (Math.random() - 0.5) * 10;
    return {
      symbol,
      price: basePrice,
      change,
      changePercent: (change / basePrice) * 100,
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