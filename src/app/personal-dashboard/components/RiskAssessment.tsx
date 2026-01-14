'use client';

import { useState, useEffect } from 'react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, Legend } from 'recharts';

interface RiskMetric {
  category: string;
  score: number;
  maxScore: number;
}

interface RiskAssessmentProps {
  metrics: RiskMetric[];
  overallRiskLevel: 'low' | 'medium' | 'high';
}

export default function RiskAssessment({ metrics, overallRiskLevel }: RiskAssessmentProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Lade Risikobewertung...</div>
        </div>
      </div>
    );
  }

  const getRiskColor = () => {
    switch (overallRiskLevel) {
      case 'low':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskLabel = () => {
    switch (overallRiskLevel) {
      case 'low':
        return 'Niedriges Risiko';
      case 'medium':
        return 'Mittleres Risiko';
      case 'high':
        return 'Hohes Risiko';
      default:
        return 'Unbekannt';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-headline font-bold text-foreground">Risikobewertung</h2>
        <div className={`px-4 py-2 rounded-full text-sm font-cta font-bold ${getRiskColor()} bg-current/20`}>
          {getRiskLabel()}
        </div>
      </div>

      <div className="w-full h-80 mb-6" aria-label="Risk Assessment Radar Chart">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={metrics}>
            <PolarGrid stroke="rgba(0, 191, 255, 0.2)" />
            <PolarAngleAxis 
              dataKey="category" 
              stroke="#B0B0B0"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}
            />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]}
              stroke="#B0B0B0"
              style={{ fontSize: '10px', fontFamily: 'JetBrains Mono, monospace' }}
            />
            <Radar 
              name="Risiko-Score" 
              dataKey="score" 
              stroke="#00BFFF" 
              fill="#00BFFF" 
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Legend 
              wrapperStyle={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '14px' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3">
        {metrics.map((metric) => (
          <div key={metric.category} className="flex items-center justify-between">
            <span className="text-sm font-cta font-semibold text-foreground">{metric.category}</span>
            <div className="flex items-center space-x-3">
              <div className="w-32 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{ width: `${(metric.score / metric.maxScore) * 100}%` }}
                ></div>
              </div>
              <span className="text-sm font-mono text-primary w-12 text-right">{metric.score}/{metric.maxScore}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}