import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../../components/common/GlassCard';
import PageTransition from '../../components/common/PageTransition';
import {
  Shield,
  Mail,
  Lock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  HardHat,
  Building2,
  KeyRound,
} from 'lucide-react';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Quick Demo Login Helper for instant testing
  const handleQuickDemo = async (demoRole) => {
    let demoEmail = '';
    let demoPass = '';

    if (demoRole === 'admin') {
      demoEmail = 'admin@labourhub.com';
      demoPass = 'Admin@1234';
    } else if (demoRole === 'labour') {
      demoEmail = 'labour@labourhub.com';
      demoPass = 'Labour@1234';
    } else if (demoRole === 'customer') {
      demoEmail = 'customer@labourhub.com';
      demoPass = 'Customer@1234';
    }

    setIdentifier(demoEmail);
    setPassword(demoPass);

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await login(demoEmail, demoPass);
      if (res && res.user) {
        toastSuccess(`Welcome back! Authenticated as ${res.user?.name || res.user?.fullName || demoRole}`);
        window.location.href = `/dashboard/${res.user.role}`;
      }
    } catch (err) {
      setErrorMessage(err.message || 'Login failed. Please verify the backend API is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!identifier || !password) {
      setErrorMessage('Please provide your email/mobile and password.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await login(identifier, password);
      if (res && res.user) {
        toastSuccess(`Login successful! Redirecting to ${res.user.role} workspace...`);
        window.location.href = `/dashboard/${res.user.role}`;
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid credentials or backend unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Background ambient lighting */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          {/* Logo Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Labour<span className="text-cyan-400">Hub</span>
              </span>
            </Link>
            <h1 className="text-xl font-bold text-white tracking-tight">Sign In to Your Workspace</h1>
            <p className="text-xs text-slate-400">Enter your credentials to access role-specific dashboard controls</p>
          </div>

          {/* Login Glass Form */}
          <GlassCard hover={false} className="p-8">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Identifier Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email or Mobile Number
                </label>
                <input
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="e.g. labour@labourhub.com or +91 9812345678"
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-cyan-400 hover:underline font-semibold"
                  >
                    Forgot OTP Reset?
                  </Link>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input placeholder:text-slate-500"
                  required
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Authenticating Session...
                  </span>
                ) : (
                  <>
                    Sign In to Portal <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo One-Click Fill Buttons */}
            <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center flex items-center justify-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> One-Click Quick Demo Sign In
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickDemo('labour')}
                  className="px-2.5 py-2 rounded-xl text-[11px] font-semibold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <HardHat className="w-3 h-3" /> Worker
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('customer')}
                  className="px-2.5 py-2 rounded-xl text-[11px] font-semibold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Building2 className="w-3 h-3" /> Contractor
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickDemo('admin')}
                  className="px-2.5 py-2 rounded-xl text-[11px] font-semibold text-purple-300 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Shield className="w-3 h-3" /> Admin
                </button>
              </div>
            </div>
          </GlassCard>

          {/* Register Callout */}
          <p className="text-center text-xs text-slate-400">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-cyan-400 font-bold hover:underline">
              Create Free Account
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
