import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import PageTransition from '../../components/common/PageTransition';
import {
  Shield,
  User,
  Mail,
  Phone,
  Lock,
  HardHat,
  Building2,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Zap,
  Award,
  Wallet,
  CheckCircle,
  Eye,
  EyeOff,
  Check,
} from 'lucide-react';

const ROLE_PERKS = {
  labour: [
    { icon: Zap, title: 'Instant Direct Bank Payouts', desc: 'Shift wages deposited to your UPI / Bank Account within 10 mins of approval.' },
    { icon: Award, title: 'Verified Digital Credential', desc: 'Verified skill ratings and badges directly increase your daily hire rates.' },
    { icon: Wallet, title: '0% Platform Deduction', desc: 'Keep 100% of your listed daily wages with transparent escrow management.' },
  ],
  customer: [
    { icon: Shield, title: '100% Escrow Protection', desc: 'Funds released only after you review and approve on-site deliverables.' },
    { icon: CheckCircle2, title: 'Automated 50m Geo-Fencing', desc: 'Zero ghost attendance. Workers checked in via GPS radius verification.' },
    { icon: Building2, title: 'Instant Multi-Trade Dispatch', desc: 'Deploy single specialists or 50+ person crews with 1-click booking.' },
  ],
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
    role: 'labour',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successCelebration, setSuccessCelebration] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPasswordStrength = () => {
    const pass = formData.password;
    if (!pass) return { score: 0, label: '', color: 'bg-slate-700' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) return { score, label: 'Weak', color: 'bg-rose-500', width: '33%' };
    if (score <= 3) return { score, label: 'Good', color: 'bg-amber-500', width: '66%' };
    return { score, label: 'Enterprise Strong', color: 'bg-emerald-400', width: '100%' };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match. Please verify.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData);
      setSuccessCelebration(true);
      toastSuccess('Account created successfully! Welcome to LabourHub.');
      setTimeout(() => {
        navigate(`/dashboard/${res.user.role}`);
      }, 1500);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed. Please check your network.');
      toastError(err.message || 'Registration failed.');
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className={`min-h-screen ${formData.role === 'labour' ? 'bg-labour-dashboard' : 'bg-customer-dashboard'} text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-12 relative overflow-hidden transition-all duration-700`}>
        {/* Dark overlay backdrop */}
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[2px] pointer-events-none" />
        <div className="w-full max-w-5xl my-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Side: Rich Showcase on Glass */}
            <div className="lg:col-span-5 flex flex-col justify-between p-8 rounded-3xl bg-slate-950/85 border border-white/15 text-white shadow-2xl backdrop-blur-2xl relative overflow-hidden">
              <div className="space-y-6">
                <Link to="/" className="inline-flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-white tracking-tight leading-none block">
                      Labour<span className="text-cyan-400">Hub</span>
                    </span>
                    <span className="text-[10px] text-cyan-300 font-mono tracking-widest uppercase">
                      Enterprise Workforce OS
                    </span>
                  </div>
                </Link>

                <div className="space-y-2 pt-2">
                  <h2 className="text-2xl font-black text-white leading-snug">
                    {formData.role === 'labour' ? (
                      <>
                        Unlock High-Paying <br />
                        <span className="text-amber-400">
                          Trade Contracts Daily
                        </span>
                      </>
                    ) : (
                      <>
                        Deploy Certified Crews <br />
                        <span className="text-cyan-400">
                          With 100% Escrow Safety
                        </span>
                      </>
                    )}
                  </h2>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {formData.role === 'labour'
                      ? 'Join thousands of verified electricians, plumbers, masons and structural crews getting instant bank payouts.'
                      : 'Deploy verified multi-trade workers with automated GPS attendance tracking and milestone-backed escrow.'}
                  </p>
                </div>

                {/* Role Benefits */}
                <div className="space-y-3 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
                    {formData.role === 'labour' ? 'Worker Member Benefits' : 'Contractor Enterprise Perks'}
                  </span>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={formData.role}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-3"
                    >
                      {ROLE_PERKS[formData.role].map((perk, pIdx) => {
                        const Icon = perk.icon;
                        return (
                          <div
                            key={pIdx}
                            className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3"
                          >
                            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                              <Icon className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white">{perk.title}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{perk.desc}</p>
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Shield className="w-3.5 h-3.5" /> 100% Escrow Secured
                </span>
                <span>256-Bit SSL Encrypted</span>
              </div>
            </div>

            {/* Right Side: Frosted Glass Form */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <div className="glass-card p-6 sm:p-8 bg-slate-950/85 backdrop-blur-2xl border border-white/15">
                {successCelebration ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="py-12 text-center space-y-4"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-md">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Account Created Successfully!</h3>
                    <p className="text-xs text-slate-300 max-w-sm mx-auto">
                      Setting up your {formData.role} workspace and security credentials. Redirecting...
                    </p>
                    <div className="w-24 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                      <div className="h-full bg-cyan-400 animate-pulse w-full" />
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-1">
                      <h1 className="text-xl font-black text-white tracking-tight">Create Enterprise Account</h1>
                      <p className="text-xs text-slate-400">Choose your account type to set up your profile</p>
                    </div>

                    {errorMessage && (
                      <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Role Picker Selector */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block font-mono">
                        Choose Account Type
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, role: 'labour' })}
                          className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-3 cursor-pointer ${
                            formData.role === 'labour'
                              ? 'bg-amber-500/20 border-amber-500/60 text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <HardHat
                            className={`w-6 h-6 mt-0.5 shrink-0 ${
                              formData.role === 'labour' ? 'text-amber-400' : 'text-slate-500'
                            }`}
                          />
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1.5">
                              Skilled Worker
                              {formData.role === 'labour' && (
                                <span className="w-2 h-2 rounded-full bg-amber-400" />
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Electricians, Masons, Plumbers</p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, role: 'customer' })}
                          className={`p-3.5 rounded-2xl border text-left transition-all relative overflow-hidden flex items-start gap-3 cursor-pointer ${
                            formData.role === 'customer'
                              ? 'bg-cyan-500/20 border-cyan-500/60 text-white shadow-md'
                              : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                          }`}
                        >
                          <Building2
                            className={`w-6 h-6 mt-0.5 shrink-0 ${
                              formData.role === 'customer' ? 'text-cyan-400' : 'text-slate-500'
                            }`}
                          />
                          <div>
                            <p className="text-xs font-bold text-white flex items-center gap-1.5">
                              Contractor / Client
                              {formData.role === 'customer' && (
                                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                              )}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Hire workers for sites</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name or Enterprise Name
                        </label>
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="e.g. Rajesh Kumar or Apex Construction"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder:text-slate-500"
                          required
                        />
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="you@domain.com"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder:text-slate-500"
                          required
                        />
                      </div>

                      {/* Mobile Number */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-cyan-400" /> Mobile Number
                        </label>
                        <input
                          type="tel"
                          name="mobileNumber"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          placeholder="+91 9876543210"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder:text-slate-500"
                          required
                        />
                      </div>

                      {/* Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password
                          </span>
                          {strength.label && (
                            <span className="text-[10px] text-cyan-400 font-bold font-mono">{strength.label}</span>
                          )}
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="At least 6 characters"
                            className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder:text-slate-500 pr-9"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                          >
                            {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        {formData.password && (
                          <div className="w-full h-1 bg-slate-800 rounded-full mt-1 overflow-hidden">
                            <div
                              className={`h-full ${strength.color} transition-all duration-300`}
                              style={{ width: strength.width }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Confirm Password */}
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                          <Lock className="w-3.5 h-3.5 text-cyan-400" /> Confirm Password
                        </label>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          placeholder="Re-enter password"
                          className="w-full px-3.5 py-2.5 text-xs rounded-xl glass-input placeholder:text-slate-500"
                          required
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer hover:scale-[1.01]"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Creating Account Profile...
                        </span>
                      ) : (
                        <>
                          Complete Registration <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>

                    <p className="text-center text-xs text-slate-400 pt-1">
                      Already registered?{' '}
                      <Link to="/login" className="text-cyan-400 font-bold hover:underline">
                        Sign In Here
                      </Link>
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
