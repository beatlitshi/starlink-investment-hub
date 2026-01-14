import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MarketData {
  region: string;
  penetration: number;
  potential: number;
  growth: number;
}

interface MarketPenetrationChartProps {
  className?: string;
}

const MarketPenetrationChart = ({ className = '' }: MarketPenetrationChartProps) => {
  const marketData: MarketData[] = [
    { region: 'Nordamerika', penetration: 42, potential: 85, growth: 156 },
    { region: 'Europa', penetration: 28, potential: 78, growth: 134 },
    { region: 'Asien-Pazifik', penetration: 18, potential: 92, growth: 198 },
    { region: 'Lateinamerika', penetration: 12, potential: 68, growth: 223 },
    { region: 'Naher Osten', penetration: 8, potential: 54, growth: 267 },
    { region: 'Afrika', penetration: 5, potential: 88, growth: 312 }
  ];

  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mb-4">
            Globale Marktdurchdringung
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Analyse der aktuellen Marktpenetration und des ungenutzten Potenzials nach Regionen
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-depth">
          <div className="w-full h-96 mb-8" aria-label="Marktdurchdringungs-Balkendiagramm">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="region" 
                  stroke="#B0B0B0"
                  style={{ fontSize: '12px', fontFamily: 'Inter' }}
                />
                <YAxis 
                  stroke="#B0B0B0"
                  style={{ fontSize: '12px', fontFamily: 'Inter' }}
                  label={{ value: 'Prozent (%)', angle: -90, position: 'insideLeft', fill: '#B0B0B0' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid rgba(0, 191, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                  formatter={(value: number) => `${value}%`}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Bar dataKey="penetration" fill="#00BFFF" name="Aktuelle Durchdringung" radius={[8, 8, 0, 0]} />
                <Bar dataKey="potential" fill="#FFD700" name="Marktpotenzial" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {marketData.slice(0, 3).map((region, index) => (
              <div key={index} className="bg-muted/30 rounded-lg p-4 border border-border hover:border-primary/50 transition-smooth">
                <h3 className="text-lg font-headline font-bold text-foreground mb-2">{region.region}</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Durchdringung:</span>
                    <span className="text-sm font-mono text-primary">{region.penetration}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Potenzial:</span>
                    <span className="text-sm font-mono text-secondary">{region.potential}%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Wachstum:</span>
                    <span className="text-sm font-mono text-success">+{region.growth}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketPenetrationChart;