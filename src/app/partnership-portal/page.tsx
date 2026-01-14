import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import PartnershipInteractive from './components/PartnershipInteractive';

export const metadata: Metadata = {
  title: 'Partnerschaftsportal - StarLink Investment Hub',
  description: 'Verbinden Sie sich mit verifizierten EU-regulierten Investitionspartnern für Starlink-Infrastrukturinvestitionen. GDPR-konform, BaFin-reguliert, mit vollständiger Due-Diligence-Unterstützung.',
};

export default function PartnershipPortalPage() {
  return (
    <>
      <Header />
      <PartnershipInteractive />
    </>
  );
}