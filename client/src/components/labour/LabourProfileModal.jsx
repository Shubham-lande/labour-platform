import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../common/StatusBadge';
import {
  X,
  Star,
  MapPin,
  Clock,
  ShieldCheck,
  Briefcase,
  Calendar,
  CheckCircle2,
  Building2,
  DollarSign,
  MessageSquare,
} from 'lucide-react';

const LabourProfileModal = ({ profile, isOpen, onClose, onBookNow }) => {
  if (!isOpen || !profile) return null;

  const {
    userId,
    user,
    primarySkill,
    skills = [],
    workCategories = [],
    experienceYears = 1,
    dailyRate = 800,
    hourlyRate = 120,
    location = { city: 'Mumbai', state: 'Maharashtra' },
    serviceArea = 'Mumbai Metropolitan Area',
    workingHours = '08:00 AM - 06:00 PM',
    availabilityStatus = 'available',
    rating = 4.8,
    completedJobs = 0,
    bio = '',
    reviews = [],
    workHistory = [],
  } = profile;

  const fullName = user?.fullName || profile.fullName || 'Skilled Worker';
  const avatar = user?.avatar || profile.avatar || '';
  const isVerified = user?.isVerified ?? profile.isVerified ?? true;
  const isAvailable = availabilityStatus === 'available';

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-3xl glass-card rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Profile Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 border-b border-white/10 pb-6 mb-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-3xl overflow-hidden shadow-xl border border-cyan-400/30 shrink-0">
              {avatar ? (
                <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                fullName[0] || 'W'
              )}
            </div>

            <div className="space-y-1 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">{fullName}</h2>
                {isVerified && <StatusBadge status="verified" text="KYC Approved" />}
                {isAvailable ? (
                  <StatusBadge status="active" text="Available Now" />
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 capitalize">
                    {availabilityStatus}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-cyan-400">
                {primarySkill || skills[0] || 'Master Skilled Professional'}
              </p>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {location.city || 'Mumbai'}
                </span>
                <span>•</span>
                <span>{experienceYears} Years Experience</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400" /> {rating} ({completedJobs} Jobs)
                </span>
              </div>
            </div>

            {/* Quick Book Button */}
            {isAvailable && (
              <button
                onClick={() => {
                  onClose();
                  onBookNow(profile);
                }}
                className="w-full sm:w-auto px-6 py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all shrink-0 mt-3 sm:mt-0"
              >
                Book Worker Now
              </button>
            )}
          </div>

          {/* Rate Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[11px] text-slate-400 block">Daily Rate</span>
              <span className="text-lg font-extrabold text-cyan-400 font-mono">₹{dailyRate.toLocaleString()}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[11px] text-slate-400 block">Hourly Rate</span>
              <span className="text-lg font-extrabold text-cyan-400 font-mono">₹{hourlyRate.toLocaleString()}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[11px] text-slate-400 block">Working Hours</span>
              <span className="text-xs font-bold text-white">{workingHours}</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
              <span className="text-[11px] text-slate-400 block">Service Area</span>
              <span className="text-xs font-bold text-white truncate block">{serviceArea}</span>
            </div>
          </div>

          {/* Bio / About */}
          <div className="space-y-2 mb-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">About & Work Background</h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
              {bio || 'Experienced skilled professional ready for commercial and residential site bookings.'}
            </p>
          </div>

          {/* Certified Skills */}
          <div className="space-y-2 mb-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Certified Skill Sets</h3>
            <div className="flex flex-wrap gap-2">
              {skills.map((sk, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                >
                  {sk}
                </span>
              ))}
            </div>
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-3 mb-6">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
              <span>Verified Customer Reviews</span>
              <span className="text-amber-400 font-mono">★ {rating} / 5.0</span>
            </h3>
            {reviews.length > 0 ? (
              <div className="space-y-2.5">
                {reviews.map((rev, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-white/5 border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-white">{rev.customerName}</span>
                      <span className="flex items-center gap-1 text-amber-400 font-bold font-mono">
                        <Star className="w-3 h-3 fill-amber-400" /> {rev.rating}.0
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{rev.comment}</p>
                    <span className="text-[10px] text-slate-500 font-mono block">{rev.date}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic bg-white/5 p-3 rounded-xl">
                No customer reviews yet. Worker is verified and ready for site assignments.
              </p>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LabourProfileModal;
