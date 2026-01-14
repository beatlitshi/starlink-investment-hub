import AppImage from '@/components/ui/AppImage';

interface Investment {
  id: string;
  name: string;
  symbol: string;
  image: string;
  alt: string;
  currentValue: number;
  invested: number;
  shares: number;
  returnAmount: number;
  returnPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
  isCrypto?: boolean;
  cryptoBonus?: number;
}

interface InvestmentCardProps {
  investment: Investment;
  onViewDetails: (id: string) => void;
}

export default function InvestmentCard({ investment, onViewDetails }: InvestmentCardProps) {
  return (
    <div className="bg-card rounded-lg p-4 border border-border hover:border-primary transition-smooth cursor-pointer" onClick={() => onViewDetails(investment.id)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary">
            <AppImage 
              src={investment.image} 
              alt={investment.alt}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-headline font-bold text-foreground">{investment.name}</h3>
              {investment.isCrypto && (
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-secondary/20 text-secondary border border-secondary/30">
                  CRYPTO
                </span>
              )}
            </div>
            <p className="text-sm font-mono text-muted-foreground">{investment.symbol}</p>
          </div>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-cta font-bold ${investment.returnPercentage >= 0 ? 'bg-success/20 text-success' : 'bg-destructive/20 text-destructive'}`}>
          {investment.returnPercentage >= 0 ? '+' : ''}{investment.returnPercentage.toFixed(2)}%
        </div>
      </div>

      {investment.isCrypto && investment.cryptoBonus && (
        <div className="mb-4 p-3 bg-secondary/10 border border-secondary/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-secondary">🎁 CRYPTO BONUS (8% TAX-FREE)</span>
            </div>
            <span className="text-sm font-headline font-bold text-secondary">
              +{investment.cryptoBonus.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs font-mono text-muted-foreground mb-1">Aktueller Wert</p>
          <p className="text-lg font-headline font-bold text-primary">{investment.currentValue.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
        </div>
        <div>
          <p className="text-xs font-mono text-muted-foreground mb-1">Investiert</p>
          <p className="text-lg font-headline font-bold text-foreground">{investment.invested.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          <p className="text-xs font-mono text-muted-foreground">Anteile</p>
          <p className="text-sm font-cta font-semibold text-foreground">{investment.shares.toLocaleString('de-DE', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-mono text-muted-foreground">Heute</p>
          <p className={`text-sm font-cta font-semibold ${investment.dayChange >= 0 ? 'text-success' : 'text-destructive'}`}>
            {investment.dayChange >= 0 ? '+' : ''}{investment.dayChange.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
          </p>
        </div>
      </div>
    </div>
  );
}