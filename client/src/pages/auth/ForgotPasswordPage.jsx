import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../../components/common/GlassCard';
import PageTransition from '../../components/common/PageTransition';
import {
  Shield,
  Mail,
  KeyRound,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
} from 'lucide-react';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const { requestOTP, verifyOTP, resetPassword } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [step, setStep] = useState(1); // Step 1: Request, Step 2: Verify OTP, Step 3: Set New Password
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [demoOtpCode, setDemoOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Step 1: Request OTP
  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!identifier) {
      setErrorMessage('Please enter your email or mobile number.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await requestOTP(identifier);
      if (res.success) {
        toastSuccess(`OTP Code sent to ${identifier}`);
        if (res.demoOTP) {
          setDemoOtpCode(res.demoOTP);
          setOtp(res.demoOTP); // Auto-fill for ultra smooth demo testing
        }
        setStep(2);
        setTimer(60);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to request OTP');
      toastError(err.message || 'Failed to request OTP');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP
  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otp) {
      setErrorMessage('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await verifyOTP(identifier, otp);
      if (res.success) {
        toastSuccess('OTP Verified! Enter your new password.');
        setStep(3);
      }
    } catch (err) {
      setErrorMessage(err.message || 'Invalid OTP code.');
      toastError(err.message || 'Invalid OTP code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    setErrorMessage('');
    try {
      const res = await resetPassword({
        identifier,
        otp,
        newPassword,
        confirmPassword,
      });
      if (res.success) {
        toastSuccess('Password reset successfully! Log in with your new credentials.');
        navigate('/login');
      }
    } catch (err) {
      setErrorMessage(err.message || 'Reset failed.');
      toastError(err.message || 'Reset failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
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
            <h1 className="text-xl font-bold text-white tracking-tight">Account Recovery</h1>
            <p className="text-xs text-slate-400">Step {step} of 3 — Secure OTP Password Reset</p>
          </div>

          <GlassCard hover={false} className="p-8">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 mb-4">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* STEP 1: Enter Identifier */}
            {step === 1 && (
              <form onSubmit={handleRequestOTP} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-cyan-400" /> Account Email or Mobile Number
                  </label>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="e.g. labour@labourhub.com"
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input placeholder:text-slate-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Sending OTP...' : 'Send Verification OTP'} <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: Enter & Verify OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                {demoOtpCode && (
                  <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs flex items-center justify-between">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Generated Demo OTP:
                    </span>
                    <span className="font-mono font-bold text-white tracking-widest text-sm bg-cyan-500/20 px-2 py-0.5 rounded border border-cyan-400/40">
                      {demoOtpCode}
                    </span>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                    <span className="flex items-center gap-1.5"><KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Enter 6-Digit OTP</span>
                    <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" /> {timer}s
                    </span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="123456"
                    className="w-full px-4 py-3 text-center text-lg font-mono tracking-widest rounded-xl glass-input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Verifying...' : 'Verify OTP Code'} <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 3: Set New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-cyan-400" /> Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? 'Updating Password...' : 'Save & Reset Password'} <CheckCircle2 className="w-4 h-4" />
                </button>
              </form>
            )}
          </GlassCard>

          <p className="text-center text-xs text-slate-400">
            Remembered your password?{' '}
            <Link to="/login" className="text-cyan-400 font-bold hover:underline">
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </PageTransition>
  );
};

export default ForgotPasswordPage;
