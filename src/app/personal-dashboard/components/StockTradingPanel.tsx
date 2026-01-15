'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useStockPrices } from '@/hooks/useStockPrices';

export default function StockTradingPanel() {
  const { user, updateBalance, updateInvestments, refreshBalance } = useUserAuth();
  const { stocks, isLoading, refreshStocks } = useStockPrices({
    symbols: ['STLK', 'TECH', 'SPACE', 'IBM', 'AAPL'],
    autoRefresh: true,
    refreshInterval: 60000, // Update every 60 seconds (1 minute)
  });

  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const [buyAmount, setBuyAmount] = useState('');
  const [buyShares, setBuyShares] = useState('');
  const [sellStock, setSellStock] = useState<string | null>(null);
  const [sellShares, setSellShares] = useState('');
  const [selectedTab, setSelectedTab] = useState<'buy' | 'sell' | 'portfolio'>('buy');
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [totalGain, setTotalGain] = useState({ amount: 0, percentage: 0 });

  useEffect(() => {
    refreshBalance();
  }, []);

  // Recalculate portfolio when stocks or user investments change
  useEffect(() => {
    const newPortfolioValue = calculatePortfolioValue();
    const newTotalGain = calculateTotalGain();
    setPortfolioValue(newPortfolioValue);
    setTotalGain(newTotalGain);
  }, [stocks, user?.investments]);

  const handleBuyStock = async () => {
    if (!selectedStock || (!buyAmount && !buyShares) || !user) return;

    const stock = stocks.find(s => s.symbol === selectedStock);
    if (!stock) return;

    const shares = buyShares ? parseFloat(buyShares) : parseFloat(buyAmount) / stock.price;
    const cost = shares * stock.price;

    if (cost > user.balance) {
      alert('Insufficient balance');
      return;
    }

    try {
      // Get auth token from Supabase
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }

      // Call the API endpoint to process the purchase with auth header
      const response = await fetch('/api/user/buy-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          stockSymbol: stock.symbol,
          shares: shares,
          cost: cost,
          stockData: {
            name: stock.name,
            price: stock.price,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error}`);
        return;
      }

      // Update local state with new balance and investments
      await refreshBalance();

      alert(`Successfully purchased ${shares.toFixed(4)} shares of ${stock.name}`);
      setBuyAmount('');
      setBuyShares('');
      setSelectedStock(null);
      setSelectedTab('portfolio');
    } catch (error) {
      console.error('Error buying stock:', error);
      alert('Failed to process purchase');
    }
  };

  const handleSellStock = async () => {
    if (!sellStock || !sellShares || !user) return;

    const sharesToSell = parseFloat(sellShares);
    if (isNaN(sharesToSell) || sharesToSell <= 0) {
      alert('Please enter a valid number of shares');
      return;
    }

    // Find user's investment
    const investment = user.investments?.find((inv: any) => inv.symbol === sellStock);
    if (!investment || investment.shares < sharesToSell) {
      alert('Insufficient shares to sell');
      return;
    }

    // Find current stock price
    const stock = stocks.find(s => s.symbol === sellStock);
    if (!stock) {
      alert('Stock not found');
      return;
    }

    const saleValue = sharesToSell * stock.price;

    try {
      // Get auth token
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert('Authentication required. Please log in again.');
        return;
      }

      // Call sell API endpoint
      const response = await fetch('/api/user/sell-stock', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          stockSymbol: sellStock,
          shares: sharesToSell,
          saleValue: saleValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error}`);
        return;
      }

      // Refresh balance and investments
      await refreshBalance();

      alert(`Successfully sold ${sharesToSell.toFixed(4)} shares of ${stock.name} for €${saleValue.toFixed(2)}`);
      setSellShares('');
      setSellStock(null);
      setSelectedTab('portfolio');
    } catch (error) {
      console.error('Error selling stock:', error);
      alert('Failed to process sale');
    }
  };
  const calculatePortfolioValue = () => {
    if (!user?.investments) return 0;
    return user.investments.reduce((sum: number, inv: any) => {
      const currentStock = stocks.find(s => s.symbol === inv.symbol);
      const currentPrice = currentStock ? currentStock.price : inv.currentValue;
      return sum + (currentPrice * inv.shares);
    }, 0);
  };

  const calculateTotalGain = () => {
    if (!user?.investments) return { amount: 0, percentage: 0 };
    let totalInvested = 0;
    let totalCurrent = 0;

    user.investments.forEach((inv: any) => {
      const currentStock = stocks.find(s => s.symbol === inv.symbol);
      const currentPrice = currentStock ? currentStock.price : inv.currentValue;
      totalInvested += inv.invested;
      totalCurrent += currentPrice * inv.shares;
    });

    const gainAmount = totalCurrent - totalInvested;
    const gainPercentage = totalInvested > 0 ? (gainAmount / totalInvested) * 100 : 0;

    return { amount: gainAmount, percentage: gainPercentage };
  };

  const selectedStockData = stocks.find(s => s.symbol === selectedStock);

  return (
    <div className="space-y-6">
      {/* Header with Balance */}
      <div className="bg-card rounded-lg p-6 shadow-depth">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Available Cash</p>
            <p className="text-3xl font-headline font-bold text-foreground">
              {user?.balance?.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Portfolio Value</p>
            <p className="text-3xl font-headline font-bold text-primary">
              {portfolioValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total Gain/Loss</p>
            <p className={`text-3xl font-headline font-bold ${totalGain.amount >= 0 ? 'text-success' : 'text-destructive'}`}>
              {totalGain.amount >= 0 ? '+' : ''}{totalGain.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
              <span className="text-lg ml-2">({totalGain.percentage >= 0 ? '+' : ''}{totalGain.percentage.toFixed(2)}%)</span>
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 border-b border-border">
        <button
          onClick={() => setSelectedTab('buy')}
          className={`px-6 py-3 font-cta font-semibold transition-smooth ${
            selectedTab === 'buy'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Buy Stocks
        </button>
        <button
          onClick={() => setSelectedTab('sell')}
          className={`px-6 py-3 font-cta font-semibold transition-smooth ${
            selectedTab === 'sell'
              ? 'text-destructive border-b-2 border-destructive'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Sell Stocks
        </button>
        <button
          onClick={() => setSelectedTab('portfolio')}
          className={`px-6 py-3 font-cta font-semibold transition-smooth ${
            selectedTab === 'portfolio'
              ? 'text-primary border-b-2 border-primary'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          My Portfolio
        </button>
      </div>

      {/* Buy Stocks Tab */}
      {selectedTab === 'buy' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Stock List */}
          <div className="bg-card rounded-lg p-6 shadow-depth">
            <h3 className="text-xl font-headline font-bold text-foreground mb-4">Available Stocks</h3>
            <div className="space-y-3">
              {stocks.map((stock) => (
                <button
                  key={stock.id}
                  onClick={() => setSelectedStock(stock.symbol)}
                  className={`w-full p-4 rounded-lg border-2 transition-smooth text-left ${
                    selectedStock === stock.symbol
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-cta font-bold text-foreground">{stock.symbol}</h4>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">${stock.price.toFixed(2)}</p>
                      <p className={`text-sm font-semibold ${stock.change >= 0 ? 'text-success' : 'text-destructive'}`}>
                        {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Buy Form */}
          <div className="bg-card rounded-lg p-6 shadow-depth">
            <h3 className="text-xl font-headline font-bold text-foreground mb-4">Place Order</h3>
            {selectedStockData ? (
              <div className="space-y-6">
                <div className="p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-cta font-bold text-foreground mb-1">{selectedStockData.name}</h4>
                  <p className="text-2xl font-bold text-primary">${selectedStockData.price.toFixed(2)}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Amount in EUR
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={buyAmount}
                    onChange={(e) => {
                      setBuyAmount(e.target.value);
                      if (e.target.value && selectedStockData) {
                        setBuyShares((parseFloat(e.target.value) / selectedStockData.price).toFixed(4));
                      }
                    }}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.00"
                  />
                </div>

                <div className="text-center text-muted-foreground">or</div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Number of Shares
                  </label>
                  <input
                    type="number"
                    step="0.0001"
                    value={buyShares}
                    onChange={(e) => {
                      setBuyShares(e.target.value);
                      if (e.target.value && selectedStockData) {
                        setBuyAmount((parseFloat(e.target.value) * selectedStockData.price).toFixed(2));
                      }
                    }}
                    className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="0.0000"
                  />
                </div>

                {buyAmount && (
                  <div className="p-4 bg-primary/10 rounded-lg">
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Shares:</span>
                      <span className="font-bold text-foreground">{buyShares}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                      <span className="text-muted-foreground">Total Cost:</span>
                      <span className="font-bold text-foreground">{buyAmount} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Remaining Balance:</span>
                      <span className="font-bold text-foreground">
                        {((user?.balance || 0) - parseFloat(buyAmount || '0')).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBuyStock}
                  disabled={!buyAmount || parseFloat(buyAmount) > (user?.balance || 0)}
                  className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Buy {selectedStockData.symbol}
                </button>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="ChartBarIcon" size={48} className="mx-auto mb-3 opacity-50" />
                <p>Select a stock to start trading</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sell Stocks Tab */}
      {selectedTab === 'sell' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* User's Investments */}
          <div className="space-y-4">
            <h3 className="text-xl font-headline font-bold text-foreground mb-4">Your Holdings</h3>
            
            {user?.investments && user.investments.length > 0 ? (
              user.investments.map((investment: any) => {
                const currentStock = stocks.find(s => s.symbol === investment.symbol);
                const currentPrice = currentStock ? currentStock.price : investment.currentValue;
                const currentValue = currentPrice * investment.shares;
                const profitLoss = currentValue - investment.invested;
                const profitLossPercent = (profitLoss / investment.invested) * 100;

                return (
                  <div
                    key={investment.symbol}
                    onClick={() => {
                      setSellStock(investment.symbol);
                      setSellShares(investment.shares.toString());
                    }}
                    className={`p-4 bg-card rounded-lg border-2 cursor-pointer transition-smooth ${
                      sellStock === investment.symbol
                        ? 'border-destructive shadow-glow-primary'
                        : 'border-border hover:border-destructive/50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                          <span className="text-lg font-bold text-primary">{investment.symbol}</span>
                        </div>
                        <div>
                          <h4 className="font-bold text-foreground">{investment.name || investment.symbol}</h4>
                          <p className="text-sm text-muted-foreground">{investment.shares.toFixed(4)} shares</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-foreground">€{currentValue.toFixed(2)}</p>
                        <p className={`text-sm ${profitLoss >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {profitLoss >= 0 ? '+' : ''}€{profitLoss.toFixed(2)} ({profitLossPercent.toFixed(2)}%)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Current Price: €{currentPrice.toFixed(2)}</span>
                      <span>Invested: €{investment.invested.toFixed(2)}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="InboxIcon" size={48} className="mx-auto mb-3 opacity-50" />
                <p>No stocks in your portfolio</p>
                <p className="text-sm mt-2">Buy some stocks first to start selling</p>
              </div>
            )}
          </div>

          {/* Sell Form */}
          <div className="bg-card p-6 rounded-lg">
            <h3 className="text-xl font-headline font-bold text-foreground mb-4">Sell Stock</h3>
            
            {sellStock ? (
              <div className="space-y-4">
                {(() => {
                  const investment = user?.investments?.find((inv: any) => inv.symbol === sellStock);
                  const currentStock = stocks.find(s => s.symbol === sellStock);
                  const currentPrice = currentStock ? currentStock.price : 0;
                  const sharesToSellNum = parseFloat(sellShares) || 0;
                  const saleValue = sharesToSellNum * currentPrice;

                  return (
                    <>
                      <div className="p-4 bg-primary/10 rounded-lg">
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Stock:</span>
                          <span className="font-bold text-foreground">{sellStock}</span>
                        </div>
                        <div className="flex justify-between mb-2">
                          <span className="text-muted-foreground">Available Shares:</span>
                          <span className="font-bold text-foreground">{investment?.shares.toFixed(4) || '0'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Current Price:</span>
                          <span className="font-bold text-foreground">€{currentPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-foreground mb-2">
                          Number of Shares to Sell
                        </label>
                        <input
                          type="number"
                          step="0.0001"
                          max={investment?.shares || 0}
                          value={sellShares}
                          onChange={(e) => setSellShares(e.target.value)}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
                          placeholder="0.0000"
                        />
                        <button
                          onClick={() => setSellShares((investment?.shares || 0).toString())}
                          className="mt-2 text-sm text-primary hover:underline"
                        >
                          Sell All
                        </button>
                      </div>

                      {sellShares && sharesToSellNum > 0 && (
                        <div className="p-4 bg-destructive/10 rounded-lg">
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Shares to Sell:</span>
                            <span className="font-bold text-foreground">{sharesToSellNum.toFixed(4)}</span>
                          </div>
                          <div className="flex justify-between mb-2">
                            <span className="text-muted-foreground">Sale Value:</span>
                            <span className="font-bold text-foreground">€{saleValue.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">New Balance:</span>
                            <span className="font-bold text-success">
                              €{((user?.balance || 0) + saleValue).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}

                      <button
                        onClick={handleSellStock}
                        disabled={!sellShares || sharesToSellNum <= 0 || sharesToSellNum > (investment?.shares || 0)}
                        className="w-full py-3 bg-destructive text-primary-foreground rounded-lg font-cta font-bold hover:bg-destructive/80 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sell {sellStock}
                      </button>
                    </>
                  );
                })()}
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Icon name="ArrowTrendingDownIcon" size={48} className="mx-auto mb-3 opacity-50" />
                <p>Select a stock from your holdings to sell</p>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Portfolio Tab */}
      {selectedTab === 'portfolio' && (
        <div className="bg-card rounded-lg p-6 shadow-depth">
          <h3 className="text-xl font-headline font-bold text-foreground mb-4">My Stock Holdings</h3>
          {user?.investments && user.investments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-cta font-bold text-muted-foreground">Stock</th>
                    <th className="text-right py-3 px-4 text-sm font-cta font-bold text-muted-foreground">Shares</th>
                    <th className="text-right py-3 px-4 text-sm font-cta font-bold text-muted-foreground">Invested</th>
                    <th className="text-right py-3 px-4 text-sm font-cta font-bold text-muted-foreground">Current Price</th>
                    <th className="text-right py-3 px-4 text-sm font-cta font-bold text-muted-foreground">Current Value</th>
                    <th className="text-right py-3 px-4 text-sm font-cta font-bold text-muted-foreground">Gain/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {user.investments.map((inv: any) => {
                    const currentStock = stocks.find(s => s.symbol === inv.symbol);
                    const currentPrice = currentStock ? currentStock.price : inv.currentValue;
                    const currentValue = currentPrice * inv.shares;
                    const gain = currentValue - inv.invested;
                    const gainPercentage = (gain / inv.invested) * 100;

                    return (
                      <tr key={inv.id} className="border-b border-border hover:bg-muted/10">
                        <td className="py-3 px-4">
                          <div>
                            <p className="font-bold text-foreground">{inv.symbol}</p>
                            <p className="text-sm text-muted-foreground">{inv.name}</p>
                          </div>
                        </td>
                        <td className="text-right py-3 px-4 font-semibold text-foreground">
                          {inv.shares.toFixed(4)}
                        </td>
                        <td className="text-right py-3 px-4 text-foreground">
                          {inv.invested.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                        </td>
                        <td className="text-right py-3 px-4 font-bold text-primary">
                          ${currentPrice.toFixed(2)}
                        </td>
                        <td className="text-right py-3 px-4 font-bold text-foreground">
                          {currentValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                        </td>
                        <td className={`text-right py-3 px-4 font-bold ${gain >= 0 ? 'text-success' : 'text-destructive'}`}>
                          {gain >= 0 ? '+' : ''}{gain.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                          <div className="text-sm">({gain >= 0 ? '+' : ''}{gainPercentage.toFixed(2)}%)</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <Icon name="ChartPieIcon" size={48} className="mx-auto mb-3 opacity-50" />
              <p>No stocks in portfolio yet</p>
              <button
                onClick={() => setSelectedTab('buy')}
                className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-cta font-bold hover:bg-accent transition-smooth"
              >
                Start Investing
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
