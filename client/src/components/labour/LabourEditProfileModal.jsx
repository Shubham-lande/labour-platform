import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  X,
  User,
  DollarSign,
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  AlertCircle,
  HardHat,
} from 'lucide-react';

const LabourEditProfileModal = ({ isOpen, onClose, onUpdated }) => {
  const { user, roleProfile } = useAuth();
  const { toastSuccess, toastError } = useToast();

  const [formData, setFormData] = useState({
    avatar: '',
    primarySkill: '',
    skillsStr: '',
    dailyRate: '1200',
    hourlyRate: '180',
    experienceYears: '5',
    city: 'Mumbai',
    serviceArea: 'Mumbai Metropolitan Region',
    workingHours: '08:00 AM - 06:00 PM',
    availabilityStatus: 'available',
    bio: '',
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (roleProfile || user) {
      setFormData({
        avatar: user?.avatar || '',
        primarySkill: roleProfile?.primarySkill || 'Master Skilled Professional',
        skillsStr: roleProfile?.skills?.join(', ') || 'Electrical Wiring, High Voltage Switchgear, Solar Setup',
        dailyRate: roleProfile?.dailyRate || '1200',
        hourlyRate: roleProfile?.hourlyRate || '180',
        experienceYears: roleProfile?.experienceYears || '7',
        city: roleProfile?.location?.city || 'Mumbai',
        serviceArea: roleProfile?.serviceArea || 'Mumbai Metropolitan Area',
        workingHours: roleProfile?.workingHours || '08:00 AM - 06:00 PM (Mon-Sat)',
        availabilityStatus: roleProfile?.availabilityStatus || 'available',
        bio: roleProfile?.bio || '',
      });
    }
  }, [roleProfile, user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        avatar: formData.avatar,
        primarySkill: formData.primarySkill,
        skills: formData.skillsStr.split(',').map((s) => s.trim()).filter(Boolean),
        dailyRate: parseInt(formData.dailyRate, 10),
        hourlyRate: parseInt(formData.hourlyRate, 10),
        experienceYears: parseInt(formData.experienceYears, 10),
        location: { city: formData.city, state: 'Maharashtra', pincode: '400001' },
        serviceArea: formData.serviceArea,
        workingHours: formData.workingHours,
        availabilityStatus: formData.availabilityStatus,
        bio: formData.bio,
      };

      const res = await api.put('/labour/profile/me', payload);
      if (res.success) {
        toastSuccess('Profile & Availability Status updated successfully!');
        if (onUpdated) onUpdated();
        onClose();
      }
    } catch (err) {
      toastError(err.message || 'Profile update failed.');
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
          className="fixed inset-0 bg-black/70 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl glass-card rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="border-b border-white/10 pb-4 mb-6">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <HardHat className="w-5 h-5 text-amber-400" /> Edit Worker Profile & Availability
            </h2>
            <p className="text-xs text-slate-400">Update your rates, skills, working area, and availability status</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Animated Availability Status Selector */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                Live Availability Toggle
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, availabilityStatus: 'available' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border flex items-center justify-center gap-1.5 ${
                    formData.availabilityStatus === 'available'
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Available
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, availabilityStatus: 'busy' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border flex items-center justify-center gap-1.5 ${
                    formData.availabilityStatus === 'busy'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/10'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400" /> Busy on Site
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, availabilityStatus: 'offline' })}
                  className={`py-2.5 px-3 rounded-xl text-xs font-extrabold transition-all border flex items-center justify-center gap-1.5 ${
                    formData.availabilityStatus === 'offline'
                      ? 'bg-slate-700 text-slate-200 border-slate-600 shadow-md'
                      : 'bg-white/5 text-slate-400 border-white/10'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-500" /> Offline
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Skill */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Primary Specialization</label>
                <input
                  type="text"
                  value={formData.primarySkill}
                  onChange={(e) => setFormData({ ...formData, primarySkill: e.target.value })}
                  placeholder="e.g. Master Industrial Electrician"
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              {/* Avatar URL */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Profile Photo URL</label>
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                />
              </div>

              {/* Skills Comma Separated */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Certified Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={formData.skillsStr}
                  onChange={(e) => setFormData({ ...formData, skillsStr: e.target.value })}
                  placeholder="Electrical Wiring, Switchgear, Solar Setup, HVAC"
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              {/* Rates */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Daily Rate (₹ / Day)</label>
                <input
                  type="number"
                  value={formData.dailyRate}
                  onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Hourly Rate (₹ / Hr)</label>
                <input
                  type="number"
                  value={formData.hourlyRate}
                  onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input font-mono"
                  required
                />
              </div>

              {/* Location & Hours */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Primary City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Working Hours</label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => setFormData({ ...formData, workingHours: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                />
              </div>

              {/* Bio */}
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-300">Bio & About Experience</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Describe your site experience..."
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all mt-4"
            >
              {loading ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LabourEditProfileModal;
