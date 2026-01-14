'use client';

import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Satellite {
  id: number;
  x: number;
  y: number;
  speed: number;
  angle: number;
  orbit: number;
}

const SatelliteVisualization = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [isRotating, setIsRotating] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const initialSatellites: Satellite[] = Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: 0,
      y: 0,
      speed: 0.3 + Math.random() * 0.5,
      angle: (i * 360) / 24,
      orbit: 120 + (i % 3) * 40,
    }));

    setSatellites(initialSatellites);
  }, [isHydrated]);

  useEffect(() => {
    if (!isHydrated || !canvasRef.current || !isRotating) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = 'rgba(0, 191, 255, 0.1)';
      ctx.lineWidth = 1;
      [120, 160, 200].forEach((radius) => {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.fillStyle = 'rgba(0, 191, 255, 0.8)';
      ctx.shadowBlur = 10;
      ctx.shadowColor = 'rgba(0, 191, 255, 0.5)';

      setSatellites((prev) =>
        prev.map((sat) => {
          const newAngle = sat.angle + sat.speed;
          const radian = (newAngle * Math.PI) / 180;
          const x = centerX + Math.cos(radian) * sat.orbit;
          const y = centerY + Math.sin(radian) * sat.orbit;

          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();

          return { ...sat, angle: newAngle % 360, x, y };
        })
      );

      ctx.shadowBlur = 0;

      ctx.fillStyle = 'rgba(0, 191, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(0, 191, 255, 0.8)';
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fill();

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHydrated, isRotating]);

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  if (!isHydrated) {
    return (
      <section className="py-20 bg-gradient-to-b from-background to-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-headline font-bold text-foreground mb-4">
              Satelliten-Konstellation
            </h2>
            <p className="text-xl text-muted-foreground font-body">
              Laden...
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-b from-background to-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-headline font-bold text-foreground mb-4">
            Interaktive Satelliten-Konstellation
          </h2>
          <p className="text-xl text-muted-foreground font-body">
            Erleben Sie die globale Starlink-Infrastruktur in Echtzeit
          </p>
        </div>

        <div className="relative bg-card border border-border rounded-2xl p-8 shadow-depth">
          <div className="flex justify-center mb-8">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="max-w-full h-auto"
            />
          </div>

          <div className="flex justify-center space-x-4">
            <button
              onClick={toggleRotation}
              className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-cta font-bold hover:bg-accent transition-smooth"
            >
              <Icon name={isRotating ? 'PauseIcon' : 'PlayIcon'} size={20} />
              <span>{isRotating ? 'Pause' : 'Start'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
                <Icon name="SignalIcon" size={32} className="text-primary" />
              </div>
              <h3 className="text-lg font-headline font-bold text-foreground mb-2">
                Niedrige Latenz
              </h3>
              <p className="text-muted-foreground font-body">
                20-40ms durchschnittliche Latenzzeit
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-secondary/20 rounded-full mb-4">
                <Icon name="BoltIcon" size={32} className="text-secondary" />
              </div>
              <h3 className="text-lg font-headline font-bold text-foreground mb-2">
                Hohe Geschwindigkeit
              </h3>
              <p className="text-muted-foreground font-body">
                Bis zu 350 Mbps Download-Geschwindigkeit
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-success/20 rounded-full mb-4">
                <Icon name="GlobeAltIcon" size={32} className="text-success" />
              </div>
              <h3 className="text-lg font-headline font-bold text-foreground mb-2">
                Globale Abdeckung
              </h3>
              <p className="text-muted-foreground font-body">
                Verfügbar in über 145 Ländern weltweit
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SatelliteVisualization;