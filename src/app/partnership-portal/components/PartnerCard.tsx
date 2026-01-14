import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface PartnerCardProps {
  partner: {
    id: number;
    name: string;
    logo: string;
    logoAlt: string;
    category: string;
    rating: number;
    verified: boolean;
    minInvestment: string;
    description: string;
    features: string[];
    regulatoryBadges: string[];
  };
  onConnect: (id: number) => void;
}

export default function PartnerCard({ partner, onConnect }: PartnerCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-smooth glow-primary">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            <AppImage
              src={partner.logo}
              alt={partner.logoAlt}
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-headline font-bold text-foreground">{partner.name}</h3>
              {partner.verified && (
                <Icon name="CheckBadgeIcon" size={20} className="text-success" variant="solid" />
              )}
            </div>
            <p className="text-sm text-muted-foreground">{partner.category}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name="StarIcon"
              size={16}
              variant={i < partner.rating ? 'solid' : 'outline'}
              className={i < partner.rating ? 'text-secondary' : 'text-muted'}
            />
          ))}
        </div>
      </div>

      <p className="text-sm text-muted-foreground mb-4">{partner.description}</p>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Mindestinvestition</p>
        <p className="text-xl font-headline font-bold text-primary">{partner.minInvestment}</p>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Hauptmerkmale</p>
        <div className="flex flex-wrap gap-2">
          {partner.features.map((feature, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-muted text-xs font-cta font-semibold text-foreground rounded-full"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-2">Regulierungsabzeichen</p>
        <div className="flex flex-wrap gap-2">
          {partner.regulatoryBadges.map((badge, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-success/10 text-xs font-cta font-semibold text-success rounded-full border border-success/30"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={() => onConnect(partner.id)}
        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth"
      >
        Verbindung herstellen
      </button>
    </div>
  );
}