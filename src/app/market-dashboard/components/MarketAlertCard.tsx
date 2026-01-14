'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Alert {
  id: number;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  timestamp: string;
}

interface MarketAlertCardProps {
  alerts: Alert[];
}

export default function MarketAlertCard({ alerts }: MarketAlertCardProps) {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-success text-success';
      case 'warning': return 'border-warning text-warning';
      case 'error': return 'border-destructive text-destructive';
      default: return 'border-primary text-primary';
    }
  };

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return 'CheckCircleIcon';
      case 'warning': return 'ExclamationTriangleIcon';
      case 'error': return 'XCircleIcon';
      default: return 'InformationCircleIcon';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-headline font-bold text-foreground">Markt-Benachrichtigungen</h3>
        <Icon name="BellIcon" size={20} className="text-primary" />
      </div>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`border-l-4 ${getAlertColor(alert.type)} bg-muted/30 p-4 rounded-r-lg cursor-pointer hover:bg-muted/50 transition-smooth`}
            onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
          >
            <div className="flex items-start space-x-3">
              <Icon name={getAlertIcon(alert.type) as any} size={20} className={getAlertColor(alert.type)} />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-cta font-semibold text-foreground">{alert.title}</h4>
                  <span className="text-xs text-muted-foreground font-mono">{alert.timestamp}</span>
                </div>
                {expandedId === alert.id && (
                  <p className="text-sm text-muted-foreground font-body mt-2">{alert.message}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}