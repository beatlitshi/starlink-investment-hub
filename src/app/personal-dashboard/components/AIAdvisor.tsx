'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface AIRecommendation {
  id: string;
  type: 'buy' | 'sell' | 'hold' | 'diversify';
  asset: string;
  confidence: number;
  reasoning: string;
  potentialReturn: number;
  riskLevel: 'low' | 'medium' | 'high';
  timeframe: string;
}

interface AIAdvisorProps {
  portfolioValue: number;
  investments: any[];
}

export default function AIAdvisor({ portfolioValue, investments }: AIAdvisorProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    // Generate AI recommendations based on portfolio
    generateRecommendations();
  }, []);

  const generateRecommendations = () => {
    setIsGenerating(true);
    
    // Simulated AI recommendations (in production, this would call Claude/OpenAI API)
    setTimeout(() => {
      const mockRecommendations: AIRecommendation[] = [
        {
          id: '1',
          type: 'diversify',
          asset: 'Renewable Energy ETF',
          confidence: 87,
          reasoning: 'Ihr Portfolio ist stark auf Satelliten-Technologie konzentriert. Eine Diversifikation in erneuerbare Energien würde das Risiko reduzieren und von Wachstumstrends profitieren.',
          potentialReturn: 15.5,
          riskLevel: 'medium',
          timeframe: '12-18 Monate'
        },
        {
          id: '2',
          type: 'buy',
          asset: 'Starlink Global (STLK)',
          confidence: 92,
          reasoning: 'Basierend auf aktuellen Markttrends und Ihrer erfolgreichen Position empfehle ich, Ihre Starlink-Position zu erhöhen. Der Sektor zeigt starkes Wachstum.',
          potentialReturn: 22.3,
          riskLevel: 'medium',
          timeframe: '6-12 Monate'
        },
        {
          id: '3',
          type: 'hold',
          asset: 'SpaceX Ventures (SPCX)',
          confidence: 78,
          reasoning: 'Ihre SpaceX-Position performt gut. Halten Sie diese Position, um von langfristigem Wachstum zu profitieren.',
          potentialReturn: 12.8,
          riskLevel: 'low',
          timeframe: '18-24 Monate'
        },
        {
          id: '4',
          type: 'buy',
          asset: 'Quantum Computing Stocks',
          confidence: 81,
          reasoning: 'Quantum Computing wird die nächste technologische Revolution sein. Eine frühe Position könnte erhebliche Renditen bringen.',
          potentialReturn: 35.7,
          riskLevel: 'high',
          timeframe: '24-36 Monate'
        }
      ];
      
      setRecommendations(mockRecommendations);
      setIsGenerating(false);
    }, 1500);
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Lade KI-Berater...</div>
        </div>
      </div>
    );
  }

  const getTypeIcon = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'buy': return 'ArrowTrendingUpIcon';
      case 'sell': return 'ArrowTrendingDownIcon';
      case 'hold': return 'HandRaisedIcon';
      case 'diversify': return 'ChartPieIcon';
    }
  };

  const getTypeColor = (type: AIRecommendation['type']) => {
    switch (type) {
      case 'buy': return 'text-success';
      case 'sell': return 'text-destructive';
      case 'hold': return 'text-primary';
      case 'diversify': return 'text-secondary';
    }
  };

  const getRiskColor = (risk: AIRecommendation['riskLevel']) => {
    switch (risk) {
      case 'low': return 'text-success';
      case 'medium': return 'text-warning';
      case 'high': return 'text-destructive';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border glow-primary">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-primary/20 rounded-lg">
            <Icon name="SparklesIcon" size={24} className="text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-headline font-bold text-foreground">KI-Investment-Berater</h2>
            <p className="text-xs text-muted-foreground">Powered by Advanced AI Analytics</p>
          </div>
        </div>
        <button
          onClick={generateRecommendations}
          disabled={isGenerating}
          className="flex items-center space-x-2 px-4 py-2 bg-primary/20 text-primary rounded-md font-semibold hover:bg-primary/30 transition-smooth disabled:opacity-50"
        >
          <Icon name="ArrowPathIcon" size={16} className={isGenerating ? 'animate-spin' : ''} />
          <span>{isGenerating ? 'Analysiere...' : 'Aktualisieren'}</span>
        </button>
      </div>

      {isGenerating ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-32 bg-muted/20 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {recommendations.map((rec) => (
            <div key={rec.id} className="p-4 bg-muted/10 rounded-lg border border-border hover:border-primary transition-smooth">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full bg-current/20 ${getTypeColor(rec.type)}`}>
                    <Icon name={getTypeIcon(rec.type) as any} size={20} className={getTypeColor(rec.type)} />
                  </div>
                  <div>
                    <h3 className="text-lg font-headline font-bold text-foreground">{rec.asset}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getTypeColor(rec.type)} bg-current/20`}>
                        {rec.type.toUpperCase()}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${getRiskColor(rec.riskLevel)} bg-current/20`}>
                        {rec.riskLevel.toUpperCase()} RISK
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 mb-1">
                    <Icon name="CheckBadgeIcon" size={16} className="text-primary" />
                    <span className="text-sm font-bold text-primary">{rec.confidence}% Confidence</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.timeframe}</p>
                </div>
              </div>

              <p className="text-sm text-foreground mb-3">{rec.reasoning}</p>

              <div className="flex items-center justify-between pt-3 border-t border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="ChartBarIcon" size={16} className="text-success" />
                  <span className="text-sm font-semibold text-muted-foreground">Potenzielle Rendite:</span>
                  <span className="text-sm font-bold text-success">+{rec.potentialReturn}%</span>
                </div>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-bold hover:bg-accent transition-smooth">
                  Details anzeigen
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} className="text-primary mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground mb-1">KI-gestützte Analyse</p>
            <p className="text-xs text-muted-foreground">
              Diese Empfehlungen basieren auf fortschrittlichen KI-Algorithmen, die Markttrends, Ihr Portfolio und Risikoprofil analysieren. 
              Bitte beachten Sie, dass dies keine Finanzberatung darstellt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}