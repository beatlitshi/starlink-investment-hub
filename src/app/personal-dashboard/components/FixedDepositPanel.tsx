'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useUserAuth } from '@/contexts/UserAuthContext';

interface FixedDeposit {
  id: string;
  amount: number;
  apy: number;
  duration: number; // in months
  startDate: string;
  maturityDate: string;
  status: 'active' | 'matured' | 'withdrawn';
  expectedReturn: number;
  currentValue: number;
}

export default function FixedDepositPanel() {
  const { user, refreshBalance } = useUserAuth();
  const [activeDeposits, setActiveDeposits] = useState<FixedDeposit[]>([]);
  const [depositAmount, setDepositAmount] = useState('');
  const [selectedDuration, setSelectedDuration] = useState(12); // 12 months default
  const [isLoading, setIsLoading] = useState(false);

  const APY_RATE = 8; // 8% guaranteed APY

  const durations = [
    { months: 6, label: '6 Monate', bonus: 0 },
    { months: 12, label: '12 Monate', bonus: 0 },
    { months: 24, label: '24 Monate', bonus: 1 }, // +1% bonus
    { months: 36, label: '36 Monate', bonus: 2 }, // +2% bonus
  ];

  useEffect(() => {
    loadDeposits();
  }, [user]);

  const loadDeposits = async () => {
    if (!user) return;
    
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) return;

      const response = await fetch('/api/user/fixed-deposits', {
        headers: { 'Authorization': `Bearer ${token}` },
      });

      const result = await response.json();
      if (result.success) {
        setActiveDeposits(result.deposits || []);
      }
    } catch (error) {
      console.error('Error loading deposits:', error);
    }
  };

  const calculateReturn = (amount: number, months: number) => {
    const duration = durations.find(d => d.months === months);
    const effectiveAPY = APY_RATE + (duration?.bonus || 0);
    const yearlyReturn = amount * (effectiveAPY / 100);
    const totalReturn = yearlyReturn * (months / 12);
    return totalReturn;
  };

  const handleCreateDeposit = async () => {
    if (!depositAmount || !user) return;

    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      alert('Bitte geben Sie einen gültigen Betrag ein');
      return;
    }

    if (amount > user.balance) {
      alert('Unzureichendes Guthaben');
      return;
    }

    if (amount < 100) {
      alert('Mindesteinzahlung: 100 €');
      return;
    }

    setIsLoading(true);

    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert('Authentifizierung erforderlich');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/user/create-fixed-deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          amount,
          duration: selectedDuration,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error('Deposit API error:', result);
        alert(`Fehler: ${result.error || 'Unbekannter Fehler'}`);
        setIsLoading(false);
        return;
      }

      if (result.success) {
        alert(`Festgeld erfolgreich angelegt! Rendite: ${result.deposit.expectedReturn.toFixed(2)} €`);
        setDepositAmount('');
        await loadDeposits();
        await refreshBalance();
      } else {
        alert(`Fehler: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating deposit:', error);
      alert('Fehler beim Anlegen des Festgelds');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (depositId: string) => {
    const deposit = activeDeposits.find(d => d.id === depositId);
    if (!deposit) return;

    const now = new Date();
    const maturityDate = new Date(deposit.maturityDate);
    
    if (now < maturityDate) {
      const earlyWithdrawal = confirm(
        'Vorzeitige Auszahlung bedeutet Verlust der Zinsen. Möchten Sie fortfahren?'
      );
      if (!earlyWithdrawal) return;
    }

    setIsLoading(true);

    try {
      const { supabase } = await import('@/lib/supabase');
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert('Authentifizierung erforderlich');
        setIsLoading(false);
        return;
      }

      const response = await fetch('/api/user/withdraw-fixed-deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ depositId }),
      });

      const result = await response.json();

      if (result.success) {
        alert(`Erfolgreich ausgezahlt: ${result.paidAmount.toFixed(2)} €`);
        await loadDeposits();
        await refreshBalance();
      } else {
        alert(`Fehler: ${result.error}`);
      }
    } catch (error) {
      console.error('Error withdrawing deposit:', error);
      alert('Fehler beim Auszahlen');
    } finally {
      setIsLoading(false);
    }
  };

  const amount = parseFloat(depositAmount) || 0;
  const expectedReturn = calculateReturn(amount, selectedDuration);
  const totalPayout = amount + expectedReturn;
  const selectedDurationData = durations.find(d => d.months === selectedDuration);
  const effectiveAPY = APY_RATE + (selectedDurationData?.bonus || 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-2">
          <Icon name="BanknotesIcon" className="h-8 w-8 text-primary" />
          <h2 className="text-2xl font-headline font-bold">Festgeld-Staking</h2>
        </div>
        <p className="text-muted-foreground">
          Garantierte Rendite von bis zu {APY_RATE + 2}% p.a. - 100% sicher wie bei einer Bank
        </p>
      </div>

      {/* Create New Deposit */}
      <div className="bg-card rounded-lg p-6 shadow-depth">
        <h3 className="text-xl font-headline font-bold mb-4">Neues Festgeld anlegen</h3>
        
        <div className="space-y-4">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium mb-2">Betrag (min. 100 €)</label>
            <input
              type="number"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              placeholder="1000"
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              min="100"
              step="100"
            />
            <p className="text-sm text-muted-foreground mt-1">
              Verfügbares Guthaben: {user?.balance?.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
            </p>
          </div>

          {/* Duration Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Laufzeit</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {durations.map((duration) => (
                <button
                  key={duration.months}
                  onClick={() => setSelectedDuration(duration.months)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedDuration === duration.months
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="font-bold">{duration.label}</div>
                  {duration.bonus > 0 && (
                    <div className="text-xs text-success mt-1">+{duration.bonus}% Bonus</div>
                  )}
                  <div className="text-sm text-muted-foreground mt-1">
                    {APY_RATE + duration.bonus}% p.a.
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Calculation Preview */}
          {amount >= 100 && (
            <div className="bg-primary/5 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Einzahlung:</span>
                <span className="font-bold">{amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Zinssatz:</span>
                <span className="font-bold text-success">{effectiveAPY}% p.a.</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Erwartete Rendite:</span>
                <span className="font-bold text-success">+{expectedReturn.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="font-medium">Auszahlung bei Fälligkeit:</span>
                  <span className="font-bold text-lg text-primary">{totalPayout.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</span>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Fälligkeit: {new Date(Date.now() + selectedDuration * 30 * 24 * 60 * 60 * 1000).toLocaleDateString('de-DE')}
              </div>
            </div>
          )}

          <button
            onClick={handleCreateDeposit}
            disabled={isLoading || !depositAmount || amount < 100}
            className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? 'Wird angelegt...' : 'Festgeld anlegen'}
          </button>
        </div>
      </div>

      {/* Active Deposits */}
      <div className="bg-card rounded-lg p-6 shadow-depth">
        <h3 className="text-xl font-headline font-bold mb-4">Meine Festgelder</h3>
        
        {activeDeposits.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Icon name="BanknotesIcon" className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Noch keine Festgelder angelegt</p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeDeposits.map((deposit) => {
              const now = new Date();
              
              // Safe date parsing
              const startDate = deposit.startDate ? new Date(deposit.startDate) : new Date();
              const maturityDate = deposit.maturityDate ? new Date(deposit.maturityDate) : new Date();
              
              const isMatured = now >= maturityDate;
              const daysRemaining = Math.ceil((maturityDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
              
              // Safety checks for undefined values
              const amount = deposit.amount || 0;
              const apy = deposit.apy || 0;
              const duration = deposit.duration || 0;
              const expectedReturn = deposit.expectedReturn || 0;
              const currentValue = deposit.currentValue || 0;
              
              // Format dates safely
              const startDateStr = startDate.toString() === 'Invalid Date' 
                ? 'N/A'
                : startDate.toLocaleDateString('de-DE');
              const maturityDateStr = maturityDate.toString() === 'Invalid Date'
                ? 'N/A'
                : maturityDate.toLocaleDateString('de-DE');

              return (
                <div key={deposit.id} className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-lg">{amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</div>
                      <div className="text-sm text-muted-foreground">
                        {apy}% p.a. • {duration} Monate
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      deposit.status === 'active' && isMatured
                        ? 'bg-success/10 text-success'
                        : deposit.status === 'active'
                        ? 'bg-primary/10 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {deposit.status === 'active' && isMatured ? 'Fällig' : 
                       deposit.status === 'active' ? 'Aktiv' : 
                       deposit.status === 'matured' ? 'Ausgezahlt' : 'Beendet'}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <div className="text-xs text-muted-foreground">Erwartete Rendite</div>
                      <div className="font-bold text-success">+{expectedReturn.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Gesamtauszahlung</div>
                      <div className="font-bold">{currentValue.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €</div>
                    </div>
                  </div>

                  <div className="text-sm mb-3">
                    <div className="text-muted-foreground">Angelegt: {startDateStr}</div>
                    <div className="text-muted-foreground">Fällig: {maturityDateStr}</div>
                    {deposit.status === 'active' && !isMatured && (
                      <div className="text-primary font-medium mt-1">Noch {daysRemaining} Tage</div>
                    )}
                  </div>

                  {deposit.status === 'active' && (
                    <button
                      onClick={() => handleWithdraw(deposit.id)}
                      disabled={isLoading}
                      className={`w-full py-2 rounded-lg font-bold transition-all ${
                        isMatured
                          ? 'bg-success text-white hover:bg-success/90'
                          : 'bg-muted text-muted-foreground hover:bg-destructive hover:text-white'
                      }`}
                    >
                      {isMatured ? 'Jetzt auszahlen' : 'Vorzeitig auszahlen (ohne Zinsen)'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="bg-card rounded-lg p-6 shadow-depth">
        <h3 className="text-lg font-headline font-bold mb-3">Wie funktioniert Festgeld-Staking?</h3>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>✓ <strong>100% Garantiert:</strong> Ihre Einlage ist vollständig gesichert</p>
          <p>✓ <strong>Feste Zinsen:</strong> Bis zu {APY_RATE + 2}% p.a. garantierte Rendite</p>
          <p>✓ <strong>Flexibilität:</strong> Laufzeiten von 6 bis 36 Monaten</p>
          <p>✓ <strong>Längere Bindung = Mehr Rendite:</strong> Bonus-Zinsen bei längeren Laufzeiten</p>
          <p>⚠️ <strong>Vorzeitige Auszahlung:</strong> Möglich, aber ohne Zinsen</p>
        </div>
      </div>
    </div>
  );
}
