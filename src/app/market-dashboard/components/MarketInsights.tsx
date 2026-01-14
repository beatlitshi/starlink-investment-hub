import Icon from '@/components/ui/AppIcon';

interface Insight {
  id: number;
  category: string;
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  icon: string;
}

interface MarketInsightsProps {
  insights: Insight[];
}

export default function MarketInsights({ insights }: MarketInsightsProps) {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      default: return 'text-success';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-headline font-bold text-foreground">Markt-Einblicke</h3>
        <Icon name="LightBulbIcon" size={20} className="text-secondary" />
      </div>
      <div className="space-y-4">
        {insights.map((insight) => (
          <div key={insight.id} className="p-4 bg-muted/30 rounded-lg border border-border hover:border-primary transition-smooth">
            <div className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Icon name={insight.icon as any} size={20} className="text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-muted-foreground font-mono uppercase">{insight.category}</span>
                  <span className={`text-xs font-cta font-semibold uppercase ${getImpactColor(insight.impact)}`}>
                    {insight.impact === 'high' ? 'Hohe Auswirkung' : insight.impact === 'medium' ? 'Mittlere Auswirkung' : 'Geringe Auswirkung'}
                  </span>
                </div>
                <h4 className="text-sm font-cta font-semibold text-foreground mb-1">{insight.title}</h4>
                <p className="text-xs text-muted-foreground font-body">{insight.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}