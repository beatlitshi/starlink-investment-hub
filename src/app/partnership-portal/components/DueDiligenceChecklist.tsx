import Icon from '@/components/ui/AppIcon';

interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

interface DueDiligenceChecklistProps {
  items: ChecklistItem[];
  onToggle: (id: number) => void;
}

export default function DueDiligenceChecklist({ items, onToggle }: DueDiligenceChecklistProps) {
  const completedCount = items.filter(item => item.completed).length;
  const progress = (completedCount / items.length) * 100;

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-headline font-bold text-foreground">Due-Diligence-Checkliste</h3>
        <span className="text-sm font-cta font-semibold text-primary">
          {completedCount} / {items.length} abgeschlossen
        </span>
      </div>

      <div className="mb-6">
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-smooth"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-start space-x-4 p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth cursor-pointer"
            onClick={() => onToggle(item.id)}
          >
            <div className="flex-shrink-0 mt-1">
              <div
                className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-smooth ${
                  item.completed
                    ? 'bg-success border-success' :'border-border hover:border-primary'
                }`}
              >
                {item.completed && (
                  <Icon name="CheckIcon" size={16} className="text-background" />
                )}
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="text-sm font-cta font-semibold text-foreground">{item.title}</h4>
                {item.required && (
                  <span className="px-2 py-0.5 bg-destructive/20 text-xs font-cta font-semibold text-destructive rounded">
                    Erforderlich
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}