'use client';

import { useRef } from 'react';
import HeroSection from './HeroSection';
import SatelliteVisualization from './SatelliteVisualization';
import MarketOpportunity from './MarketOpportunity';
import TechnologyShowcase from './TechnologyShowcase';
import InvestmentHighlights from './InvestmentHighlights';
import NewsletterSignup from './NewsletterSignup';
import Footer from './Footer';
import CookieConsent from './CookieConsent';

const HomepageInteractive = () => {
  const satelliteRef = useRef<HTMLDivElement>(null);

  const handleExploreClick = () => {
    satelliteRef?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <HeroSection onExploreClick={handleExploreClick} />
      <div ref={satelliteRef}>
        <SatelliteVisualization />
      </div>
      <MarketOpportunity />
      <TechnologyShowcase />
      <InvestmentHighlights />
      <NewsletterSignup />
      <Footer />
      <CookieConsent />
    </>
  );
};

export default HomepageInteractive;