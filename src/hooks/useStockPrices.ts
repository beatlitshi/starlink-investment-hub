'use client';

import { useState, useEffect, useCallback } from 'react';
import { stockPriceService } from '@/services/stockPriceService';

interface StockPrice {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  lastUpdated: string;
}

interface UseStockPricesOptions {
  symbols: string[];
  autoRefresh?: boolean;
  refreshInterval?: number; // in milliseconds
}

interface UseStockPricesReturn {
  stocks: StockPrice[];
  isLoading: boolean;
  error: string | null;
  lastSync: Date | null;
  refreshStocks: () => Promise<void>;
  updateStockPrice: (id: string, newPrice: number) => void;
}

export function useStockPrices(options: UseStockPricesOptions): UseStockPricesReturn {
  const { symbols, autoRefresh = true, refreshInterval = 60000 } = options; // Default: 1 minute
  
  const [stocks, setStocks] = useState<StockPrice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<Date | null>(null);

  const refreshStocks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const quotes = await stockPriceService.fetchMultipleQuotes(symbols);
      
      const updatedStocks: StockPrice[] = quotes.map((quote, index) => ({
        id: String(index + 1),
        symbol: quote.symbol,
        name: getStockName(quote.symbol),
        price: quote.price,
        change: quote.changePercent,
        lastUpdated: quote.lastUpdated,
      }));

      setStocks(updatedStocks);
      setLastSync(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch stock prices');
      console.error('Error fetching stock prices:', err);
    } finally {
      setIsLoading(false);
    }
  }, [symbols]);

  const updateStockPrice = useCallback((id: string, newPrice: number) => {
    setStocks(prevStocks => 
      prevStocks.map(stock => 
        stock.id === id 
          ? { ...stock, price: newPrice, lastUpdated: new Date().toISOString() }
          : stock
      )
    );
  }, []);

  // Initial fetch
  useEffect(() => {
    refreshStocks();
  }, [refreshStocks]);

  // Auto-refresh interval
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      refreshStocks();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, refreshStocks]);

  return {
    stocks,
    isLoading,
    error,
    lastSync,
    refreshStocks,
    updateStockPrice,
  };
}

// Helper function to map symbols to display names
function getStockName(symbol: string): string {
  const nameMap: Record<string, string> = {
    'STLK': 'StarLink Investment',
    'TECH': 'Tech Ventures',
    'SPACE': 'Space Industries',
    'IBM': 'IBM Corporation',
    'AAPL': 'Apple Inc.',
  };
  return nameMap[symbol] || symbol;
}