'use client';

import Icon from '@/components/ui/AppIcon';

export default function CryptoBonusBanner() {
  return (
    <section className="py-16 px-4 lg:px-8 bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 border-y-2 border-secondary">
      <div className="max-w-7xl mx-auto">
        <div className="bg-card rounded-lg p-8 shadow-depth border-2 border-secondary animate-pulse-glow">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-6">
              <div className="p-4 bg-secondary rounded-full">
                <Icon name="CurrencyDollarIcon" size={48} className="text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-headline font-bold text-foreground mb-2">
                  💎 Investieren Sie mit Krypto - Erhalten Sie 8% MEHR Starlink Stocks!
                </h2>
                <p className="text-lg text-muted-foreground mb-2">
                  Alle Krypto-Investitionen erhalten automatisch <strong className="text-secondary">8% zusätzliche Anteile</strong> - komplett <strong className="text-success">STEUERFREI!</strong>
                </p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircleIcon" size={20} className="text-success" />
                    <span className="text-sm text-foreground">Sofortige Gutschrift</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircleIcon" size={20} className="text-success" />
                    <span className="text-sm text-foreground">Keine versteckten Gebühren</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircleIcon" size={20} className="text-success" />
                    <span className="text-sm text-foreground">100% Steuerfrei</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="CheckCircleIcon" size={20} className="text-success" />
                    <span className="text-sm text-foreground">Unbegrenzte Investitionen</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-3">
              <button className="px-8 py-4 bg-secondary text-white rounded-md font-cta font-bold text-lg hover:bg-secondary/80 hover:shadow-glow-secondary transition-smooth whitespace-nowrap">
                Jetzt mit Krypto investieren
              </button>
              <p className="text-xs text-center text-muted-foreground">Bitcoin, Ethereum, USDT akzeptiert</p>
            </div>
          </div>

          {/* Example Calculation */}
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-xl font-headline font-bold text-foreground mb-4">Beispielrechnung:</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-muted/20 rounded-lg">
                <p className="text-sm text-muted-foreground mb-1">Ihre Investition</p>
                <p className="text-2xl font-headline font-bold text-primary">10.000 €</p>
              </div>
              <div className="p-4 bg-secondary/10 rounded-lg border border-secondary/30">
                <p className="text-sm text-muted-foreground mb-1">+ Crypto Bonus (8%)</p>
                <p className="text-2xl font-headline font-bold text-secondary">+800 €</p>
              </div>
              <div className="p-4 bg-success/10 rounded-lg border border-success/30">
                <p className="text-sm text-muted-foreground mb-1">Gesamtwert Ihrer Anteile</p>
                <p className="text-2xl font-headline font-bold text-success">10.800 €</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}