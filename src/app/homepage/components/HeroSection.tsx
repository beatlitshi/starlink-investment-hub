'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface HeroSectionProps {
  onExploreClick: () => void;
}

const HeroSection = ({ onExploreClick }: HeroSectionProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [stars, setStars] = useState<Array<{ top: number; left: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    setIsHydrated(true);
    setStars(
      Array.from({ length: 50 }, () => ({
        top: Math.random() * 100,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 2 + Math.random() * 3,
      }))
    );
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isHydrated]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-card to-background">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(0, 191, 255, 0.1) 0%, transparent 50%)`,
          transform: isHydrated ? `translate(${mousePosition.x}px, ${mousePosition.y}px)` : 'translate(0, 0)',
          transition: 'transform 0.3s ease-out',
        }}
      />

      <div className="absolute inset-0">
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary rounded-full animate-pulse"
            style={{
              top: `${star.top}%`,
              left: `${star.left}%`,
              animationDelay: `${star.delay}s`,
              animationDuration: `${star.duration}s`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-8 inline-block">
          <div className="relative">
            <div className="absolute inset-0 bg-primary rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <svg
              className="relative w-32 h-32 mx-auto"
              viewBox="0 0 128 128"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="64" cy="64" r="60" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <circle cx="64" cy="64" r="45" stroke="currentColor" strokeWidth="1" className="text-primary opacity-50" />
              <circle cx="64" cy="64" r="30" fill="currentColor" className="text-primary opacity-80" />
              <circle cx="64" cy="20" r="4" fill="currentColor" className="text-secondary animate-pulse" />
              <circle cx="104" cy="64" r="4" fill="currentColor" className="text-secondary animate-pulse" style={{ animationDelay: '0.3s' }} />
              <circle cx="64" cy="108" r="4" fill="currentColor" className="text-secondary animate-pulse" style={{ animationDelay: '0.6s' }} />
              <circle cx="24" cy="64" r="4" fill="currentColor" className="text-secondary animate-pulse" style={{ animationDelay: '0.9s' }} />
              <circle cx="92" cy="36" r="3" fill="currentColor" className="text-accent animate-pulse" style={{ animationDelay: '0.2s' }} />
              <circle cx="92" cy="92" r="3" fill="currentColor" className="text-accent animate-pulse" style={{ animationDelay: '0.5s' }} />
              <circle cx="36" cy="92" r="3" fill="currentColor" className="text-accent animate-pulse" style={{ animationDelay: '0.8s' }} />
              <circle cx="36" cy="36" r="3" fill="currentColor" className="text-accent animate-pulse" style={{ animationDelay: '1.1s' }} />
            </svg>
          </div>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-headline font-bold text-foreground mb-6 tracking-tight">
          Willkommen bei{' '}
          <span className="text-primary text-glow-primary">StarLink</span>
          <br />
          <span className="text-secondary text-glow-secondary">Investment Hub</span>
        </h1>

        <p className="text-xl sm:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto font-body">
          Das digitale Tor zu Investitionen in die Weltraumwirtschaft. Entdecken Sie die Zukunft der globalen Konnektivität durch Satelliten-Infrastruktur.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <button
            onClick={onExploreClick}
            className="group px-8 py-4 bg-primary text-primary-foreground rounded-md text-lg font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth flex items-center space-x-2"
          >
            <span>Jetzt erkunden</span>
            <Icon name="ArrowRightIcon" size={20} className="group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 border-2 border-primary text-primary rounded-md text-lg font-cta font-bold hover:bg-primary hover:text-primary-foreground transition-smooth">
            Mehr erfahren
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary transition-smooth">
            <Icon name="GlobeAltIcon" size={40} className="text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-headline font-bold text-foreground mb-2">145+</h3>
            <p className="text-muted-foreground font-body">Länder abgedeckt</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary transition-smooth">
            <Icon name="RocketLaunchIcon" size={40} className="text-secondary mx-auto mb-4" />
            <h3 className="text-2xl font-headline font-bold text-foreground mb-2">5.000+</h3>
            <p className="text-muted-foreground font-body">Aktive Satelliten</p>
          </div>
          <div className="bg-card/50 backdrop-blur-sm border border-border rounded-lg p-6 hover:border-primary transition-smooth">
            <Icon name="ChartBarIcon" size={40} className="text-success mx-auto mb-4" />
            <h3 className="text-2xl font-headline font-bold text-foreground mb-2">€42Mrd</h3>
            <p className="text-muted-foreground font-body">Marktpotenzial 2030</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Icon name="ChevronDownIcon" size={32} className="text-primary" />
      </div>
    </section>
  );
};

export default HeroSection;