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
import Icon from '@/components/ui/AppIcon';
import { emailNotificationService } from '@/services/emailNotificationService';

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
  const [isHydrated, setIsHydrated] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [selectedView, setSelectedView] = useState<'overview' | 'investments' | 'analytics' | 'goals' | 'tax' | 'ai' | 'social' | 'advanced'>('overview');

  useEffect(() => {
    setIsHydrated(true);

    setAlerts([
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
    }]
    );

    setGoals([
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
    }]
    );
  }, []);

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground font-mono">Lade Dashboard...</p>
        </div>
      </div>);

  }

  const portfolioData = {
    totalValue: 287543.75,
    totalInvestment: 250000.00,
    totalReturn: 37543.75,
    returnPercentage: 15.02,
    dayChange: 2847.50,
    dayChangePercentage: 1.00,
    cryptoBonus: 8000.00
  };

  const investments: Investment[] = [
  {
    id: '1',
    name: 'Starlink Global',
    symbol: 'STLK',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_18f77f544-1766400233926.png",
    alt: 'Satellite orbiting Earth with blue glow against dark space background',
    currentValue: 125000.00,
    invested: 100000.00,
    shares: 833.3333,
    returnAmount: 25000.00,
    returnPercentage: 25.00,
    dayChange: 1250.00,
    dayChangePercentage: 1.01,
    isCrypto: true,
    cryptoBonus: 8000.00
  },
  {
    id: '2',
    name: 'SpaceX Ventures',
    symbol: 'SPCX',
    image: "https://images.unsplash.com/photo-1516850228053-a807778c4e0f",
    alt: 'Rocket launching into space with bright orange flames and smoke',
    currentValue: 87500.00,
    invested: 75000.00,
    shares: 583.3333,
    returnAmount: 12500.00,
    returnPercentage: 16.67,
    dayChange: 875.00,
    dayChangePercentage: 1.01,
    isCrypto: false
  },
  {
    id: '3',
    name: 'Satellite Tech ETF',
    symbol: 'STET',
    image: "https://images.unsplash.com/photo-1649682892309-e10e0b7cd40b",
    alt: 'Digital network connections with glowing blue nodes on dark background',
    currentValue: 50043.75,
    invested: 50000.00,
    shares: 2001.7500,
    returnAmount: 43.75,
    returnPercentage: 0.09,
    dayChange: 500.50,
    dayChangePercentage: 1.01,
    isCrypto: false
  },
  {
    id: '4',
    name: 'Global Connectivity Fund',
    symbol: 'GCON',
    image: "https://images.unsplash.com/photo-1658479657379-e0adb7cb91e8",
    alt: 'Computer code on dark screen with blue and green syntax highlighting',
    currentValue: 25000.00,
    invested: 25000.00,
    shares: 1000.0000,
    returnAmount: 0.00,
    returnPercentage: 0.00,
    dayChange: 222.00,
    dayChangePercentage: 0.90,
    isCrypto: false
  }];


  const performanceData = [
  { date: '01.12', value: 250000, invested: 250000 },
  { date: '05.12', value: 252500, invested: 250000 },
  { date: '10.12', value: 255000, invested: 250000 },
  { date: '15.12', value: 260000, invested: 250000 },
  { date: '20.12', value: 265000, invested: 250000 },
  { date: '25.12', value: 270000, invested: 250000 },
  { date: '31.12', value: 275000, invested: 250000 },
  { date: '05.01', value: 280000, invested: 250000 },
  { date: '10.01', value: 285000, invested: 250000 },
  { date: '12.01', value: 287543.75, invested: 250000 }];


  const allocationData = [
  { name: 'Starlink Global', value: 125000.00, percentage: 43.47 },
  { name: 'SpaceX Ventures', value: 87500.00, percentage: 30.43 },
  { name: 'Satellite Tech ETF', value: 50043.75, percentage: 17.40 },
  { name: 'Global Connectivity Fund', value: 25000.00, percentage: 8.70 }];


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
    label: 'Investieren',
    icon: 'PlusCircleIcon',
    color: 'primary',
    onClick: () => alert('Investieren-Funktion')
  },
  {
    id: '2',
    label: 'Auszahlung',
    icon: 'BanknotesIcon',
    color: 'secondary',
    onClick: () => alert('Auszahlung anfordern')
  },
  {
    id: '3',
    label: 'KI-Empfehlungen',
    icon: 'SparklesIcon',
    color: 'primary',
    onClick: () => setSelectedView('ai')
  },
  {
    id: '4',
    label: 'Social Trading',
    icon: 'UserGroupIcon',
    color: 'secondary',
    onClick: () => setSelectedView('social')
  },
  {
    id: '5',
    label: 'Erweiterte Analysen',
    icon: 'ChartBarIcon',
    color: 'primary',
    onClick: () => setSelectedView('advanced')
  },
  {
    id: '6',
    label: 'Portfolio',
    icon: 'DocumentChartBarIcon',
    color: 'success',
    onClick: () => alert('Portfolio-Details')
  },
  {
    id: '7',
    label: 'Berichte',
    icon: 'DocumentTextIcon',
    color: 'warning',
    onClick: () => setSelectedView('tax')
  },
  {
    id: '8',
    label: 'Einstellungen',
    icon: 'CogIcon',
    color: 'muted-foreground',
    onClick: () => alert('Einstellungen')
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
  useEffect(() => {
    const checkMilestones = () => {
      const totalValue = investments.reduce((sum, inv) => sum + (inv.currentValue * inv.shares), 0);
      const milestones = [50000, 100000, 250000, 500000, 1000000];
      
      milestones.forEach(milestone => {
        if (totalValue >= milestone && totalValue < milestone * 1.05) {
          const startValue = 25000; // Mock starting value
          const totalGain = ((totalValue - startValue) / startValue) * 100;
          const monthsSinceStart = 12; // Mock duration
          
          sendMilestoneEmail({
            milestoneType: `$${(milestone / 1000).toFixed(0)}K Portfolio Value`,
            currentValue: totalValue,
            targetValue: milestone,
            totalGain: totalGain,
            startValue: startValue,
            timeToAchieve: `${monthsSinceStart} months`,
            avgMonthlyGain: totalGain / monthsSinceStart,
            nextMilestone: `$${(milestones[milestones.indexOf(milestone) + 1] / 1000).toFixed(0)}K`,
            nextTargetValue: milestones[milestones.indexOf(milestone) + 1] || milestone * 2
          });
        }
      });
    };

    // Check milestones on mount and when portfolio changes
    checkMilestones();
  }, [investments]);

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
    </div>);

}