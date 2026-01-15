'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import Header from '@/components/common/Header';
import { useStockPrices } from '@/hooks/useStockPrices';
import { supabase } from '@/lib/supabase';

interface User {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'approved' | 'rejected';
  joinDate: string;
  dashboardAccess: boolean;
  accountBalance: number;
  cryptoHoldings: number;
}

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  type: 'deposit' | 'withdrawal' | 'crypto_bonus';
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  notes?: string;
}

interface WithdrawalRequest {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  requestDate: string;
  processedDate?: string;
}

interface HomepageSection {
  id: string;
  name: string;
  enabled: boolean;
  order: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const { isAuthenticated, login, logout } = useAdminAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'stocks' | 'content' | 'system' | 'financial'>('overview');
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncInterval, setSyncInterval] = useState(60000); // 1 minute default

  // Use the stock prices hook with auto-refresh
  const { 
    stocks, 
    isLoading: stocksLoading, 
    error: stocksError, 
    lastSync, 
    refreshStocks, 
    updateStockPrice 
  } = useStockPrices({
    symbols: ['STLK', 'TECH', 'SPACE', 'IBM', 'AAPL'],
    autoRefresh: false,
    refreshInterval: syncInterval,
  });

  const [users, setUsers] = useState<User[]>([]);

  // Load users and transactions from Supabase
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch('/api/admin/users');
        const json = await res.json();
        if (!json.success) {
          console.error('Error loading users:', json.error);
          return;
        }
        const formattedUsers = json.data.map((user: any) => ({
          id: user.id,
          authId: user.auth_id,
          name: `${user.first_name} ${user.last_name}`,
          email: user.email,
          phoneNumber: user.phone_number,
          status: user.status || 'pending',
          joinDate: new Date(user.created_at).toLocaleDateString(),
          dashboardAccess: user.dashboard_access ?? true,
          accountBalance: user.balance || 0,
          cryptoHoldings: user.crypto_holdings || 0,
        }));
        setUsers(formattedUsers);
      } catch (e) {
        console.error('Error loading users:', e);
      }
    };
    const loadTransactions = async () => {
      try {
        const res = await fetch('/api/admin/transactions');
        const json = await res.json();
        if (!json.success) {
          console.error('Error loading transactions:', json.error);
          return;
        }
        setTransactions(json.data.map((tx: any) => ({
          id: tx.id,
          userId: tx.user_id,
          userName: tx.user_name,
          type: tx.type,
          amount: tx.amount,
          status: tx.status,
          timestamp: tx.timestamp,
          notes: tx.notes,
        })));
      } catch (e) {
        console.error('Error loading transactions:', e);
      }
    };
    loadUsers();
    loadTransactions();

    // Subscribe to realtime changes for users and transactions
    const usersChannel = supabase
      .channel('admin-users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const user = payload.new as any;
          setUsers((prev) => [{
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            phoneNumber: user.phone_number,
            status: user.status || 'pending',
            joinDate: new Date(user.created_at).toLocaleDateString(),
            dashboardAccess: user.dashboard_access ?? true,
            accountBalance: user.balance || 0,
            cryptoHoldings: user.crypto_holdings || 0,
          }, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const user = payload.new as any;
          setUsers((prev) => prev.map(u => u.id === user.id ? {
            id: user.id,
            name: `${user.first_name} ${user.last_name}`,
            email: user.email,
            phoneNumber: user.phone_number,
            status: user.status || 'pending',
            joinDate: new Date(user.created_at).toLocaleDateString(),
            dashboardAccess: user.dashboard_access ?? true,
            accountBalance: user.balance || 0,
            cryptoHoldings: user.crypto_holdings || 0,
          } : u));
        } else if (payload.eventType === 'DELETE') {
          const deletedId = (payload.old as any).id;
          setUsers((prev) => prev.filter(u => u.id !== deletedId));
        }
      })
      .subscribe();

    const transactionsChannel = supabase
      .channel('admin-transactions')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const tx = payload.new as any;
          setTransactions((prev) => [{
            id: tx.id,
            userId: tx.user_id,
            userName: tx.user_name,
            type: tx.type,
            amount: tx.amount,
            status: tx.status,
            timestamp: tx.timestamp,
            notes: tx.notes,
          }, ...prev]);
        } else if (payload.eventType === 'UPDATE') {
          const tx = payload.new as any;
          setTransactions((prev) => prev.map(t => t.id === tx.id ? {
            id: tx.id,
            userId: tx.user_id,
            userName: tx.user_name,
            type: tx.type,
            amount: tx.amount,
            status: tx.status,
            timestamp: tx.timestamp,
            notes: tx.notes,
          } : t));
        } else if (payload.eventType === 'DELETE') {
          const deletedId = (payload.old as any).id;
          setTransactions((prev) => prev.filter(t => t.id !== deletedId));
        }
      })
      .subscribe();

    // Also listen to broadcast changes if enabled server-side
    const usersBroadcastChannel = supabase
      .channel('public:users')
      .on('broadcast', { event: 'postgres_changes' }, () => {
        // Refresh users list on any broadcasted change
        loadUsers();
      })
      .subscribe();

    const transactionsBroadcastChannel = supabase
      .channel('public:transactions')
      .on('broadcast', { event: 'postgres_changes' }, () => {
        // Refresh transactions list on any broadcasted change
        loadTransactions();
      })
      .subscribe();

    return () => {
      try { supabase.removeChannel(usersChannel); } catch {}
      try { supabase.removeChannel(transactionsChannel); } catch {}
      try { supabase.removeChannel(usersBroadcastChannel); } catch {}
      try { supabase.removeChannel(transactionsBroadcastChannel); } catch {}
    };
  }, []);

  // Save user balance to database when changed
  const updateUserBalance = async (userId: string, newBalance: number) => {
    const { error } = await supabase
      .from('users')
      .update({ balance: newBalance })
      .eq('id', userId);
    if (error) {
      console.error('Error updating user balance:', error);
    }
  };

  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);

  const [depositForm, setDepositForm] = useState({ userId: '', amount: '', notes: '' });
  const [showDepositModal, setShowDepositModal] = useState(false);
  
  // New features state
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [showStockControlModal, setShowStockControlModal] = useState(false);
  const [showCryptoWalletModal, setShowCryptoWalletModal] = useState(false);
  const [bonusForm, setBonusForm] = useState({ userId: '' });
  const [stockControlForm, setStockControlForm] = useState({ symbol: 'STLK', targetChangePercent: 10, durationMinutes: 60 });
  const [cryptoWalletForm, setCryptoWalletForm] = useState({ userId: '', walletAddress: '', cryptoType: 'BTC' });
  const [withdrawals, setWithdrawals] = useState<any[]>([]);

  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([
    { id: '1', name: 'Hero Section', enabled: true, order: 1 },
    { id: '2', name: 'Investment Highlights', enabled: true, order: 2 },
    { id: '3', name: 'Market Opportunity', enabled: true, order: 3 },
    { id: '4', name: 'Technology Showcase', enabled: true, order: 4 },
    { id: '5', name: 'Newsletter Signup', enabled: true, order: 5 },
  ]);

  const [systemStats] = useState({
    totalUsers: 156,
    pendingApprovals: 12,
    activeInvestments: 89,
    systemUptime: '99.9%',
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = login(loginForm.username, loginForm.password);
      if (!success) {
        setLoginError('Invalid credentials. Use admin/Admin123#');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleUserAction = async (userId: string, action: 'approve' | 'reject' | 'toggleDashboard') => {
    const user = users.find(u => u.id === userId);
    if (!user) return;
    let updates: any = {};
    if (action === 'approve') updates = { status: 'approved', dashboard_access: true };
    if (action === 'reject') updates = { status: 'rejected', dashboard_access: false };
    if (action === 'toggleDashboard') updates = { dashboard_access: !user.dashboardAccess };
    // Use admin API to update user securely
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, updates }),
      });
      const json = await res.json();
      if (!json.success) {
        console.error('Error updating user:', json.error);
      }
    } catch (e) {
      console.error('Error updating user:', e);
    }
    setUsers(users.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const handleChangePassword = async (authId: string) => {
    const newPwd = window.prompt('Enter new password for this user:');
    if (!newPwd) return;
    try {
      const res = await fetch('/api/admin/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authId, newPassword: newPwd }),
      });
      const json = await res.json();
      if (!json.success) {
        alert(`Failed to update password: ${json.error}`);
      } else {
        alert('Password updated successfully');
      }
    } catch (e: any) {
      alert(`Failed to update password: ${e.message}`);
    }
  };

  const handleConfirmUser = async (authId: string) => {
    if (!authId) {
      alert('User has no auth ID');
      return;
    }
    if (!confirm('Manually confirm this user\'s email?')) return;
    try {
      const res = await fetch('/api/admin/confirm-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ authId }),
      });
      const json = await res.json();
      if (!json.success) {
        alert(`Failed to confirm user: ${json.error}`);
      } else {
        alert('User email confirmed successfully');
        loadUsers(); // Refresh the list
      }
    } catch (e: any) {
      alert(`Failed to confirm user: ${e.message}`);
    }
  };

  const handleAddMoney = async () => {
    if (!depositForm.userId || !depositForm.amount) {
      alert('Please select a user and enter an amount');
      return;
    }
    
    const user = users.find(u => u.id === depositForm.userId);
    if (!user) {
      alert('User not found');
      return;
    }
    
    const amount = parseFloat(depositForm.amount);
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    try {
      const response = await fetch('/api/admin/add-money', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: depositForm.userId,
          amount: amount
        })
      });

      const result = await response.json();

      if (!result.success) {
        alert('Error: ' + result.error);
        return;
      }

      // Update local state with new balance
      setUsers(users.map(u => 
        u.id === depositForm.userId 
          ? { ...u, accountBalance: result.newBalance } 
          : u
      ));

      // Reset form
      setDepositForm({ userId: '', amount: '', notes: '' });
      setShowDepositModal(false);
      
      alert(`✓ Added €${amount} to ${user.name}\nNew balance: €${result.newBalance}`);
      
    } catch (error) {
      console.error('Error adding money:', error);
      alert('Failed to add money: ' + (error as any).message);
    }
  };

  // Send 8% bonus to user
  const handleSendBonus = async () => {
    if (!bonusForm.userId) {
      alert('Please select a user');
      return;
    }

    const user = users.find(u => u.id === bonusForm.userId);
    if (!user) {
      alert('User not found');
      return;
    }

    try {
      const response = await fetch('/api/admin/send-bonus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: bonusForm.userId })
      });

      const result = await response.json();

      if (!result.success) {
        alert('Error: ' + result.error);
        return;
      }

      // Update local state
      setUsers(users.map(u => 
        u.id === bonusForm.userId 
          ? { ...u, accountBalance: result.newBalance } 
          : u
      ));

      setShowBonusModal(false);
      setBonusForm({ userId: '' });
      alert(`✓ Sent 8% bonus (€${result.bonusAmount.toFixed(2)}) to ${user.name}\nNew balance: €${result.newBalance.toFixed(2)}`);
    } catch (error) {
      console.error('Error sending bonus:', error);
      alert('Failed to send bonus: ' + (error as any).message);
    }
  };

  // Set stock price target
  const handleStockControl = async () => {
    try {
      const response = await fetch('/api/admin/stock-control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: stockControlForm.symbol,
          targetChangePercent: stockControlForm.targetChangePercent,
          duration: stockControlForm.durationMinutes
        })
      });

      const result = await response.json();

      if (!result.success) {
        alert('Error: ' + result.error);
        return;
      }

      setShowStockControlModal(false);
      alert(`✓ ${result.message}`);
      
      // Refresh stocks
      refreshStocks();
    } catch (error) {
      console.error('Error setting stock control:', error);
      alert('Failed to set stock control: ' + (error as any).message);
    }
  };

  // Assign crypto wallet to user
  const handleAssignCryptoWallet = async () => {
    if (!cryptoWalletForm.userId || !cryptoWalletForm.walletAddress) {
      alert('Please select a user and enter a wallet address');
      return;
    }

    const user = users.find(u => u.id === cryptoWalletForm.userId);
    if (!user) {
      alert('User not found');
      return;
    }

    try {
      const response = await fetch('/api/admin/crypto-wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: cryptoWalletForm.userId,
          walletAddress: cryptoWalletForm.walletAddress,
          cryptoType: cryptoWalletForm.cryptoType
        })
      });

      const result = await response.json();

      if (!result.success) {
        alert('Error: ' + result.error);
        return;
      }

      setShowCryptoWalletModal(false);
      setCryptoWalletForm({ userId: '', walletAddress: '', cryptoType: 'BTC' });
      alert(`✓ ${cryptoWalletForm.cryptoType} wallet assigned to ${user.name}`);
    } catch (error) {
      console.error('Error assigning wallet:', error);
      alert('Failed to assign wallet: ' + (error as any).message);
    }
  };

  // Load withdrawals
  useEffect(() => {
    const loadWithdrawals = async () => {
      try {
        const response = await fetch('/api/admin/withdrawals');
        const result = await response.json();
        if (result.success) {
          setWithdrawals(result.withdrawals);
        }
      } catch (error) {
        console.error('Error loading withdrawals:', error);
      }
    };
    loadWithdrawals();
  }, []);

  // Handle withdrawal approval/rejection
  const handleWithdrawalAction = async (withdrawalId: string, status: 'approved' | 'rejected') => {
    try {
      const response = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalId, status })
      });

      const result = await response.json();

      if (!result.success) {
        alert('Error: ' + result.error);
        return;
      }

      // Reload withdrawals
      const refreshResponse = await fetch('/api/admin/withdrawals');
      const refreshResult = await refreshResponse.json();
      if (refreshResult.success) {
        setWithdrawals(refreshResult.withdrawals);
      }

      alert(`✓ Withdrawal ${status} successfully`);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      alert('Failed to process withdrawal: ' + (error as any).message);
    }
  };

  const handleManualDeposit = () => {
    if (!depositUsername || depositAmount <= 0) {
      setDepositError('Please enter valid username and amount');
      return;
    }

    const mockUsers = [
      { username: 'john_investor', name: 'John Smith', email: 'john@example.com', balance: 50000 },
      { username: 'sarah_trader', name: 'Sarah Johnson', email: 'sarah@example.com', balance: 125000 },
      { username: 'mike_crypto', name: 'Mike Chen', email: 'mike@example.com', balance: 85000 },
    ];

    const user = mockUsers.find(u => u.username.toLowerCase() === depositUsername.toLowerCase());
    
    if (!user) {
      setDepositError('Username not found');
      return;
    }

    const isCrypto = depositMethod === 'crypto';
    const bonusAmount = isCrypto ? depositAmount * 0.08 : 0;
    const totalAmount = depositAmount + bonusAmount;

    const newDeposit = {
      id: Date.now().toString(),
      username: user.username,
      amount: depositAmount,
      method: depositMethod,
      bonus: bonusAmount,
      total: totalAmount,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    setRecentDeposits([newDeposit, ...recentDeposits]);
    setDepositUsername('');
    setDepositAmount(0);
    setDepositMethod('bank');
    setDepositError('');
    setShowDepositForm(false);
    setDepositSuccess('Deposit processed successfully!');

    // Send crypto bonus email if applicable
    if (isCrypto && bonusAmount > 0) {
      emailNotificationService.sendCryptoBonusEmail(
        user.email,
        user.name,
        {
          depositAmount: depositAmount,
          bonusAmount: bonusAmount,
          totalValue: totalAmount,
          transactionId: newDeposit.id,
          timestamp: newDeposit.timestamp
        }
      ).then(result => {
        if (!result.success) {
          console.error('Failed to send crypto bonus email:', result.error);
        }
      });
    }

    setTimeout(() => setDepositSuccess(''), 3000);
  };

  const handleManualStockUpdate = (stockId: string, newPrice: number) => {
    updateStockPrice(stockId, newPrice);
  };

  const handleSectionToggle = (sectionId: string) => {
    setHomepageSections(sections => 
      sections.map(section => 
        section.id === sectionId 
          ? { ...section, enabled: !section.enabled }
          : section
      )
    );
  };

  const handleSectionReorder = (sectionId: string, direction: 'up' | 'down') => {
    const index = homepageSections.findIndex(s => s.id === sectionId);
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === homepageSections.length - 1)) return;

    const newSections = [...homepageSections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newSections[index], newSections[targetIndex]] = [newSections[targetIndex], newSections[index]];
    
    setHomepageSections(newSections.map((section, idx) => ({ ...section, order: idx + 1 })));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-card to-background">
        <div className="w-full max-w-md p-8 bg-card rounded-lg shadow-depth">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
              <Icon name="ShieldCheckIcon" size={32} className="text-primary" />
            </div>
            <h1 className="text-3xl font-headline font-bold text-foreground mb-2">Admin Portal</h1>
            <p className="text-muted-foreground">Secure access to system management</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-semibold text-foreground mb-2">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter username"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter password"
                required
              />
            </div>

            {loginError && (
              <div className="flex items-center space-x-2 p-3 bg-red-500/10 border border-red-500/20 rounded-md">
                <Icon name="ExclamationTriangleIcon" size={20} className="text-red-500" />
                <p className="text-sm text-red-500">{loginError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-primary text-primary-foreground rounded-md font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth disabled:opacity-50"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-muted/50 rounded-md">
            <p className="text-xs text-muted-foreground text-center">
              Demo credentials: admin / Admin123#
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-20 px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-headline font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Complete control center for StarLink platform</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500/20 transition-smooth"
          >
            <Icon name="ArrowRightOnRectangleIcon" size={20} />
            <span className="font-semibold">Logout</span>
          </button>
        </div>

        <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
          {[
            { id: 'overview', label: 'Overview', icon: 'ChartBarIcon' },
            { id: 'users', label: 'User Management', icon: 'UserGroupIcon' },
            { id: 'financial', label: 'Financial Management', icon: 'BanknotesIcon' },
            { id: 'stocks', label: 'Stock Prices', icon: 'CurrencyDollarIcon' },
            { id: 'content', label: 'Content Management', icon: 'DocumentTextIcon' },
            { id: 'system', label: 'System Settings', icon: 'CogIcon' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-md font-semibold transition-smooth whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-primary text-primary-foreground shadow-glow-primary'
                  : 'bg-card text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={tab.icon as any} size={20} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Total Users', value: systemStats.totalUsers, icon: 'UserGroupIcon', color: 'text-blue-500' },
                { label: 'Pending Approvals', value: systemStats.pendingApprovals, icon: 'ClockIcon', color: 'text-yellow-500' },
                { label: 'Active Investments', value: systemStats.activeInvestments, icon: 'ChartBarIcon', color: 'text-green-500' },
                { label: 'System Uptime', value: systemStats.systemUptime, icon: 'ServerIcon', color: 'text-purple-500' },
              ].map((stat, idx) => (
                <div key={idx} className="p-6 bg-card rounded-lg shadow-depth">
                  <div className="flex items-center justify-between mb-4">
                    <Icon name={stat.icon as any} size={24} className={stat.color} />
                  </div>
                  <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Auto-Sync Status Card */}
            <div className="p-6 bg-card rounded-lg shadow-depth border-2 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    autoSyncEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
                  }`}></div>
                  <h2 className="text-2xl font-headline font-bold text-foreground">Stock Price Auto-Sync</h2>
                </div>
                <button
                  onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                  className={`px-4 py-2 rounded-md font-semibold transition-smooth ${
                    autoSyncEnabled
                      ? 'bg-green-500 text-white hover:bg-green-600' :'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
                >
                  {autoSyncEnabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-background rounded-md">
                  <p className="text-sm text-muted-foreground mb-1">Status</p>
                  <p className="text-lg font-semibold text-foreground">
                    {autoSyncEnabled ? '🟢 Active' : '🔴 Paused'}
                  </p>
                </div>
                <div className="p-4 bg-background rounded-md">
                  <p className="text-sm text-muted-foreground mb-1">Last Sync</p>
                  <p className="text-lg font-semibold text-foreground">
                    {lastSync ? lastSync.toLocaleTimeString() : 'Never'}
                  </p>
                </div>
                <div className="p-4 bg-background rounded-md">
                  <p className="text-sm text-muted-foreground mb-1">Refresh Interval</p>
                  <select
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value={30000}>30 seconds</option>
                    <option value={60000}>1 minute</option>
                    <option value={300000}>5 minutes</option>
                    <option value={600000}>10 minutes</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-3">
                <button
                  onClick={refreshStocks}
                  disabled={stocksLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-accent transition-smooth disabled:opacity-50"
                >
                  <Icon name="ArrowPathIcon" size={20} className={stocksLoading ? 'animate-spin' : ''} />
                  <span>Manual Refresh</span>
                </button>
                {stocksError && (
                  <p className="text-sm text-red-500">⚠️ {stocksError}</p>
                )}
              </div>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-depth">
              <h2 className="text-2xl font-headline font-bold text-foreground mb-4">Quick Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveTab('users')}
                  className="flex items-center space-x-3 p-4 bg-primary/10 rounded-md hover:bg-primary/20 transition-smooth"
                >
                  <Icon name="UserPlusIcon" size={24} className="text-primary" />
                  <span className="font-semibold text-foreground">Approve Users</span>
                </button>
                <button
                  onClick={() => setActiveTab('stocks')}
                  className="flex items-center space-x-3 p-4 bg-primary/10 rounded-md hover:bg-primary/20 transition-smooth"
                >
                  <Icon name="PencilSquareIcon" size={24} className="text-primary" />
                  <span className="font-semibold text-foreground">Update Stock Prices</span>
                </button>
                <button
                  onClick={() => setActiveTab('content')}
                  className="flex items-center space-x-3 p-4 bg-primary/10 rounded-md hover:bg-primary/20 transition-smooth"
                >
                  <Icon name="AdjustmentsHorizontalIcon" size={24} className="text-primary" />
                  <span className="font-semibold text-foreground">Manage Content</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg shadow-depth">
              <h2 className="text-2xl font-headline font-bold text-foreground mb-6">User Management</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="py-2 px-3 text-left">Name</th>
                      <th className="py-2 px-3 text-left">Email</th>
                      <th className="py-2 px-3 text-left">Phone</th>
                      <th className="py-2 px-3 text-left">Status</th>
                      <th className="py-2 px-3 text-left">Join Date</th>
                      <th className="py-2 px-3 text-left">Balance (€)</th>
                      <th className="py-2 px-3 text-left">Password</th>
                      <th className="py-2 px-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b border-border">
                        <td className="py-2 px-3">{user.name}</td>
                        <td className="py-2 px-3">{user.email}</td>
                        <td className="py-2 px-3">{user.phoneNumber || '-'}</td>
                        <td className="py-2 px-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            user.status === 'approved' ? 'bg-green-500/10 text-green-500' :
                            user.status === 'rejected'? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'
                          }`}>
                            {user.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-2 px-3">{user.joinDate}</td>
                        <td className="py-2 px-3">{user.accountBalance.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</td>
                        <td className="py-2 px-3">
                          <button
                            onClick={() => handleChangePassword((user as any).authId || '')}
                            className="px-3 py-1 bg-muted text-foreground rounded hover:bg-muted/80"
                          >Change</button>
                        </td>
                        <td className="py-2 px-3 space-x-2">
                          {user.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleUserAction(user.id, 'approve')}
                                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                              >Approve</button>
                              <button
                                onClick={() => handleUserAction(user.id, 'reject')}
                                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                              >Reject</button>
                              <button
                                onClick={() => handleConfirmUser((user as any).authId)}
                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                title="Manually confirm email"
                              >Confirm Email</button>
                            </>
                          )}
                          <button
                            onClick={() => handleUserAction(user.id, 'toggleDashboard')}
                            className={`px-3 py-1 rounded ${user.dashboardAccess ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-muted/80'}`}
                          >
                            {user.dashboardAccess ? 'Dashboard Enabled' : 'Enable Dashboard'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stocks' && (
          <div className="space-y-6">
            {/* Stock Control Panel */}
            <div className="p-6 bg-card rounded-lg shadow-depth border-2 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-headline font-bold text-foreground">Stock Price Control</h2>
                <button
                  onClick={() => setShowStockControlModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth"
                >
                  <Icon name="ChartBarIcon" size={20} />
                  <span>Set Price Target</span>
                </button>
              </div>
              
              <div className="p-4 bg-primary/10 rounded-md border border-primary/20 mb-4">
                <p className="text-sm text-muted-foreground">
                  Control stock prices gradually over time. Set a target percentage change (e.g., +10% or -5%) and duration (e.g., 60 minutes). 
                  The price will change smoothly over time, not randomly every second.
                </p>
              </div>
            </div>

            {/* Auto-Sync Control Panel */}
            <div className="p-6 bg-card rounded-lg shadow-depth border-2 border-primary/20">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-headline font-bold text-foreground">Automated Stock Price Updates</h2>
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-muted-foreground">Auto-Sync:</span>
                  <button
                    onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      autoSyncEnabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        autoSyncEnabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div className="p-3 bg-background rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <p className="text-sm font-semibold text-foreground">
                    {autoSyncEnabled ? '🟢 Active' : '🔴 Paused'}
                  </p>
                </div>
                <div className="p-3 bg-background rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Last Update</p>
                  <p className="text-sm font-semibold text-foreground">
                    {lastSync ? lastSync.toLocaleTimeString() : 'Never'}
                  </p>
                </div>
                <div className="p-3 bg-background rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Next Update</p>
                  <p className="text-sm font-semibold text-foreground">
                    {autoSyncEnabled && lastSync 
                      ? new Date(lastSync.getTime() + syncInterval).toLocaleTimeString()
                      : 'N/A'
                    }
                  </p>
                </div>
                <div className="p-3 bg-background rounded-md">
                  <p className="text-xs text-muted-foreground mb-1">Interval</p>
                  <select
                    value={syncInterval}
                    onChange={(e) => setSyncInterval(Number(e.target.value))}
                    className="w-full px-2 py-1 text-sm bg-card border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value={30000}>30s</option>
                    <option value={60000}>1m</option>
                    <option value={300000}>5m</option>
                    <option value={600000}>10m</option>
                  </select>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                Stock prices update automatically based on the interval selected above.
              </div>
            </div>

            {/* Stock Price List with Manual Override */}
            <div className="p-6 bg-card rounded-lg shadow-depth">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-bold text-foreground">Stock Prices</h2>
                <div className="flex items-center space-x-2">
                  <Icon name="InformationCircleIcon" size={20} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Manual updates override auto-sync temporarily</span>
                </div>
              </div>
              
              {stocksLoading && stocks.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="ArrowPathIcon" size={32} className="text-primary animate-spin mx-auto mb-2" />
                  <p className="text-muted-foreground">Loading stock prices...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {stocks.map((stock) => (
                    <div key={stock.id} className="p-4 bg-background rounded-md border border-border">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-foreground">{stock.symbol}</h3>
                            <span className="text-sm text-muted-foreground">{stock.name}</span>
                          </div>
                          <div className="flex items-center space-x-4">
                            <p className="text-2xl font-bold text-foreground">${stock.price.toFixed(2)}</p>
                            <span className={`flex items-center space-x-1 text-sm font-semibold ${
                              stock.change >= 0 ? 'text-green-500' : 'text-red-500'
                            }`}>
                              <Icon name={stock.change >= 0 ? 'ArrowUpIcon' : 'ArrowDownIcon'} size={16} />
                              <span>{Math.abs(stock.change).toFixed(2)}%</span>
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Last updated: {new Date(stock.lastUpdated).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            step="0.01"
                            placeholder="New price"
                            className="w-32 px-3 py-2 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const newPrice = parseFloat((e.target as HTMLInputElement).value);
                                if (newPrice > 0) {
                                  handleManualStockUpdate(stock.id, newPrice);
                                  (e.target as HTMLInputElement).value = '';
                                }
                              }
                            }}
                          />
                          <button
                            onClick={(e) => {
                              const input = (e.currentTarget.previousElementSibling as HTMLInputElement);
                              const newPrice = parseFloat(input.value);
                              if (newPrice > 0) {
                                handleManualStockUpdate(stock.id, newPrice);
                                input.value = '';
                              }
                            }}
                            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-accent transition-smooth"
                          >
                            Override
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'content' && (
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg shadow-depth">
              <h2 className="text-2xl font-headline font-bold text-foreground mb-6">Homepage Content Management</h2>
              
              <div className="space-y-4">
                {homepageSections.map((section, index) => (
                  <div key={section.id} className="p-4 bg-background rounded-md border border-border">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-muted-foreground">#{section.order}</span>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{section.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Status: {section.enabled ? 'Visible' : 'Hidden'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSectionReorder(section.id, 'up')}
                          disabled={index === 0}
                          className="p-2 bg-muted rounded-md hover:bg-muted/80 transition-smooth disabled:opacity-30"
                        >
                          <Icon name="ChevronUpIcon" size={20} />
                        </button>
                        <button
                          onClick={() => handleSectionReorder(section.id, 'down')}
                          disabled={index === homepageSections.length - 1}
                          className="p-2 bg-muted rounded-md hover:bg-muted/80 transition-smooth disabled:opacity-30"
                        >
                          <Icon name="ChevronDownIcon" size={20} />
                        </button>
                        <button
                          onClick={() => handleSectionToggle(section.id)}
                          className={`px-4 py-2 rounded-md transition-smooth ${
                            section.enabled
                              ? 'bg-green-500 text-white hover:bg-green-600' :'bg-red-500 text-white hover:bg-red-600'
                          }`}
                        >
                          {section.enabled ? 'Hide' : 'Show'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6 bg-card rounded-lg shadow-depth">
              <h2 className="text-2xl font-headline font-bold text-foreground mb-4">Layout Controls</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button className="p-4 bg-primary/10 rounded-md hover:bg-primary/20 transition-smooth text-left">
                  <h3 className="font-semibold text-foreground mb-1">Market Dashboard Layout</h3>
                  <p className="text-sm text-muted-foreground">Customize widget positions and visibility</p>
                </button>
                <button className="p-4 bg-primary/10 rounded-md hover:bg-primary/20 transition-smooth text-left">
                  <h3 className="font-semibold text-foreground mb-1">User Dashboard Layout</h3>
                  <p className="text-sm text-muted-foreground">Configure personal dashboard components</p>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6">
            <div className="p-6 bg-card rounded-lg shadow-depth">
              <h2 className="text-2xl font-headline font-bold text-foreground mb-6">System Settings</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-background rounded-md border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Security Settings</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Two-Factor Authentication</span>
                      <button className="px-4 py-2 bg-muted rounded-md hover:bg-muted/80 transition-smooth">
                        Configure
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">Session Timeout</span>
                      <select className="px-4 py-2 bg-background border border-border rounded-md text-foreground">
                        <option>15 minutes</option>
                        <option>30 minutes</option>
                        <option>1 hour</option>
                        <option>4 hours</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-background rounded-md border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Backup & Recovery</h3>
                  <div className="space-y-3">
                    <button className="w-full px-4 py-3 bg-primary text-primary-foreground rounded-md hover:bg-accent transition-smooth">
                      Create Manual Backup
                    </button>
                    <button className="w-full px-4 py-3 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-smooth">
                      View Backup History
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-background rounded-md border border-border">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Audit Logs</h3>
                  <button className="w-full px-4 py-3 bg-muted text-foreground rounded-md hover:bg-muted/80 transition-smooth">
                    View System Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'financial' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-headline font-bold text-foreground">Financial Management</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDepositModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-md font-cta font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth"
                >
                  <Icon name="PlusCircleIcon" size={20} />
                  <span>Add Money</span>
                </button>
                <button
                  onClick={() => setShowBonusModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-success/20 text-success rounded-md font-cta font-bold hover:bg-success/30 transition-smooth"
                >
                  <Icon name="GiftIcon" size={20} />
                  <span>8% Bonus</span>
                </button>
                <button
                  onClick={() => setShowCryptoWalletModal(true)}
                  className="flex items-center space-x-2 px-6 py-3 bg-primary/20 text-primary rounded-md font-cta font-bold hover:bg-primary/30 transition-smooth"
                >
                  <Icon name="CurrencyDollarIcon" size={20} />
                  <span>Crypto Wallet</span>
                </button>
              </div>
            </div>

            {/* Withdrawal Requests */}
            <div className="bg-card rounded-lg p-6 shadow-depth">
              <h3 className="text-xl font-headline font-bold text-foreground mb-4">Pending Withdrawal Requests</h3>
              <div className="space-y-4">
                {withdrawals.filter(w => w.status === 'pending').length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="CheckCircleIcon" size={48} className="mx-auto text-success mb-3" />
                    <p className="text-muted-foreground">No pending withdrawal requests</p>
                  </div>
                ) : (
                  withdrawalRequests.filter(r => r.status === 'pending').map((request) => (
                    <div key={request.id} className="flex items-center justify-between p-4 bg-muted/20 rounded-lg border border-border">
                      <div className="flex-1">
                        <h4 className="text-lg font-cta font-bold text-foreground">{request.userName}</h4>
                        <p className="text-sm text-muted-foreground">Requested: {request.requestDate}</p>
                      </div>
                      <div className="text-right mr-6">
                        <p className="text-2xl font-headline font-bold text-destructive">
                          {request.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleWithdrawalAction(request.id, 'approve')}
                          className="px-4 py-2 bg-success/20 text-success rounded-md font-semibold hover:bg-success/30 transition-smooth"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleWithdrawalAction(request.id, 'reject')}
                          className="px-4 py-2 bg-destructive/20 text-destructive rounded-md font-semibold hover:bg-destructive/30 transition-smooth"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Transaction History */}
            <div className="bg-card rounded-lg p-6 shadow-depth">
              <h3 className="text-xl font-headline font-bold text-foreground mb-4">Recent Transactions</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 text-sm font-cta font-bold text-muted-foreground">User</th>
                      <th className="text-left py-3 px-4 text-sm font-cta font-bold text-muted-foreground">Type</th>
                      <th className="text-right py-3 px-4 text-sm font-cta font-bold text-muted-foreground">Amount</th>
                      <th className="text-left py-3 px-4 text-sm font-cta font-bold text-muted-foreground">Status</th>
                      <th className="text-left py-3 px-4 text-sm font-cta font-bold text-muted-foreground">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-cta font-bold text-muted-foreground">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-border hover:bg-muted/10">
                        <td className="py-3 px-4 text-sm font-semibold text-foreground">{transaction.userName}</td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            transaction.type === 'deposit' ? 'bg-success/20 text-success' :
                            transaction.type === 'withdrawal'? 'bg-destructive/20 text-destructive' : 'bg-secondary/20 text-secondary'
                          }`}>
                            {transaction.type === 'deposit' ? 'Deposit' : transaction.type === 'withdrawal' ? 'Withdrawal' : 'Crypto Bonus'}
                          </span>
                        </td>
                        <td className={`py-3 px-4 text-right text-sm font-bold ${
                          transaction.amount >= 0 ? 'text-success' : 'text-destructive'
                        }`}>
                          {transaction.amount >= 0 ? '+' : ''}{transaction.amount.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            transaction.status === 'approved' ? 'bg-success/20 text-success' :
                            transaction.status === 'rejected'? 'bg-destructive/20 text-destructive' : 'bg-yellow-500/20 text-yellow-500'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.timestamp}</td>
                        <td className="py-3 px-4 text-sm text-muted-foreground">{transaction.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Account Balances */}
            <div className="bg-card rounded-lg p-6 shadow-depth">
              <h3 className="text-xl font-headline font-bold text-foreground mb-4">User Account Balances</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {users.filter(u => u.status === 'approved').map((user) => (
                  <div key={user.id} className="p-4 bg-muted/20 rounded-lg border border-border">
                    <h4 className="text-lg font-cta font-bold text-foreground mb-2">{user.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">Account Balance:</span>
                        <input
                          type="number"
                          step="0.01"
                          value={user.accountBalance}
                          onChange={(e) => {
                            const newBalance = parseFloat(e.target.value) || 0;
                            setUsers(users.map(u => u.id === user.id ? { ...u, accountBalance: newBalance } : u));
                          }}
                          className="w-24 text-sm font-bold text-primary bg-background border border-border rounded px-2 py-1"
                        />
                        <span className="text-sm ml-1">€</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Crypto Holdings:</span>
                        <span className="text-sm font-bold text-secondary">
                          {user.cryptoHoldings.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Add Money Modal */}
        {showDepositModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-6 max-w-md w-full shadow-depth">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-headline font-bold text-foreground">Add Money to Client Account</h3>
                <button onClick={() => setShowDepositModal(false)} className="text-muted-foreground hover:text-foreground">
                  <Icon name="XMarkIcon" size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Select User</label>
                  <select
                    value={depositForm.userId}
                    onChange={(e) => setDepositForm({ ...depositForm, userId: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a user...</option>
                    {users.filter(u => u.status === 'approved').map((user) => (
                      <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Amount (€)</label>
                  <input
                    type="number"
                    value={depositForm.amount}
                    onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter amount"
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Notes (Optional)</label>
                  <textarea
                    value={depositForm.notes}
                    onChange={(e) => setDepositForm({ ...depositForm, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Add notes..."
                    rows={3}
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowDepositModal(false)}
                    className="flex-1 px-4 py-3 bg-muted text-foreground rounded-md font-semibold hover:bg-muted/80 transition-smooth"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddMoney}
                    disabled={!depositForm.userId || !depositForm.amount}
                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth disabled:opacity-50"
                  >
                    Add Money
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 8% Bonus Modal */}
        {showBonusModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-6 max-w-md w-full shadow-depth">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-headline font-bold text-foreground">Send 8% Bonus</h3>
                <button onClick={() => setShowBonusModal(false)} className="text-muted-foreground hover:text-foreground">
                  <Icon name="XMarkIcon" size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Select User</label>
                  <select
                    value={bonusForm.userId}
                    onChange={(e) => setBonusForm({ ...bonusForm, userId: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a user...</option>
                    {users.filter(u => u.status === 'approved').map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name} (€{user.accountBalance.toFixed(2)}) - Bonus: €{(user.accountBalance * 0.08).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    The user will receive an 8% bonus based on their current balance
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowBonusModal(false)}
                    className="flex-1 px-4 py-3 bg-muted text-foreground rounded-md font-semibold hover:bg-muted/80 transition-smooth"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSendBonus}
                    disabled={!bonusForm.userId}
                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth disabled:opacity-50"
                  >
                    Send Bonus
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stock Control Modal */}
        {showStockControlModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-6 max-w-md w-full shadow-depth">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-headline font-bold text-foreground">Control Stock Price</h3>
                <button onClick={() => setShowStockControlModal(false)} className="text-muted-foreground hover:text-foreground">
                  <Icon name="XMarkIcon" size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Select Stock</label>
                  <select
                    value={stockControlForm.symbol}
                    onChange={(e) => setStockControlForm({ ...stockControlForm, symbol: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="STLK">STLK - Starlink</option>
                    <option value="TECH">TECH - Tech Corp</option>
                    <option value="SPACE">SPACE - Space Ventures</option>
                    <option value="IBM">IBM</option>
                    <option value="AAPL">AAPL - Apple</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Target Change (%)</label>
                  <input
                    type="number"
                    value={stockControlForm.targetChangePercent}
                    onChange={(e) => setStockControlForm({ ...stockControlForm, targetChangePercent: parseFloat(e.target.value) })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter percentage (e.g., 10 for +10%, -5 for -5%)"
                    step="0.1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={stockControlForm.durationMinutes}
                    onChange={(e) => setStockControlForm({ ...stockControlForm, durationMinutes: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="How long to reach target"
                    min="1"
                    step="1"
                  />
                </div>

                <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    Stock will gradually change {stockControlForm.targetChangePercent > 0 ? '+' : ''}{stockControlForm.targetChangePercent}% over {stockControlForm.durationMinutes} minutes
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowStockControlModal(false)}
                    className="flex-1 px-4 py-3 bg-muted text-foreground rounded-md font-semibold hover:bg-muted/80 transition-smooth"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStockControl}
                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth"
                  >
                    Set Target
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Crypto Wallet Modal */}
        {showCryptoWalletModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-lg p-6 max-w-md w-full shadow-depth">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-headline font-bold text-foreground">Assign Crypto Wallet</h3>
                <button onClick={() => setShowCryptoWalletModal(false)} className="text-muted-foreground hover:text-foreground">
                  <Icon name="XMarkIcon" size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Select User</label>
                  <select
                    value={cryptoWalletForm.userId}
                    onChange={(e) => setCryptoWalletForm({ ...cryptoWalletForm, userId: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Choose a user...</option>
                    {users.filter(u => u.status === 'approved').map((user) => (
                      <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Crypto Type</label>
                  <select
                    value={cryptoWalletForm.cryptoType}
                    onChange={(e) => setCryptoWalletForm({ ...cryptoWalletForm, cryptoType: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="BTC">Bitcoin (BTC)</option>
                    <option value="ETH">Ethereum (ETH)</option>
                    <option value="USDT">Tether (USDT)</option>
                    <option value="USDC">USD Coin (USDC)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Wallet Address</label>
                  <input
                    type="text"
                    value={cryptoWalletForm.walletAddress}
                    onChange={(e) => setCryptoWalletForm({ ...cryptoWalletForm, walletAddress: e.target.value })}
                    className="w-full px-4 py-3 bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                    placeholder="Enter wallet address"
                  />
                </div>

                <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    This wallet address will appear on the user's deposit page
                  </p>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    onClick={() => setShowCryptoWalletModal(false)}
                    className="flex-1 px-4 py-3 bg-muted text-foreground rounded-md font-semibold hover:bg-muted/80 transition-smooth"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAssignCryptoWallet}
                    disabled={!cryptoWalletForm.userId || !cryptoWalletForm.walletAddress}
                    className="flex-1 px-4 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth disabled:opacity-50"
                  >
                    Assign Wallet
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}