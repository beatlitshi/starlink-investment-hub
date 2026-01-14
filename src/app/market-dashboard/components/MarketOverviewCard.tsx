interface MarketOverviewCardProps {
  title: string;
  value: string;
  change: number;
  icon: string;
  trend: 'up' | 'down';
}

export default function MarketOverviewCard({ title, value, change, icon, trend }: MarketOverviewCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-smooth glow-primary">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <p className="text-sm text-muted-foreground font-body">{title}</p>
            <p className="text-2xl font-headline font-bold text-foreground mt-1">{value}</p>
          </div>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className={`text-sm font-cta font-semibold ${trend === 'up' ? 'text-success' : 'text-destructive'}`}>
          {trend === 'up' ? '↑' : '↓'} {Math.abs(change)}%
        </span>
        <span className="text-xs text-muted-foreground font-body">vs. letzter Monat</span>
      </div>
    </div>
  );
}