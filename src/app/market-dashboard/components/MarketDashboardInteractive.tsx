'use client';

import { useState, useEffect } from 'react';
import MarketOverviewCard from './MarketOverviewCard';
import MarketChart from './MarketChart';
import LiveMarketTicker from './LiveMarketTicker';
import MarketAlertCard from './MarketAlertCard';
import CompetitorAnalysis from './CompetitorAnalysis';
import DataExportPanel from './DataExportPanel';
import CustomizableWidget from './CustomizableWidget';
import MarketInsights from './MarketInsights';

interface MarketOverview {
  title: string;
  value: string;
  change: number;
  icon: string;
  trend: 'up' | 'down';
}

interface ChartData {
  name: string;
  value: number;
  value2?: number;
}

interface TickerItem {
  symbol: string;
  name: string;
  price: string;
  change: number;
}

interface Alert {
  id: number;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

interface Competitor {
  name: string;
  marketShare: number;
  growth: number;
  color: string;
}

interface Widget {
  id: string;
  title: string;
  type: string;
  visible: boolean;
}

interface Insight {
  id: number;
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  icon: string;
}

export default function MarketDashboardInteractive() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [widgets, setWidgets] = useState<Widget[]>([
    { id: 'overview', title: 'Marktübersicht', type: 'cards', visible: true },
    { id: 'charts', title: 'Diagramme', type: 'charts', visible: true },
    { id: 'alerts', title: 'Benachrichtigungen', type: 'alerts', visible: true },
    { id: 'competitors', title: 'Wettbewerber', type: 'analysis', visible: true },
    { id: 'insights', title: 'Einblicke', type: 'insights', visible: true }
  ]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const marketOverview: MarketOverview[] = [
    { title: 'Gesamtmarktkapitalisierung', value: '€42,5 Mrd.', change: 12.5, icon: '🌐', trend: 'up' },
    { title: 'Starlink Marktanteil', value: '38,2%', change: 5.8, icon: '🛰️', trend: 'up' },
    { title: 'Aktive Satelliten', value: '4.892', change: 8.3, icon: '📡', trend: 'up' },
    { title: 'Globale Abdeckung', value: '67 Länder', change: 15.2, icon: '🌍', trend: 'up' }
  ];

  const revenueData: ChartData[] = [
    { name: 'Jan', value: 2400, value2: 1800 },
    { name: 'Feb', value: 2800, value2: 2100 },
    { name: 'Mär', value: 3200, value2: 2400 },
    { name: 'Apr', value: 3800, value2: 2800 },
    { name: 'Mai', value: 4200, value2: 3200 },
    { name: 'Jun', value: 4800, value2: 3600 }
  ];

  const marketShareData: ChartData[] = [
    { name: 'Q1 2025', value: 32.5 },
    { name: 'Q2 2025', value: 35.2 },
    { name: 'Q3 2025', value: 36.8 },
    { name: 'Q4 2025', value: 38.2 }
  ];

  const subscriberGrowthData: ChartData[] = [
    { name: 'Jan', value: 1200000 },
    { name: 'Feb', value: 1450000 },
    { name: 'Mär', value: 1680000 },
    { name: 'Apr', value: 1920000 },
    { name: 'Mai', value: 2150000 },
    { name: 'Jun', value: 2400000 }
  ];

  const tickerItems: TickerItem[] = [
    { symbol: 'STLK', name: 'Starlink Index', price: '€1.245,80', change: 3.2 },
    { symbol: 'SATCOM', name: 'Satellite Communications', price: '€892,50', change: -1.5 },
    { symbol: 'SPTECH', name: 'Space Technology', price: '€2.156,30', change: 5.7 },
    { symbol: 'INET', name: 'Internet Infrastructure', price: '€678,90', change: 2.1 }
  ];

  const alerts: Alert[] = [
    {
      id: 1,
      type: 'success',
      title: 'Neuer Meilenstein erreicht',
      message: 'Starlink hat die 5-Millionen-Abonnenten-Marke überschritten. Dies stellt einen bedeutenden Meilenstein in der globalen Satelliteninternet-Expansion dar.',
      timestamp: '12.01.2026 04:30'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Regulatorische Änderungen',
      message: 'Die EU-Kommission hat neue Richtlinien für Satelliteninternet-Anbieter angekündigt. Überprüfung der Compliance-Anforderungen empfohlen.',
      timestamp: '11.01.2026 18:45'
    },
    {
      id: 3,
      type: 'info',
      title: 'Marktanalyse verfügbar',
      message: 'Neuer Quartalsbericht zur Satelliteninternet-Branche wurde veröffentlicht. Detaillierte Wettbewerbsanalyse und Wachstumsprognosen enthalten.',
      timestamp: '11.01.2026 14:20'
    },
    {
      id: 4,
      type: 'success',
      title: 'Technologie-Upgrade',
      message: 'Starlink hat erfolgreich die Gen2-Satelliten-Konstellation erweitert, was zu 40% höheren Datenübertragungsraten führt.',
      timestamp: '10.01.2026 22:15'
    }
  ];

  const competitors: Competitor[] = [
    { name: 'Starlink', marketShare: 38.2, growth: 5.8, color: '#00BFFF' },
    { name: 'OneWeb', marketShare: 22.5, growth: 3.2, color: '#FFD700' },
    { name: 'Amazon Kuiper', marketShare: 15.8, growth: 8.5, color: '#FF4444' },
    { name: 'Telesat', marketShare: 12.3, growth: -1.2, color: '#00FF88' },
    { name: 'Andere', marketShare: 11.2, growth: 2.1, color: '#B0B0B0' }
  ];

  const insights: Insight[] = [
    {
      id: 1,
      category: 'Wachstum',
      title: 'Beschleunigtes Abonnentenwachstum',
      description: 'Die Abonnentenzahlen zeigen ein exponentielles Wachstum von 45% im Vergleich zum Vorquartal, getrieben durch Expansion in Schwellenländer.',
      impact: 'high',
      icon: 'TrendingUpIcon'
    },
    {
      id: 2,
      category: 'Technologie',
      title: 'Gen2-Satelliten-Deployment',
      message: 'Die neue Generation von Satelliten bietet 3x höhere Kapazität und verbesserte Latenz, was die Wettbewerbsposition stärkt.',
      impact: 'high',
      icon: 'RocketLaunchIcon'
    },
    {
      id: 3,
      category: 'Markt',
      title: 'Regulatorische Genehmigungen',
      description: 'Starlink hat Betriebsgenehmigungen in 12 weiteren Ländern erhalten, was das adressierbare Marktpotenzial um 28% erhöht.',
      impact: 'medium',
      icon: 'DocumentCheckIcon'
    },
    {
      id: 4,
      category: 'Wettbewerb',
      title: 'Amazon Kuiper Markteintritt',
      description: 'Amazon plant den Start seiner Satellitenflotte für Q3 2026, was zu erhöhtem Wettbewerbsdruck führen könnte.',
      impact: 'medium',
      icon: 'ShieldExclamationIcon'
    }
  ];

  const handleExport = (format: string) => {
    if (!isHydrated) return;
    alert(`Daten werden im ${format.toUpperCase()}-Format exportiert...`);
  };

  const handleWidgetToggle = (id: string) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, visible: !w.visible } : w));
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-card rounded-lg w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-32 bg-card rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto py-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-headline font-bold text-foreground mb-2 text-glow-primary">
              Markt-Dashboard
            </h1>
            <p className="text-muted-foreground font-body">
              Echtzeit-Marktdaten und Wettbewerbsanalyse für Satelliteninternet-Investitionen
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <CustomizableWidget widgets={widgets} onToggle={handleWidgetToggle} />
            <button className="px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth">
              Dashboard teilen
            </button>
          </div>
        </div>

        <LiveMarketTicker items={tickerItems} />

        {widgets.find(w => w.id === 'overview')?.visible && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {marketOverview.map((item, index) => (
              <MarketOverviewCard key={index} {...item} />
            ))}
          </div>
        )}

        {widgets.find(w => w.id === 'charts')?.visible && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketChart
              title="Umsatzentwicklung (Mio. €)"
              data={revenueData}
              type="area"
              dataKey="value"
              dataKey2="value2"
              color="#00BFFF"
              color2="#FFD700"
            />
            <MarketChart
              title="Marktanteil-Entwicklung (%)"
              data={marketShareData}
              type="line"
              dataKey="value"
              color="#00BFFF"
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {widgets.find(w => w.id === 'charts')?.visible && (
            <div className="lg:col-span-2">
              <MarketChart
                title="Abonnenten-Wachstum"
                data={subscriberGrowthData}
                type="bar"
                dataKey="value"
                color="#00BFFF"
              />
            </div>
          )}
          <DataExportPanel onExport={handleExport} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {widgets.find(w => w.id === 'competitors')?.visible && (
            <CompetitorAnalysis competitors={competitors} />
          )}
          {widgets.find(w => w.id === 'alerts')?.visible && (
            <MarketAlertCard alerts={alerts} />
          )}
        </div>

        {widgets.find(w => w.id === 'insights')?.visible && (
          <MarketInsights insights={insights} />
        )}

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-headline font-bold text-foreground">Glossar</h3>
            <button className="text-sm text-primary font-cta font-semibold hover:text-accent transition-smooth">
              Alle anzeigen
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-cta font-semibold text-foreground mb-1">LEO (Low Earth Orbit)</h4>
              <p className="text-xs text-muted-foreground font-body">
                Niedrige Erdumlaufbahn zwischen 160 und 2.000 km Höhe, ideal für Satelliteninternet mit geringer Latenz.
              </p>
            </div>
            <div className="p-4 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-cta font-semibold text-foreground mb-1">Satellitenkonstellationen</h4>
              <p className="text-xs text-muted-foreground font-body">
                Netzwerk von Satelliten, die zusammenarbeiten, um globale Internetabdeckung bereitzustellen.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-primary/30 rounded-lg p-6 text-center">
          <p className="text-sm text-muted-foreground font-body mb-4">
            <strong className="text-foreground">Haftungsausschluss:</strong> Diese Plattform ist unabhängig und nicht mit Starlink oder SpaceX verbunden. Alle Daten dienen nur zu Informationszwecken. Investitionsentscheidungen sollten auf eigener Recherche basieren.
          </p>
          <div className="flex items-center justify-center space-x-4 text-xs text-muted-foreground">
            <span>🔒 GDPR-konform</span>
            <span>•</span>
            <span>🇪🇺 EU-Regulierung</span>
            <span>•</span>
            <span>✓ Unabhängige Analyse</span>
          </div>
        </div>
      </div>
    </div>
  );
}