'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { useUserAuth } from '@/contexts/UserAuthContext';

export default function CryptoDepositPanel() {
  const { user } = useUserAuth();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [cryptoType, setCryptoType] = useState('BTC');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    loadWalletAddress();
  }, [user]);

  const loadWalletAddress = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/admin/crypto-wallet?userId=${user.id}`);
      const result = await response.json();

      if (result.success) {
        setWalletAddress(result.wallet);
        setCryptoType(result.cryptoType || 'BTC');
      }
    } catch (error) {
      console.error('Error loading wallet address:', error);
    }
  };

  const handleCopy = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getCryptoIcon = (type: string) => {
    return 'CurrencyDollarIcon'; // Placeholder - you can add specific crypto icons
  };

  const getCryptoName = (type: string) => {
    const names: Record<string, string> = {
      BTC: 'Bitcoin',
      ETH: 'Ethereum',
      USDT: 'Tether',
      USDC: 'USD Coin',
    };
    return names[type] || type;
  };

  if (!walletAddress) {
    return (
      <div className="bg-card rounded-lg p-6 shadow-depth">
        <h2 className="text-2xl font-headline font-bold text-foreground mb-4 flex items-center">
          <Icon name="CurrencyDollarIcon" size={28} className="mr-2 text-primary" />
          Crypto Deposit
        </h2>

        <div className="text-center py-12">
          <Icon name="LockClosedIcon" size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Wallet Not Assigned
          </h3>
          <p className="text-muted-foreground mb-6">
            Your crypto wallet address has not been assigned yet. Please contact support to activate crypto deposits.
          </p>
          <button
            className="px-6 py-3 bg-primary text-primary-foreground rounded-md font-bold hover:bg-accent hover:shadow-glow-primary transition-smooth"
          >
            Contact Support
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Deposit Instructions */}
      <div className="bg-card rounded-lg p-6 shadow-depth">
        <h2 className="text-2xl font-headline font-bold text-foreground mb-4 flex items-center">
          <Icon name="CurrencyDollarIcon" size={28} className="mr-2 text-primary" />
          Deposit via Crypto
        </h2>

        <div className="space-y-6">
          {/* Crypto Type */}
          <div className="p-4 bg-primary/10 rounded-md border border-primary/20">
            <div className="flex items-center space-x-3 mb-2">
              <Icon name={getCryptoIcon(cryptoType)} size={32} className="text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Accepting</p>
                <p className="text-xl font-bold text-foreground">
                  {getCryptoName(cryptoType)} ({cryptoType})
                </p>
              </div>
            </div>
          </div>

          {/* Wallet Address */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Your Deposit Address
            </label>
            <div className="relative">
              <input
                type="text"
                value={walletAddress}
                readOnly
                className="w-full px-4 py-3 pr-24 bg-background border border-border rounded-md text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                onClick={handleCopy}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-accent transition-smooth"
              >
                {copied ? (
                  <span className="flex items-center space-x-1">
                    <Icon name="CheckIcon" size={16} />
                    <span>Copied!</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1">
                    <Icon name="ClipboardDocumentIcon" size={16} />
                    <span>Copy</span>
                  </span>
                )}
              </button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Send {cryptoType} to this address to deposit funds
            </p>
          </div>

          {/* QR Code Placeholder */}
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-background border-2 border-border rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Icon name="QrCodeIcon" size={48} className="mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">QR Code Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="p-4 bg-destructive/10 rounded-md border border-destructive/20">
            <div className="flex items-start space-x-3">
              <Icon name="ExclamationTriangleIcon" size={24} className="text-destructive flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-destructive mb-1">Important Notice</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Only send {cryptoType} to this address</li>
                  <li>• Sending other cryptocurrencies may result in permanent loss</li>
                  <li>• Deposits are typically processed within 30 minutes</li>
                  <li>• Minimum deposit: 0.001 {cryptoType}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Deposit History */}
      <div className="bg-card rounded-lg p-6 shadow-depth">
        <h3 className="text-xl font-headline font-bold text-foreground mb-4">
          Recent Deposits
        </h3>
        
        <div className="text-center py-8">
          <Icon name="InboxIcon" size={48} className="mx-auto text-muted-foreground mb-3" />
          <p className="text-muted-foreground">No deposits yet</p>
          <p className="text-sm text-muted-foreground mt-2">
            Your crypto deposits will appear here
          </p>
        </div>
      </div>
    </div>
  );
}
