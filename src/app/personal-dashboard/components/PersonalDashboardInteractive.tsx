'use client';

import { useState, useEffect } from 'react';
import PortfolioOverview from './PortfolioOverview';
import InvestmentCard from './InvestmentCard';
import PerformanceChart from './PerformanceChart';
import AllocationChart from './AllocationChart';
import AlertsPanel from './AlertsPanel';
import GoalsTracker from './GoalsTracker';
import RiskAssessment from './RiskAssessment';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import TaxReporting from './TaxReporting';
import AIAdvisor from './AIAdvisor';
import SocialCopyTrading from './SocialCopyTrading';
import AdvancedPortfolioAnalytics from './AdvancedPortfolioAnalytics';
import StockTradingPanel from './StockTradingPanel';
import WithdrawPanel from './WithdrawPanel';
import CryptoDepositPanel from './CryptoDepositPanel';
import TransactionHistory from './TransactionHistory';
import FixedDepositPanel from './FixedDepositPanel';
import Icon from '@/components/ui/AppIcon';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { supabase } from '@/lib/supabase';

interface Investment {
  id: string;
  name: string;
  symbol: string;
  image: string;
  alt: string;
  currentValue: number;
  invested: number;
  shares: number;
  returnAmount: number;
  returnPercentage: number;
  dayChange: number;
  dayChangePercentage: number;
  isCrypto?: boolean;
  cryptoBonus?: number;
}

interface Alert {
  id: string;
  type: 'price' | 'news' | 'goal' | 'risk';
  title: string;
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
}

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface Activity {
  id: string;
  type: 'buy' | 'sell' | 'dividend' | 'alert' | 'deposit' | 'withdrawal' | 'crypto_bonus';
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
}

interface TaxReport {
  year: number;
  totalGains: number;
  totalLosses: number;
  netGains: number;
  dividends: number;
  taxableAmount: number;
  estimatedTax: number;
}

