'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface ChartDataPoint {
  date: string;
  value: number;
  invested: number;
}

interface PerformanceChartProps {
  data: ChartDataPoint[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const [isHydrated, setIsHydrated] = useState(false);
  const [timeRange, setTimeRange] = useState<'1W' | '1M' | '3M' | '6M' | '1Y' | 'ALL'>('1M');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Lade Performance-Diagramm...</div>
        </div>
      </div>
    );
  }

  const timeRanges = ['1W', '1M', '3M', '6M', '1Y', 'ALL'] as const;

  return (
    <div className="bg-card rounded-lg p-6 border border-border glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-headline font-bold text-foreground">Portfolio-Performance</h2>
        <div className="flex items-center space-x-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1 rounded-md text-xs font-cta font-bold transition-smooth ${
                timeRange === range
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:text-primary'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full h-80" aria-label="Portfolio Performance Line Chart">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 191, 255, 0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#B0B0B0"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}
            />
            <YAxis 
              stroke="#B0B0B0"
              style={{ fontSize: '12px', fontFamily: 'JetBrains Mono, monospace' }}
              tickFormatter={(value) => `${value.toLocaleString('de-DE')} €`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#1A1A1A', 
                border: '1px solid rgba(0, 191, 255, 0.3)',
                borderRadius: '8px',
                fontFamily: 'JetBrains Mono, monospace'
              }}
              formatter={(value: number) => [`${value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`, '']}
            />
            <Legend 
              wrapperStyle={{ fontFamily: 'Rajdhani, sans-serif', fontSize: '14px' }}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#00BFFF" 
              strokeWidth={3}
              dot={false}
              name="Portfolio-Wert"
            />
            <Line 
              type="monotone" 
              dataKey="invested" 
              stroke="#FFD700" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Investiert"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}