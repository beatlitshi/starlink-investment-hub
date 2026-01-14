'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface DataExportPanelProps {
  onExport: (format: string) => void;
}

export default function DataExportPanel({ onExport }: DataExportPanelProps) {
  const [selectedFormat, setSelectedFormat] = useState('csv');

  const formats = [
    { value: 'csv', label: 'CSV', icon: 'DocumentTextIcon' },
    { value: 'xlsx', label: 'Excel', icon: 'TableCellsIcon' },
    { value: 'json', label: 'JSON', icon: 'CodeBracketIcon' },
    { value: 'pdf', label: 'PDF', icon: 'DocumentIcon' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-headline font-bold text-foreground mb-4">Daten exportieren</h3>
      <div className="grid grid-cols-2 gap-3 mb-4">
        {formats.map((format) => (
          <button
            key={format.value}
            onClick={() => setSelectedFormat(format.value)}
            className={`flex items-center justify-center space-x-2 p-3 rounded-lg border transition-smooth ${
              selectedFormat === format.value
                ? 'border-primary bg-primary/10 text-primary' :'border-border text-muted-foreground hover:border-primary/50'
            }`}
          >
            <Icon name={format.icon as any} size={20} />
            <span className="text-sm font-cta font-semibold">{format.label}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => onExport(selectedFormat)}
        className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg text-sm font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth"
      >
        <div className="flex items-center justify-center space-x-2">
          <Icon name="ArrowDownTrayIcon" size={20} />
          <span>Exportieren</span>
        </div>
      </button>
    </div>
  );
}