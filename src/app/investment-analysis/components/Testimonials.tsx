import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface Testimonial {
  name: string;
  role: string;
  company: string;
  image: string;
  alt: string;
  quote: string;
  rating: number;
}

interface TestimonialsProps {
  className?: string;
}

const Testimonials = ({ className = '' }: TestimonialsProps) => {
  const testimonials: Testimonial[] = [
  {
    name: 'Dr. Michael Schmidt',
    role: 'Investmentanalyst',
    company: 'Deutsche Finanzberatung AG',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_1ed465880-1763294125467.png",
    alt: 'Professional businessman in navy suit with gray hair and glasses in modern office setting',
    quote: 'Die Datenqualität und Analysetiefe dieser Plattform sind außergewöhnlich. Als Finanzberater schätze ich besonders die transparente Darstellung von Risiken und Chancen.',
    rating: 5
  },
  {
    name: 'Sarah Müller',
    role: 'Portfolio Manager',
    company: 'TechInvest Capital',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_126946a46-1763294962859.png",
    alt: 'Professional woman with blonde hair in black blazer smiling confidently in corporate environment',
    quote: 'Endlich eine Plattform, die komplexe Satelliteninternet-Investitionen verständlich macht. Die interaktiven Tools haben mir geholfen, fundierte Entscheidungen für meine Kunden zu treffen.',
    rating: 5
  },
  {
    name: 'Thomas Weber',
    role: 'Tech-Investor',
    company: 'Innovation Ventures',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_14d5770fa-1763294770713.png",
    alt: 'Young professional man with short brown hair in casual blue shirt in modern tech office',
    quote: 'Die Marktanalysen sind erstklassig und die Prognosen basieren auf soliden Daten. Diese Plattform hat mein Verständnis für den Satelliteninternet-Markt revolutioniert.',
    rating: 5
  },
  {
    name: 'Lisa Hoffmann',
    role: 'Vermögensberaterin',
    company: 'Wealth Management Pro',
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_18d4825d1-1763293841178.png",
    alt: 'Professional woman with dark hair in burgundy blazer with confident expression in office',
    quote: 'Die Kombination aus technischer Expertise und finanzieller Analyse ist beeindruckend. Meine Kunden vertrauen auf die hier präsentierten Informationen.',
    rating: 5
  }];


  return (
    <section className={`py-16 bg-muted/20 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-headline font-bold text-foreground mb-4">
            Was Experten sagen
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Vertrauen Sie auf die Erfahrungen von Finanzprofis und Investoren
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) =>
          <div key={index} className="bg-card border border-border rounded-lg p-6 shadow-depth hover:border-primary/50 transition-smooth">
              <div className="flex items-start space-x-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                  <AppImage
                  src={testimonial.image}
                  alt={testimonial.alt}
                  className="w-full h-full object-cover" />

                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-headline font-bold text-foreground">{testimonial.name}</h3>
                  <p className="text-sm text-primary font-cta">{testimonial.role}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.company}</p>
                </div>
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) =>
                <Icon key={i} name="StarIcon" size={16} variant="solid" className="text-secondary" />
                )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground italic leading-relaxed">
                "{testimonial.quote}"
              </p>
            </div>
          )}
        </div>

        <div className="mt-12 bg-primary/10 border border-primary/30 rounded-lg p-8 text-center">
          <div className="flex items-center justify-center space-x-8 mb-6">
            <div>
              <p className="text-4xl font-headline font-bold text-primary mb-1">4,9</p>
              <div className="flex space-x-1 mb-1">
                {[...Array(5)].map((_, i) =>
                <Icon key={i} name="StarIcon" size={20} variant="solid" className="text-secondary" />
                )}
              </div>
              <p className="text-xs text-muted-foreground">Durchschnittsbewertung</p>
            </div>
            <div className="h-16 w-px bg-border"></div>
            <div>
              <p className="text-4xl font-headline font-bold text-primary mb-1">2.847</p>
              <p className="text-xs text-muted-foreground">Verifizierte Bewertungen</p>
            </div>
            <div className="h-16 w-px bg-border"></div>
            <div>
              <p className="text-4xl font-headline font-bold text-primary mb-1">98%</p>
              <p className="text-xs text-muted-foreground">Empfehlungsrate</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Über 2.800 Finanzprofis und Investoren vertrauen auf unsere Analysen
          </p>
        </div>
      </div>
    </section>);

};

export default Testimonials;