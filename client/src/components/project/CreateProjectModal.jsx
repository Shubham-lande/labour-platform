import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  X,
  PlusCircle,
  FolderKanban,
  Calendar,
  DollarSign,
  MapPin,
  Users,
  AlertCircle,
  CheckCircle2,
  HardHat,
} from 'lucide-react';

const CATEGORIES = [
  'Certified Electricians',
  'Master Plumbers & Pipefitters',
  'Civil & Masonry Specialists',
  'HVAC & Ducting Techs',
  'Master Carpenters',
];

const CreateProjectModal = ({ isOpen, onClose, onProjectCreated }) => {
  const { toastSuccess, toastError } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: 'Certified Electricians',
    description: '',
    address: 'Plot 4B, Commercial Tech Park',
    city: 'Mumbai',
    pincode: '400013',
    requiredSkillsStr: 'Electrical Wiring, Switchgear, Sub-station Assembly',
    workerCount: '3',
    startDate: new Date().toISOString().split('T')[0],
    deadline: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    budget: '185000',
    priority: 'high',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        location: {
          address: formData.address,
          city: formData.city,
          state: 'Maharashtra',
          pincode: formData.pincode,
        },
        requiredSkills: formData.requiredSkillsStr.split(',').map((s) => s.trim()).filter(Boolean),
        workerCount: parseInt(formData.workerCount, 10),
        startDate: formData.startDate,
        deadline: formData.deadline,
        budget: parseInt(formData.budget, 10),
        priority: formData.priority,
      };

      const res = await api.post('/projects', payload);
      if (res.success) {
        toastSuccess(`Work Project "${formData.name}" created successfully!`);
        if (onProjectCreated) onProjectCreated(res.project);
        onClose();
      }
    } catch (err) {
      toastError(err.message || 'Failed to create project.');
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
              <FolderKanban className="w-5 h-5 text-cyan-400" /> Create New Work Project
            </h2>
            <p className="text-xs text-slate-400">Configure site specifications, budget, required crew size & timeline</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Project / Site Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Smart Building Substation Wiring & Automation"
                className="w-full px-4 py-3 text-xs rounded-xl glass-input"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Work Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input bg-[#0F172A]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Project Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input bg-[#0F172A]"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                  <option value="urgent">Urgent Priority</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Project Scope & Technical Specs</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detail the work requirements, site safety constraints, materials provided..."
                className="w-full px-4 py-3 text-xs rounded-xl glass-input"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5 sm:col-span-2">
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

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Required Skills (Comma Separated)</label>
              <input
                type="text"
                value={formData.requiredSkillsStr}
                onChange={(e) => setFormData({ ...formData, requiredSkillsStr: e.target.value })}
                placeholder="Electrical Wiring, Switchgear Assembly, Substation"
                className="w-full px-4 py-3 text-xs rounded-xl glass-input"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Workers Needed</label>
                <input
                  type="number"
                  min={1}
                  value={formData.workerCount}
                  onChange={(e) => setFormData({ ...formData, workerCount: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input font-mono"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Total Budget (₹)</label>
                <input
                  type="number"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full px-4 py-3 text-xs rounded-xl glass-input font-mono font-bold text-cyan-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Start Date</label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-3 text-xs rounded-xl glass-input text-white"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Deadline</label>
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-3 py-3 text-xs rounded-xl glass-input text-white"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all mt-4"
            >
              {loading ? 'Creating Project Specs...' : 'Create & Publish Project'}
            </button>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateProjectModal;
