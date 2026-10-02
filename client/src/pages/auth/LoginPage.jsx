import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
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
  Eye,
  EyeOff,
  Radio,
  CheckCircle,
  Zap,
  Briefcase,
  Users,
  Wallet,
  Activity,
} from 'lucide-react';

const ROLE_CONFIGS = {
  labour: {
    title: 'Skilled Labour & Trades',
    subtitle: 'Sign in to access job requests, GPS attendance geo-fence check-in, and instant daily UPI escrow payouts.',
    bgClass: 'bg-labour-dashboard',
    accentColor: 'amber',
    borderColor: 'border-amber-500/40',
    glowColor: 'shadow-amber-500/20',
    badgeText: 'Verified Master Worker Portal',
    defaultEmail: 'labour@labourhub.com',
    defaultPass: 'Labour@1234',
    icon: HardHat,
    telemetry: [
      { label: 'UPI Escrow Settlement', value: 'INSTANT READY', color: 'text-amber-400', icon: Zap },
      { label: 'GPS Shift Check-in', value: 'CALIBRATED', color: 'text-emerald-400', icon: Radio },
      { label: 'Daily Verified Work', value: '4 NEW REQUESTS', color: 'text-cyan-400', icon: Briefcase },
    ],
  },
  customer: {
    title: 'Customer & Contractor',
    subtitle: 'Deploy vetted construction crews, manage multi-site job milestones, and authorize secure escrow settlements.',
    bgClass: 'bg-customer-dashboard',
    accentColor: 'purple',
    borderColor: 'border-purple-500/40',
    glowColor: 'shadow-purple-500/20',
    badgeText: 'Enterprise Contractor Portal',
    defaultEmail: 'customer@labourhub.com',
    defaultPass: 'Customer@1234',
    icon: Building2,
    telemetry: [
      { label: 'Live Trades Network', value: '1,480 ONLINE', color: 'text-emerald-400', icon: Radio },
      { label: 'Active Projects', value: '9 SITES', color: 'text-purple-400', icon: Building2 },
      { label: 'Milestone Escrow', value: '100% PROTECTED', color: 'text-cyan-400', icon: Shield },
    ],
  },
  admin: {
    title: 'Administration Command',
    subtitle: 'Audit workforce KYC identity documents, govern platform roster accounts, and resolve dispute escalations.',
    bgClass: 'bg-admin-dashboard',
    accentColor: 'purple',
    borderColor: 'border-indigo-500/40',
    glowColor: 'shadow-indigo-500/20',
    badgeText: 'Root System Command & Audit',
    defaultEmail: 'admin@labourhub.com',
    defaultPass: 'Admin@1234',
    icon: Shield,
    telemetry: [
      { label: 'Identity KYC Pipeline', value: '5 PENDING', color: 'text-amber-400', icon: Zap },
      { label: 'Platform GMV Volume', value: '₹5,20,000', color: 'text-emerald-400', icon: Wallet },
      { label: 'System Health Diagnostics', value: '100% OPERATIONAL', color: 'text-cyan-400', icon: Activity },
    ],
  },
};

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [activeRole, setActiveRole] = useState('customer');
  const [identifier, setIdentifier] = useState('customer@labourhub.com');
  const [password, setPassword] = useState('Customer@1234');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const currentConfig = ROLE_CONFIGS[activeRole] || ROLE_CONFIGS.customer;

  const handleRoleSelect = (roleKey) => {
    setActiveRole(roleKey);
    const config = ROLE_CONFIGS[roleKey];
    setIdentifier(config.defaultEmail);
    setPassword(config.defaultPass);
    setErrorMessage('');
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
      setErrorMessage(err.message || 'Invalid credentials or backend server unavailable.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className={`min-h-screen ${currentConfig.bgClass} text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden transition-all duration-700`}>
        {/* Dark overlay backdrop */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] pointer-events-none" />

        <div className="w-full max-w-5xl my-6 relative z-10">
          {/* Top Role Switcher Header Pills */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 flex-wrap">
            <button
              type="button"
              onClick={() => handleRoleSelect('labour')}
              className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xl border ${
                activeRole === 'labour'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white border-amber-400 shadow-xl shadow-amber-600/30 scale-105'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <HardHat className="w-4 h-4 text-amber-300" />
              <span>Labour / Worker Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('customer')}
              className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xl border ${
                activeRole === 'customer'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-xl shadow-purple-600/30 scale-105'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Building2 className="w-4 h-4 text-purple-300" />
              <span>Customer / Contractor Login</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('admin')}
              className={`px-4 sm:px-6 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all cursor-pointer backdrop-blur-xl border ${
                activeRole === 'admin'
                  ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white border-indigo-400 shadow-xl shadow-indigo-600/30 scale-105'
                  : 'bg-slate-900/80 text-slate-300 border-white/10 hover:bg-white/10 hover:text-white'
              }`}
            >
              <Shield className="w-4 h-4 text-cyan-300" />
              <span>Admin Login</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Column: Role Overview & Live Telemetry */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-950/85 border border-white/15 backdrop-blur-2xl text-white shadow-2xl flex flex-col justify-between space-y-6">
              <div>
                <Link to="/" className="inline-flex items-center gap-2.5 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white tracking-tight leading-none block">
                      Labour<span className="text-cyan-400">Hub</span>
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono tracking-widest uppercase">
                      Enterprise OS
                    </span>
                  </div>
                </Link>

                <div className="space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-xs font-bold text-white border border-white/15 mb-1 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {currentConfig.badgeText}
                  </div>
                  <h3 className="text-2xl font-black text-white">{currentConfig.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {currentConfig.subtitle}
                  </p>
                </div>
              </div>

              {/* Dynamic Role Telemetry Box */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs font-mono">
                {currentConfig.telemetry.map((item, idx) => {
                  const ItemIcon = item.icon;
                  return (
                    <div key={idx} className="flex items-center justify-between text-slate-300">
                      <span className="flex items-center gap-1.5 font-semibold">
                        <ItemIcon className="w-3.5 h-3.5 text-slate-400" /> {item.label}
                      </span>
                      <span className={`font-bold ${item.color}`}>{item.value}</span>
                    </div>
                  );
                })}
              </div>

              {/* One Click Instant Demo Auto-fill Helper */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-purple-900/40 via-slate-900/60 to-cyan-900/40 border border-white/10 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block font-mono">DEMO CREDENTIALS LOADED</span>
                  <span className="font-mono text-cyan-300 font-bold">{currentConfig.defaultEmail}</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-[10px] font-bold text-slate-200 border border-white/10">
                  Ready
                </span>
              </div>
            </div>

            {/* Right Column: Sign In Form */}
            <div className="lg:col-span-7">
              <div className="glass-card p-6 sm:p-8 bg-slate-950/85 backdrop-blur-2xl border border-white/15 h-full flex flex-col justify-between">
                <div>
                  <div className="text-left space-y-1.5 mb-6">
                    <h1 className="text-2xl font-black text-white tracking-tight">Portal Authentication</h1>
                    <p className="text-xs text-slate-300">
                      Logging in as <span className="font-bold text-cyan-400">{currentConfig.title}</span>
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Identifier Input */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email or Mobile Number
                      </label>
                      <input
                        type="text"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                        placeholder="e.g. contractor@domain.com"
                        className="w-full px-4 py-3 text-xs rounded-xl glass-input placeholder:text-slate-500 font-mono text-white"
                        required
                      />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password
                        </label>
                        <Link
                          to="/forgot-password"
                          className="text-xs text-cyan-400 hover:underline font-bold"
                        >
                          Forgot Password?
                        </Link>
                      </div>
                      <div className="relative">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••••••"
                          className="w-full px-4 py-3 text-xs rounded-xl glass-input placeholder:text-slate-500 pr-10 font-mono text-white"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 shadow-xl shadow-purple-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 cursor-pointer hover:scale-[1.01]"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Authenticating {currentConfig.title}...
                        </span>
                      ) : (
                        <>
                          Sign In to {currentConfig.title} <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>

                <div className="mt-6 pt-5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <p className="text-xs text-slate-400">
                    New to LabourHub?{' '}
                    <Link to="/register" className="text-cyan-400 font-bold hover:underline">
                      Create an Account
                    </Link>
                  </p>
                  <span className="text-[11px] font-mono text-slate-500">256-Bit Escrow Security</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default LoginPage;
