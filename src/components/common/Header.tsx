'use client';

import { useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  className?: string;
}

const Header = ({ className = '' }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout, isLoading } = useUserAuth() as any;
  const router = useRouter();

  const navigationItems = [
    { name: 'Home', path: '/homepage', icon: 'HomeIcon' },
    { name: 'Investment Analysis', path: '/investment-analysis', icon: 'ChartBarIcon' },
    { name: 'Market Dashboard', path: '/market-dashboard', icon: 'PresentationChartLineIcon' },
    { name: 'Partnership Portal', path: '/partnership-portal', icon: 'UserGroupIcon' },
    { name: 'Personal Dashboard', path: '/personal-dashboard', icon: 'UserCircleIcon' },
    { name: 'Admin', path: '/admin-dashboard', icon: 'ShieldCheckIcon' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 bg-card shadow-depth ${className}`}>
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        <Link href="/homepage" className="flex items-center space-x-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-50 group-hover:opacity-75 transition-opacity"></div>
            <svg
              className="relative w-10 h-10"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" className="text-primary" />
              <circle cx="20" cy="20" r="12" fill="currentColor" className="text-primary" />
              <circle cx="20" cy="8" r="2" fill="currentColor" className="text-secondary animate-pulse" />
              <circle cx="32" cy="20" r="2" fill="currentColor" className="text-secondary animate-pulse" style={{ animationDelay: '0.3s' }} />
              <circle cx="20" cy="32" r="2" fill="currentColor" className="text-secondary animate-pulse" style={{ animationDelay: '0.6s' }} />
              <circle cx="8" cy="20" r="2" fill="currentColor" className="text-secondary animate-pulse" style={{ animationDelay: '0.9s' }} />
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

        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className="flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-cta font-semibold text-muted-foreground hover:text-primary hover:bg-muted transition-smooth group"
            >
              <Icon name={item.icon as any} size={20} className="group-hover:text-primary transition-smooth" />
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center space-x-4">
          {isLoading ? (
            <span className="text-sm text-muted-foreground">Loading...</span>
          ) : isAuthenticated ? (
            <>
              <span className="text-sm text-muted-foreground">
                Welcome, {user?.firstName}
              </span>
              <Link
                href="/personal-dashboard"
                className="px-4 py-2 text-sm font-cta font-semibold text-foreground hover:text-primary transition-smooth"
              >
                Dashboard
              </Link>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-cta font-semibold text-foreground hover:text-primary transition-smooth"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-cta font-semibold text-foreground hover:text-primary transition-smooth"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth animate-pulse-glow"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <button
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 rounded-md text-foreground hover:text-primary hover:bg-muted transition-smooth"
          aria-label="Toggle mobile menu"
        >
          <Icon name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'} size={24} />
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="lg:hidden bg-card border-t border-border animate-slide-in-right">
          <nav className="flex flex-col p-4 space-y-2">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-md text-sm font-cta font-semibold text-muted-foreground hover:text-primary hover:bg-muted transition-smooth"
              >
                <Icon name={item.icon as any} size={20} />
                <span>{item.name}</span>
              </Link>
            ))}
            <div className="pt-4 space-y-2 border-t border-border">
              {isLoading ? (
                <span className="block px-4 py-2 text-sm text-muted-foreground">Loading...</span>
              ) : isAuthenticated ? (
                <>
                  <span className="block px-4 py-2 text-sm text-muted-foreground">
                    Welcome, {user?.firstName}
                  </span>
                  <Link
                    href="/personal-dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-sm font-cta font-semibold text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                      router.push('/homepage');
                    }}
                    className="w-full px-4 py-3 text-sm font-cta font-semibold text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth text-left"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-sm font-cta font-semibold text-foreground hover:text-primary hover:bg-muted rounded-md transition-smooth"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-md text-sm font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;