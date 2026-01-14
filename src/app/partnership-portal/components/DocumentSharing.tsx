'use client';

import { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'rejected';
}

interface DocumentSharingProps {
  documents: Document[];
  onUpload: (file: File) => void;
  onDelete: (id: number) => void;
}

export default function DocumentSharing({ documents, onUpload, onDelete }: DocumentSharingProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      onUpload(files[0]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'verified':
        return 'text-success bg-success/10 border-success/30';
      case 'pending':
        return 'text-warning bg-warning/10 border-warning/30';
      case 'rejected':
        return 'text-destructive bg-destructive/10 border-destructive/30';
      default:
        return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'verified':
        return 'Verifiziert';
      case 'pending':
        return 'Ausstehend';
      case 'rejected':
        return 'Abgelehnt';
      default:
        return 'Unbekannt';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-xl font-headline font-bold text-foreground mb-6">Sichere Dokumentenfreigabe</h3>
      
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-smooth ${
          isDragging
            ? 'border-primary bg-primary/10' :'border-border hover:border-primary'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Icon name="CloudArrowUpIcon" size={48} className="text-primary mx-auto mb-4" />
        <p className="text-sm font-cta font-semibold text-foreground mb-2">
          Dokumente hier ablegen oder klicken zum Hochladen
        </p>
        <p className="text-xs text-muted-foreground">
          Unterstützte Formate: PDF, DOC, DOCX, JPG, PNG (Max. 10MB)
        </p>
      </div>

      <div className="mt-6 space-y-3">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-smooth"
          >
            <div className="flex items-center space-x-4 flex-1">
              <Icon name="DocumentTextIcon" size={24} className="text-primary" />
              <div className="flex-1">
                <h4 className="text-sm font-cta font-semibold text-foreground">{doc.name}</h4>
                <p className="text-xs text-muted-foreground">
                  {doc.size} • Hochgeladen am {doc.uploadedAt}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span
                className={`px-3 py-1 text-xs font-cta font-semibold rounded-full border ${getStatusColor(
                  doc.status
                )}`}
              >
                {getStatusText(doc.status)}
              </span>
              <button
                onClick={() => onDelete(doc.id)}
                className="p-2 text-muted-foreground hover:text-destructive transition-smooth"
              >
                <Icon name="TrashIcon" size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-primary/10 border border-primary/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="ShieldCheckIcon" size={20} className="text-primary flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-xs font-cta font-semibold text-foreground mb-1">
              Ende-zu-Ende-Verschlüsselung
            </p>
            <p className="text-xs text-muted-foreground">
              Alle Dokumente werden mit AES-256-Verschlüsselung gesichert und entsprechen den GDPR-Anforderungen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}