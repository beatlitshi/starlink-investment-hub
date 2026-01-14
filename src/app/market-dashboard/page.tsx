import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import MarketDashboardInteractive from './components/MarketDashboardInteractive';

export const metadata: Metadata = {
  title: 'Markt-Dashboard - StarLink Investment Hub',
  description: 'Echtzeit-Marktdaten, Trends und Wettbewerbsanalyse für Satelliteninternet-Investitionen. Verfolgen Sie Starlink-Marktanteile, Abonnentenwachstum und Branchenentwicklungen.',
};

export default function MarketDashboardPage() {
  return (
    <>
      <Header />
      <MarketDashboardInteractive />
    </>
  );
}