'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

const NewsletterSignup = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail('');
      }, 3000);
    }
  };

  if (!isHydrated) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-headline font-bold text-foreground mb-4">
              Newsletter
            </h2>
            <p className="text-lg text-muted-foreground font-body">
              Laden...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 border border-primary/30 rounded-2xl p-8 md:p-12 text-center shadow-depth">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-6">
            <Icon name="EnvelopeIcon" size={32} className="text-primary" />
          </div>

          <h2 className="text-3xl md:text-4xl font-headline font-bold text-foreground mb-4">
            Bleiben Sie informiert
          </h2>
          <p className="text-lg text-muted-foreground font-body mb-8 max-w-2xl mx-auto">
            Erhalten Sie exklusive Marktanalysen, Investitionsmöglichkeiten und Experteneinblicke direkt in Ihr Postfach.
          </p>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ihre.email@beispiel.de"
                  required
                  className="flex-1 px-6 py-4 bg-card border border-border rounded-md text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-smooth font-body"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-primary text-primary-foreground rounded-md font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth whitespace-nowrap"
                >
                  Abonnieren
                </button>
              </div>
              <p className="mt-4 text-sm text-muted-foreground font-body">
                Wir respektieren Ihre Privatsphäre. Jederzeit abbestellbar.
              </p>
            </form>
          ) : (
            <div className="max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-2 text-success mb-4">
                <Icon name="CheckCircleIcon" size={32} />
                <span className="text-xl font-cta font-bold">Erfolgreich abonniert!</span>
              </div>
              <p className="text-muted-foreground font-body">
                Vielen Dank! Überprüfen Sie Ihr Postfach für die Bestätigungs-E-Mail.
              </p>
            </div>
          )}

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="flex items-start space-x-3">
              <Icon name="ChartBarIcon" size={24} className="text-primary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-headline font-bold text-foreground mb-1">
                  Marktanalysen
                </h4>
                <p className="text-sm text-muted-foreground font-body">
                  Wöchentliche Insights zu Trends
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Icon name="LightBulbIcon" size={24} className="text-secondary flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-headline font-bold text-foreground mb-1">
                  Investitionstipps
                </h4>
                <p className="text-sm text-muted-foreground font-body">
                  Expertenmeinungen und Strategien
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <Icon name="BellAlertIcon" size={24} className="text-success flex-shrink-0 mt-1" />
              <div>
                <h4 className="font-headline font-bold text-foreground mb-1">
                  Exklusive Updates
                </h4>
                <p className="text-sm text-muted-foreground font-body">
                  Frühzeitiger Zugang zu Chancen
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSignup;