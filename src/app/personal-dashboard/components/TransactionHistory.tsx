'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { supabase } from '@/lib/supabase';
import { useUserAuth } from '@/contexts/UserAuthContext';

interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'crypto_bonus' | 'stock_purchase' | 'stock_sale';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  notes?: string;
  timestamp: string;
}

export default function TransactionHistory() {
  const { user } = useUserAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'deposit' | 'withdrawal' | 'trades'>('all');

  useEffect(() => {
    loadTransactions();
  }, [user]);

  const loadTransactions = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Error loading transactions:', error);
        return;
      }

      setTransactions(data || []);
    } catch (error) {
      console.error('Error loading transactions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeIcon = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'ArrowDownTrayIcon';
      case 'withdrawal':
        return 'ArrowUpTrayIcon';
      case 'crypto_bonus':
        return 'SparklesIcon';
      case 'stock_purchase':
        return 'ArrowUpCircleIcon';
      case 'stock_sale':
        return 'ArrowDownCircleIcon';
      default:
        return 'BanknotesIcon';
    }
  };

  const getTypeColor = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'text-success';
      case 'withdrawal':
        return 'text-warning';
      case 'crypto_bonus':
        return 'text-secondary';
      case 'stock_purchase':
        return 'text-primary';
      case 'stock_sale':
        return 'text-accent';
      default:
        return 'text-muted-foreground';
    }
  };

  const getTypeLabel = (type: Transaction['type']) => {
    switch (type) {
      case 'deposit':
        return 'Deposit';
      case 'withdrawal':
        return 'Withdrawal';
      case 'crypto_bonus':
        return 'Crypto Bonus';
      case 'stock_purchase':
        return 'Stock Purchase';
      case 'stock_sale':
        return 'Stock Sale';
      default:
        return type;
    }
  };

  const filteredTransactions = transactions.filter((tx) => {
    if (filter === 'all') return true;
    if (filter === 'deposit') return tx.type === 'deposit' || tx.type === 'crypto_bonus';
    if (filter === 'withdrawal') return tx.type === 'withdrawal';
    if (filter === 'trades') return tx.type === 'stock_purchase' || tx.type === 'stock_sale';
    return true;
  });

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-headline font-bold text-foreground flex items-center">
          <Icon name="ClockIcon" size={28} className="mr-2 text-primary" />
          Transaction History
        </h2>

        <div className="flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-smooth ${
              filter === 'all'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('deposit')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-smooth ${
              filter === 'deposit'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            Deposits
          </button>
          <button
            onClick={() => setFilter('withdrawal')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-smooth ${
              filter === 'withdrawal'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            Withdrawals
          </button>
          <button
            onClick={() => setFilter('trades')}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-smooth ${
              filter === 'trades'
                ? 'bg-primary text-primary-foreground'
                : 'bg-card text-muted-foreground hover:bg-muted'
            }`}
          >
            Trades
          </button>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-depth overflow-hidden">
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground font-mono">Loading transactions...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <Icon name="InboxIcon" size={64} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-lg font-body">No transactions found</p>
            <p className="text-sm text-muted-foreground mt-2">
              Your transaction history will appear here
            </p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="p-4 hover:bg-muted/20 transition-smooth flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full bg-current/20 ${getTypeColor(transaction.type)}`}>
                    <Icon
                      name={getTypeIcon(transaction.type) as any}
                      size={24}
                      className={getTypeColor(transaction.type)}
                    />
                  </div>
                  <div>
                    <h3 className="text-base font-cta font-bold text-foreground">
                      {getTypeLabel(transaction.type)}
                    </h3>
                    {transaction.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{transaction.notes}</p>
                    )}
                    <p className="text-xs font-mono text-muted-foreground mt-1">
                      {formatDate(transaction.timestamp)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`text-xl font-headline font-bold ${
                      transaction.amount >= 0 ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {transaction.amount >= 0 ? '+' : ''}
                    €{Math.abs(transaction.amount).toLocaleString('de-DE', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-mono rounded-full mt-1 ${
                      transaction.status === 'completed'
                        ? 'bg-success/20 text-success'
                        : transaction.status === 'pending'
                        ? 'bg-warning/20 text-warning'
                        : 'bg-destructive/20 text-destructive'
                    }`}
                  >
                    {transaction.status}
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
