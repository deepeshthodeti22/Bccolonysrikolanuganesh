import React, { useState } from 'react';
import { Lock, ShieldAlert, ArrowRight, ShieldCheck, Sparkles, AlertCircle } from 'lucide-react';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
  onBackToHome: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess, onBackToHome }) => {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      // Configured password via environment variable (or committee fallback)
      const metaEnv = (import.meta as unknown as { env?: Record<string, string> }).env;
      const configuredPassword =
        metaEnv?.VITE_ADMIN_PASSWORD ||
        (typeof process !== 'undefined' && process.env && (process.env as Record<string, string>).ADMIN_PASSWORD) ||
        'ganapathi2026';

      if (passcode.trim() === configuredPassword) {
        // Store authenticated session token
        sessionStorage.setItem('svm_admin_auth_token', btoa(`svm_auth_${Date.now()}`));
        setIsLoading(false);
        onLoginSuccess();
      } else {
        setIsLoading(false);
        setError('Invalid administrative passcode. Access is restricted to authorized committee officers.');
      }
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl temple-glass border border-amber-500/40 p-8 shadow-2xl space-y-6 text-[#FFFDF5]">
        {/* Header with Sacred Emblem */}
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#800000] via-[#5a0000] to-[#250000] border-2 border-[#D4AF37] mx-auto flex items-center justify-center shadow-lg">
            <Lock className="w-7 h-7 text-amber-300" />
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800000]/70 border border-amber-500/30 text-amber-300 text-xs font-bold uppercase tracking-wider mb-2">
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Restricted Zone</span>
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#FFFDF5]">
              Committee Operations Portal
            </h1>
            <p className="text-xs text-amber-200/70 mt-1">
              Sri Vinayaka Mahotsavam • Executive Management Center
            </p>
          </div>
        </div>

        {/* Security Notice */}
        <div className="p-3.5 rounded-xl bg-black/40 border border-amber-500/20 text-xs text-amber-200/80 leading-relaxed space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Authorized Committee Access Only</span>
          </div>
          <p className="text-[11px] text-amber-200/60">
            This portal controls live tickers, ritual schedules, darshan streams, and private financial logs. Unauthorized entry attempts are logged.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Officer Administrative Passcode
            </label>
            <input
              type="password"
              required
              autoFocus
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                if (error) setError('');
              }}
              placeholder="Enter secure passcode..."
              className="w-full px-4 py-3 rounded-xl bg-black/60 border border-amber-500/40 text-amber-100 text-sm focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50 transition placeholder:text-amber-200/30"
            />
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !passcode.trim()}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-black font-heading font-bold text-sm tracking-wide hover:brightness-110 shadow-lg border border-amber-300 flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? (
              <span>Verifying Credentials...</span>
            ) : (
              <>
                <span>Unlock Control Center</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Back Link */}
        <div className="pt-2 text-center">
          <button
            onClick={onBackToHome}
            className="text-xs text-amber-200/70 hover:text-amber-300 transition underline underline-offset-4"
          >
            Return to Public Website
          </button>
        </div>
      </div>
    </div>
  );
};
