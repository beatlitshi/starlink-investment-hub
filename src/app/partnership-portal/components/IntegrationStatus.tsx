import Icon from '@/components/ui/AppIcon';

interface IntegrationStep {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  timestamp?: string;
}

interface IntegrationStatusProps {
  steps: IntegrationStep[];
  currentStep: number;
}

export default function IntegrationStatus({ steps, currentStep }: IntegrationStatusProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <Icon name="CheckCircleIcon" size={24} className="text-success" variant="solid" />;
      case 'in-progress':
        return <Icon name="ArrowPathIcon" size={24} className="text-primary animate-spin" />;
      default:
        return <Icon name="ClockIcon" size={24} className="text-muted-foreground" />;
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-headline font-bold text-foreground mb-6">Integrationsstatus</h3>
      
      <div className="space-y-6">
        {steps.map((step, index) => (
          <div key={step.id} className="relative">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                {getStatusIcon(step.status)}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-cta font-semibold text-foreground mb-1">
                  {step.title}
                </h4>
                {step.timestamp && (
                  <p className="text-xs text-muted-foreground">{step.timestamp}</p>
                )}
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="absolute left-3 top-8 w-0.5 h-8 bg-border" />
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="InformationCircleIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-foreground">
            Schritt {currentStep} von {steps.length} abgeschlossen. Die Integration wird in der Regel innerhalb von 24-48 Stunden abgeschlossen.
          </p>
        </div>
      </div>
    </div>
  );
}