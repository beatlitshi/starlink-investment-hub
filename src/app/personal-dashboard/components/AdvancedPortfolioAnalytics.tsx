'use client';

import { useState, useEffect } from 'react';
import { ResponsiveContainer, Legend, XAxis, YAxis, CartesianGrid, Tooltip, BarChart, Bar } from 'recharts';
import Icon from '@/components/ui/AppIcon';

interface AdvancedAnalyticsProps {
  investments: any[];
  portfolioValue: number;
}

export default function AdvancedPortfolioAnalytics({ investments, portfolioValue }: AdvancedAnalyticsProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState<'correlation' | 'var' | 'stress' | 'sector'>('correlation');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Lade erweiterte Analysen...</div>
        </div>
      </div>
    );
  }

  // Correlation Analysis Data
  const correlationData = [
    { asset: 'STLK', STLK: 1.0, SPCX: 0.85, STET: 0.62, GCON: 0.48 },
    { asset: 'SPCX', STLK: 0.85, SPCX: 1.0, STET: 0.71, GCON: 0.53 },
    { asset: 'STET', STLK: 0.62, SPCX: 0.71, STET: 1.0, GCON: 0.68 },
    { asset: 'GCON', STLK: 0.48, SPCX: 0.53, STET: 0.68, GCON: 1.0 }
  ];

  // Value at Risk (VaR) Data
  const varData = [
    { timeframe: '1 Tag', var95: 2847, var99: 4271 },
    { timeframe: '1 Woche', var95: 6342, var99: 9513 },
    { timeframe: '1 Monat', var95: 12684, var99: 19026 },
    { timeframe: '3 Monate', var95: 21978, var99: 32967 },
    { timeframe: '1 Jahr', var95: 43956, var99: 65934 }
  ];

  // Stress Test Scenarios
  const stressTestData = [
    { scenario: 'Marktcrash -20%', impact: -57508.75, probability: 5 },
    { scenario: 'Rezession -10%', impact: -28754.38, probability: 15 },
    { scenario: 'Korrektur -5%', impact: -14377.19, probability: 25 },
    { scenario: 'Volatilät +50%', impact: -8626.31, probability: 35 },
    { scenario: 'Normales Marktumfeld', impact: 0, probability: 20 }
  ];

  // Sector Allocation
  const sectorData = [
    { sector: 'Satelliten-Tech', value: 125000, percentage: 43.5, color: '#00BFFF' },
    { sector: 'Raumfahrt', value: 87500, percentage: 30.4, color: '#FF6B6B' },
    { sector: 'Telekommunikation', value: 50043.75, percentage: 17.4, color: '#4ECDC4' },
    { sector: 'Diversifiziert', value: 25000, percentage: 8.7, color: '#95E1D3' }
  ];

  // Risk Metrics
  const riskMetrics = {
    sharpeRatio: 1.87,
    beta: 1.23,
    alpha: 4.52,
    volatility: 18.3,
    maxDrawdown: -12.4,
    informationRatio: 0.94
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6 border border-border glow-primary">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/20 rounded-lg">
              <Icon name="ChartBarIcon" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-headline font-bold text-foreground">Erweiterte Portfolio-Analysen</h2>
              <p className="text-xs text-muted-foreground">Professionelle Risiko- und Performance-Metriken</p>
            </div>
          </div>
        </div>

        {/* Risk Metrics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
          <div className="p-4 bg-muted/10 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Sharpe Ratio</p>
            <p className="text-2xl font-headline font-bold text-success">{riskMetrics.sharpeRatio}</p>
          </div>
          <div className="p-4 bg-muted/10 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Beta</p>
            <p className="text-2xl font-headline font-bold text-primary">{riskMetrics.beta}</p>
          </div>
          <div className="p-4 bg-muted/10 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Alpha</p>
            <p className="text-2xl font-headline font-bold text-success">+{riskMetrics.alpha}%</p>
          </div>
          <div className="p-4 bg-muted/10 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Volatilität</p>
            <p className="text-2xl font-headline font-bold text-warning">{riskMetrics.volatility}%</p>
          </div>
          <div className="p-4 bg-muted/10 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Max Drawdown</p>
            <p className="text-2xl font-headline font-bold text-destructive">{riskMetrics.maxDrawdown}%</p>
          </div>
          <div className="p-4 bg-muted/10 rounded-lg border border-border">
            <p className="text-xs text-muted-foreground mb-1">Info Ratio</p>
            <p className="text-2xl font-headline font-bold text-primary">{riskMetrics.informationRatio}</p>
          </div>
        </div>

        {/* Metric Selection */}
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'correlation', label: 'Korrelationsanalyse', icon: 'ArrowsRightLeftIcon' },
            { id: 'var', label: 'Value at Risk', icon: 'ExclamationTriangleIcon' },
            { id: 'stress', label: 'Stress-Tests', icon: 'BoltIcon' },
            { id: 'sector', label: 'Sektor-Allokation', icon: 'ChartPieIcon' }
          ].map((metric) => (
            <button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id as any)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-semibold transition-smooth whitespace-nowrap ${
                selectedMetric === metric.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon name={metric.icon as any} size={16} />
              <span>{metric.label}</span>
            </button>
          ))}
        </div>

        {/* Correlation Analysis */}
        {selectedMetric === 'correlation' && (
          <div>
            <h3 className="text-lg font-headline font-bold text-foreground mb-4">Korrelationsmatrix</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 text-sm font-cta font-bold text-muted-foreground">Asset</th>
                    {['STLK', 'SPCX', 'STET', 'GCON'].map((asset) => (
                      <th key={asset} className="text-center py-2 px-4 text-sm font-cta font-bold text-muted-foreground">{asset}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {correlationData.map((row) => (
                    <tr key={row.asset} className="border-t border-border">
                      <td className="py-2 px-4 text-sm font-bold text-foreground">{row.asset}</td>
                      {['STLK', 'SPCX', 'STET', 'GCON'].map((asset) => {
                        const value = row[asset as keyof typeof row] as number;
                        const intensity = Math.abs(value);
                        return (
                          <td key={asset} className="py-2 px-4 text-center">
                            <span 
                              className="inline-block px-3 py-1 rounded text-sm font-bold"
                              style={{
                                backgroundColor: `rgba(0, 191, 255, ${intensity * 0.3})`,
                                color: intensity > 0.7 ? '#FFFFFF' : '#00BFFF'
                              }}
                            >
                              {value.toFixed(2)}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-3 bg-primary/10 border border-primary/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Interpretation:</strong> Werte nahe 1.0 zeigen starke positive Korrelation. 
                Diversifikation ist am effektivsten bei niedrigen Korrelationswerten (&lt; 0.5).
              </p>
            </div>
          </div>
        )}

        {/* Value at Risk */}
        {selectedMetric === 'var' && (
          <div>
            <h3 className="text-lg font-headline font-bold text-foreground mb-4">Value at Risk (VaR)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={varData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 191, 255, 0.1)" />
                  <XAxis dataKey="timeframe" stroke="#B0B0B0" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#B0B0B0" style={{ fontSize: '12px' }} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid #00BFFF', borderRadius: '8px' }}
                    labelStyle={{ color: '#FFFFFF' }}
                  />
                  <Legend />
                  <Bar dataKey="var95" fill="#FFA500" name="VaR 95%" />
                  <Bar dataKey="var99" fill="#FF6B6B" name="VaR 99%" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>VaR 95%:</strong> Mit 95% Wahrscheinlichkeit wird Ihr Verlust diesen Betrag nicht überschreiten. 
                <strong className="ml-2">VaR 99%:</strong> Noch konservativere Schätzung mit 99% Konfidenz.
              </p>
            </div>
          </div>
        )}

        {/* Stress Tests */}
        {selectedMetric === 'stress' && (
          <div>
            <h3 className="text-lg font-headline font-bold text-foreground mb-4">Stress-Test-Szenarien</h3>
            <div className="space-y-3">
              {stressTestData.map((test, idx) => (
                <div key={idx} className="p-4 bg-muted/10 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-cta font-bold text-foreground">{test.scenario}</h4>
                    <span className="text-xs text-muted-foreground">{test.probability}% Wahrscheinlichkeit</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${test.impact < 0 ? 'bg-destructive' : 'bg-success'}`}
                          style={{ width: `${Math.abs(test.impact / portfolioValue * 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className={`ml-4 text-xl font-headline font-bold ${
                      test.impact < 0 ? 'text-destructive' : 'text-success'
                    }`}>
                      {test.impact < 0 ? '' : '+'}{test.impact.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Stress-Tests</strong> simulieren extreme Marktbedingungen, um potenzielle Verluste zu identifizieren. 
                Verwenden Sie diese Informationen für Risikomanagement und Absicherungsstrategien.
              </p>
            </div>
          </div>
        )}

        {/* Sector Allocation */}
        {selectedMetric === 'sector' && (
          <div>
            <h3 className="text-lg font-headline font-bold text-foreground mb-4">Sektor-Allokation</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {sectorData.map((sector, idx) => (
                  <div key={idx} className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-cta font-semibold text-foreground">{sector.sector}</span>
                      <span className="text-sm font-bold text-primary">{sector.percentage}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full transition-all duration-500"
                        style={{ width: `${sector.percentage}%`, backgroundColor: sector.color }}
                      ></div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {sector.value.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-center">
                <div className="relative w-64 h-64">
                  {sectorData.map((sector, idx) => {
                    const total = sectorData.reduce((sum, s) => sum + s.percentage, 0);
                    const startAngle = sectorData.slice(0, idx).reduce((sum, s) => sum + (s.percentage / total * 360), 0);
                    const angle = sector.percentage / total * 360;
                    
                    return (
                      <div
                        key={idx}
                        className="absolute inset-0 rounded-full"
                        style={{
                          background: `conic-gradient(from ${startAngle}deg, ${sector.color} 0deg, ${sector.color} ${angle}deg, transparent ${angle}deg)`,
                          clipPath: 'circle(50%)'
                        }}
                      ></div>
                    );
                  })}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-card rounded-full flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-2xl font-headline font-bold text-primary">
                          {portfolioValue.toLocaleString('de-DE', { maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-muted-foreground">€</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
              <p className="text-xs text-muted-foreground">
                <strong>Diversifikation:</strong> Eine ausgewogene Sektor-Allokation reduziert das Risiko. 
                Empfohlen: Keine einzelne Position über 40% des Gesamtportfolios.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}