import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../common/GlassCard';
import api from '../../services/api';
import { X, Star, CheckCircle2, MessageSquare, ThumbsUp, Sparkles } from 'lucide-react';

const ReviewModal = ({ isOpen, onClose, project, booking, labour, onReviewSubmitted }) => {
  const { toastSuccess, toastError } = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);

  const [qualityRating, setQualityRating] = useState(5);
  const [behaviourRating, setBehaviourRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [skillRating, setSkillRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const targetLabourId = labour?._id || labour?.id || project?.assignedWorkers?.[0]?.workerId || booking?.labour || '65f0a0000000000000000002';
  const targetLabourName = labour?.fullName || project?.assignedWorkers?.[0]?.workerName || booking?.labourName || 'Rajesh Kumar (Master Electrician)';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toastError('Please provide written feedback describing work performance.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/reviews', {
        projectId: project?._id || project?.id,
        bookingId: booking?._id || booking?.id,
        labourId: targetLabourId,
        labourName: targetLabourName,
        rating,
        qualityRating,
        behaviourRating,
        punctualityRating,
        skillRating,
        comment,
      });

      if (res.success) {
        toastSuccess('Review and rating submitted successfully for ' + targetLabourName + '!');
        if (onReviewSubmitted) onReviewSubmitted(res.data);
        onClose();
      }
    } catch (err) {
      toastError(err.message || 'Review submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-lg bg-[#0F172A] border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-500/10 space-y-6 relative my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                Post-Work Quality Rating
              </span>
              <h2 className="text-xl font-extrabold text-white">Rate Certified Worker</h2>
              <p className="text-xs text-slate-400">Review worker for: {targetLabourName}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Animated Star Rating Selector */}
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-center space-y-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Overall Rating</span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 focus:outline-none transition-transform hover:scale-125"
                  >
                    <Star
                      className={`w-9 h-9 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]'
                          : 'text-slate-600 fill-slate-700'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-xs font-extrabold text-amber-400">
                {rating === 5 && '🌟 Exceptional Quality Work'}
                {rating === 4 && '👍 Great & Reliable Performance'}
                {rating === 3 && '👌 Satisfactory Completion'}
                {rating === 2 && '⚠️ Needs Improvement'}
                {rating === 1 && '❌ Unacceptable Quality'}
              </p>
            </div>

            {/* Sub-Ratings Matrix */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Work Quality', state: qualityRating, setState: setQualityRating },
                { label: 'Site Behavior', state: behaviourRating, setState: setBehaviourRating },
                { label: 'Punctuality', state: punctualityRating, setState: setPunctualityRating },
                { label: 'Technical Skill', state: skillRating, setState: setSkillRating },
              ].map((sub, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-400">{sub.label}</span>
                    <span className="text-amber-400 font-mono font-bold">{sub.state} / 5</span>
                  </div>
                  <div className="flex gap-1 justify-center">
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => sub.setState(num)}
                        className={`w-5 h-5 rounded-md text-[10px] font-bold transition-all ${
                          sub.state >= num ? 'bg-amber-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Written Feedback Textarea */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">Written Feedback Review</label>
              <textarea
                required
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share details regarding craftsmanship, safety compliance, work speed, and site cleanup..."
                className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-all custom-scrollbar"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-white/10 hover:bg-white/20 transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 shadow-lg shadow-amber-500/25 flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? 'Submitting Review...' : 'Publish Rating & Review'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;
