import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import InvestmentAnalysisInteractive from './components/InvestmentAnalysisInteractive';

export const metadata: Metadata = {
  title: 'Investment Analysis - StarLink Investment Hub',
  description: 'Comprehensive Starlink investment opportunity analysis with interactive data visualization, market penetration insights, financial projections, competitor analysis, and risk assessment for informed investment decisions.',
};

export default function InvestmentAnalysisPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <InvestmentAnalysisInteractive />
      </main>
    </div>
  );
}