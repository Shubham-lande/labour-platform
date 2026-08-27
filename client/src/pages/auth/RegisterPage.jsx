import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../../components/common/GlassCard';
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
} from 'lucide-react';

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
    role: 'labour', // default role
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const res = await register(formData);
      toastSuccess('Account created successfully!');
      navigate(`/dashboard/${res.user.role}`);
    } catch (err) {
      setErrorMessage(err.message || 'Registration failed.');
      toastError(err.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-xl space-y-6 relative z-10 my-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Labour<span className="text-cyan-400">Hub</span>
              </span>
            </Link>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Create Your Account</h1>
            <p className="text-xs text-slate-400">Choose your role and set up your enterprise profile</p>
          </div>

          <GlassCard hover={false} className="p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Role Selection Picker */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                  Select Account Role
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Labour Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'labour' })}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      formData.role === 'labour'
                        ? 'bg-amber-500/15 border-amber-500/50 text-white shadow-lg shadow-amber-500/10'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {formData.role === 'labour' && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 absolute top-3 right-3" />
                    )}
                    <HardHat className={`w-7 h-7 mb-2 ${formData.role === 'labour' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div>
                      <p className="text-xs font-extrabold text-white">Skilled Worker</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Electricians, Plumbers, Masons, Helpers</p>
                    </div>
                  </button>

                  {/* Customer Option */}
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'customer' })}
                    className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                      formData.role === 'customer'
                        ? 'bg-cyan-500/15 border-cyan-500/50 text-white shadow-lg shadow-cyan-500/10'
                        : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/20'
                    }`}
                  >
                    {formData.role === 'customer' && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 absolute top-3 right-3" />
                    )}
                    <Building2 className={`w-7 h-7 mb-2 ${formData.role === 'customer' ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <div>
                      <p className="text-xs font-extrabold text-white">Customer / Contractor</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">Hire skilled labor for sites & projects</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" /> Full Name
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="e.g. Rajesh Kumar or Apex Infra"
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input placeholder:text-slate-500"
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@domain.com"
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input placeholder:text-slate-500"
                    required
                  />
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" /> Mobile Number
                  </label>
                  <input
                    type="tel"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input placeholder:text-slate-500"
                    required
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input placeholder:text-slate-500"
                    required
                  />
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Confirm Password
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input placeholder:text-slate-500"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                    Creating Profile & Session...
                  </span>
                ) : (
                  <>
                    Create Enterprise Account <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </GlassCard>

          <p className="text-center text-xs text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-cyan-400 font-bold hover:underline">
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default RegisterPage;
