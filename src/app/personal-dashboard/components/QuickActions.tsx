'use client';

import Icon from '@/components/ui/AppIcon';

interface QuickAction {
  id: string;
  label: string;
  icon: string;
  color: string;
  onClick: () => void;
}

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h2 className="text-xl font-headline font-bold text-foreground mb-6">Schnellaktionen</h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {actions.map((action) => {
          const colorClass = action.color === 'primary' ? 'border-primary hover:border-primary hover:bg-primary/10' :
                            action.color === 'secondary' ? 'border-secondary hover:border-secondary hover:bg-secondary/10' :
                            action.color === 'success' ? 'border-success hover:border-success hover:bg-success/10' :
                            action.color === 'warning'? 'border-warning hover:border-warning hover:bg-warning/10' : 'border-border hover:border-muted-foreground hover:bg-muted/10';
          
          const iconColor = action.color === 'primary' ? 'text-primary' :
                           action.color === 'secondary' ? 'text-secondary' :
                           action.color === 'success' ? 'text-success' :
                           action.color === 'warning'? 'text-warning' : 'text-muted-foreground';
          
          const bgColor = action.color === 'primary' ? 'bg-primary/20' :
                         action.color === 'secondary' ? 'bg-secondary/20' :
                         action.color === 'success' ? 'bg-success/20' :
                         action.color === 'warning'? 'bg-warning/20' : 'bg-muted/20';

          return (
            <button
              key={action.id}
              onClick={action.onClick}
              className={`p-4 rounded-lg border transition-smooth group ${colorClass}`}
            >
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full ${bgColor} flex items-center justify-center group-hover:scale-110 transition-smooth`}>
                <Icon name={action.icon as any} size={24} className={iconColor} />
              </div>
              <p className="text-sm font-cta font-semibold text-foreground text-center">{action.label}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}