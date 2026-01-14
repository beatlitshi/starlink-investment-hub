import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import HomepageInteractive from './components/HomepageInteractive';

export const metadata: Metadata = {
  title: 'StarLink Investment Hub - Das digitale Tor zu Investitionen in die Weltraumwirtschaft',
  description: 'Entdecken Sie die Zukunft der globalen Konnektivität durch Satelliten-Infrastruktur. Erhalten Sie exklusive Marktanalysen, Investitionsmöglichkeiten und Experteneinblicke in die Starlink-Technologie.',
};

export default function Homepage() {
  return (
    <>
      <Header />
      <main className="pt-16">
        <HomepageInteractive />
      </main>
    </>
  );
}