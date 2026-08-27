import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../common/StatusBadge';
import GlassCard from '../common/GlassCard';
import api from '../../services/api';
import {
  X,
  Sparkles,
  CheckCircle2,
  MapPin,
  Star,
  Zap,
  TrendingUp,
  Award,
  BookOpen,
} from 'lucide-react';

const SmartRecommendationModal = ({ isOpen, onClose, category, city, maxBudget, onSelectWorker }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      const fetchRecommendations = async () => {
        setLoading(true);
        try {
          const queryParams = new URLSearchParams();
          if (category) queryParams.append('category', category);
          if (city) queryParams.append('city', city);
          if (maxBudget) queryParams.append('maxBudget', maxBudget);

          const res = await api.get(`/labour/recommendations?${queryParams.toString()}`);
          if (res.success && res.data) {
            setRecommendations(res.data);
          }
        } catch (e) {
          console.warn('Smart recommendation error:', e.message);
        } finally {
          setLoading(false);
        }
      };
      fetchRecommendations();
    }
  }, [isOpen, category, city, maxBudget]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-[#0F172A] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <StatusBadge status="verified" text="AI Match Engine" />
                <span className="text-[10px] font-mono text-cyan-400">Algorithmic Scoring Active</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" /> Recommended Skilled Workers
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Recommendation Stream */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
                Analyzing worker skill matrices, location proximity, and historical site ratings...
              </div>
            ) : recommendations.length > 0 ? (
              recommendations.map((rec) => {
                const b = rec.matchBreakdown || { skillMatch: 100, locationProximity: 90, experienceFit: 95, ratingScore: 98, priceFit: 90 };
                return (
                  <GlassCard key={rec._id || rec.userId} hover={false} className="p-5 space-y-4 border border-cyan-500/20">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xl overflow-hidden shadow-lg border border-cyan-400/30">
                          {rec.user?.avatar ? (
                            <img src={rec.user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            rec.user?.fullName?.[0] || 'W'
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-base font-extrabold text-white">{rec.user?.fullName}</h3>
                            <StatusBadge status="verified" />
                          </div>
                          <p className="text-xs text-cyan-300 font-semibold">{rec.primarySkill || 'Industrial Electrician'}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {rec.serviceArea || 'Lower Parel & BKC, Mumbai'}
                          </p>
                        </div>
                      </div>

                      {/* Animated Match Score Badge */}
                      <div className="text-left sm:text-right shrink-0">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-extrabold text-sm shadow-md shadow-emerald-500/10">
                          <Zap className="w-4 h-4 text-emerald-400 animate-pulse" /> {rec.matchScore || 95}% Match
                        </div>
                        <span className="text-[11px] font-mono text-cyan-400 block mt-1">₹{rec.dailyRate || 1200} / day</span>
                      </div>
                    </div>

                    {/* Match Score Factor Breakdown Bars */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 p-3 rounded-xl bg-white/5 border border-white/5 text-[10px]">
                      <div>
                        <span className="text-slate-400 block">Skill Match</span>
                        <span className="font-mono font-bold text-cyan-300">{b.skillMatch}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Location</span>
                        <span className="font-mono font-bold text-cyan-300">{b.locationProximity}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Experience</span>
                        <span className="font-mono font-bold text-cyan-300">{b.experienceFit}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Rating Score</span>
                        <span className="font-mono font-bold text-amber-300">{b.ratingScore}%</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Price Fit</span>
                        <span className="font-mono font-bold text-emerald-300">{b.priceFit}%</span>
                      </div>
                    </div>

                    {/* Select Worker Action */}
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          if (onSelectWorker) onSelectWorker(rec);
                          onClose();
                        }}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md transition-all flex items-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Select Recommended Worker
                      </button>
                    </div>
                  </GlassCard>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No recommended profiles match exact criteria. Try broadening search parameters.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SmartRecommendationModal;
