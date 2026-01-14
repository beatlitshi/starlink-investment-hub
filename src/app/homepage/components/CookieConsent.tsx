'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

const CookieConsent = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, [isHydrated]);

  const handleAccept = () => {
    if (isHydrated) {
      localStorage.setItem('cookieConsent', 'accepted');
      setShowBanner(false);
    }
  };

  const handleDecline = () => {
    if (isHydrated) {
      localStorage.setItem('cookieConsent', 'declined');
      setShowBanner(false);
    }
  };

  if (!isHydrated || !showBanner) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-slide-in-right">
      <div className="max-w-7xl mx-auto bg-card border border-primary/30 rounded-xl shadow-depth p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start space-x-4 flex-1">
            <Icon name="InformationCircleIcon" size={24} className="text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-headline font-bold text-foreground mb-2">
                Cookie-Einstellungen
              </h3>
              <p className="text-sm text-muted-foreground font-body leading-relaxed">
                Wir verwenden Cookies, um Ihre Erfahrung zu verbessern und anonyme Nutzungsstatistiken zu sammeln. Ihre Daten werden gemäß DSGVO verarbeitet und niemals an Dritte weitergegeben.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <button
              onClick={handleDecline}
              className="px-6 py-3 border border-border text-foreground rounded-md font-cta font-bold hover:bg-muted transition-smooth whitespace-nowrap"
            >
              Ablehnen
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth whitespace-nowrap"
            >
              Akzeptieren
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;