import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { X, Activity, Camera, Percent, CheckCircle2 } from 'lucide-react';

const AddWorkUpdateModal = ({ project, isOpen, onClose, onUpdateAdded }) => {
  const { toastSuccess, toastError } = useToast();
  const [loading, setLoading] = useState(false);

  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [progressPercentage, setProgressPercentage] = useState(project?.progressPercentage || 50);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post(`/projects/${project._id || project.id}/updates`, {
        description,
        photoUrl,
        progressPercentage: parseInt(progressPercentage, 10),
      });

      if (res.success) {
        toastSuccess('Work progress update logged to project timeline!');
        if (onUpdateAdded) onUpdateAdded(res.update);
        onClose();
        setDescription('');
        setPhotoUrl('');
      }
    } catch (err) {
      toastError(err.message || 'Failed to submit work update.');
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
          className="relative w-full max-w-lg glass-card rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[90vh] overflow-y-auto custom-scrollbar"
        >
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="border-b border-white/10 pb-4 mb-6">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-cyan-400" /> Log Site Work Progress Update
            </h2>
            <p className="text-xs text-slate-400 truncate">Project: {project.name}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Progress Update Description</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe completed tasks, materials installed, or milestone achievements..."
                className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Work Proof Photo URL (Optional)</label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-3 text-xs rounded-xl glass-input"
              />
            </div>

            {/* Slider & Input for Progress Percentage */}
            <div className="space-y-2 p-4 rounded-2xl bg-white/5 border border-white/5">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-slate-300">Project Completion Percentage</span>
                <span className="text-cyan-400 font-mono text-base font-extrabold">{progressPercentage}%</span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={progressPercentage}
                onChange={(e) => setProgressPercentage(e.target.value)}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all mt-4 flex items-center justify-center gap-2"
            >
              {loading ? 'Logging Progress Update...' : (
                <>
                  <CheckCircle2 className="w-4 h-4" /> Publish Progress Update
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AddWorkUpdateModal;
