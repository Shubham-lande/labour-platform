import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import api from '../../services/api';
import {
  X,
  CreditCard,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Lock,
  IndianRupee,
  Building,
  Wallet,
  Sparkles,
} from 'lucide-react';

const PaymentModal = ({ isOpen, onClose, project, booking, onPaymentSuccess }) => {
  const { toastSuccess, toastError } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('upi_razorpay');
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const amount = project?.budget || booking?.estimatedBudget || 185000;
  const workerRate = 1200;
  const durationDays = Math.ceil(amount / workerRate);
  const taxAmount = Math.round(amount * 0.18);
  const grandTotal = amount + taxAmount;

  if (!isOpen) return null;

  const handlePayNow = async () => {
    setLoading(true);
    try {
      const payload = {
        projectId: project?._id || project?.id,
        bookingId: booking?._id || booking?.id,
        labourId: project?.assignedWorkers?.[0]?.workerId || booking?.labour || '65f0a0000000000000000002',
        labourName: project?.assignedWorkers?.[0]?.workerName || booking?.labourName || 'Rajesh Kumar',
        amount: grandTotal,
        paidAmount: grandTotal,
        paymentMethod,
        workDescription: project?.description || booking?.description || 'Site Labour & Substation Services',
        duration: `${durationDays} Days`,
        dailyRate: workerRate,
        additionalCharges: taxAmount,
      };

      const res = await api.post('/payments', payload);
      if (res.success) {
        setPaid(true);
        toastSuccess('Payment of ₹' + grandTotal.toLocaleString() + ' processed successfully!');
        if (onPaymentSuccess) onPaymentSuccess(res.data);
        setTimeout(() => {
          setPaid(false);
          onClose();
        }, 1800);
      }
    } catch (err) {
      toastError(err.message || 'Payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-xl bg-[#0F172A] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-cyan-500/10 space-y-6 relative overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <StatusBadge status="pending" text="Escrow Secure Checkout" />
                <span className="text-[10px] font-mono text-cyan-400">Pluggable Razorpay / Stripe Engine</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1">Work Payment Checkout</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {paid ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-extrabold text-white">Payment Authorized!</h3>
              <p className="text-xs text-slate-400">
                Transaction ID: TXN-RZP-{(Math.random() * 1000000).toFixed(0)} • Invoice generated automatically.
              </p>
            </div>
          ) : (
            <>
              {/* Payment Summary */}
              <GlassCard hover={false} className="p-4 space-y-3 bg-slate-900/60 border border-white/10">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Payment Summary Breakdown</h4>
                
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Project / Work Order</span>
                    <span className="font-semibold text-white truncate max-w-[220px]">
                      {project?.name || booking?.title || 'Smart Building Automation'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Assigned Labour Crew</span>
                    <span className="font-semibold text-cyan-300">
                      {project?.assignedWorkers?.[0]?.workerName || booking?.labourName || 'Rajesh Kumar (Master Electrician)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Base Daily Rate</span>
                    <span className="font-mono text-slate-300">₹{workerRate.toLocaleString()} / day</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Subtotal Labour Charge</span>
                    <span className="font-mono text-slate-300">₹{amount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">GST (18% Statutory Tax)</span>
                    <span className="font-mono text-slate-300">₹{taxAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10 text-sm font-extrabold">
                    <span className="text-white">Total Amount Payable</span>
                    <span className="text-cyan-400 font-mono text-base">₹{grandTotal.toLocaleString()}</span>
                  </div>
                </div>
              </GlassCard>

              {/* Gateway Selection */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Select Payment Gateway</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { id: 'upi_razorpay', label: 'UPI / Razorpay', icon: Zap },
                    { id: 'card_stripe', label: 'Credit Card', icon: CreditCard },
                    { id: 'bank_transfer', label: 'Net Banking', icon: Building },
                    { id: 'escrow_wallet', label: 'Escrow Wallet', icon: Wallet },
                  ].map((gw) => (
                    <button
                      key={gw.id}
                      type="button"
                      onClick={() => setPaymentMethod(gw.id)}
                      className={`p-3 rounded-2xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                        paymentMethod === gw.id
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-lg shadow-cyan-500/20'
                          : 'bg-white/5 text-slate-400 border-white/10 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      <gw.icon className="w-5 h-5" />
                      <span>{gw.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Escrow Guarantee Banner */}
              <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-200">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
                <span>Funds are held safely in LabourHub Escrow and released only after customer work approval.</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-white/10 hover:bg-white/20 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handlePayNow}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/30 flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <span className="animate-pulse">Authorizing Gateway...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" /> Pay ₹{grandTotal.toLocaleString()} Now
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default PaymentModal;
