import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

interface CTASectionProps {
  className?: string;
}

const CTASection = ({ className = '' }: CTASectionProps) => {
  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-gradient-to-br from-primary/20 via-card to-secondary/20 border border-primary/30 rounded-2xl p-8 lg:p-12 shadow-depth">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          <div className="relative z-10 text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-headline font-bold text-foreground mb-6">
              Bereit für Ihre
              <span className="block text-primary text-glow-primary mt-2">Starlink-Investition?</span>
            </h2>
            
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              Erhalten Sie Zugang zu exklusiven Investitionsmöglichkeiten und personalisierten Marktanalysen
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link href="/partnership-portal">
                <button className="px-8 py-4 bg-primary text-primary-foreground rounded-md font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth flex items-center space-x-2 animate-pulse-glow">
                  <Icon name="RocketLaunchIcon" size={20} />
                  <span>Jetzt investieren</span>
                </button>
              </Link>
              <Link href="/personal-dashboard">
                <button className="px-8 py-4 bg-transparent border-2 border-primary text-primary rounded-md font-cta font-bold hover:bg-primary/10 transition-smooth flex items-center space-x-2">
                  <Icon name="ChartBarIcon" size={20} />
                  <span>Dashboard erstellen</span>
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <Icon name="ShieldCheckIcon" size={32} className="text-success mx-auto mb-3" />
                <h3 className="text-lg font-headline font-bold text-foreground mb-2">Sichere Plattform</h3>
                <p className="text-sm text-muted-foreground">EU-reguliert und GDPR-konform</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <Icon name="ChartPieIcon" size={32} className="text-primary mx-auto mb-3" />
                <h3 className="text-lg font-headline font-bold text-foreground mb-2">Diversifizierung</h3>
                <p className="text-sm text-muted-foreground">Zugang zu verschiedenen Anlageklassen</p>
              </div>
              <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6">
                <Icon name="UserGroupIcon" size={32} className="text-secondary mx-auto mb-3" />
                <h3 className="text-lg font-headline font-bold text-foreground mb-2">Expertenberatung</h3>
                <p className="text-sm text-muted-foreground">Persönliche Unterstützung verfügbar</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Vertrauen von über 15.000 Investoren weltweit
          </p>
          <div className="flex items-center justify-center space-x-8 flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Icon name="CheckBadgeIcon" size={20} className="text-success" />
              <span className="text-sm text-muted-foreground">BaFin-reguliert</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="LockClosedIcon" size={20} className="text-success" />
              <span className="text-sm text-muted-foreground">256-Bit-Verschlüsselung</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="DocumentCheckIcon" size={20} className="text-success" />
              <span className="text-sm text-muted-foreground">ISO 27001 zertifiziert</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;