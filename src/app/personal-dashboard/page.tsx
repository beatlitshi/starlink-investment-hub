import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import PersonalDashboardInteractive from './components/PersonalDashboardInteractive';

export const metadata: Metadata = {
  title: 'Persönliches Dashboard - StarLink Investment Hub',
  description: 'Verwalten Sie Ihre Starlink-Investitionen mit personalisierten Tracking-Tools, Echtzeit-Analysen, Zielverfolgung und Steuerberichten auf Ihrem persönlichen Investment-Dashboard.',
};

export default function PersonalDashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <PersonalDashboardInteractive />
        </div>
      </main>

      <footer className="bg-card border-t border-border py-8 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-50"></div>
                <svg
                  className="relative w-8 h-8"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <circle cx="20" cy="20" r="12" fill="currentColor" className="text-primary" />
                </svg>
              </div>
              <span className="text-sm font-headline font-bold text-foreground">StarLink Investment Hub</span>
            </div>
            
            <p className="text-xs font-mono text-muted-foreground">
              © {new Date().getFullYear()} StarLink Investment Hub. Alle Rechte vorbehalten.
            </p>
            
            <div className="flex items-center space-x-4">
              <a href="#" className="text-xs font-mono text-muted-foreground hover:text-primary transition-smooth">
                Datenschutz
              </a>
              <a href="#" className="text-xs font-mono text-muted-foreground hover:text-primary transition-smooth">
                Impressum
              </a>
              <a href="#" className="text-xs font-mono text-muted-foreground hover:text-primary transition-smooth">
                GDPR
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}