import AppImage from '@/components/ui/AppImage';

interface Competitor {
  name: string;
  logo: string;
  alt: string;
  marketShare: number;
  coverage: string;
  avgSpeed: string;
  pricing: string;
  strength: string;
  weakness: string;
}

interface CompetitorAnalysisProps {
  className?: string;
}

const CompetitorAnalysis = ({ className = '' }: CompetitorAnalysisProps) => {
  const competitors: Competitor[] = [
  {
    name: 'Starlink',
    logo: "https://images.unsplash.com/photo-1652017681821-61cd1a8ad37b",
    alt: 'Starlink satellite constellation visualization with blue orbital paths against dark space background',
    marketShare: 42,
    coverage: '75 Länder',
    avgSpeed: '150 Mbps',
    pricing: '€99/Monat',
    strength: 'Globale Abdeckung, niedrige Latenz',
    weakness: 'Hohe Anfangsinvestition'
  },
  {
    name: 'OneWeb',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_12c7fee32-1766881880765.png",
    alt: 'Satellite communication network with glowing connection nodes in orbital space',
    marketShare: 18,
    coverage: '45 Länder',
    avgSpeed: '100 Mbps',
    pricing: '€85/Monat',
    strength: 'Etablierte Partnerschaften',
    weakness: 'Begrenzte Kapazität'
  },
  {
    name: 'Amazon Kuiper',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1625c1aa0-1764716998903.png",
    alt: 'Modern satellite technology with solar panels and communication arrays in Earth orbit',
    marketShare: 12,
    coverage: '28 Länder',
    avgSpeed: '120 Mbps',
    pricing: '€79/Monat',
    strength: 'AWS-Integration',
    weakness: 'Frühe Entwicklungsphase'
  },
  {
    name: 'Traditionelle ISPs',
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_12af1efd0-1768097517640.png",
    alt: 'Fiber optic network cables with blue light transmission in data center infrastructure',
    marketShare: 28,
    coverage: 'Regional',
    avgSpeed: '200 Mbps',
    pricing: '€45/Monat',
    strength: 'Etablierte Infrastruktur',
    weakness: 'Begrenzte ländliche Abdeckung'
  }];


  return (
    <section className={`py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mb-4">
            Wettbewerbsanalyse
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Vergleichende Bewertung der wichtigsten Akteure im Satelliteninternet-Markt
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-card border border-border rounded-lg overflow-hidden shadow-depth">
            <thead className="bg-muted/30">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-headline font-bold text-foreground">Anbieter</th>
                <th className="px-6 py-4 text-left text-sm font-headline font-bold text-foreground">Marktanteil</th>
                <th className="px-6 py-4 text-left text-sm font-headline font-bold text-foreground">Abdeckung</th>
                <th className="px-6 py-4 text-left text-sm font-headline font-bold text-foreground">Geschwindigkeit</th>
                <th className="px-6 py-4 text-left text-sm font-headline font-bold text-foreground">Preis</th>
                <th className="px-6 py-4 text-left text-sm font-headline font-bold text-foreground">Stärken</th>
                <th className="px-6 py-4 text-left text-sm font-headline font-bold text-foreground">Schwächen</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((competitor, index) =>
              <tr key={index} className="border-t border-border hover:bg-muted/20 transition-smooth">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden border border-border">
                        <AppImage
                        src={competitor.logo}
                        alt={competitor.alt}
                        className="w-full h-full object-cover" />

                      </div>
                      <span className="font-cta font-semibold text-foreground">{competitor.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-muted rounded-full h-2 overflow-hidden">
                        <div
                        className="bg-primary h-full rounded-full transition-all duration-1000"
                        style={{ width: `${competitor.marketShare}%` }}>
                      </div>
                      </div>
                      <span className="text-sm font-mono text-primary">{competitor.marketShare}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{competitor.coverage}</td>
                  <td className="px-6 py-4 text-sm font-mono text-foreground">{competitor.avgSpeed}</td>
                  <td className="px-6 py-4 text-sm font-mono text-secondary">{competitor.pricing}</td>
                  <td className="px-6 py-4 text-sm text-success">{competitor.strength}</td>
                  <td className="px-6 py-4 text-sm text-warning">{competitor.weakness}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-8 bg-primary/10 border border-primary/30 rounded-lg p-6">
          <h3 className="text-lg font-headline font-bold text-primary mb-3">Wettbewerbsvorteil von Starlink</h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Größte Satellitenkonstellation mit über 5.000 aktiven Satelliten</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Niedrigste Latenz durch LEO-Umlaufbahn (Low Earth Orbit)</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Schnellste Marktexpansion mit 42% Marktanteil</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-primary mt-1">•</span>
              <span>Vertikale Integration durch SpaceX-Trägerraketen reduziert Kosten</span>
            </li>
          </ul>
        </div>
      </div>
    </section>);

};

export default CompetitorAnalysis;