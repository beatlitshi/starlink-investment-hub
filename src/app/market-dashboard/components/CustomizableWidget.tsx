'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Widget {
  id: string;
  title: string;
  type: string;
  visible: boolean;
}

interface CustomizableWidgetProps {
  widgets: Widget[];
  onToggle: (id: string) => void;
}

export default function CustomizableWidget({ widgets, onToggle }: CustomizableWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-cta font-semibold text-foreground hover:border-primary transition-smooth"
      >
        <Icon name="Cog6ToothIcon" size={20} />
        <span>Widgets anpassen</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-card border border-border rounded-lg shadow-lg z-50 animate-slide-in-right">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-headline font-bold text-foreground">Dashboard-Widgets</h3>
          </div>
          <div className="p-4 space-y-3 max-h-96 overflow-y-auto">
            {widgets.map((widget) => (
              <div
                key={widget.id}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-smooth"
              >
                <div className="flex items-center space-x-3">
                  <Icon name="RectangleStackIcon" size={20} className="text-primary" />
                  <span className="text-sm font-body text-foreground">{widget.title}</span>
                </div>
                <button
                  onClick={() => onToggle(widget.id)}
                  className={`w-12 h-6 rounded-full transition-smooth ${
                    widget.visible ? 'bg-primary' : 'bg-muted'
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                      widget.visible ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  ></div>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}