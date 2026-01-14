'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface MarketData {
  year: string;
  value: number;
  growth: number;
}

const MarketOpportunity = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'revenue' | 'users' | 'coverage'>('revenue');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const marketData: Record<string, MarketData[]> = {
    revenue: [
      { year: '2024', value: 12, growth: 0 },
      { year: '2025', value: 18, growth: 50 },
      { year: '2026', value: 26, growth: 44 },
      { year: '2027', value: 35, growth: 35 },
      { year: '2028', value: 42, growth: 20 },
    ],
    users: [
      { year: '2024', value: 2.5, growth: 0 },
      { year: '2025', value: 4.2, growth: 68 },
      { year: '2026', value: 6.8, growth: 62 },
      { year: '2027', value: 10.5, growth: 54 },
      { year: '2028', value: 15.2, growth: 45 },
    ],
    coverage: [
      { year: '2024', value: 145, growth: 0 },
      { year: '2025', value: 165, growth: 14 },
      { year: '2026', value: 180, growth: 9 },
      { year: '2027', value: 190, growth: 6 },
      { year: '2028', value: 195, growth: 3 },
    ],
  };

  const metrics = [
    { id: 'revenue' as const, label: 'Umsatz (Mrd. €)', icon: 'CurrencyEuroIcon', color: 'text-primary' },
    { id: 'users' as const, label: 'Nutzer (Mio.)', icon: 'UsersIcon', color: 'text-secondary' },
    { id: 'coverage' as const, label: 'Länderabdeckung', icon: 'GlobeAltIcon', color: 'text-success' },
  ];

  const currentData = marketData[selectedMetric];
  const maxValue = Math.max(...currentData.map((d) => d.value));

  if (!isHydrated) {
    return (
      <section className="py-20 bg-gradient-to-b from-card to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-headline font-bold text-foreground mb-4">
              Marktpotenzial
            </h2>
            <p className="text-xl text-muted-foreground font-body">
              Laden...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-bold text-foreground mb-4">
            Exponentielles Marktpotenzial
          </h2>
          <p className="text-xl text-muted-foreground font-body">
            Analysieren Sie das Wachstum der Satelliten-Internet-Industrie
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 shadow-depth">
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {metrics.map((metric) => (
              <button
                key={metric.id}
                onClick={() => setSelectedMetric(metric.id)}
                className={`flex items-center space-x-2 px-6 py-3 rounded-md font-cta font-bold transition-smooth ${
                  selectedMetric === metric.id
                    ? 'bg-primary text-primary-foreground shadow-glow-primary'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                <Icon name={metric.icon as any} size={20} />
                <span>{metric.label}</span>
              </button>
            ))}
          </div>

          <div className="relative h-80 mb-8">
            <div className="absolute inset-0 flex items-end justify-around px-4">
              {currentData.map((data, index) => {
                const height = (data.value / maxValue) * 100;
                return (
                  <div key={data.year} className="flex flex-col items-center flex-1 max-w-[120px]">
                    <div className="relative w-full group">
                      <div
                        className="w-full bg-gradient-to-t from-primary to-accent rounded-t-lg transition-all duration-500 hover:shadow-glow-primary cursor-pointer"
                        style={{ height: `${height * 2.5}px` }}
                      >
                        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-primary rounded-lg px-3 py-2 whitespace-nowrap">
                          <p className="text-sm font-mono font-bold text-primary">
                            {selectedMetric === 'revenue' && `€${data.value} Mrd.`}
                            {selectedMetric === 'users' && `${data.value} Mio.`}
                            {selectedMetric === 'coverage' && `${data.value} Länder`}
                          </p>
                          {data.growth > 0 && (
                            <p className="text-xs text-success">+{data.growth}%</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <p className="mt-4 text-sm font-mono font-bold text-foreground">{data.year}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <Icon name="TrendingUpIcon" size={32} className="text-success mb-4" />
              <h3 className="text-2xl font-headline font-bold text-foreground mb-2">
                250% CAGR
              </h3>
              <p className="text-muted-foreground font-body">
                Durchschnittliches jährliches Wachstum bis 2028
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <Icon name="BanknotesIcon" size={32} className="text-primary mb-4" />
              <h3 className="text-2xl font-headline font-bold text-foreground mb-2">
                €42 Mrd.
              </h3>
              <p className="text-muted-foreground font-body">
                Prognostizierter Marktwert im Jahr 2028
              </p>
            </div>
            <div className="bg-muted/50 rounded-lg p-6 border border-border">
              <Icon name="UserGroupIcon" size={32} className="text-secondary mb-4" />
              <h3 className="text-2xl font-headline font-bold text-foreground mb-2">
                15+ Mio.
              </h3>
              <p className="text-muted-foreground font-body">
                Erwartete Nutzerbasis bis 2028
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketOpportunity;