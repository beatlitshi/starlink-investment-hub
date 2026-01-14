'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';

interface TechFeature {
  id: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  stats: {label: string;value: string;}[];
}

const TechnologyShowcase = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const features: TechFeature[] = [
  {
    id: 'satellites',
    title: 'Satelliten-Konstellation',
    description: 'Über 5.000 aktive Satelliten in niedriger Erdumlaufbahn (LEO) sorgen für globale Abdeckung mit minimaler Latenz. Die Konstellation wächst kontinuierlich mit regelmäßigen Starts.',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_18f77f544-1766400233926.png",
    alt: 'Satellite constellation orbiting Earth with blue glow against dark space background',
    stats: [
    { label: 'Aktive Satelliten', value: '5.000+' },
    { label: 'Umlaufhöhe', value: '550 km' },
    { label: 'Orbitalgeschwindigkeit', value: '27.000 km/h' }]

  },
  {
    id: 'ground',
    title: 'Bodenstationen',
    description: 'Strategisch platzierte Bodenstationen weltweit ermöglichen nahtlose Konnektivität zwischen Satelliten und terrestrischen Netzwerken für optimale Datenübertragung.',
    image: "https://images.unsplash.com/photo-1591629974568-f7c0983d12f2",
    alt: 'Modern satellite ground station with large white dish antenna against clear blue sky',
    stats: [
    { label: 'Globale Stationen', value: '200+' },
    { label: 'Kontinente', value: '6' },
    { label: 'Redundanz', value: '99.9%' }]

  },
  {
    id: 'terminals',
    title: 'Nutzer-Terminals',
    description: 'Kompakte, benutzerfreundliche Terminals ermöglichen einfache Installation und Hochgeschwindigkeits-Internet-Zugang überall auf der Welt, auch in abgelegenen Gebieten.',
    image: "https://images.unsplash.com/photo-1554483873-5cf930715299",
    alt: 'Futuristic white satellite dish terminal on rooftop with city skyline in background',
    stats: [
    { label: 'Download-Speed', value: 'Bis 350 Mbps' },
    { label: 'Latenz', value: '20-40 ms' },
    { label: 'Installationszeit', value: '< 30 Min.' }]

  }];


  useEffect(() => {
    if (!isHydrated) return;

    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isHydrated, features.length]);

  if (!isHydrated) {
    return (
      <section className="py-20 bg-gradient-to-b from-card to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-headline font-bold text-foreground mb-4">
              Technologie-Übersicht
            </h2>
            <p className="text-xl text-muted-foreground font-body">
              Laden...
            </p>
          </div>
        </div>
      </section>);

  }

  return (
    <section className="py-20 bg-gradient-to-b from-card to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-bold text-foreground mb-4">
            Revolutionäre Satelliten-Technologie
          </h2>
          <p className="text-xl text-muted-foreground font-body">
            Entdecken Sie die Infrastruktur hinter der globalen Konnektivität
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="order-2 lg:order-1">
            <div className="flex space-x-2 mb-6">
              {features.map((feature, index) =>
              <button
                key={feature.id}
                onClick={() => setActiveFeature(index)}
                className={`flex-1 px-4 py-3 rounded-md font-cta font-bold transition-smooth ${
                activeFeature === index ?
                'bg-primary text-primary-foreground shadow-glow-primary' :
                'bg-muted text-muted-foreground hover:bg-muted/80'}`
                }>

                  {feature.title}
                </button>
              )}
            </div>

            <div className="bg-card border border-border rounded-xl p-8 shadow-depth">
              <h3 className="text-2xl font-headline font-bold text-foreground mb-4">
                {features[activeFeature].title}
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed mb-6">
                {features[activeFeature].description}
              </p>

              <div className="grid grid-cols-3 gap-4">
                {features[activeFeature].stats.map((stat, index) =>
                <div key={index} className="text-center">
                    <p className="text-2xl font-headline font-bold text-primary mb-1">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground font-body">
                      {stat.label}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="relative aspect-square rounded-2xl overflow-hidden border border-border shadow-depth">
              <AppImage
                src={features[activeFeature].image}
                alt={features[activeFeature].alt}
                className="w-full h-full object-cover" />

              <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="flex items-center space-x-2 text-primary">
                  <Icon name="CheckBadgeIcon" size={24} />
                  <span className="font-cta font-bold">Verifizierte Technologie</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-smooth">
            <Icon name="BoltIcon" size={40} className="text-primary mx-auto mb-4" />
            <h4 className="text-lg font-headline font-bold text-foreground mb-2">
              Hochgeschwindigkeit
            </h4>
            <p className="text-sm text-muted-foreground font-body">
              Bis zu 350 Mbps Download
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-smooth">
            <Icon name="ClockIcon" size={40} className="text-secondary mx-auto mb-4" />
            <h4 className="text-lg font-headline font-bold text-foreground mb-2">
              Niedrige Latenz
            </h4>
            <p className="text-sm text-muted-foreground font-body">
              20-40ms Reaktionszeit
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-smooth">
            <Icon name="GlobeAltIcon" size={40} className="text-success mx-auto mb-4" />
            <h4 className="text-lg font-headline font-bold text-foreground mb-2">
              Globale Reichweite
            </h4>
            <p className="text-sm text-muted-foreground font-body">
              145+ Länder abgedeckt
            </p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center hover:border-primary transition-smooth">
            <Icon name="ShieldCheckIcon" size={40} className="text-accent mx-auto mb-4" />
            <h4 className="text-lg font-headline font-bold text-foreground mb-2">
              Zuverlässigkeit
            </h4>
            <p className="text-sm text-muted-foreground font-body">
              99.9% Verfügbarkeit
            </p>
          </div>
        </div>
      </div>
    </section>);

};

export default TechnologyShowcase;