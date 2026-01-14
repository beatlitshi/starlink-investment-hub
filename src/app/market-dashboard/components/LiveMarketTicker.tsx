'use client';

import { useState, useEffect } from 'react';
import { stockPriceService } from '@/services/stockPriceService';

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: number;
}

interface LiveMarketTickerProps {
  items?: TickerItem[];
  autoUpdate?: boolean;
  updateInterval?: number;
}

export default function LiveMarketTicker({ 
  items, 
  autoUpdate = true, 
  updateInterval = 60000 
}: LiveMarketTickerProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liveItems, setLiveItems] = useState<TickerItem[]>(items || []);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Auto-fetch stock prices if no items provided or autoUpdate enabled
  useEffect(() => {
    if (!isHydrated || !autoUpdate) return;

    const fetchPrices = async () => {
      setIsLoading(true);
      try {
        const symbols = items?.map(item => item.symbol) || ['STLK', 'TECH', 'SPACE', 'IBM', 'AAPL'];
        const quotes = await stockPriceService.fetchMultipleQuotes(symbols);
        
        const updatedItems: TickerItem[] = quotes.map(quote => ({
          symbol: quote.symbol,
          name: getStockName(quote.symbol),
          price: `$${quote.price.toFixed(2)}`,
          change: quote.changePercent,
        }));

        setLiveItems(updatedItems);
      } catch (error) {
        console.error('Failed to fetch live prices:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial fetch
    fetchPrices();

    // Set up interval for auto-updates
    const interval = setInterval(fetchPrices, updateInterval);

    return () => clearInterval(interval);
  }, [isHydrated, autoUpdate, updateInterval, items]);

  // Rotate through items
  useEffect(() => {
    if (!isHydrated || liveItems.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % liveItems.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isHydrated, liveItems.length]);

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Lade Live-Daten...</span>
        </div>
      </div>
    );
  }

  if (liveItems.length === 0) {
    return (
      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Keine Daten verfügbar</span>
        </div>
      </div>
    );
  }

  const currentItem = liveItems[currentIndex];

  return (
    <div className="bg-card border border-primary/30 rounded-lg p-4 glow-primary animate-pulse-glow">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-xs text-muted-foreground font-mono">LIVE</span>
          <span className="text-sm font-cta font-bold text-foreground">{currentItem.symbol}</span>
          <span className="text-xs text-muted-foreground font-body">{currentItem.name}</span>
          {isLoading && <span className="text-xs text-muted-foreground">⟳</span>}
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-lg font-headline font-bold text-foreground">{currentItem.price}</span>
          <span className={`text-sm font-cta font-semibold ${currentItem.change >= 0 ? 'text-success' : 'text-destructive'}`}>
            {currentItem.change >= 0 ? '↑' : '↓'} {Math.abs(currentItem.change).toFixed(2)}%
          </span>
        </div>
      </div>
    </div>
  );
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