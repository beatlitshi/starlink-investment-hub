'use client';

import Icon from '@/components/ui/AppIcon';

interface TaxReport {
  year: number;
  totalGains: number;
  totalLosses: number;
  netGains: number;
  dividends: number;
  taxableAmount: number;
  estimatedTax: number;
}

interface TaxReportingProps {
  reports: TaxReport[];
  onDownloadReport: (year: number) => void;
  onGenerateReport: () => void;
}

export default function TaxReporting({ reports, onDownloadReport, onGenerateReport }: TaxReportingProps) {
  return (
    <div className="bg-card rounded-lg p-6 border border-border glow-primary">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-headline font-bold text-foreground">Steuerberichte</h2>
        <button
          onClick={onGenerateReport}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-cta font-bold hover:bg-accent transition-smooth"
        >
          <Icon name="DocumentTextIcon" size={16} className="inline mr-2" />
          Bericht erstellen
        </button>
      </div>

      <div className="space-y-4">
        {reports.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="DocumentIcon" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-sm font-mono text-muted-foreground">Keine Steuerberichte verfügbar</p>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report.year} className="p-4 bg-muted/20 rounded-lg border border-border">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-headline font-bold text-foreground">Steuerjahr {report.year}</h3>
                <button
                  onClick={() => onDownloadReport(report.year)}
                  className="px-3 py-1 bg-primary/20 text-primary rounded-md text-xs font-cta font-bold hover:bg-primary/30 transition-smooth"
                >
                  <Icon name="ArrowDownTrayIcon" size={14} className="inline mr-1" />
                  Herunterladen
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">Gesamtgewinne</p>
                  <p className="text-sm font-headline font-bold text-success">
                    +{report.totalGains.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">Gesamtverluste</p>
                  <p className="text-sm font-headline font-bold text-destructive">
                    {report.totalLosses.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">Nettogewinne</p>
                  <p className="text-sm font-headline font-bold text-primary">
                    {report.netGains.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">Dividenden</p>
                  <p className="text-sm font-headline font-bold text-secondary">
                    {report.dividends.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">Steuerpflichtiger Betrag</p>
                  <p className="text-sm font-headline font-bold text-foreground">
                    {report.taxableAmount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted-foreground mb-1">Geschätzte Steuer</p>
                  <p className="text-sm font-headline font-bold text-warning">
                    {report.estimatedTax.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}