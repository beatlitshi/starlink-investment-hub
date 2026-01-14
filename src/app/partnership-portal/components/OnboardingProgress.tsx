import Icon from '@/components/ui/AppIcon';

interface OnboardingPhase {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: 'completed' | 'active' | 'locked';
}

interface OnboardingProgressProps {
  phases: OnboardingPhase[];
}

export default function OnboardingProgress({ phases }: OnboardingProgressProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-headline font-bold text-foreground mb-6">Onboarding-Fortschritt</h3>
      
      <div className="space-y-4">
        {phases.map((phase) => (
          <div
            key={phase.id}
            className={`p-4 rounded-lg border transition-smooth ${
              phase.status === 'active' ?'bg-primary/10 border-primary'
                : phase.status === 'completed' ?'bg-success/10 border-success/30' :'bg-muted/50 border-border'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {phase.status === 'completed' && (
                  <Icon name="CheckCircleIcon" size={24} className="text-success" variant="solid" />
                )}
                {phase.status === 'active' && (
                  <Icon name="ArrowPathIcon" size={24} className="text-primary" />
                )}
                {phase.status === 'locked' && (
                  <Icon name="LockClosedIcon" size={24} className="text-muted-foreground" />
                )}
                <h4 className="text-sm font-cta font-semibold text-foreground">{phase.title}</h4>
              </div>
              <span className="text-xs font-cta font-semibold text-primary">
                {phase.progress}%
              </span>
            </div>
            
            <p className="text-xs text-muted-foreground mb-3">{phase.description}</p>
            
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full transition-smooth ${
                  phase.status === 'completed'
                    ? 'bg-success'
                    : phase.status === 'active' ?'bg-primary' :'bg-muted-foreground'
                }`}
                style={{ width: `${phase.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}