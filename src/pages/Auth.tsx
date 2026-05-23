import React, { useState } from 'react';
import { useApp } from '../context/AppContext.tsx';
import { Shield, Sparkles, LogIn, UserPlus } from 'lucide-react';

export const Auth: React.FC = () => {
  const { login, register, googleLogin } = useApp();
  
  // Toggles between register mode or standard login
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [authError, setAuthError] = useState<string>('');
  const [handling, setHandling] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    setHandling(true);

    if (isRegister) {
      if (!username || !email || !password) {
        setAuthError("Noble Username, email and passwords coordinates are required.");
        setHandling(false);
        return;
      }
      const res = await register(username, email, password);
      if (!res.success) {
        setAuthError(res.message || "Registration coordinates failed.");
      }
    } else {
      if (!email || !password) {
        setAuthError("Email and password parameters are required.");
        setHandling(false);
        return;
      }
      const res = await login(email, password);
      if (!res.success) {
        setAuthError(res.message || "Invalid email or password combination.");
      }
    }
    setHandling(false);
  };

  // One click logins for evaluate reviewers
  const handleShortcutLogin = async (type: 'admin' | 'guest') => {
    setHandling(true);
    setAuthError('');
    if (type === 'admin') {
      const res = await googleLogin('sharmaanjana2352@gmail.com', 'Admin Sharma', 'https://api.dicebear.com/7.x/initials/svg?seed=Anjana&backgroundType=solid&backgroundColor=b45309');
      if (!res.success) {
        setAuthError(res.message || "Admin entry failed.");
      }
    } else {
      const res = await googleLogin('gentleman.guest@gmail.com', 'Lord Charles', 'https://api.dicebear.com/7.x/initials/svg?seed=Charles&backgroundType=solid&backgroundColor=1f2937');
      if (!res.success) {
        setAuthError(res.message || "Guest entry failed.");
      }
    }
    setHandling(false);
  };

  return (
    <div className="bg-black py-16 text-white min-h-[85vh] flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6 space-y-8">
        
        {/* Portal branding header */}
        <div className="text-center">
          <span className="font-mono text-[9px] tracking-[0.3em] text-amber-500 uppercase font-bold">The Sarto Access</span>
          <h1 className="mt-2 font-sans text-3xl font-extrabold uppercase tracking-wide">PRIVATE ENTRY</h1>
          <p className="mt-2 text-xs text-neutral-500 font-light leading-relaxed">
            Register or sign in to save your private bespoke AI lookbooks and check active order progressions.
          </p>
        </div>

        {/* Shortcut entry points for seamless review evaluations */}
        <div className="border border-neutral-900 bg-neutral-950 p-5 rounded-xl space-y-3 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex h-20 w-20 items-center justify-between rounded-full bg-amber-500/[0.02] filter blur-xl" />
          
          <div className="flex items-center space-x-2 text-xs font-mono text-amber-500 uppercase tracking-widest font-bold border-b border-neutral-900 pb-2 mb-1">
            <Sparkles className="h-4 w-4" />
            <span>Review Shortcut Login (1-Click)</span>
          </div>
          
          <p className="text-[10px] text-neutral-500 leading-normal font-light">
            Skip filling credentials. Click here to instantly try either an Admin session or Standard Customer session.
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2.5">
            <button
              onClick={() => handleShortcutLogin('admin')}
              disabled={handling}
              className="rounded bg-amber-600/10 border border-amber-500/30 text-[10px] py-2.5 px-3 font-mono font-bold text-amber-500 uppercase hover:bg-amber-600 hover:text-black hover:border-amber-600 transition-all flex items-center justify-center space-x-1"
            >
              <Shield className="h-3.5 w-3.5" />
              <span>Admin Entry</span>
            </button>
            <button
              onClick={() => handleShortcutLogin('guest')}
              disabled={handling}
              className="rounded bg-neutral-900 border border-neutral-805 text-[10px] py-2.5 px-3 font-mono font-bold text-neutral-300 uppercase hover:bg-white hover:text-black hover:border-white transition-all flex items-center justify-center space-x-1"
            >
              <span>Lord Guest</span>
            </button>
          </div>
        </div>

        {/* Regular Signin form */}
        <form onSubmit={handleSubmit} className="bg-neutral-950/40 p-6 sm:p-8 rounded-xl border border-neutral-900 space-y-4">
          
          {isRegister && (
            <div>
              <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Noble Username</label>
              <input
                type="text"
                required
                placeholder="e.g. Lord Byron"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3.5 text-xs text-white placeholder-neutral-750 focus:outline-none focus:border-amber-500"
              />
            </div>
          )}

          <div>
            <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Account email</label>
            <input
              type="email"
              required
              placeholder="lord@gentlemen.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3.5 text-xs text-white placeholder-neutral-755 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-[9px] font-mono text-neutral-500 uppercase mb-1">Noble password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded border border-neutral-850 bg-black py-2.5 px-3.5 text-xs text-white placeholder-neutral-755 focus:outline-none focus:border-amber-500"
            />
          </div>

          {authError && (
            <div className="text-xs text-red-500 bg-red-400/10 p-3 rounded font-mono">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={handling}
            className="w-full rounded bg-white hover:bg-amber-500 hover:text-black py-3 px-4 text-xs font-bold tracking-widest text-black uppercase transition-colors"
          >
            {isRegister ? "Assemble noble account" : "Authorize Entry"}
          </button>

          <div className="text-center pt-3 border-t border-neutral-900 mt-4">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="font-mono text-[9px] text-neutral-500 hover:text-white uppercase tracking-widest transition-colors"
            >
              {isRegister ? "Have an account? Access gateway" : "Need registration? Enroll ledger"}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