export default function PersonalDashboardInteractive() {
  const { user, refreshBalance, isLoading: authLoading } = useUserAuth();
  const [isHydrated, setIsHydrated] = useState(false);
  
  const [alerts] = useState<Alert[]>([
    {
      id: '1',
      type: 'price',
      title: 'Preisalarm: Starlink Aktie',
      message: 'Starlink Aktie hat Ihr Zielpreis von 150,00 € erreicht',
      timestamp: '12.01.2026, 14:30',
      priority: 'high',
      read: false
    },
    {
      id: '2',
      type: 'goal',
      title: 'Ziel erreicht!',
      message: 'Sie haben Ihr Sparziel "Notfallfonds" zu 100% erreicht',
      timestamp: '12.01.2026, 10:15',
      priority: 'medium',
      read: false
    },
    {
      id: '3',
      type: 'news',
      title: 'Marktupdate',
      message: 'Neue Regulierungen für Satelliten-Internet angekündigt',
      timestamp: '11.01.2026, 16:45',
      priority: 'low',
      read: true
    }
  ]);
  
  const [goals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Altersvorsorge',
      targetAmount: 500000,
      currentAmount: 125000,
      deadline: '31.12.2045',
      category: 'Langfristig'
    },
    {
      id: '2',
      title: 'Immobilienkauf',
      targetAmount: 100000,
      currentAmount: 45000,
      deadline: '31.12.2028',
      category: 'Mittelfristig'
    },
    {
      id: '3',
      title: 'Notfallfonds',
      targetAmount: 20000,
      currentAmount: 20000,
      deadline: '31.12.2026',
      category: 'Kurzfristig'
    }
  ]);
  
  const [selectedView, setSelectedView] = useState<'overview' | 'investments' | 'analytics' | 'goals' | 'tax' | 'ai' | 'social' | 'advanced' | 'trading' | 'withdraw' | 'crypto-deposit' | 'history' | 'fixed-deposit'>('overview');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Refresh balance only when view changes (not on every render)
  useEffect(() => {
    if (user && selectedView === 'overview') {
      // Only refresh when coming to overview tab
      refreshBalance();
    }
  }, [selectedView, user, refreshBalance]);

  // Do NOT refresh on tab visibility - it causes flicker
  // Just let the balance stay stable from initial load

  // Wait for auth to load before showing content
  if (authLoading || !isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-mono">Lade Dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show a message (user should be redirected by route protection)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground font-body text-lg">Nicht authentifiziert</p>
          <p className="text-muted-foreground font-body">Bitte melden Sie sich an, um auf das Dashboard zuzugreifen.</p>
        </div>
      </div>
    );
  }

  const investments: Investment[] = user?.investments || [];

  const portfolioData = {
    totalValue: (user?.balance || 0) + investments.reduce((sum, inv) => sum + (inv.currentValue * inv.shares), 0),
    totalInvestment: investments.reduce((sum, inv) => sum + inv.invested, 0),
    totalReturn: investments.reduce((sum, inv) => sum + inv.returnAmount, 0),
    returnPercentage: investments.length > 0 ? (investments.reduce((sum, inv) => sum + inv.returnAmount, 0) / investments.reduce((sum, inv) => sum + inv.invested, 0)) * 100 : 0,
    dayChange: investments.reduce((sum, inv) => sum + inv.dayChange, 0),
    dayChangePercentage: investments.length > 0 ? (investments.reduce((sum, inv) => sum + inv.dayChange, 0) / investments.reduce((sum, inv) => sum + (inv.currentValue * inv.shares), 0)) * 100 : 0,
    cryptoBonus: investments.filter(inv => inv.isCrypto).reduce((sum, inv) => sum + (inv.cryptoBonus || 0), 0),
    cashBalance: user?.balance || 0,
  };


  const performanceData = [
    // Initial performance data - starts at 0
    { date: '01.01', value: 0, invested: 0 }
  ];


  const allocationData = [
    // No allocations initially
  ];


  const riskMetrics = [
  { category: 'Volatilität', score: 65, maxScore: 100 },
  { category: 'Diversifikation', score: 72, maxScore: 100 },
  { category: 'Liquidität', score: 85, maxScore: 100 },
  { category: 'Marktrisiko', score: 58, maxScore: 100 },
  { category: 'Branchenrisiko', score: 45, maxScore: 100 }];


  const activities: Activity[] = [
  {
    id: '1',
    type: 'buy',
    title: 'Kauf: Starlink Global',
    description: '50 Anteile zu je 150,00 €',
    amount: -7500.00,
    timestamp: '12.01.2026, 09:30'
  },
  {
    id: '2',
    type: 'crypto_bonus',
    title: 'Crypto Bonus erhalten',
    description: '8% TAX-FREE Bonus auf Starlink Stocks',
    amount: 8000.00,
    timestamp: '12.01.2026, 09:35'
  },
  {
    id: '3',
    type: 'dividend',
    title: 'Dividende: SpaceX Ventures',
    description: 'Quartalsdividende ausgezahlt',
    amount: 437.50,
    timestamp: '11.01.2026, 14:20'
  },
  {
    id: '4',
    type: 'deposit',
    title: 'Einzahlung',
    description: 'Kontoaufladung durch Admin',
    amount: 25000.00,
    timestamp: '10.01.2026, 10:15'
  }];


  const quickActions = [
  {
    id: '1',
    label: 'Buy Stocks',
    icon: 'PlusCircleIcon',
    color: 'primary',
    onClick: () => setSelectedView('trading')
  },
  {
    id: '2',
    label: 'Withdraw',
    icon: 'BanknotesIcon',
    color: 'secondary',
    onClick: () => setSelectedView('withdraw')
  },
  {
    id: '3',
    label: 'Crypto Deposit',
    icon: 'CurrencyDollarIcon',
    color: 'success',
    onClick: () => setSelectedView('crypto-deposit')
  },
  {
    id: '4',
    label: 'Calendar',
    icon: 'CalendarIcon',
    color: 'primary',
    onClick: () => window.location.href = '/calendar'
  },
  {
    id: '5',
    label: 'AI Advisor',
    icon: 'SparklesIcon',
    color: 'primary',
    onClick: () => setSelectedView('ai')
  },
  {
    id: '6',
    label: 'Social Trading',
    icon: 'UserGroupIcon',
    color: 'secondary',
    onClick: () => setSelectedView('social')
  },
  {
    id: '7',
    label: 'Analytics',
    icon: 'ChartBarIcon',
    color: 'primary',
    onClick: () => setSelectedView('advanced')
  },
  {
    id: '8',
    label: 'Tax Reports',
    icon: 'DocumentTextIcon',
    color: 'warning',
    onClick: () => setSelectedView('tax')
  }];


  const taxReports: TaxReport[] = [
  {
    year: 2025,
    totalGains: 42500.00,
    totalLosses: -5000.00,
    netGains: 37500.00,
    dividends: 3500.00,
    taxableAmount: 41000.00,
    estimatedTax: 10250.00
  },
  {
    year: 2024,
    totalGains: 28000.00,
    totalLosses: -2500.00,
    netGains: 25500.00,
    dividends: 2800.00,
    taxableAmount: 28300.00,
    estimatedTax: 7075.00
  }];


  const handleMarkAsRead = (id: string) => {
    setAlerts(alerts.map((alert) =>
    alert.id === id ? { ...alert, read: true } : alert
    ));
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id));
  };

  const handleEditGoal = (id: string) => {
    console.log('Edit goal:', id);
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter((goal) => goal.id !== id));
  };

  const handleViewDetails = (id: string) => {
    console.log('View investment details:', id);
  };

  const handleDownloadReport = (year: number) => {
    console.log('Download tax report for year:', year);
  };

  const handleGenerateReport = () => {
    console.log('Generate new tax report');
  };

  // Add email notification helper
  const sendInvestmentAlert = (alertData: {
    alertType: string;
    message: string;
    stockName: string;
    currentPrice: number;
    priceChange: number;
    triggerCondition: string;
    severity: 'low' | 'medium' | 'high';
    recommendation: string;
  }) => {
    // Mock user data - in production, get from auth context
    const userEmail = 'user@example.com';
    const userName = 'Investment User';

    emailNotificationService.sendInvestmentAlertEmail(
      userEmail,
      userName,
      {
        ...alertData,
        timestamp: new Date().toISOString()
      }
    ).then(result => {
      if (!result.success) {
        console.error('Failed to send investment alert email:', result.error);
      }
    });
  };

  const sendMilestoneEmail = (milestoneData: {
    milestoneType: string;
    currentValue: number;
    targetValue: number;
    totalGain: number;
    startValue: number;
    timeToAchieve: string;
    avgMonthlyGain: number;
    nextMilestone: string;
    nextTargetValue: number;
  }) => {
    // Mock user data - in production, get from auth context
    const userEmail = 'user@example.com';
    const userName = 'Investment User';

    emailNotificationService.sendPortfolioMilestoneEmail(
      userEmail,
      userName,
      {
        ...milestoneData,
        achievedAt: new Date().toISOString()
      }
    ).then(result => {
      if (!result.success) {
        console.error('Failed to send milestone email:', result.error);
      }
    });
  };

  // Add investment alert monitoring
  // useEffect(() => {
  //   const checkInvestmentAlerts = () => {
  //     investments.forEach(investment => {
  //       const priceChange = ((investment.currentValue - investment.invested) / investment.invested) * 100;
        
  //       // High gain alert (>20%)
  //       if (priceChange > 20) {
  //         sendInvestmentAlert({
  //           alertType: 'High Profit Alert',
  //           message: `Your ${investment.name} investment has gained over 20%!`,
  //           stockName: investment.name,
  //           currentPrice: investment.currentValue,
  //           priceChange: priceChange,
  //           triggerCondition: 'Price gain > 20%',
  //           severity: 'high',
  //           recommendation: 'Consider taking profits or adjusting your position.'
  //         });
  //       }
        
  //       // Loss alert (<-10%)
  //       if (priceChange < -10) {
  //         sendInvestmentAlert({
  //           alertType: 'Loss Alert',
  //           message: `Your ${investment.name} investment has decreased by more than 10%.`,
  //           stockName: investment.name,
  //           currentPrice: investment.currentValue,
  //           priceChange: priceChange,
  //           triggerCondition: 'Price loss > 10%',
  //           severity: 'high',
  //           recommendation: 'Review your investment strategy and consider your risk tolerance.'
  //         });
  //       }
  //     });
  //   };

  //   // Check alerts every 5 minutes
  //   const alertInterval = setInterval(checkInvestmentAlerts, 5 * 60 * 1000);
  //   return () => clearInterval(alertInterval);
  // }, [investments]);

  // Add portfolio milestone monitoring
  // useEffect(() => {
  //   const checkMilestones = () => {
  //     const totalValue = investments.reduce((sum, inv) => sum + (inv.currentValue * inv.shares), 0);
  //     const milestones = [50000, 100000, 250000, 500000, 1000000];
      
  //     milestones.forEach(milestone => {
  //       if (totalValue >= milestone && totalValue < milestone * 1.05) {
  //         const startValue = 25000; // Mock starting value
  //         const totalGain = ((totalValue - startValue) / startValue) * 100;
  //         const monthsSinceStart = 12; // Mock duration
          
  //         sendMilestoneEmail({
  //           milestoneType: `$${(milestone / 1000).toFixed(0)}K Portfolio Value`,
  //           currentValue: totalValue,
  //           targetValue: milestone,
  //           totalGain: totalGain,
  //           startValue: startValue,
  //           timeToAchieve: `${monthsSinceStart} months`,
  //           avgMonthlyGain: totalGain / monthsSinceStart,
  //           nextMilestone: `$${(milestones[milestones.indexOf(milestone) + 1] / 1000).toFixed(0)}K`,
  //           nextTargetValue: milestones[milestones.indexOf(milestone) + 1] || milestone * 2
  //         });
  //       }
  //     });
  //   };

  //   // Check milestones on mount and when portfolio changes
  //   checkMilestones();
  // }, [investments]);

  return (
    <div className="space-y-8">
      {/* Crypto Bonus Banner */}
      <div className="bg-gradient-to-r from-secondary/20 via-primary/20 to-secondary/20 border-2 border-secondary rounded-lg p-6 shadow-glow-secondary animate-pulse-glow">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 bg-secondary rounded-full">
              <Icon name="CurrencyDollarIcon" size={32} className="text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-headline font-bold text-foreground mb-1">
                💎 Investieren Sie mit Krypto - Erhalten Sie 8% MEHR!
              </h3>
              <p className="text-sm text-muted-foreground">
                Crypto-Investitionen erhalten 8% zusätzliche Starlink Stocks - <strong className="text-secondary">KOMPLETT STEUERFREI!</strong>
              </p>
            </div>
          </div>
          <button className="px-6 py-3 bg-secondary text-white rounded-md font-cta font-bold hover:bg-secondary/80 hover:shadow-glow-secondary transition-smooth whitespace-nowrap">
            Jetzt investieren
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: 'Übersicht', icon: 'HomeIcon' },
          { id: 'investments', label: 'Investitionen', icon: 'CurrencyDollarIcon' },
          { id: 'trading', label: 'Trading', icon: 'ArrowPathIcon', badge: 'NEU' },
          { id: 'fixed-deposit', label: 'Festgeld-Staking', icon: 'BanknotesIcon', badge: '8%' },
          { id: 'history', label: 'Transaction History', icon: 'ClockIcon' },
          { id: 'withdraw', label: 'Withdraw', icon: 'BanknotesIcon' },
          { id: 'crypto-deposit', label: 'Crypto Deposit', icon: 'CurrencyDollarIcon', badge: '8%' },
          { id: 'ai', label: 'KI-Berater', icon: 'SparklesIcon', badge: 'NEU' },
          { id: 'social', label: 'Social Trading', icon: 'UserGroupIcon', badge: 'NEU' },
          { id: 'advanced', label: 'Erweiterte Analysen', icon: 'ChartBarIcon', badge: 'PRO' },
          { id: 'analytics', label: 'Performance', icon: 'PresentationChartLineIcon' },
          { id: 'goals', label: 'Ziele', icon: 'FlagIcon' },
          { id: 'tax', label: 'Steuern', icon: 'DocumentTextIcon' }
        ].map((view) => (
          <button
            key={view.id}
            onClick={() => setSelectedView(view.id as any)}
            className={`relative flex items-center space-x-2 px-4 py-3 rounded-md font-semibold transition-smooth whitespace-nowrap ${
              selectedView === view.id
                ? 'bg-primary text-primary-foreground shadow-glow-primary'
                : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            <Icon name={view.icon as any} size={20} />
            <span>{view.label}</span>
            {view.badge && (
              <span className="absolute -top-1 -right-1 px-2 py-0.5 bg-secondary text-white text-xs font-bold rounded-full">
                {view.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {selectedView === 'overview' &&
      <>
          <PortfolioOverview data={portfolioData} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <PerformanceChart data={performanceData} />
            </div>
            <div>
              <AlertsPanel
              alerts={alerts}
              onMarkAsRead={handleMarkAsRead}
              onDeleteAlert={handleDeleteAlert} />

            </div>
          </div>

          <QuickActions actions={quickActions} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity activities={activities} />
            <GoalsTracker
            goals={goals}
            onEditGoal={handleEditGoal}
            onDeleteGoal={handleDeleteGoal} />

          </div>
        </>
      }

      {selectedView === 'investments' &&
      <>
          <PortfolioOverview data={portfolioData} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((investment) =>
          <InvestmentCard
            key={investment.id}
            investment={investment}
            onViewDetails={handleViewDetails} />

          )}
          </div>
        </>
      }

      {selectedView === 'analytics' &&
      <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PerformanceChart data={performanceData} />
            <AllocationChart data={allocationData} />
          </div>

          <RiskAssessment metrics={riskMetrics} overallRiskLevel="medium" />
        </>
      }

      {selectedView === 'goals' &&
      <GoalsTracker
        goals={goals}
        onEditGoal={handleEditGoal}
        onDeleteGoal={handleDeleteGoal} />

      }

      {selectedView === 'tax' &&
      <TaxReporting
        reports={taxReports}
        onDownloadReport={handleDownloadReport}
        onGenerateReport={handleGenerateReport} />

      }

      {selectedView === 'ai' && (
        <div className="space-y-6">
          <AIAdvisor portfolioValue={portfolioData.totalValue} investments={investments} />
        </div>
      )}

      {selectedView === 'social' && (
        <div className="space-y-6">
          <SocialCopyTrading />
        </div>
      )}

      {selectedView === 'advanced' && (
        <div className="space-y-6">
          <AdvancedPortfolioAnalytics investments={investments} portfolioValue={portfolioData.totalValue} />
        </div>
      )}

      {selectedView === 'trading' && (
        <div className="space-y-6">
          <StockTradingPanel />
        </div>
      )}

      {selectedView === 'withdraw' && (
        <div className="space-y-6">
          <WithdrawPanel />
        </div>
      )}

      {selectedView === 'crypto-deposit' && (
        <div className="space-y-6">
          <CryptoDepositPanel />
        </div>
      )}

      {selectedView === 'history' && (
        <div className="space-y-6">
          <TransactionHistory />
        </div>
      )}

      {selectedView === 'fixed-deposit' && (
        <div className="space-y-6">
          <FixedDepositPanel />
        </div>
      )}
    </div>
  );
}