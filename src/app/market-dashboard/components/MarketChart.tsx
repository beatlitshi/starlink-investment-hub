'use client';

import { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MarketChartProps {
  title: string;
  data: Array<{ name: string; value: number; value2?: number }>;
  type: 'line' | 'area' | 'bar';
  dataKey: string;
  dataKey2?: string;
  color: string;
  color2?: string;
}

export default function MarketChart({ title, data, type, dataKey, dataKey2, color, color2 }: MarketChartProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-headline font-bold text-foreground mb-4">{title}</h3>
        <div className="w-full h-80 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Lade Diagramm...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-smooth">
      <h3 className="text-lg font-headline font-bold text-foreground mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={320}>
        {type === 'line' && (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#B0B0B0" style={{ fontSize: '12px' }} />
            <YAxis stroke="#B0B0B0" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Legend wrapperStyle={{ color: '#B0B0B0' }} />
            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} dot={{ fill: color }} />
            {dataKey2 && <Line type="monotone" dataKey={dataKey2} stroke={color2} strokeWidth={2} dot={{ fill: color2 }} />}
          </LineChart>
        )}
        {type === 'area' && (
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#B0B0B0" style={{ fontSize: '12px' }} />
            <YAxis stroke="#B0B0B0" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Legend wrapperStyle={{ color: '#B0B0B0' }} />
            <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} fillOpacity={0.3} />
            {dataKey2 && <Area type="monotone" dataKey={dataKey2} stroke={color2} fill={color2} fillOpacity={0.3} />}
          </AreaChart>
        )}
        {type === 'bar' && (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="name" stroke="#B0B0B0" style={{ fontSize: '12px' }} />
            <YAxis stroke="#B0B0B0" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid rgba(0, 191, 255, 0.3)',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
            />
            <Legend wrapperStyle={{ color: '#B0B0B0' }} />
            <Bar dataKey={dataKey} fill={color} />
            {dataKey2 && <Bar dataKey={dataKey2} fill={color2} />}
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}