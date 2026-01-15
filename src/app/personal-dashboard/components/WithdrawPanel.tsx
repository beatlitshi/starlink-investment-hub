'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { supabase } from '@/lib/supabase';

export default function WithdrawPanel() {
  const { user } = useUserAuth();
  const [amount, setAmount] = useState('');
  const [iban, setIban] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [withdrawalHistory, setWithdrawalHistory] = useState<any[]>([]);

  useEffect(() => {
    loadWithdrawalHistory();
  }, []);

  const loadWithdrawalHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/user/withdrawal', {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setWithdrawalHistory(result.withdrawals);
      }
    } catch (error) {
      console.error('Error loading withdrawals:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || !iban) {
      alert('Please enter amount and IBAN');
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (!user || withdrawAmount > user.balance) {
      alert('Insufficient balance');
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please log in again');
        return;
      }

      const response = await fetch('/api/user/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          amount: withdrawAmount,
          iban: iban.trim(),
        }),
      });

      const result = await response.json();

      if (!result.success) {
        alert('Error: ' + result.error);
        return;
      }

      alert('✓ Withdrawal request submitted successfully!\n\nThe admin will process your request soon.');
      setAmount('');
      setIban('');
      loadWithdrawalHistory();
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      alert('Failed to submit withdrawal request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-success';
      case 'rejected':
        return 'text-destructive';
      default:
        return 'text-warning';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return 'CheckCircleIcon';
      case 'rejected':
        return 'XCircleIcon';
      default:
        return 'ClockIcon';
    }
  };

  return (
    <div className="space-y-6">
      {/* Withdrawal Form */}
      <div className="bg-card rounded-lg p-6 shadow-depth">
        <h2 className="text-2xl font-headline font-bold text-foreground mb-4 flex items-center">
          <Icon name="BanknotesIcon" size={28} className="mr-2 text-primary" />
          Withdraw Funds
        </h2>

        <div className="mb-6 p-4 bg-primary/10 rounded-md border border-primary/20">
          <p className="text-sm text-muted-foreground mb-2">
            Available Balance
          </p>
          <p className="text-3xl font-headline font-bold text-foreground">
            €{user?.balance.toFixed(2) || '0.00'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Withdrawal Amount (€)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Enter amount to withdraw"
              min="0"
              step="0.01"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              IBAN
            </label>
            <input
              type="text"
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono"
              placeholder="DE89 3704 0044 0532 0130 00"
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground mt-2">
              Enter your bank account IBAN for the withdrawal
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !amount || !iban}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Submitting...' : 'Request Withdrawal'}
          </button>
        </form>
      </div>

      {/* Withdrawal History */}
      <div className="bg-card rounded-lg p-6 shadow-depth">
        <h3 className="text-xl font-headline font-bold text-foreground mb-4">
          Withdrawal History
        </h3>
        
        {withdrawalHistory.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="InboxIcon" size={48} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No withdrawal requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {withdrawalHistory.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex items-center justify-between p-4 bg-background rounded-md border border-border"
              >
                <div className="flex items-center space-x-3">
                  <Icon
                    name={getStatusIcon(withdrawal.status)}
                    size={24}
                    className={getStatusColor(withdrawal.status)}
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      €{withdrawal.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(withdrawal.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                      withdrawal.status
                    )}`}
                  >
                    {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
