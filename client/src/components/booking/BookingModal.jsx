import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Briefcase,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  HardHat,
  Building2,
  Lock,
} from 'lucide-react';

const BookingModal = ({ labourProfile, isOpen, onClose, onBookingSuccess }) => {
  const { user } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const workerName = labourProfile?.user?.fullName || labourProfile?.fullName || 'Skilled Labour';
  const workerCategory = labourProfile?.primarySkill || labourProfile?.skills?.[0] || 'General Skilled Worker';
  const dailyRate = labourProfile?.dailyRate || 1000;

  const [formData, setFormData] = useState({
    title: '',
    category: workerCategory,
    description: '',
    address: 'Plot 4B, Commercial Tech Park',
    city: labourProfile?.location?.city || 'Mumbai',
    pincode: '400013',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0],
    startTime: '08:30 AM',
    workerCount: '2',
    estimatedBudget: dailyRate * 5 * 2,
    specialInstructions: 'PPE Safety Helmet and Steel-Toe Boots Mandatory.',
  });

  // Calculate estimated budget automatically when date range or worker count changes
  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));
      const count = parseInt(formData.workerCount, 10) || 1;
      const calcBudget = dailyRate * diffTime * count;
      setFormData((prev) => ({ ...prev, estimatedBudget: calcBudget }));
    }
  }, [formData.startDate, formData.endDate, formData.workerCount, dailyRate]);

  if (!isOpen || !labourProfile) return null;

  const handleSubmitBooking = async () => {
    setLoading(true);
    try {
      const payload = {
        labourId: labourProfile.userId || labourProfile.user?.id || '65f0a0000000000000000002',
        labourName: workerName,
        title: formData.title || `${workerCategory} Booking`,
        category: formData.category,
        description: formData.description,
        location: {
          address: formData.address,
          city: formData.city,
          state: 'Maharashtra',
          pincode: formData.pincode,
        },
        startDate: formData.startDate,
        endDate: formData.endDate,
        startTime: formData.startTime,
        workerCount: parseInt(formData.workerCount, 10),
        estimatedBudget: parseInt(formData.estimatedBudget, 10),
        specialInstructions: formData.specialInstructions,
      };

      const res = await api.post('/bookings', payload);
      if (res.success) {
        toastSuccess(`Work Booking Request created for ${workerName}! Status: Pending`);
        if (onBookingSuccess) onBookingSuccess(res.booking);
        onClose();
        setStep(1);
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit booking request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl glass-card rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Stepper Indicator */}
          <div className="mb-6">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 mb-2">
              <span className="text-cyan-400">Step {step} of 4</span>
              <span>
                {step === 1 && 'Work Details'}
                {step === 2 && 'Schedule & Crew'}
                {step === 3 && 'Budget & Notes'}
                {step === 4 && 'Confirmation'}
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden flex">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-300 rounded-full"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* Worker Banner Header */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5 mb-6">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-base overflow-hidden shrink-0">
              {labourProfile?.user?.avatar ? (
                <img src={labourProfile.user.avatar} alt="Worker" className="w-full h-full object-cover" />
              ) : (
                workerName[0] || 'W'
              )}
            </div>
            <div>
              <h3 className="text-xs font-extrabold text-white">{workerName}</h3>
              <p className="text-[11px] text-cyan-400 font-semibold">{workerCategory} • ₹{dailyRate}/day</p>
            </div>
          </div>

          {/* STEP 1: Work Details */}
          {step === 1 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Work / Project Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Commercial Mall Electrical Wiring Phase 2"
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Work Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Work Scope & Site Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Provide scope of work, technical requirements, or materials available on-site..."
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Site Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep(2)}
                className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 mt-4"
              >
                Continue to Schedule <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {/* STEP 2: Schedule & Crew */}
          {step === 2 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Daily Start Time</label>
                  <input
                    type="text"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    placeholder="08:30 AM"
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Workers Needed</label>
                  <input
                    type="number"
                    min={1}
                    value={formData.workerCount}
                    onChange={(e) => setFormData({ ...formData, workerCount: e.target.value })}
                    className="w-full px-4 py-3 text-xs rounded-xl glass-input font-mono"
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3.5 rounded-xl text-xs font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-2/3 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  Continue to Budget <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: Budget & Special Notes */}
          {step === 3 && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Total Estimated Budget (₹)</label>
                <input
                  type="number"
                  value={formData.estimatedBudget}
                  onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                  className="w-full px-4 py-3 text-sm rounded-xl glass-input font-mono font-bold text-cyan-400"
                />
                <span className="text-[11px] text-slate-400">Auto-calculated based on daily rate & shift duration.</span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Special Site Instructions</label>
                <textarea
                  rows={3}
                  value={formData.specialInstructions}
                  onChange={(e) => setFormData({ ...formData, specialInstructions: e.target.value })}
                  placeholder="Gate pass instructions, PPE requirements, safety compliance..."
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="w-1/3 py-3.5 rounded-xl text-xs font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="w-2/3 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center justify-center gap-2"
                >
                  Review Summary <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 4: Summary Confirmation */}
          {step === 4 && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-5">
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
                  <span className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400" /> Booking Order Summary
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-200 font-mono">STATUS: PENDING</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Assigned Worker</span>
                    <span className="font-bold text-white">{workerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Work Title</span>
                    <span className="font-bold text-white truncate block">{formData.title || 'Work Booking'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Duration</span>
                    <span className="font-bold text-white">{formData.startDate} to {formData.endDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Crew Size</span>
                    <span className="font-bold text-white">{formData.workerCount} Workers</span>
                  </div>
                </div>
                <div className="pt-2 border-t border-cyan-500/20 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300">Total Escrow Budget:</span>
                  <span className="text-lg font-extrabold text-cyan-400 font-mono">₹{parseInt(formData.estimatedBudget, 10).toLocaleString()}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="w-1/3 py-3.5 rounded-xl text-xs font-bold text-slate-300 bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Edit
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={handleSubmitBooking}
                  className="w-2/3 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? (
                    'Submitting Request...'
                  ) : (
                    <>
                      Confirm & Send Booking <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default BookingModal;
