import React from 'react';
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import {
  Star,
  MapPin,
  Briefcase,
  ShieldCheck,
  Calendar,
  Zap,
  ArrowRight,
  Clock,
} from 'lucide-react';

const LabourCard = ({ profile, onViewProfile, onBookNow }) => {
  const {
    userId,
    user,
    primarySkill,
    skills = [],
    experienceYears = 1,
    dailyRate = 800,
    hourlyRate = 120,
    location = { city: 'Mumbai' },
    availabilityStatus = 'available',
    rating = 4.8,
    completedJobs = 0,
    bio = '',
  } = profile;

  const fullName = user?.fullName || profile.fullName || 'Skilled Worker';
  const avatar = user?.avatar || profile.avatar || '';
  const isVerified = user?.isVerified ?? profile.isVerified ?? true;
  const isAvailable = availabilityStatus === 'available';
  const isBusy = availabilityStatus === 'busy';

  return (
    <GlassCard className="flex flex-col justify-between space-y-4 relative overflow-hidden group">
      {/* Top Header Row */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-white text-xl overflow-hidden border border-white/10 shrink-0 shadow-lg group-hover:scale-105 transition-transform">
              {avatar ? (
                <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                fullName[0] || 'W'
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors">
                  {fullName}
                </h3>
                {isVerified && (
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" title="Verified Worker" />
                )}
              </div>
              <p className="text-xs font-semibold text-cyan-400 mt-0.5">
                {primarySkill || skills[0] || 'General Skilled Worker'}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-slate-400" /> {location.city || 'Mumbai'}
                </span>
                <span>•</span>
                <span>{experienceYears} Yrs Exp</span>
              </div>
            </div>
          </div>

          {/* Availability Badge */}
          <div>
            {isAvailable && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Available
              </span>
            )}
            {isBusy && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Busy on Site
              </span>
            )}
            {!isAvailable && !isBusy && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                Offline
              </span>
            )}
          </div>
        </div>

        {/* Rating & Stats Strip */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-xs my-3">
          <div className="flex items-center gap-1.5">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="font-extrabold text-white">{rating}</span>
            <span className="text-[10px] text-slate-400">({completedJobs} Jobs)</span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 block leading-none">Daily Rate</span>
            <span className="text-sm font-extrabold text-cyan-400 font-mono">₹{dailyRate.toLocaleString()}</span>
          </div>
        </div>

        {/* Skills Chips */}
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 3).map((sk, idx) => (
            <span
              key={idx}
              className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
            >
              {sk}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 text-slate-400">
              +{skills.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
        <button
          onClick={() => onViewProfile(profile)}
          className="py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-all text-center"
        >
          View Profile
        </button>
        <button
          onClick={() => onBookNow(profile)}
          disabled={!isAvailable}
          className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
            isAvailable
              ? 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/20'
              : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
          }`}
        >
          {isAvailable ? (
            <>
              Book Now <ArrowRight className="w-3.5 h-3.5" />
            </>
          ) : (
            'Busy / Unavailable'
          )}
        </button>
      </div>
    </GlassCard>
  );
};

export default LabourCard;
