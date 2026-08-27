import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import GlassCard from '../common/GlassCard';
import api from '../../services/api';
import {
  X,
  Camera,
  Upload,
  Image as ImageIcon,
  FileText,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';

const WorkProofGalleryModal = ({ isOpen, onClose, project, onProofUploaded }) => {
  const { toastSuccess, toastError } = useToast();
  const [activeStage, setActiveStage] = useState('all'); // 'all' | 'before' | 'during' | 'after' | 'document'
  const [showUploadForm, setShowUploadForm] = useState(false);

  const [proofTitle, setProofTitle] = useState('');
  const [proofStage, setProofStage] = useState('during');
  const [photoUrl, setPhotoUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const sampleProofs = [
    {
      id: 'PF-101',
      title: 'Initial Bare Substation Floor & Cable Trenching',
      stage: 'before',
      photoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&q=80&w=800',
      date: '2026-08-20',
      uploader: 'Rajesh Kumar (Lead Electrician)',
      notes: 'Initial site inspection before mounting high-voltage busbars.',
    },
    {
      id: 'PF-102',
      title: 'Main Circuit Breaker & Grounding Assembly',
      stage: 'during',
      photoUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=800',
      date: '2026-08-24',
      uploader: 'Rajesh Kumar (Lead Electrician)',
      notes: 'High-voltage switchgear mounted on Floor 4.',
    },
    {
      id: 'PF-103',
      title: 'Final Energized Panel Quality Audit & Certification',
      stage: 'after',
      photoUrl: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&q=80&w=800',
      date: '2026-08-26',
      uploader: 'System Auditor',
      notes: 'Zero defect quality inspection passed successfully.',
    },
  ];

  const [proofList, setProofList] = useState(sampleProofs);

  if (!isOpen) return null;

  const handleUploadSubmit = (e) => {
    e.preventDefault();
    if (!photoUrl) {
      toastError('Please provide a photo or document URL.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const newProof = {
        id: 'PF-' + Math.floor(100 + Math.random() * 900),
        title: proofTitle || 'Site Progress Photo',
        stage: proofStage,
        photoUrl,
        date: new Date().toISOString().split('T')[0],
        uploader: 'Current User',
        notes: notes || 'Uploaded to project site proof vault.',
      };
      setProofList([newProof, ...proofList]);
      toastSuccess('Work proof photo uploaded successfully to site gallery!');
      if (onProofUploaded) onProofUploaded(newProof);
      setShowUploadForm(false);
      setLoading(false);
    }, 800);
  };

  const filteredProofs = activeStage === 'all'
    ? proofList
    : proofList.filter((p) => p.stage === activeStage);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-3xl bg-[#0F172A] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                Verified Quality Audit Vault
              </span>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-400" /> Work Proof Photo & Document Gallery
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action & Filter Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: 'all', label: 'All Photos' },
                { id: 'before', label: 'Before' },
                { id: 'during', label: 'In-Progress' },
                { id: 'after', label: 'Completed' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setActiveStage(btn.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeStage === btn.id
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => setShowUploadForm(!showUploadForm)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20"
            >
              <Upload className="w-3.5 h-3.5" /> Upload Work Proof
            </button>
          </div>

          {/* Upload Form Modal Body */}
          {showUploadForm && (
            <form onSubmit={handleUploadSubmit} className="p-4 rounded-2xl bg-white/5 border border-cyan-500/30 space-y-4">
              <h3 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Upload New Site Proof Photo</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Proof Title</label>
                  <input
                    type="text"
                    required
                    value={proofTitle}
                    onChange={(e) => setProofTitle(e.target.value)}
                    placeholder="e.g. Busbar splicing inspection"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Stage Category</label>
                  <select
                    value={proofStage}
                    onChange={(e) => setProofStage(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="before">Before Work</option>
                    <option value="during">In Progress</option>
                    <option value="after">Completed / Final</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-slate-400 block">Photo URL</label>
                <input
                  type="url"
                  required
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-cyan-500 font-mono text-[11px]"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowUploadForm(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                >
                  {loading ? 'Uploading...' : 'Publish Proof'}
                </button>
              </div>
            </form>
          )}

          {/* Gallery Lightbox Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[450px] overflow-y-auto custom-scrollbar pr-1">
            {filteredProofs.map((pf) => (
              <GlassCard key={pf.id} hover={false} className="p-3 space-y-2 border border-white/10">
                <div className="h-40 rounded-xl overflow-hidden bg-slate-900 relative">
                  <img src={pf.photoUrl} alt={pf.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-slate-950/80 text-cyan-300 border border-cyan-500/30">
                    {pf.stage}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white truncate">{pf.title}</h4>
                <p className="text-[11px] text-slate-400">{pf.notes}</p>
                <span className="text-[10px] text-slate-500 font-mono block">{pf.date} • {pf.uploader}</span>
              </GlassCard>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default WorkProofGalleryModal;
