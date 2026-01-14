'use client';

import { useState, useEffect } from 'react';

const StarlinkAntenna = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    setIsHydrated(true);
    const interval = setInterval(() => {
      setRotation(prev => (prev + 1) % 360);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  if (!isHydrated) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/20 to-primary/0 rounded-full blur-3xl animate-pulse"></div>

      {/* Satellite dish base */}
      <svg
        className="w-full h-full max-w-md max-h-md"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Stand */}
        <rect x="190" y="300" width="20" height="80" fill="currentColor" className="text-muted-foreground opacity-60" />
        <circle cx="200" cy="380" r="25" fill="currentColor" className="text-muted-foreground opacity-40" />

        {/* Dish mount */}
        <circle cx="200" cy="240" r="30" fill="currentColor" className="text-primary opacity-30" />
        <circle cx="200" cy="240" r="25" stroke="currentColor" strokeWidth="2" className="text-primary" />

        {/* Main dish (parabolic antenna) */}
        <ellipse
          cx="200"
          cy="200"
          rx="80"
          ry="60"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          className="text-primary text-glow-primary"
          style={{
            filter: 'drop-shadow(0 0 8px rgba(0, 191, 255, 0.6))',
          }}
        />

        {/* Dish grid lines */}
        {Array.from({ length: 5 }).map((_, i) => (
          <path
            key={`grid-${i}`}
            d={`M ${200 - 80 + (i * 40)} 140 Q 200 260 ${200 - 80 + (i * 40)} 260`}
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-primary opacity-30"
          />
        ))}

        {/* LNB (Low-Noise Block) arm */}
        <line
          x1="200"
          y1="180"
          x2="240"
          y2="140"
          stroke="currentColor"
          strokeWidth="3"
          className="text-secondary"
        />

        {/* LNB receiver */}
        <circle
          cx="245"
          cy="135"
          r="12"
          fill="currentColor"
          className="text-secondary text-glow-secondary"
          style={{
            filter: 'drop-shadow(0 0 6px rgba(255, 107, 107, 0.8))',
          }}
        />

        {/* Rotating signal waves */}
        <g style={{ transform: `rotate(${rotation}deg)`, transformOrigin: '200px 200px', transition: 'transform 0.05s linear' }}>
          <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary opacity-20" />
          <circle cx="200" cy="200" r="130" fill="none" stroke="currentColor" strokeWidth="1" className="text-primary opacity-10" />
        </g>

        {/* Signal indicator dots */}
        <g>
          <circle cx="80" cy="200" r="5" fill="currentColor" className="text-success animate-pulse" style={{ animationDelay: '0s' }} />
          <circle cx="320" cy="200" r="5" fill="currentColor" className="text-success animate-pulse" style={{ animationDelay: '0.3s' }} />
          <circle cx="200" cy="80" r="5" fill="currentColor" className="text-success animate-pulse" style={{ animationDelay: '0.6s' }} />
        </g>

        {/* Text label */}
        <text
          x="200"
          y="350"
          textAnchor="middle"
          className="text-muted-foreground text-sm font-mono"
          fill="currentColor"
          opacity="0.6"
        >
          STARLINK ANTENNA
        </text>
      </svg>

      {/* Connected satellites indicator */}
      <div className="absolute bottom-8 left-8 text-xs font-mono text-primary space-y-1">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
          <span>Connected Satellites: 4,500+</span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
          <span>Signal Strength: 98%</span>
        </div>
      </div>
    </div>
  );
};

export default StarlinkAntenna;
