'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface ErrorLog {
  timestamp: string;
  type: string;
  message: string;
  details: any;
  stack?: string;
}

export default function ErrorTracker() {
  const [errors, setErrors] = useState<ErrorLog[]>([]);
  const [authStatus, setAuthStatus] = useState<any>(null);
  const [supabaseStatus, setSupabaseStatus] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const errorLogs: ErrorLog[] = [];

    // Capture all console errors
    const originalError = console.error;
    console.error = function(...args) {
      errorLogs.push({
        timestamp: new Date().toISOString(),
        type: 'console.error',
        message: args.join(' '),
        details: args,
      });
      setErrors([...errorLogs]);
      originalError.apply(console, args);
    };

    // Capture all console warnings
    const originalWarn = console.warn;
    console.warn = function(...args) {
      errorLogs.push({
        timestamp: new Date().toISOString(),
        type: 'console.warn',
        message: args.join(' '),
        details: args,
      });
      setErrors([...errorLogs]);
      originalWarn.apply(console, args);
    };

    // Capture unhandled promise rejections
    const handleRejection = (event: PromiseRejectionEvent) => {
      errorLogs.push({
        timestamp: new Date().toISOString(),
        type: 'unhandledRejection',
        message: event.reason?.message || String(event.reason),
        details: event.reason,
        stack: event.reason?.stack,
      });
      setErrors([...errorLogs]);
    };

    window.addEventListener('unhandledrejection', handleRejection);

    // Check auth status every 2 seconds
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        setAuthStatus({
          hasSession: !!session,
          user: session?.user?.email,
          expiresAt: session?.expires_at ? new Date(session.expires_at * 1000).toISOString() : null,
          error: error?.message,
        });
      } catch (err: any) {
        setAuthStatus({
          error: err.message,
        });
      }
    };

    // Check Supabase connection
    const checkSupabase = async () => {
      try {
        const { data, error } = await supabase.from('users').select('count').limit(1);
        setSupabaseStatus({
          connected: !error,
          error: error?.message,
        });
      } catch (err: any) {
        setSupabaseStatus({
          connected: false,
          error: err.message,
        });
      }
    };

    checkAuth();
    checkSupabase();
    const authInterval = setInterval(checkAuth, 2000);
    const supabaseInterval = setInterval(checkSupabase, 5000);

    // Keyboard shortcut to toggle visibility (Ctrl+Shift+E)
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'E') {
        setIsVisible(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyPress);

    return () => {
      console.error = originalError;
      console.warn = originalWarn;
      window.removeEventListener('unhandledrejection', handleRejection);
      window.removeEventListener('keydown', handleKeyPress);
      clearInterval(authInterval);
      clearInterval(supabaseInterval);
    };
  }, []);

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-[9999] bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-red-700 font-mono text-sm"
      >
        🐛 Debug Panel (Ctrl+Shift+E)
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 overflow-auto p-4">
      <div className="max-w-6xl mx-auto bg-gray-900 text-white rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">🐛 Error Tracking Dashboard</h2>
          <button
            onClick={() => setIsVisible(false)}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
          >
            Close
          </button>
        </div>

        {/* Auth Status */}
        <div className="mb-6 p-4 bg-gray-800 rounded">
          <h3 className="text-xl font-bold mb-2">🔐 Auth Status</h3>
          {authStatus && (
            <div className="font-mono text-sm space-y-1">
              <div className={authStatus.hasSession ? 'text-green-400' : 'text-red-400'}>
                Session: {authStatus.hasSession ? '✓ Active' : '✗ None'}
              </div>
              {authStatus.user && <div>User: {authStatus.user}</div>}
              {authStatus.expiresAt && <div>Expires: {authStatus.expiresAt}</div>}
              {authStatus.error && <div className="text-red-400">Error: {authStatus.error}</div>}
              <div className="text-xs text-gray-400 mt-2">
                LocalStorage Key: starlink-auth-token
              </div>
            </div>
          )}
        </div>

        {/* Supabase Status */}
        <div className="mb-6 p-4 bg-gray-800 rounded">
          <h3 className="text-xl font-bold mb-2">💾 Database Status</h3>
          {supabaseStatus && (
            <div className="font-mono text-sm space-y-1">
              <div className={supabaseStatus.connected ? 'text-green-400' : 'text-red-400'}>
                Connection: {supabaseStatus.connected ? '✓ Connected' : '✗ Disconnected'}
              </div>
              {supabaseStatus.error && <div className="text-red-400">Error: {supabaseStatus.error}</div>}
            </div>
          )}
        </div>

        {/* LocalStorage Contents */}
        <div className="mb-6 p-4 bg-gray-800 rounded">
          <h3 className="text-xl font-bold mb-2">💾 LocalStorage Auth Token</h3>
          <div className="font-mono text-xs break-all bg-gray-900 p-2 rounded">
            {typeof window !== 'undefined' && localStorage.getItem('starlink-auth-token') || 'No token found'}
          </div>
        </div>

        {/* Error Log */}
        <div className="mb-6 p-4 bg-gray-800 rounded">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">❌ Error Log ({errors.length})</h3>
            <button
              onClick={() => setErrors([])}
              className="bg-blue-600 px-3 py-1 rounded text-sm hover:bg-blue-700"
            >
              Clear
            </button>
          </div>
          
          {errors.length === 0 ? (
            <div className="text-green-400 text-center py-4">✓ No errors detected!</div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-auto">
              {errors.slice().reverse().map((error, idx) => (
                <div key={idx} className="bg-gray-900 p-3 rounded text-xs">
                  <div className="flex justify-between mb-1">
                    <span className={
                      error.type === 'console.error' ? 'text-red-400' :
                      error.type === 'console.warn' ? 'text-yellow-400' :
                      'text-orange-400'
                    }>
                      {error.type}
                    </span>
                    <span className="text-gray-400">{new Date(error.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <div className="text-white break-all">{error.message}</div>
                  {error.stack && (
                    <details className="mt-2">
                      <summary className="cursor-pointer text-blue-400">Stack trace</summary>
                      <pre className="mt-1 text-gray-300 text-xs overflow-auto">{error.stack}</pre>
                    </details>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Export Button */}
        <button
          onClick={() => {
            const report = {
              timestamp: new Date().toISOString(),
              authStatus,
              supabaseStatus,
              localStorage: typeof window !== 'undefined' ? localStorage.getItem('starlink-auth-token') : null,
              errors,
            };
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `error-report-${Date.now()}.json`;
            a.click();
          }}
          className="w-full bg-green-600 px-4 py-2 rounded hover:bg-green-700 font-bold"
        >
          📥 Download Full Error Report
        </button>

        <div className="mt-4 text-xs text-gray-400 text-center">
          Press Ctrl+Shift+E to toggle this panel
        </div>
      </div>
    </div>
  );
}
