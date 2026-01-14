'use client';

import InvestmentHero from './InvestmentHero';
import MarketPenetrationChart from './MarketPenetrationChart';
import FinancialProjections from './FinancialProjections';
import CompetitorAnalysis from './CompetitorAnalysis';
import RiskAssessment from './RiskAssessment';
import InvestmentCalculator from './InvestmentCalculator';
import Testimonials from './Testimonials';
import CTASection from './CTASection';
import CryptoBonusBanner from './CryptoBonusBanner';

const InvestmentAnalysisInteractive = () => {
  return (
    <>
      <InvestmentHero />
      <CryptoBonusBanner />
      <MarketPenetrationChart />
      <FinancialProjections />
      <CompetitorAnalysis />
      <RiskAssessment />
      <InvestmentCalculator />
      <Testimonials />
      <CTASection />
    </>
  );
};

export default InvestmentAnalysisInteractive;