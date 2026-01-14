'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface AllocationData {
  name: string;
  value: number;
  percentage: number;
}

interface AllocationChartProps {
  data: AllocationData[];
}

const COLORS = ['#00BFFF', '#FFD700', '#00FF88', '#FF4444', '#FFA500', '#1E90FF'];

export default function AllocationChart({ data }: AllocationChartProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg p-6 border border-border">
        <div className="h-80 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Lade Allokationsdiagramm...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg p-6 border border-border glow-primary">
      <h2 className="text-xl font-headline font-bold text-foreground mb-6">Portfolio-Allokation</h2>

      <div className="w-full h-80" aria-label="Portfolio Allocation Pie Chart">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage.toFixed(1)}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 space-y-3">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div 
                className="w-4 h-4 rounded-full" 
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-sm font-cta font-semibold text-foreground">{item.name}</span>
            </div>
            <div className="text-right">
              <p className="text-sm font-headline font-bold text-primary">{item.value.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
              <p className="text-xs font-mono text-muted-foreground">{item.percentage.toFixed(2)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}