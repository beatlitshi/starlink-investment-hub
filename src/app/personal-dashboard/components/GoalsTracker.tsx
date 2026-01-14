'use client';

import Icon from '@/components/ui/AppIcon';

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

interface GoalsTrackerProps {
  goals: Goal[];
  onEditGoal: (id: string) => void;
  onDeleteGoal: (id: string) => void;
}

export default function GoalsTracker({ goals, onEditGoal, onDeleteGoal }: GoalsTrackerProps) {
  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="bg-card rounded-lg p-6 border border-border glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-headline font-bold text-foreground">Investitionsziele</h2>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-cta font-bold hover:bg-accent transition-smooth">
          <Icon name="PlusIcon" size={16} className="inline mr-2" />
          Neues Ziel
        </button>
      </div>

      <div className="space-y-4">
        {goals.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="FlagIcon" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-mono text-muted-foreground">Keine Ziele festgelegt</p>
          </div>
        ) : (
          goals.map((goal) => {
            const progress = calculateProgress(goal.currentAmount, goal.targetAmount);
            return (
              <div key={goal.id} className="p-4 bg-muted/20 rounded-lg border border-border">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-lg font-headline font-bold text-foreground mb-1">{goal.title}</h3>
                    <p className="text-xs font-mono text-muted-foreground">{goal.category}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onEditGoal(goal.id)}
                      className="p-2 rounded-md hover:bg-muted transition-smooth"
                      aria-label="Ziel bearbeiten"
                    >
                      <Icon name="PencilIcon" size={16} className="text-primary" />
                    </button>
                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-2 rounded-md hover:bg-muted transition-smooth"
                      aria-label="Ziel löschen"
                    >
                      <Icon name="TrashIcon" size={16} className="text-destructive" />
                    </button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-cta font-semibold text-foreground">
                      {goal.currentAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                    <span className="text-sm font-cta font-semibold text-muted-foreground">
                      {goal.targetAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-mono text-primary">{progress.toFixed(1)}% erreicht</span>
                    <span className="text-xs font-mono text-muted-foreground">Frist: {goal.deadline}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}