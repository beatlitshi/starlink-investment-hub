interface RiskFactor {
  category: string;
  level: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
}

interface RiskAssessmentProps {
  className?: string;
}

const RiskAssessment = ({ className = '' }: RiskAssessmentProps) => {
  const riskFactors: RiskFactor[] = [
    {
      category: 'Regulatorisches Risiko',
      level: 'medium',
      description: 'Änderungen in Telekommunikationsvorschriften und Frequenzzuweisungen',
      mitigation: 'Starlink arbeitet aktiv mit Regulierungsbehörden in 75 Ländern zusammen'
    },
    {
      category: 'Technologisches Risiko',
      level: 'low',
      description: 'Satellitenausfälle oder technische Störungen',
      mitigation: 'Redundante Satellitenkonstellation mit automatischem Failover-System'
    },
    {
      category: 'Wettbewerbsrisiko',
      level: 'medium',
      description: 'Neue Marktteilnehmer wie Amazon Kuiper und OneWeb',
      mitigation: 'First-Mover-Vorteil mit 42% Marktanteil und etablierter Infrastruktur'
    },
    {
      category: 'Marktrisiko',
      level: 'low',
      description: 'Schwankungen in der Nachfrage nach Satelliteninternet',
      mitigation: 'Diversifizierte Kundenbasis: Privat, Unternehmen, Regierung, Maritime'
    },
    {
      category: 'Finanzierungsrisiko',
      level: 'low',
      description: 'Kapitalbedarf für weitere Satellitenproduktion',
      mitigation: 'Positive Cashflow-Entwicklung und SpaceX-Unterstützung'
    },
    {
      category: 'Geopolitisches Risiko',
      level: 'medium',
      description: 'Internationale Spannungen und Exportbeschränkungen',
      mitigation: 'Lokale Partnerschaften und regionale Lizenzierungsstrategien'
    }
  ];

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'text-success border-success bg-success/10';
      case 'medium': return 'text-warning border-warning bg-warning/10';
      case 'high': return 'text-error border-error bg-error/10';
      default: return 'text-muted-foreground border-border bg-muted/10';
    }
  };

  const getRiskLabel = (level: string) => {
    switch (level) {
      case 'low': return 'NIEDRIG';
      case 'medium': return 'MITTEL';
      case 'high': return 'HOCH';
      default: return 'UNBEKANNT';
    }
  };

  return (
    <section className={`py-16 bg-muted/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mb-4">
            Risikobewertung
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Umfassende Analyse der Investitionsrisiken und Minderungsstrategien
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {riskFactors.map((risk, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-depth hover:border-primary/50 transition-smooth">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-headline font-bold text-foreground">{risk.category}</h3>
                <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${getRiskColor(risk.level)}`}>
                  {getRiskLabel(risk.level)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{risk.description}</p>
              <div className="bg-muted/30 rounded-lg p-4 border-l-4 border-primary">
                <p className="text-xs font-mono text-primary mb-1">MINDERUNGSSTRATEGIE</p>
                <p className="text-sm text-foreground">{risk.mitigation}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-depth">
          <h3 className="text-xl font-headline font-bold text-foreground mb-6 text-center">
            Gesamtrisikoprofil
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-success flex items-center justify-center">
                <span className="text-3xl font-headline font-bold text-success">33%</span>
              </div>
              <p className="text-sm font-mono text-success mb-1">NIEDRIGES RISIKO</p>
              <p className="text-xs text-muted-foreground">2 von 6 Faktoren</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-warning flex items-center justify-center">
                <span className="text-3xl font-headline font-bold text-warning">50%</span>
              </div>
              <p className="text-sm font-mono text-warning mb-1">MITTLERES RISIKO</p>
              <p className="text-xs text-muted-foreground">3 von 6 Faktoren</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-4 rounded-full border-4 border-error flex items-center justify-center">
                <span className="text-3xl font-headline font-bold text-error">17%</span>
              </div>
              <p className="text-sm font-mono text-error mb-1">HOHES RISIKO</p>
              <p className="text-xs text-muted-foreground">1 von 6 Faktoren</p>
            </div>
          </div>
          <div className="mt-8 bg-primary/10 border border-primary/30 rounded-lg p-6">
            <p className="text-sm text-center text-muted-foreground">
              <span className="font-bold text-primary">Gesamtbewertung:</span> Das Risikoprofil von Starlink-Investitionen wird als <span className="font-bold text-warning">moderat</span> eingestuft, mit robusten Minderungsstrategien für alle identifizierten Risikofaktoren.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RiskAssessment;