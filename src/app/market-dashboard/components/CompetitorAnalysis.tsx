interface Competitor {
  name: string;
  marketShare: number;
  growth: number;
  color: string;
}

interface CompetitorAnalysisProps {
  competitors: Competitor[];
}

export default function CompetitorAnalysis({ competitors }: CompetitorAnalysisProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-headline font-bold text-foreground mb-6">Wettbewerbsanalyse</h3>
      <div className="space-y-4">
        {competitors.map((competitor, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-cta font-semibold text-foreground">{competitor.name}</span>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-muted-foreground font-body">{competitor.marketShare}%</span>
                <span className={`text-xs font-cta font-semibold ${competitor.growth >= 0 ? 'text-success' : 'text-destructive'}`}>
                  {competitor.growth >= 0 ? '↑' : '↓'} {Math.abs(competitor.growth)}%
                </span>
              </div>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${competitor.marketShare}%`,
                  backgroundColor: competitor.color
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}