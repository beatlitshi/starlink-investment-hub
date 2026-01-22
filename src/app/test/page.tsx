'use client';

import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Satellite {
  id: string;
  x: number;
  y: number;
  product: StarlinkProduct;
}

interface StarlinkProduct {
  id: string;
  name: string;
  price: number;
  commission: number; // percentage
  image: string;
}

interface TeamMember {
  id: string;
  name: string;
  salesCount: number;
  totalEarnings: number;
  level: number;
}

const STARLINK_PRODUCTS: StarlinkProduct[] = [
  {
    id: 'mini',
    name: 'Starlink Mini',
    price: 599,
    commission: 0.015, // €0.015 per click/sale
    image: '📡',
  },
  {
    id: 'standard',
    name: 'Starlink Standard',
    price: 899,
    commission: 0.025,
    image: '🛰️',
  },
  {
    id: 'pro',
    name: 'Starlink Pro',
    price: 2499,
    commission: 0.045,
    image: '✨',
  },
  {
    id: 'business',
    name: 'Starlink Business',
    price: 5000,
    commission: 0.08,
    image: '💼',
  },
  {
    id: 'enterprise',
    name: 'Starlink Enterprise',
    price: 15000,
    commission: 0.15,
    image: '🏢',
  },
];

export default function StarlinkAffiliateGame() {
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState(0);
  const [totalEarnings, setTotalEarnings] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [conversionRate, setConversionRate] = useState(2.5); // 2.5%
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [activeBoosts, setActiveBoosts] = useState(0);
  const [playerLevel, setPlayerLevel] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoClickIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Deposit to boost earnings
  const handleDeposit = (amount: number) => {
    if (amount > 0) {
      setDepositAmount(prev => prev + amount);
      // Deposit gives you starting capital and boost
      setBalance(prev => prev + amount);
      setActiveBoosts(prev => prev + 1);
    }
  };

  // Calculate commission based on deposit leverage
  const getCommission = (baseCommission: number): number => {
    const leverageMultiplier = depositAmount > 0 ? 1 + (depositAmount / 10000) : 1;
    return baseCommission * leverageMultiplier;
  };

  // Simulate sales with skill challenge
  const handleSaleClick = (product: StarlinkProduct) => {
    // Skill check: 70% success rate
    if (Math.random() > 0.3) {
      const commission = getCommission(product.commission);
      setBalance(prev => prev + commission);
      setTotalEarnings(prev => prev + commission);
      setTotalSales(prev => prev + 1);

      // Add to monthly revenue
      setMonthlyRevenue(prev => prev + commission);

      // Remove satellite
      setSatellites(prev => prev.filter(s => s.id !== s.id));

      // Spawn new one
      spawnSatellite();

      // Floating text
      const newSat = satellites.find(s => s.id === s.id);
      if (newSat) {
        const floatingText = document.createElement('div');
        floatingText.textContent = `+€${commission.toFixed(4)}`;
        floatingText.style.position = 'fixed';
        floatingText.style.left = `${newSat.x}px`;
        floatingText.style.top = `${newSat.y}px`;
        floatingText.style.fontSize = '20px';
        floatingText.style.fontWeight = 'bold';
        floatingText.style.color = '#10b981';
        floatingText.style.pointerEvents = 'none';
        floatingText.style.zIndex = '50';
        floatingText.style.animation = 'floatUp 1s ease-out forwards';
        
        document.body.appendChild(floatingText);
        setTimeout(() => floatingText.remove(), 1000);
      }

      // Upgrade level every 20 sales
      if (totalSales % 20 === 0) {
        setPlayerLevel(prev => prev + 1);
      }
    }
  };

  const spawnSatellite = () => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const product = STARLINK_PRODUCTS[Math.floor(Math.random() * STARLINK_PRODUCTS.length)];
      const newSat: Satellite = {
        id: Math.random().toString(),
        x: Math.random() * (rect.width - 120),
        y: Math.random() * (rect.height - 120),
        product,
      };
      setSatellites(prev => [...prev.slice(-4), newSat]); // Max 5 on screen
    }
  };

  const hireTeamMember = () => {
    if (balance >= 500) {
      setBalance(prev => prev - 500);
      const newMember: TeamMember = {
        id: Math.random().toString(),
        name: `Sales Agent ${teamMembers.length + 1}`,
        salesCount: 0,
        totalEarnings: 0,
        level: 1,
      };
      setTeamMembers(prev => [...prev, newMember]);

      // Team members auto-generate sales
      const interval = setInterval(() => {
        if (Math.random() > 0.6) { // 40% chance per interval
          const product = STARLINK_PRODUCTS[Math.floor(Math.random() * STARLINK_PRODUCTS.length)];
          const commission = getCommission(product.commission) * 0.7; // Team gets 70% of normal
          setBalance(prev => prev + commission);
          setTotalEarnings(prev => prev + commission);
          setTotalSales(prev => prev + 1);
          setMonthlyRevenue(prev => prev + commission);

          setTeamMembers(prev => prev.map(m => 
            m.id === newMember.id 
              ? { ...m, salesCount: m.salesCount + 1, totalEarnings: m.totalEarnings + commission }
              : m
          ));
        }
      }, 3000);

      return () => clearInterval(interval);
    }
  };

  const buyMarketingCampaign = () => {
    if (balance >= 1000) {
      setBalance(prev => prev - 1000);
      setConversionRate(prev => Math.min(prev + 5, 50)); // Max 50% conversion
      
      setTimeout(() => {
        setConversionRate(prev => Math.max(prev - 5, 2.5)); // Decays after 30 seconds
      }, 30000);
    }
  };

  // Initialize
  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      spawnSatellite();
    }
  }, []);

  // Monthly revenue reset
  useEffect(() => {
    const monthlyReset = setInterval(() => {
      setMonthlyRevenue(0);
    }, 30000); // Reset every 30 seconds for demo

    return () => clearInterval(monthlyReset);
  }, []);

  const conversionValue = (totalSales * conversionRate / 100).toFixed(0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-slate-950/95 backdrop-blur border-b border-slate-700 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-4xl font-bold text-white flex items-center gap-3">
              <span className="text-4xl">🛰️</span>
              Starlink Affiliate Business
              <span className="text-sm bg-green-900 text-green-300 px-3 py-1 rounded-full">Level {playerLevel}</span>
            </h1>
            <div className="text-right">
              <div className="text-4xl font-bold text-green-400">€{balance.toFixed(4)}</div>
              <div className="text-slate-400 text-sm">Current Balance</div>
            </div>
          </div>
          
          {/* Quick stats */}
          <div className="grid grid-cols-6 gap-3 text-center text-sm">
            <div className="bg-slate-800 rounded px-2 py-1">
              <div className="text-slate-400">Total Sales</div>
              <div className="font-bold text-white">{totalSales}</div>
            </div>
            <div className="bg-slate-800 rounded px-2 py-1">
              <div className="text-slate-400">Total Earnings</div>
              <div className="font-bold text-green-400">€{totalEarnings.toFixed(4)}</div>
            </div>
            <div className="bg-slate-800 rounded px-2 py-1">
              <div className="text-slate-400">Conversion Rate</div>
              <div className="font-bold text-blue-400">{conversionRate.toFixed(1)}%</div>
            </div>
            <div className="bg-slate-800 rounded px-2 py-1">
              <div className="text-slate-400">Monthly Revenue</div>
              <div className="font-bold text-purple-400">€{monthlyRevenue.toFixed(4)}</div>
            </div>
            <div className="bg-slate-800 rounded px-2 py-1">
              <div className="text-slate-400">Deposit Leverage</div>
              <div className="font-bold text-yellow-400">x{(1 + depositAmount/10000).toFixed(2)}</div>
            </div>
            <div className="bg-slate-800 rounded px-2 py-1">
              <div className="text-slate-400">Team Members</div>
              <div className="font-bold text-pink-400">{teamMembers.length}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-48 pb-8 px-4 flex gap-6 max-w-7xl mx-auto">
        {/* Main Game Area */}
        <div className="flex-1">
          <div
            ref={containerRef}
            className="relative h-[500px] bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-2 border-slate-700 overflow-hidden shadow-2xl mb-4"
          >
            {/* Grid background */}
            <div className="absolute inset-0 opacity-5">
              <div style={{
                backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(255,255,255,.05) 25%, rgba(255,255,255,.05) 26%, transparent 27%, transparent 74%, rgba(255,255,255,.05) 75%, rgba(255,255,255,.05) 76%, transparent 77%, transparent)',
                backgroundSize: '50px 50px'
              }} className="w-full h-full" />
            </div>

            {/* Products to sell */}
            {satellites.map((sat) => (
              <button
                key={sat.id}
                onClick={() => handleSaleClick(sat.product)}
                className="absolute w-28 h-28 group focus:outline-none"
                style={{
                  left: `${sat.x}px`,
                  top: `${sat.y}px`,
                }}
              >
                <div className="relative w-full h-full flex flex-col items-center justify-center">
                  {/* Glow */}
                  <div className="absolute inset-0 bg-blue-500 rounded-lg blur-xl opacity-30 group-hover:opacity-60 transition-opacity" />
                  
                  {/* Product card */}
                  <div className="relative bg-slate-900 border-2 border-slate-700 group-hover:border-blue-500 rounded-lg p-3 w-full h-full flex flex-col items-center justify-center transition-all group-hover:scale-110 group-active:scale-95">
                    <div className="text-4xl mb-1">{sat.product.image}</div>
                    <div className="text-xs font-bold text-white text-center line-clamp-1">{sat.product.name}</div>
                    <div className="text-xs text-green-400 mt-1">+€{(getCommission(sat.product.commission)).toFixed(4)}</div>
                  </div>
                </div>
              </button>
            ))}

            {/* Instructions */}
            <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur px-4 py-2 rounded-lg border border-slate-700">
              <div className="text-slate-400 text-xs">💡 Click products to complete sales</div>
              <div className="text-xs text-yellow-400 font-bold">70% success rate</div>
            </div>
          </div>

          {/* Deposit Section */}
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-4">
            <h3 className="font-bold text-white mb-3 flex items-center gap-2">
              <Icon name="CurrencyDollarIcon" className="text-green-500 h-5 w-5" />
              Investment Capital (Boost Earnings)
            </h3>
            <div className="grid grid-cols-4 gap-2">
              {[100, 500, 1000, 5000].map(amount => (
                <button
                  key={amount}
                  onClick={() => handleDeposit(amount)}
                  className="bg-green-900 hover:bg-green-800 text-green-300 py-2 rounded-lg font-bold transition-all"
                >
                  +€{amount}
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-slate-400">
              💰 Current Deposit: €{depositAmount.toFixed(2)} | Earning Multiplier: x{(1 + depositAmount/10000).toFixed(2)}
            </div>
          </div>

          {/* Products Overview */}
          <div className="grid grid-cols-5 gap-2">
            {STARLINK_PRODUCTS.map(product => (
              <div key={product.id} className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-center text-xs">
                <div className="text-3xl mb-1">{product.image}</div>
                <div className="font-bold text-white text-xs line-clamp-2">{product.name}</div>
                <div className="text-slate-400 text-xs mt-1">${product.price}</div>
                <div className="text-green-400 text-xs font-bold mt-1">€{product.commission.toFixed(4)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar - Business Operations */}
        <div className="w-80 flex flex-col gap-4">
          {/* Team Management */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-2 border-slate-700 p-4 shadow-xl sticky top-48">
            <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
              <Icon name="UserGroupIcon" className="text-pink-400 h-5 w-5" />
              Sales Team ({teamMembers.length})
            </h2>

            {teamMembers.length === 0 ? (
              <p className="text-slate-400 text-sm mb-3">No team members yet</p>
            ) : (
              <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
                {teamMembers.map(member => (
                  <div key={member.id} className="bg-slate-900 rounded p-2 text-xs border border-slate-700">
                    <div className="font-bold text-white">{member.name}</div>
                    <div className="text-slate-400">Sales: {member.salesCount} | Earnings: €{member.totalEarnings.toFixed(4)}</div>
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={hireTeamMember}
              disabled={balance < 500}
              className={`w-full py-2 rounded-lg font-bold mb-3 transition-all text-sm ${
                balance >= 500
                  ? 'bg-pink-600 hover:bg-pink-700 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              Hire Agent (€500)
            </button>

            <div className="bg-pink-900/30 border border-pink-800 rounded p-2 text-xs text-pink-300">
              👥 Team members auto-generate sales (40% chance/3sec)
            </div>
          </div>

          {/* Upgrades */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-2 border-slate-700 p-4 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-3">🚀 Upgrades</h2>

            <button
              onClick={buyMarketingCampaign}
              disabled={balance < 1000}
              className={`w-full py-3 rounded-lg font-bold mb-3 transition-all text-sm ${
                balance >= 1000
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-slate-700 text-slate-500 cursor-not-allowed'
              }`}
            >
              <div>Marketing Campaign</div>
              <div className="text-xs opacity-80">+5% conversion (30s) | €1000</div>
            </button>

            <div className="bg-blue-900/30 border border-blue-800 rounded p-2 text-xs text-blue-300">
              📊 Conversion Rate: {conversionRate.toFixed(1)}% | ~{conversionValue} sales expected
            </div>
          </div>

          {/* Business Metrics */}
          <div className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-xl border-2 border-slate-700 p-4">
            <h2 className="text-lg font-bold text-white mb-3">📈 Business Metrics</h2>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-400">Avg Per Sale:</span>
                <span className="font-bold text-white">€{totalSales > 0 ? (totalEarnings / totalSales).toFixed(4) : '0.00'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">ROI:</span>
                <span className="font-bold text-green-400">{depositAmount > 0 ? ((totalEarnings / depositAmount) * 100).toFixed(1) : '0'}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Projected Monthly:</span>
                <span className="font-bold text-purple-400">€{(monthlyRevenue * 2).toFixed(4)}</span>
              </div>
              <div className="border-t border-slate-700 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">Active Boosts:</span>
                  <span className="font-bold text-yellow-400">{activeBoosts}x</span>
                </div>
              </div>
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
