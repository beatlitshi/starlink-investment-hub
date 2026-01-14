import Icon from '@/components/ui/AppIcon';

interface Highlight {
  icon: string;
  title: string;
  description: string;
  color: string;
}

const InvestmentHighlights = () => {
  const highlights: Highlight[] = [
    {
      icon: 'ShieldCheckIcon',
      title: 'Unabhängige Analyse',
      description: 'Objektive Marktforschung ohne Interessenkonflikte. Alle Daten werden aus verifizierten Drittquellen bezogen.',
      color: 'text-primary',
    },
    {
      icon: 'ChartBarSquareIcon',
      title: 'Echtzeit-Daten',
      description: 'Live-Marktdaten und Trends aus der Satelliten-Internet-Industrie mit minutengenauer Aktualisierung.',
      color: 'text-secondary',
    },
    {
      icon: 'AcademicCapIcon',
      title: 'Bildungsressourcen',
      description: 'Umfassende Lernmaterialien zu Weltraumwirtschaft, Satellitentechnologie und Investitionsstrategien.',
      color: 'text-success',
    },
    {
      icon: 'UserGroupIcon',
      title: 'Geprüfte Partner',
      description: 'Zugang zu verifizierten Investitionsplattformen mit vollständiger regulatorischer Compliance.',
      color: 'text-accent',
    },
    {
      icon: 'DocumentTextIcon',
      title: 'Transparente Methodik',
      description: 'Detaillierte Erklärungen unserer Analysemethoden und Datenquellen für vollständige Nachvollziehbarkeit.',
      color: 'text-warning',
    },
    {
      icon: 'LockClosedIcon',
      title: 'DSGVO-konform',
      description: 'Vollständige Einhaltung europäischer Datenschutzstandards mit transparenter Datenverarbeitung.',
      color: 'text-primary',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-bold text-foreground mb-4">
            Warum StarLink Investment Hub?
          </h2>
          <p className="text-xl text-muted-foreground font-body max-w-3xl mx-auto">
            Ihre vertrauenswürdige Quelle für Investitionsintelligenz in der Weltraumwirtschaft
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <div
              key={index}
              className="group bg-card border border-border rounded-xl p-6 hover:border-primary transition-smooth hover:shadow-glow-primary"
            >
              <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/20 transition-smooth`}>
                  <Icon name={highlight.icon as any} size={24} className={highlight.color} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-headline font-bold text-foreground mb-2">
                    {highlight.title}
                  </h3>
                  <p className="text-muted-foreground font-body leading-relaxed">
                    {highlight.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 border border-primary/30 rounded-2xl p-8 text-center">
          <Icon name="SparklesIcon" size={48} className="text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-headline font-bold text-foreground mb-4">
            Bereit, die Zukunft zu erkunden?
          </h3>
          <p className="text-lg text-muted-foreground font-body mb-6 max-w-2xl mx-auto">
            Erhalten Sie exklusiven Zugang zu detaillierten Marktanalysen, Investitionsmöglichkeiten und Experteneinblicken.
          </p>
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-md text-lg font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth">
            Kostenlos registrieren
          </button>
        </div>
      </div>
    </section>
  );
};

export default InvestmentHighlights;