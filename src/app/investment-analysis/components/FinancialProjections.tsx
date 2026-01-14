import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProjectionData {
  year: string;
  revenue: number;
  profit: number;
  subscribers: number;
}

interface FinancialProjectionsProps {
  className?: string;
}

const FinancialProjections = ({ className = '' }: FinancialProjectionsProps) => {
  const projectionData: ProjectionData[] = [
    { year: '2024', revenue: 12.5, profit: 2.8, subscribers: 4.2 },
    { year: '2025', revenue: 18.7, profit: 5.4, subscribers: 6.8 },
    { year: '2026', revenue: 27.3, profit: 9.2, subscribers: 10.5 },
    { year: '2027', revenue: 38.9, profit: 14.8, subscribers: 15.7 },
    { year: '2028', revenue: 54.2, profit: 22.3, subscribers: 22.4 },
    { year: '2029', revenue: 73.8, profit: 32.6, subscribers: 31.2 }
  ];

  return (
    <section className={`py-16 bg-muted/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mb-4">
            Finanzielle Prognosen
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            5-Jahres-Projektion für Umsatz, Gewinn und Abonnentenwachstum basierend auf aktuellen Markttrends
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 lg:p-8 shadow-depth">
          <div className="w-full h-96 mb-8" aria-label="Finanzprognosen-Liniendiagramm">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="year" 
                  stroke="#B0B0B0"
                  style={{ fontSize: '12px', fontFamily: 'Inter' }}
                />
                <YAxis 
                  stroke="#B0B0B0"
                  style={{ fontSize: '12px', fontFamily: 'Inter' }}
                  label={{ value: 'Milliarden €', angle: -90, position: 'insideLeft', fill: '#B0B0B0' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1A1A1A', 
                    border: '1px solid rgba(0, 191, 255, 0.3)',
                    borderRadius: '8px',
                    color: '#FFFFFF'
                  }}
                  formatter={(value: number) => `€${value} Mrd.`}
                />
                <Legend 
                  wrapperStyle={{ paddingTop: '20px' }}
                  iconType="circle"
                />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#00BFFF" 
                  strokeWidth={3}
                  name="Umsatz"
                  dot={{ fill: '#00BFFF', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#FFD700" 
                  strokeWidth={3}
                  name="Gewinn"
                  dot={{ fill: '#FFD700', r: 5 }}
                  activeDot={{ r: 7 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="subscribers" 
                  stroke="#00FF88" 
                  strokeWidth={3}
                  name="Abonnenten (Mio.)"
                  dot={{ fill: '#00FF88', r: 5 }}
                  activeDot={{ r: 7 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-6">
              <h3 className="text-sm font-mono text-primary mb-2">UMSATZWACHSTUM</h3>
              <p className="text-3xl font-headline font-bold text-foreground mb-1">490%</p>
              <p className="text-sm text-muted-foreground">Kumulativ 2024-2029</p>
            </div>
            <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-6">
              <h3 className="text-sm font-mono text-secondary mb-2">GEWINNMARGE</h3>
              <p className="text-3xl font-headline font-bold text-foreground mb-1">44,2%</p>
              <p className="text-sm text-muted-foreground">Prognostiziert für 2029</p>
            </div>
            <div className="bg-success/10 border border-success/30 rounded-lg p-6">
              <h3 className="text-sm font-mono text-success mb-2">ABONNENTEN</h3>
              <p className="text-3xl font-headline font-bold text-foreground mb-1">31,2M</p>
              <p className="text-sm text-muted-foreground">Erwartete Basis 2029</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinancialProjections;