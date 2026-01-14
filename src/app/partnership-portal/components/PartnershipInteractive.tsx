'use client';

import { useState, useEffect } from 'react';
import PartnerCard from './PartnerCard';
import DueDiligenceChecklist from './DueDiligenceChecklist';
import IntegrationStatus from './IntegrationStatus';
import OnboardingProgress from './OnboardingProgress';
import DocumentSharing from './DocumentSharing';
import Icon from '@/components/ui/AppIcon';

interface Partner {
  id: number;
  name: string;
  logo: string;
  logoAlt: string;
  category: string;
  rating: number;
  verified: boolean;
  minInvestment: string;
  description: string;
  features: string[];
  regulatoryBadges: string[];
}

interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
}

interface IntegrationStep {
  id: number;
  title: string;
  status: 'completed' | 'in-progress' | 'pending';
  timestamp?: string;
}

interface OnboardingPhase {
  id: number;
  title: string;
  description: string;
  progress: number;
  status: 'completed' | 'active' | 'locked';
}

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: 'verified' | 'pending' | 'rejected';
}

export default function PartnershipInteractive() {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const partners: Partner[] = [
  {
    id: 1,
    name: "Deutsche Investitionsbank",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1c7d4c9a7-1766901471557.png",
    logoAlt: "Modern blue and white bank logo with geometric design on white background",
    category: "Traditionelle Bank",
    rating: 5,
    verified: true,
    minInvestment: "€10.000",
    description: "Führende deutsche Bank mit Fokus auf Satelliten-Infrastrukturinvestitionen und langfristige Wachstumsstrategien.",
    features: ["EU-reguliert", "24/7 Support", "Niedrige Gebühren"],
    regulatoryBadges: ["BaFin", "GDPR", "EU-Lizenz"]
  },
  {
    id: 2,
    name: "SpaceTech Ventures",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1619fe0c8-1768194351994.png",
    logoAlt: "Futuristic space technology logo with orbital rings and stars on dark background",
    category: "Venture Capital",
    rating: 4,
    verified: true,
    minInvestment: "€25.000",
    description: "Spezialisierter VC-Fonds für Weltraumtechnologie mit Schwerpunkt auf Satellitenkommunikation und Infrastruktur.",
    features: ["Hohe Rendite", "Expertenberatung", "Portfolio-Diversifikation"],
    regulatoryBadges: ["BaFin", "GDPR", "ESMA"]
  },
  {
    id: 3,
    name: "Orbital Investment Group",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1cbb70d34-1768194351539.png",
    logoAlt: "Professional investment firm logo with globe and satellite imagery on blue gradient",
    category: "Investmentfonds",
    rating: 5,
    verified: true,
    minInvestment: "€5.000",
    description: "Diversifizierter Investmentfonds mit Fokus auf globale Satelliten-Internet-Infrastruktur und Konnektivitätslösungen.",
    features: ["Niedrige Einstiegshürde", "Monatliche Berichte", "Flexible Auszahlungen"],
    regulatoryBadges: ["BaFin", "GDPR", "EU-Lizenz", "ISO 27001"]
  },
  {
    id: 4,
    name: "Constellation Capital Partners",
    logo: "https://img.rocket.new/generatedImages/rocket_gen_img_1ba1adcb4-1768194352593.png",
    logoAlt: "Elegant capital partners logo with constellation pattern and gold accents",
    category: "Private Equity",
    rating: 4,
    verified: true,
    minInvestment: "€50.000",
    description: "Private-Equity-Firma mit exklusivem Zugang zu Starlink-Infrastrukturprojekten und strategischen Partnerschaften.",
    features: ["Exklusiver Zugang", "Persönlicher Berater", "Quartalsweise Updates"],
    regulatoryBadges: ["BaFin", "GDPR", "ESMA"]
  }];


  const categories = ['Alle', 'Traditionelle Bank', 'Venture Capital', 'Investmentfonds', 'Private Equity'];

  const initialChecklistItems: ChecklistItem[] = [
  {
    id: 1,
    title: "Identitätsprüfung abschließen",
    description: "Laden Sie einen gültigen Personalausweis oder Reisepass hoch",
    completed: false,
    required: true
  },
  {
    id: 2,
    title: "Adressnachweis bereitstellen",
    description: "Aktuelle Rechnung oder Kontoauszug (nicht älter als 3 Monate)",
    completed: false,
    required: true
  },
  {
    id: 3,
    title: "Finanzielle Eignung bestätigen",
    description: "Nachweis über verfügbares Investitionskapital",
    completed: false,
    required: true
  },
  {
    id: 4,
    title: "Risikoaufklärung akzeptieren",
    description: "Lesen und akzeptieren Sie die Risikohinweise",
    completed: false,
    required: true
  },
  {
    id: 5,
    title: "Datenschutzerklärung zustimmen",
    description: "GDPR-konforme Datenverarbeitungszustimmung",
    completed: false,
    required: true
  },
  {
    id: 6,
    title: "Investitionsziele definieren",
    description: "Geben Sie Ihre Anlageziele und Risikotoleranz an",
    completed: false,
    required: false
  }];


  const integrationSteps: IntegrationStep[] = [
  {
    id: 1,
    title: "Partnerauswahl bestätigt",
    status: 'completed',
    timestamp: '12.01.2026, 10:30 Uhr'
  },
  {
    id: 2,
    title: "Dokumentenprüfung läuft",
    status: 'in-progress',
    timestamp: '12.01.2026, 11:15 Uhr'
  },
  {
    id: 3,
    title: "Kontoeinrichtung ausstehend",
    status: 'pending'
  },
  {
    id: 4,
    title: "Erste Investition ausstehend",
    status: 'pending'
  }];


  const onboardingPhases: OnboardingPhase[] = [
  {
    id: 1,
    title: "Registrierung & Verifizierung",
    description: "Erstellen Sie Ihr Konto und verifizieren Sie Ihre Identität",
    progress: 100,
    status: 'completed'
  },
  {
    id: 2,
    title: "Due Diligence & Compliance",
    description: "Vervollständigen Sie alle erforderlichen Compliance-Prüfungen",
    progress: 65,
    status: 'active'
  },
  {
    id: 3,
    title: "Partnerintegration",
    description: "Verbinden Sie sich mit ausgewählten Investitionspartnern",
    progress: 0,
    status: 'locked'
  },
  {
    id: 4,
    title: "Erste Investition",
    description: "Tätigen Sie Ihre erste Investition und aktivieren Sie Ihr Portfolio",
    progress: 0,
    status: 'locked'
  }];


  const initialDocuments: Document[] = [
  {
    id: 1,
    name: "Personalausweis_Vorderseite.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedAt: "10.01.2026",
    status: 'verified'
  },
  {
    id: 2,
    name: "Adressnachweis_Stromrechnung.pdf",
    type: "PDF",
    size: "1.8 MB",
    uploadedAt: "11.01.2026",
    status: 'pending'
  }];


  useEffect(() => {
    if (isHydrated) {
      setChecklistItems(initialChecklistItems);
      setDocuments(initialDocuments);
    }
  }, [isHydrated]);

  const filteredPartners = partners.filter((partner) => {
    const matchesCategory = selectedCategory === 'Alle' || partner.category === selectedCategory;
    const matchesSearch = partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleConnect = (partnerId: number) => {
    setSelectedPartner(partnerId);
  };

  const handleChecklistToggle = (itemId: number) => {
    setChecklistItems((prev) =>
    prev.map((item) =>
    item.id === itemId ? { ...item, completed: !item.completed } : item
    )
    );
  };

  const handleDocumentUpload = (file: File) => {
    const newDoc: Document = {
      id: documents.length + 1,
      name: file.name,
      type: file.type.split('/')[1].toUpperCase(),
      size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      uploadedAt: new Date().toLocaleDateString('de-DE'),
      status: 'pending'
    };
    setDocuments((prev) => [...prev, newDoc]);
  };

  const handleDocumentDelete = (docId: number) => {
    setDocuments((prev) => prev.filter((doc) => doc.id !== docId));
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto py-12">
          <div className="animate-pulse space-y-8">
            <div className="h-12 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded"></div>
              <div className="h-96 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background pt-20 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto py-12">
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-4">
            <Icon name="UserGroupIcon" size={40} className="text-primary" />
            <h1 className="text-4xl lg:text-5xl font-headline font-bold text-foreground">
              Partnerschaftsportal
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Verbinden Sie sich mit verifizierten Investitionspartnern und erhalten Sie Zugang zu exklusiven Starlink-Infrastrukturinvestitionen. Alle Partner sind EU-reguliert und GDPR-konform.
          </p>
        </div>

        <div className="mb-8 p-6 bg-primary/10 border border-primary/30 rounded-lg">
          <div className="flex items-start space-x-4">
            <Icon name="ShieldCheckIcon" size={32} className="text-primary flex-shrink-0" />
            <div>
              <h3 className="text-lg font-headline font-bold text-foreground mb-2">
                Unabhängige Plattform - Keine Interessenkonflikte
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Wir sind eine unabhängige Analyseplattform und haben keine finanziellen Beziehungen zu den aufgeführten Partnern. Alle Informationen dienen ausschließlich zu Bildungszwecken.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-success/20 text-xs font-cta font-semibold text-success rounded-full border border-success/30">
                  BaFin-konform
                </span>
                <span className="px-3 py-1 bg-success/20 text-xs font-cta font-semibold text-success rounded-full border border-success/30">
                  GDPR-zertifiziert
                </span>
                <span className="px-3 py-1 bg-success/20 text-xs font-cta font-semibold text-success rounded-full border border-success/30">
                  EU-Lizenz
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Icon name="MagnifyingGlassIcon" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Partner suchen..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-smooth" />

            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) =>
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-cta font-semibold text-sm whitespace-nowrap transition-smooth ${
              selectedCategory === category ?
              'bg-primary text-primary-foreground' :
              'bg-card text-muted-foreground hover:text-foreground border border-border hover:border-primary'}`
              }>

                {category}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {filteredPartners.map((partner) =>
          <PartnerCard
            key={partner.id}
            partner={partner}
            onConnect={handleConnect} />

          )}
        </div>

        {selectedPartner &&
        <div className="mb-12">
            <h2 className="text-2xl font-headline font-bold text-foreground mb-6">
              Onboarding-Prozess
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <OnboardingProgress phases={onboardingPhases} />
              <IntegrationStatus steps={integrationSteps} currentStep={2} />
            </div>
          </div>
        }

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <DueDiligenceChecklist
            items={checklistItems}
            onToggle={handleChecklistToggle} />

          <DocumentSharing
            documents={documents}
            onUpload={handleDocumentUpload}
            onDelete={handleDocumentDelete} />

        </div>

        <div className="p-6 bg-card border border-border rounded-lg">
          <div className="flex items-start space-x-4">
            <Icon name="ExclamationTriangleIcon" size={32} className="text-warning flex-shrink-0" />
            <div>
              <h3 className="text-lg font-headline font-bold text-foreground mb-2">
                Wichtige Risikohinweise
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Investitionen in Satelliten-Infrastruktur bergen erhebliche Risiken. Der Wert Ihrer Investition kann steigen oder fallen. Vergangene Performance ist kein Indikator für zukünftige Ergebnisse. Investieren Sie nur Kapital, dessen Verlust Sie sich leisten können.
              </p>
              <p className="text-xs text-muted-foreground">
                Diese Plattform bietet keine Anlageberatung. Alle Informationen dienen ausschließlich zu Bildungszwecken. Konsultieren Sie einen qualifizierten Finanzberater, bevor Sie Investitionsentscheidungen treffen.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>);

}