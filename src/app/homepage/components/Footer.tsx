'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const Footer = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [currentYear, setCurrentYear] = useState('2026');

  useEffect(() => {
    setIsHydrated(true);
    setCurrentYear(new Date().getFullYear().toString());
  }, []);

  const footerLinks = {
    platform: [
      { name: 'Startseite', path: '/homepage' },
      { name: 'Investitionsanalyse', path: '/investment-analysis' },
      { name: 'Markt-Dashboard', path: '/market-dashboard' },
      { name: 'Partner-Portal', path: '/partnership-portal' },
    ],
    resources: [
      { name: 'Über uns', path: '#' },
      { name: 'Bildungszentrum', path: '#' },
      { name: 'Forschungsberichte', path: '#' },
      { name: 'FAQ', path: '#' },
    ],
    legal: [
      { name: 'Datenschutz', path: '#' },
      { name: 'Nutzungsbedingungen', path: '#' },
      { name: 'Impressum', path: '#' },
      { name: 'Cookie-Richtlinie', path: '#' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: 'AtSymbolIcon', url: '#' },
    { name: 'LinkedIn', icon: 'BuildingOfficeIcon', url: '#' },
    { name: 'GitHub', icon: 'CodeBracketIcon', url: '#' },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          <div className="lg:col-span-2">
            <Link href="/homepage" className="flex items-center space-x-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-50"></div>
                <svg
                  className="relative w-10 h-10"
                  viewBox="0 0 40 40"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" className="text-primary" />
                  <circle cx="20" cy="20" r="12" fill="currentColor" className="text-primary" />
                  <circle cx="20" cy="8" r="2" fill="currentColor" className="text-secondary" />
                  <circle cx="32" cy="20" r="2" fill="currentColor" className="text-secondary" />
                  <circle cx="20" cy="32" r="2" fill="currentColor" className="text-secondary" />
                  <circle cx="8" cy="20" r="2" fill="currentColor" className="text-secondary" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-headline font-bold text-foreground tracking-wider">
                  StarLink
                </span>
                <span className="text-xs font-mono text-primary tracking-widest">
                  INVESTMENT HUB
                </span>
              </div>
            </Link>
            <p className="text-muted-foreground font-body leading-relaxed mb-4">
              Ihre vertrauenswürdige Quelle für unabhängige Investitionsintelligenz in der Satelliten-Internet-Industrie.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-smooth"
                  aria-label={social.name}
                >
                  <Icon name={social.icon as any} size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-headline font-bold text-foreground mb-4">
              Plattform
            </h3>
            <ul className="space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-muted-foreground hover:text-primary transition-smooth font-body"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-headline font-bold text-foreground mb-4">
              Ressourcen
            </h3>
            <ul className="space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-muted-foreground hover:text-primary transition-smooth font-body"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-headline font-bold text-foreground mb-4">
              Rechtliches
            </h3>
            <ul className="space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.path}
                    className="text-muted-foreground hover:text-primary transition-smooth font-body"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-muted-foreground font-body">
              © {isHydrated ? currentYear : '2026'} StarLink Investment Hub. Alle Rechte vorbehalten.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground font-body">
                <Icon name="ShieldCheckIcon" size={16} className="text-success" />
                <span>DSGVO-konform</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground font-body">
                <Icon name="LockClosedIcon" size={16} className="text-primary" />
                <span>SSL-gesichert</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;