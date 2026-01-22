'use client';

import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Satellite {
  id: string;
  x: number;
  y: number;
}

export default function SatelliteClickerGame() {
  const [earnings, setEarnings] = useState(0);
  const [clicks, setClicks] = useState(0);
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [autoClickLevel, setAutoClickLevel] = useState(0);
  const [perClickEarning, setPerClickEarning] = useState(2.50); // €2.50 per click
  const containerRef = useRef<HTMLDivElement>(null);
  const autoClickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-click feature
  useEffect(() => {
    if (autoClickLevel > 0) {
      autoClickIntervalRef.current = setInterval(() => {
        setEarnings(prev => prev + (perClickEarning * autoClickLevel));
        setClicks(prev => prev + autoClickLevel);
      }, 1000); // Click every second
    }
    return () => {
      if (autoClickIntervalRef.current) clearInterval(autoClickIntervalRef.current);
    };
  }, [autoClickLevel, perClickEarning]);

  const handleSatelliteClick = (satelliteId: string) => {
    // Add earnings
    setEarnings(prev => prev + perClickEarning);
    setClicks(prev => prev + 1);

    // Remove satellite
    setSatellites(prev => prev.filter(s => s.id !== satelliteId));

    // Create floating text effect
    const newSat = satellites.find(s => s.id === satelliteId);
    if (newSat) {
      const floatingText = document.createElement('div');
      floatingText.textContent = `+€${perClickEarning.toFixed(2)}`;
      floatingText.style.position = 'fixed';
      floatingText.style.left = `${newSat.x}px`;
      floatingText.style.top = `${newSat.y}px`;
      floatingText.style.fontSize = '24px';
      floatingText.style.fontWeight = 'bold';
      floatingText.style.color = '#22c55e';
      floatingText.style.pointerEvents = 'none';
      floatingText.style.zIndex = '50';
      floatingText.style.animation = 'floatUp 1s ease-out forwards';
      
      document.body.appendChild(floatingText);
      setTimeout(() => floatingText.remove(), 1000);
    }

    // Spawn new satellite
    spawnSatellite();
  };

  const spawnSatellite = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const newSat: Satellite = {
        id: Math.random().toString(),
        x: Math.random() * (rect.width - 100),
        y: Math.random() * (rect.height - 100),
      };
      setSatellites(prev => [...prev, newSat]);
    }
  };

  const buyAutoClicker = () => {
    const cost = 50 + autoClickLevel * 100;
    if (earnings >= cost) {
      setEarnings(prev => prev - cost);
      setAutoClickLevel(prev => prev + 1);
    }
  };

  const buyMultiplier = () => {
    const cost = 200;
    if (earnings >= cost) {
      setEarnings(prev => prev - cost);
      setPerClickEarning(prev => prev * 1.5); // 50% increase
    }
  };

  // Initialize with first satellite
  useEffect(() => {
    spawnSatellite();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-b border-slate-700 z-40 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Icon name="SparklesIcon" className="text-yellow-500 h-8 w-8" />
              Starlink Satellite Clicker
            </h1>
            <p className="text-slate-400 text-sm">Click satellites to earn commission & win real money!</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-400">€{earnings.toFixed(2)}</div>
            <div className="text-slate-400">Total Earnings</div>
          </div>
        </div>
      </div>

      <div className="pt-24 pb-8 px-4 flex gap-6 max-w-7xl mx-auto">
        {/* Game Area */}
        <div className="flex-1">
          <div
            ref={containerRef}
            className="relative h-[600px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden shadow-2xl"
          >
            {/* Background grid */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px'
              }} />
            </div>

            {/* Satellites */}
            {satellites.map((sat) => (
              <button
                key={sat.id}
                onClick={() => handleSatelliteClick(sat.id)}
                className="absolute w-24 h-24 animate-pulse hover:scale-125 transition-transform active:scale-95 focus:outline-none group"
                style={{
                  left: `${sat.x}px`,
                  top: `${sat.y}px`,
                }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 bg-yellow-500 rounded-full blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                
                {/* Satellite */}
                <div className="relative w-full h-full flex items-center justify-center">
                  <div className="absolute inset-0 border-2 border-yellow-400 rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                  <Icon name="SparklesIcon" className="w-12 h-12 text-yellow-400 z-10 drop-shadow-lg" />
                </div>

                {/* Click hint */}
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-yellow-300 text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  +€{perClickEarning.toFixed(2)}
                </div>
              </button>
            ))}

            {/* Click counter */}
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-sm">Clicks</div>
              <div className="text-2xl font-bold text-white">{clicks}</div>
            </div>

            {/* Per-click rate */}
            <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-sm">Per Click</div>
              <div className="text-2xl font-bold text-green-400">€{perClickEarning.toFixed(2)}</div>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-slate-400 text-sm">Average per Minute</div>
              <div className="text-2xl font-bold text-white">€{((clicks / (clicks > 0 ? clicks : 1)) * 60 * perClickEarning).toFixed(2)}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-slate-400 text-sm">Auto-Clickers Active</div>
              <div className="text-2xl font-bold text-blue-400">{autoClickLevel}</div>
            </div>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <div className="text-slate-400 text-sm">Multiplier</div>
              <div className="text-2xl font-bold text-purple-400">x{(perClickEarning / 2.50).toFixed(1)}</div>
            </div>
          </div>
        </div>

        {/* Upgrades Panel */}
        <div className="w-72 flex flex-col gap-4">
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-2 border-slate-700 p-6 shadow-xl sticky top-28">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Icon name="CogIcon" className="text-blue-400 h-6 w-6" />
              Upgrades
            </h2>

            {/* Auto Clicker Upgrade */}
            <div className="mb-4">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-blue-500 transition-colors cursor-pointer"
                onClick={buyAutoClicker}
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-white">Auto Clicker</h3>
                    <p className="text-xs text-slate-400 mt-1">Clicks 1 satellite/sec</p>
                  </div>
                  <Icon name="BoltIcon" className="text-yellow-500 h-5 w-5" />
                </div>
                <div className="text-sm text-blue-400 font-semibold">
                  Level: {autoClickLevel}
                </div>
                <button
                  onClick={buyAutoClicker}
                  disabled={earnings < (50 + autoClickLevel * 100)}
                  className={`w-full mt-3 py-2 rounded-lg font-bold transition-all ${
                    earnings >= (50 + autoClickLevel * 100)
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  €{(50 + autoClickLevel * 100).toFixed(2)}
                </button>
              </div>
            </div>

            {/* Multiplier Upgrade */}
            <div className="mb-4">
              <div className="bg-slate-900/50 rounded-lg p-4 border border-slate-700 hover:border-purple-500 transition-colors cursor-pointer">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-white">Earning Multiplier</h3>
                    <p className="text-xs text-slate-400 mt-1">+50% per click</p>
                  </div>
                  <Icon name="ChartBarIcon" className="text-purple-500 h-5 w-5" />
                </div>
                <div className="text-sm text-purple-400 font-semibold">
                  Current: x{(perClickEarning / 2.50).toFixed(1)}
                </div>
                <button
                  onClick={buyMultiplier}
                  disabled={earnings < 200}
                  className={`w-full mt-3 py-2 rounded-lg font-bold transition-all ${
                    earnings >= 200
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  €200.00
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-900/30 border border-blue-800 rounded-lg p-4 mt-6">
              <p className="text-xs text-blue-300">
                💡 <strong>Pro Tip:</strong> Buy auto-clickers early to earn passively while you play!
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-60px) scale(0.8);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
