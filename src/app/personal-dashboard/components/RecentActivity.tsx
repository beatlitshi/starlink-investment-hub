import Icon from '@/components/ui/AppIcon';

interface Activity {
  id: string;
  type: 'buy' | 'sell' | 'dividend' | 'alert' | 'deposit' | 'withdrawal' | 'crypto_bonus';
  title: string;
  description: string;
  amount?: number;
  timestamp: string;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'buy':
        return 'ArrowUpCircleIcon';
      case 'sell':
        return 'ArrowDownCircleIcon';
      case 'dividend':
        return 'BanknotesIcon';
      case 'alert':
        return 'BellIcon';
      case 'deposit':
        return 'ArrowDownTrayIcon';
      case 'withdrawal':
        return 'ArrowUpTrayIcon';
      case 'crypto_bonus':
        return 'SparklesIcon';
      default:
        return 'ClockIcon';
    }
  };

  const getActivityColor = (type: Activity['type']) => {
    switch (type) {
      case 'buy':
        return 'text-success';
      case 'sell':
        return 'text-destructive';
      case 'dividend':
        return 'text-secondary';
      case 'alert':
        return 'text-primary';
      case 'deposit':
        return 'text-success';
      case 'withdrawal':
        return 'text-warning';
      case 'crypto_bonus':
        return 'text-secondary';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-xl font-headline font-bold text-foreground mb-6">Letzte Aktivitäten</h2>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="ClockIcon" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-mono text-muted-foreground">Keine Aktivitäten</p>
          </div>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-muted/20 transition-smooth">
              <div className={`p-2 rounded-full bg-current/20 ${getActivityColor(activity.type)}`}>
                <Icon name={getActivityIcon(activity.type) as any} size={20} className={getActivityColor(activity.type)} />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-cta font-bold text-foreground mb-1">{activity.title}</h3>
                <p className="text-xs font-mono text-muted-foreground mb-2">{activity.description}</p>
                <p className="text-xs font-mono text-muted-foreground opacity-60">{activity.timestamp}</p>
              </div>
              {activity.amount !== undefined && (
                <div className="text-right">
                  <p className={`text-sm font-headline font-bold ${activity.amount >= 0 ? 'text-success' : 'text-destructive'}`}>
                    {activity.amount >= 0 ? '+' : ''}{activity.amount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}