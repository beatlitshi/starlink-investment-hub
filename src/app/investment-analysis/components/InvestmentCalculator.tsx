'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface CalculatorResult {
  totalInvestment: number;
  projectedReturn: number;
  roi: number;
  breakEvenYears: number;
}

interface InvestmentCalculatorProps {
  className?: string;
}

const InvestmentCalculator = ({ className = '' }: InvestmentCalculatorProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState<number>(10000);
  const [investmentPeriod, setInvestmentPeriod] = useState<number>(5);
  const [useCrypto, setUseCrypto] = useState<boolean>(false);
  const [result, setResult] = useState<CalculatorResult | null>(null);
  const [results, setResults] = useState({
    totalValue: 0,
    totalReturn: 0,
    returnPercentage: 0,
    yearlyBreakdown: [] as { year: number; value: number; return: number }[]
  });

  useEffect(() => {
    const annualReturn = 0.18; // 18% expected annual return
    const cryptoBonus = useCrypto ? investmentAmount * 0.08 : 0;
    const initialInvestment = investmentAmount + cryptoBonus;
    
    let currentValue = initialInvestment;
    const breakdown = [];

    for (let year = 1; year <= investmentPeriod; year++) {
      currentValue = currentValue * (1 + annualReturn);
      breakdown.push({
        year,
        value: currentValue,
        return: currentValue - initialInvestment
      });
    }

    setResults({
      totalValue: currentValue,
      totalReturn: currentValue - investmentAmount,
      returnPercentage: ((currentValue - investmentAmount) / investmentAmount) * 100,
      yearlyBreakdown: breakdown
    });
  }, [investmentAmount, investmentPeriod, useCrypto]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const calculateInvestment = () => {
    if (!isHydrated) return;

    const growthRates: { [key: string]: number } = {
      conservative: 0.12,
      moderate: 0.18,
      aggressive: 0.25
    };

    const rate = growthRates[riskProfile] || 0.18;
    const projectedReturn = investmentAmount * Math.pow(1 + rate, investmentPeriod);
    const roi = ((projectedReturn - investmentAmount) / investmentAmount) * 100;
    const breakEvenYears = Math.log(2) / Math.log(1 + rate);

    setResult({
      totalInvestment: investmentAmount,
      projectedReturn: projectedReturn,
      roi: roi,
      breakEvenYears: breakEvenYears
    });
  };

  if (!isHydrated) {
    return (
      <section className={`py-16 ${className}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-card border border-border rounded-lg p-8 shadow-depth animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-1/2 mx-auto mb-8"></div>
            <div className="space-y-6">
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
              <div className="h-20 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mb-4">
            Investitionsrechner
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Berechnen Sie Ihre potenzielle Rendite basierend auf historischen Wachstumsraten
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-depth">
          <div className="space-y-6 mb-8">
            <div>
              <label className="block text-sm font-cta font-semibold text-foreground mb-3">
                Investitionsbetrag: €{investmentAmount.toLocaleString('de-DE')}
              </label>
              <input
                type="range"
                min="1000"
                max="100000"
                step="1000"
                value={investmentAmount}
                onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>€1.000</span>
                <span>€100.000</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-cta font-semibold text-foreground mb-3">
                Anlagezeitraum: {investmentPeriod} Jahre
              </label>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={investmentPeriod}
                onChange={(e) => setInvestmentPeriod(Number(e.target.value))}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-2">
                <span>1 Jahr</span>
                <span>10 Jahre</span>
              </div>
            </div>

            <div className="p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useCrypto}
                  onChange={(e) => setUseCrypto(e.target.checked)}
                  className="w-5 h-5 accent-secondary cursor-pointer"
                />
                <div>
                  <span className="text-sm font-bold text-foreground">
                    💎 Mit Krypto investieren (+8% TAX-FREE Bonus)
                  </span>
                  <p className="text-xs text-muted-foreground">
                    Erhalten Sie sofort 8% mehr Starlink Stocks - komplett steuerfrei!
                  </p>
                </div>
              </label>
            </div>
          </div>

          <button
            onClick={calculateInvestment}
            className="w-full px-8 py-4 bg-primary text-primary-foreground rounded-md font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth flex items-center justify-center space-x-2"
          >
            <Icon name="CalculatorIcon" size={20} />
            <span>Rendite berechnen</span>
          </button>

          {result && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
              <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
                <p className="text-sm font-mono text-primary mb-2">PROJIZIERTE RENDITE</p>
                <p className="text-3xl font-headline font-bold text-foreground mb-1">
                  €{result.projectedReturn.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">Nach {investmentPeriod} Jahren</p>
              </div>
              <div className="bg-success/10 border border-success/30 rounded-lg p-6">
                <p className="text-sm font-mono text-success mb-2">GESAMTRENDITE (ROI)</p>
                <p className="text-3xl font-headline font-bold text-foreground mb-1">
                  +{result.roi.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Kapitalzuwachs</p>
              </div>
              <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-6">
                <p className="text-sm font-mono text-secondary mb-2">GEWINN</p>
                <p className="text-3xl font-headline font-bold text-foreground mb-1">
                  €{(result.projectedReturn - result.totalInvestment).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <p className="text-xs text-muted-foreground">Netto-Kapitalgewinn</p>
              </div>
              <div className="bg-warning/10 border border-warning/30 rounded-lg p-6">
                <p className="text-sm font-mono text-warning mb-2">BREAK-EVEN</p>
                <p className="text-3xl font-headline font-bold text-foreground mb-1">
                  {result.breakEvenYears.toFixed(1)} Jahre
                </p>
                <p className="text-xs text-muted-foreground">Bis zur Verdopplung</p>
              </div>
            </div>
          )}

          <div className="mt-6 bg-muted/30 rounded-lg p-4 border-l-4 border-warning">
            <p className="text-xs text-muted-foreground">
              <span className="font-bold text-warning">Hinweis:</span> Diese Berechnungen basieren auf historischen Wachstumsraten und stellen keine Garantie für zukünftige Renditen dar. Investitionen in Satelliteninternet-Infrastruktur unterliegen Marktrisiken.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InvestmentCalculator;