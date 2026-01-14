

interface InvestmentHeroProps {
  className?: string;
}

const InvestmentHero = ({ className = '' }: InvestmentHeroProps) => {
  return (
    <section className={`relative min-h-[60vh] flex items-center justify-center overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-primary/10 border border-primary/30 rounded-full mb-6 animate-slide-in-top">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span className="text-sm font-mono text-primary tracking-wider">LIVE MARKET ANALYSIS</span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-headline font-bold text-foreground mb-6 animate-fade-in">
          Starlink Investment
          <span className="block text-primary text-glow-primary mt-2">Opportunity Analysis</span>
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Comprehensive breakdown of investment potential with interactive data visualization and real-time market intelligence
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <button className="px-8 py-4 bg-primary text-primary-foreground rounded-md font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth animate-pulse-glow">
            Explore Investment Data
          </button>
          <button className="px-8 py-4 bg-transparent border-2 border-primary text-primary rounded-md font-cta font-bold hover:bg-primary/10 transition-smooth">
            Download PDF Report
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-4xl mx-auto">
          {[
            { label: 'Market Cap', value: '€127,5 Mrd.', change: '+23,4%' },
            { label: 'Growth Rate', value: '156%', change: 'YoY' },
            { label: 'Active Users', value: '4,2M', change: '+89%' },
            { label: 'Coverage', value: '75 Länder', change: '+12' }
          ].map((stat, index) => (
            <div key={index} className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-4 hover:border-primary/50 transition-smooth">
              <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
              <p className="text-2xl font-headline font-bold text-foreground mb-1">{stat.value}</p>
              <p className="text-xs text-success font-mono">{stat.change}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default InvestmentHero;