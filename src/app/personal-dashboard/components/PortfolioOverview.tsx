interface PortfolioData {
  totalValue: number;
  totalInvestment: number;
  totalReturn: number;
  returnPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
  cryptoBonus?: number;
}

interface PortfolioOverviewProps {
  data: PortfolioData;
}

export default function PortfolioOverview({ data }: PortfolioOverviewProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border glow-primary">
      <h2 className="text-xl font-headline font-bold text-foreground mb-6">Portfolio Übersicht</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          <p className="text-sm font-mono text-muted-foreground">Gesamtwert</p>
          <p className="text-3xl font-headline font-bold text-primary">{data.totalValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
          <div className="flex items-center space-x-2">
            <span className={`text-sm font-cta font-semibold ${data.dayChange >= 0 ? 'text-success' : 'text-destructive'}`}>
              {data.dayChange >= 0 ? '+' : ''}{data.dayChange.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
            </span>
            <span className={`text-xs font-mono ${data.dayChangePercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
              ({data.dayChangePercentage >= 0 ? '+' : ''}{data.dayChangePercentage.toFixed(2)}%)
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-mono text-muted-foreground">Gesamtinvestition</p>
          <p className="text-3xl font-headline font-bold text-foreground">{data.totalInvestment.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-mono text-muted-foreground">Gesamtrendite</p>
          <p className={`text-3xl font-headline font-bold ${data.totalReturn >= 0 ? 'text-success' : 'text-destructive'}`}>
            {data.totalReturn >= 0 ? '+' : ''}{data.totalReturn.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </p>
          <p className={`text-sm font-cta font-semibold ${data.returnPercentage >= 0 ? 'text-success' : 'text-destructive'}`}>
            {data.returnPercentage >= 0 ? '+' : ''}{data.returnPercentage.toFixed(2)}%
          </p>
        </div>
      </div>

      {data.cryptoBonus && data.cryptoBonus > 0 && (
        <div className="mt-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-mono text-muted-foreground mb-1">💎 Crypto Investment Bonus (8% TAX-FREE)</p>
              <p className="text-xs text-muted-foreground">Investieren Sie mit Krypto und erhalten Sie 8% mehr Starlink Stocks - komplett steuerfrei!</p>
            </div>
            <p className="text-2xl font-headline font-bold text-secondary">
              +{data.cryptoBonus.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </p>
          </div>
        </div>
      )}
    </div>
  );
}