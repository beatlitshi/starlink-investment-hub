'use client';

import Icon from '@/components/ui/AppIcon';

interface Alert {
  id: string;
  type: 'price' | 'news' | 'goal' | 'risk';
  title: string;
  message: string;
  timestamp: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
}

interface AlertsPanelProps {
  alerts: Alert[];
  onMarkAsRead: (id: string) => void;
  onDeleteAlert: (id: string) => void;
}

export default function AlertsPanel({ alerts, onMarkAsRead, onDeleteAlert }: AlertsPanelProps) {
  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'price':
        return 'ChartBarIcon';
      case 'news':
        return 'NewspaperIcon';
      case 'goal':
        return 'TrophyIcon';
      case 'risk':
        return 'ExclamationTriangleIcon';
      default:
        return 'BellIcon';
    }
  };

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-headline font-bold text-foreground">Benachrichtigungen</h2>
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-xs font-cta font-bold">
            {alerts.filter(a => !a.read).length} Neu
          </span>
        </div>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="BellSlashIcon" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-mono text-muted-foreground">Keine Benachrichtigungen</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 rounded-lg border transition-smooth ${
                alert.read
                  ? 'bg-muted/20 border-border' :'bg-card border-primary glow-primary'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <Icon 
                    name={getAlertIcon(alert.type) as any} 
                    size={20} 
                    className={getPriorityColor(alert.priority)}
                  />
                  <div className="flex-1">
                    <h3 className="text-sm font-cta font-bold text-foreground mb-1">{alert.title}</h3>
                    <p className="text-xs font-mono text-muted-foreground mb-2">{alert.message}</p>
                    <p className="text-xs font-mono text-muted-foreground opacity-60">{alert.timestamp}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-3">
                  {!alert.read && (
                    <button
                      onClick={() => onMarkAsRead(alert.id)}
                      className="p-1 rounded-md hover:bg-muted transition-smooth"
                      aria-label="Als gelesen markieren"
                    >
                      <Icon name="CheckIcon" size={16} className="text-success" />
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteAlert(alert.id)}
                    className="p-1 rounded-md hover:bg-muted transition-smooth"
                    aria-label="Benachrichtigung löschen"
                  >
                    <Icon name="XMarkIcon" size={16} className="text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}