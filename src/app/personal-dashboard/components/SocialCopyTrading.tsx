'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface TopTrader {
  id: string;
  name: string;
  avatar: string;
  alt: string;
  totalReturn: number;
  followers: number;
  successRate: number;
  trades: number;
  specialization: string;
  isFollowing: boolean;
}

interface CopiedTrade {
  id: string;
  traderName: string;
  asset: string;
  action: 'buy' | 'sell';
  amount: number;
  timestamp: string;
  status: 'pending' | 'executed' | 'failed';
}

export default function SocialCopyTrading() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [topTraders, setTopTraders] = useState<TopTrader[]>([]);
  const [copiedTrades, setCopiedTrades] = useState<CopiedTrade[]>([]);
  const [selectedView, setSelectedView] = useState<'traders' | 'trades'>('traders');

  useEffect(() => {
    setIsHydrated(true);

    setTopTraders([
    {
      id: '1',
      name: 'Sarah Chen',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17ccbe713-1763299395214.png",
      alt: 'Professional woman with dark hair smiling at camera',
      totalReturn: 127.5,
      followers: 2847,
      successRate: 89,
      trades: 342,
      specialization: 'Tech & Space',
      isFollowing: true
    },
    {
      id: '2',
      name: 'Marcus Rodriguez',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1f41a19e4-1763295010619.png",
      alt: 'Professional man with beard in business attire',
      totalReturn: 98.3,
      followers: 1923,
      successRate: 85,
      trades: 278,
      specialization: 'Satellite Tech',
      isFollowing: false
    },
    {
      id: '3',
      name: 'Emma Watson',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_179d5745f-1763294338633.png",
      alt: 'Young professional woman with blonde hair',
      totalReturn: 156.8,
      followers: 3421,
      successRate: 92,
      trades: 456,
      specialization: 'Diversified Portfolio',
      isFollowing: true
    },
    {
      id: '4',
      name: 'David Kim',
      avatar: "https://img.rocket.new/generatedImages/rocket_gen_img_143131080-1763294458375.png",
      alt: 'Asian man with glasses in professional setting',
      totalReturn: 82.1,
      followers: 1456,
      successRate: 81,
      trades: 198,
      specialization: 'Crypto & Blockchain',
      isFollowing: false
    }]
    );

    setCopiedTrades([
    {
      id: '1',
      traderName: 'Sarah Chen',
      asset: 'Starlink Global (STLK)',
      action: 'buy',
      amount: 5000,
      timestamp: '12.01.2026, 14:30',
      status: 'executed'
    },
    {
      id: '2',
      traderName: 'Emma Watson',
      asset: 'SpaceX Ventures (SPCX)',
      action: 'buy',
      amount: 3500,
      timestamp: '12.01.2026, 11:20',
      status: 'executed'
    },
    {
      id: '3',
      traderName: 'Sarah Chen',
      asset: 'Quantum Computing ETF',
      action: 'buy',
      amount: 2000,
      timestamp: '11.01.2026, 16:45',
      status: 'pending'
    }]
    );
  }, []);

  const handleFollowToggle = (traderId: string) => {
    setTopTraders(topTraders.map((trader) =>
    trader.id === traderId ? { ...trader, isFollowing: !trader.isFollowing } : trader
    ));
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Lade Social Trading...</div>
        </div>
      </div>);

  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border glow-primary">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-secondary/20 rounded-lg">
            <Icon name="UserGroupIcon" size={24} className="text-secondary" />
          </div>
          <div>
            <h2 className="text-xl font-headline font-bold text-foreground">Social Copy-Trading</h2>
            <p className="text-xs text-muted-foreground">Folgen Sie erfolgreichen Tradern</p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('traders')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-smooth ${
            selectedView === 'traders' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`
            }>

            Top Trader
          </button>
          <button
            onClick={() => setSelectedView('trades')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-smooth ${
            selectedView === 'trades' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`
            }>

            Meine Trades
          </button>
        </div>
      </div>

      {selectedView === 'traders' ?
      <div className="space-y-4">
          {topTraders.map((trader) =>
        <div key={trader.id} className="p-4 bg-muted/10 rounded-lg border border-border hover:border-primary transition-smooth">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary">
                    <AppImage src={trader.avatar} alt={trader.alt} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-lg font-headline font-bold text-foreground">{trader.name}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{trader.specialization}</p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Icon name="UserGroupIcon" size={14} className="text-primary" />
                        <span className="text-xs text-muted-foreground">{trader.followers.toLocaleString()} Follower</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Icon name="ChartBarIcon" size={14} className="text-success" />
                        <span className="text-xs text-muted-foreground">{trader.trades} Trades</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="mb-3">
                    <p className="text-2xl font-headline font-bold text-success">+{trader.totalReturn}%</p>
                    <p className="text-xs text-muted-foreground">Gesamtrendite</p>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-end space-x-1">
                      <Icon name="CheckCircleIcon" size={16} className="text-success" />
                      <span className="text-sm font-bold text-success">{trader.successRate}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground">Erfolgsrate</p>
                  </div>
                  <button
                onClick={() => handleFollowToggle(trader.id)}
                className={`px-4 py-2 rounded-md text-sm font-bold transition-smooth ${
                trader.isFollowing ?
                'bg-muted text-foreground hover:bg-muted/80' :
                'bg-primary text-primary-foreground hover:bg-accent'}`
                }>

                    {trader.isFollowing ? 'Entfolgen' : 'Folgen'}
                  </button>
                </div>
              </div>
            </div>
        )}
        </div> :

      <div className="space-y-4">
          {copiedTrades.length === 0 ?
        <div className="text-center py-12">
              <Icon name="DocumentDuplicateIcon" size={48} className="mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">Noch keine kopierten Trades</p>
            </div> :

        copiedTrades.map((trade) =>
        <div key={trade.id} className="flex items-center justify-between p-4 bg-muted/10 rounded-lg border border-border">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full ${
            trade.action === 'buy' ? 'bg-success/20' : 'bg-destructive/20'}`
            }>
                    <Icon
                name={trade.action === 'buy' ? 'ArrowUpCircleIcon' : 'ArrowDownCircleIcon'}
                size={24}
                className={trade.action === 'buy' ? 'text-success' : 'text-destructive'} />

                  </div>
                  <div>
                    <h3 className="text-lg font-headline font-bold text-foreground">{trade.asset}</h3>
                    <p className="text-sm text-muted-foreground">Kopiert von {trade.traderName}</p>
                    <p className="text-xs text-muted-foreground opacity-60">{trade.timestamp}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-xl font-headline font-bold ${
            trade.action === 'buy' ? 'text-success' : 'text-destructive'}`
            }>
                    {trade.action === 'buy' ? '+' : '-'}{trade.amount.toLocaleString('de-DE')} €
                  </p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold mt-2 ${
            trade.status === 'executed' ? 'bg-success/20 text-success' :
            trade.status === 'pending' ? 'bg-yellow-500/20 text-yellow-500' : 'bg-destructive/20 text-destructive'}`
            }>
                    {trade.status === 'executed' ? 'Ausgeführt' : trade.status === 'pending' ? 'Ausstehend' : 'Fehlgeschlagen'}
                  </span>
                </div>
              </div>
        )
        }
        </div>
      }

      <div className="mt-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} className="text-secondary mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">Social Copy-Trading</p>
            <p className="text-xs text-muted-foreground">
              Folgen Sie erfolgreichen Tradern und kopieren Sie automatisch deren Trades. Sie können jederzeit die Kontrolle übernehmen und Anpassungen vornehmen.
            </p>
          </div>
        </div>
      </div>
    </div>);

}