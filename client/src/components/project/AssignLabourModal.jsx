import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  X,
  UserCheck,
  Search,
  Star,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Users,
} from 'lucide-react';

const AssignLabourModal = ({ project, isOpen, onClose, onAssigned }) => {
  const { toastSuccess, toastError, toastWarning } = useToast();
  const [workers, setWorkers] = useState([]);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (isOpen) {
      const fetchAvailableWorkers = async () => {
        setLoading(true);
        try {
          const res = await api.get('/labour/profiles');
          if (res.success && res.data) {
            setWorkers(res.data);
          }
        } catch (e) {
          console.warn('Fetch workers warning:', e.message);
        } finally {
          setLoading(false);
        }
      };
      fetchAvailableWorkers();
    }
  }, [isOpen]);

  if (!isOpen || !project) return null;

  const toggleSelectWorker = (worker) => {
    const isAvailable = worker.availabilityStatus === 'available';
    if (!isAvailable) {
      toastWarning(`Cannot select ${worker.user?.fullName || worker.fullName}: Worker is currently ${worker.availabilityStatus.toUpperCase()}!`);
      return;
    }

    const workerId = worker.userId || worker.user?.id || worker._id;
    if (selectedWorkerIds.includes(workerId)) {
      setSelectedWorkerIds(selectedWorkerIds.filter((id) => id !== workerId));
    } else {
      setSelectedWorkerIds([...selectedWorkerIds, workerId]);
    }
  };

  const handleAssignSelected = async () => {
    if (selectedWorkerIds.length === 0) {
      toastError('Please select at least one available worker to assign.');
      return;
    }

    setAssigning(true);
    try {
      const selectedWorkerPayload = workers
        .filter((w) => selectedWorkerIds.includes(w.userId || w.user?.id || w._id))
        .map((w) => ({
          workerId: w.userId || w.user?.id || w._id,
          workerName: w.user?.fullName || w.fullName || 'Skilled Worker',
          roleTitle: w.primarySkill || 'Site Technician',
        }));

      const res = await api.post(`/projects/${project._id || project.id}/assign`, {
        workers: selectedWorkerPayload,
      });

      if (res.success) {
        toastSuccess(`Assigned ${selectedWorkerPayload.length} worker(s) to "${project.name}"!`);
        if (onAssigned) onAssigned(res.project);
        onClose();
        setSelectedWorkerIds([]);
      }
    } catch (err) {
      toastError(err.message || 'Failed to assign workers to project.');
    } finally {
      setAssigning(false);
    }
  };

  const filteredWorkers = workers.filter((w) => {
    const term = searchTerm.toLowerCase();
    const name = w.user?.fullName || w.fullName || '';
    const skill = w.primarySkill || w.skills?.[0] || '';
    const city = w.location?.city || '';
    return name.toLowerCase().includes(term) || skill.toLowerCase().includes(term) || city.toLowerCase().includes(term);
  });

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

          <div className="border-b border-white/10 pb-4 mb-4">
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-cyan-400" /> Assign Labour Crew to Project
            </h2>
            <p className="text-xs text-slate-400 truncate">
              Project: <span className="text-cyan-300 font-bold">{project.name}</span> ({project.workerCount} Workers Required)
            </p>
          </div>

          {/* Search Input */}
          <div className="relative mb-4">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search available workers by name, skill, or location..."
              className="w-full pl-11 pr-4 py-2.5 text-xs rounded-xl glass-input"
            />
          </div>

          {/* Workers Selection List */}
          <div className="space-y-2.5 max-h-[340px] overflow-y-auto custom-scrollbar pr-1 mb-6">
            {loading ? (
              <p className="text-xs text-slate-400 text-center py-6">Loading active skilled workers...</p>
            ) : filteredWorkers.length > 0 ? (
              filteredWorkers.map((w) => {
                const wId = w.userId || w.user?.id || w._id;
                const isSelected = selectedWorkerIds.includes(wId);
                const isAvailable = w.availabilityStatus === 'available';
                const isBusy = w.availabilityStatus === 'busy';
                const fullName = w.user?.fullName || w.fullName || 'Skilled Worker';
                const avatar = w.user?.avatar || w.avatar || '';

                return (
                  <div
                    key={wId}
                    onClick={() => toggleSelectWorker(w)}
                    className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500/50 shadow-md shadow-cyan-500/10'
                        : isAvailable
                        ? 'bg-white/5 border-white/5 hover:border-white/20'
                        : 'bg-slate-900/50 border-slate-800 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        disabled={!isAvailable}
                        onChange={() => {}}
                        className="w-4 h-4 rounded bg-slate-900 border-white/20 text-cyan-500 focus:ring-cyan-500"
                      />

                      <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-sm overflow-hidden shrink-0">
                        {avatar ? <img src={avatar} alt={fullName} className="w-full h-full object-cover" /> : fullName[0]}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white">{fullName}</h4>
                          {w.user?.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <p className="text-[11px] text-cyan-400 font-semibold">{w.primarySkill || w.skills?.[0]}</p>
                        <p className="text-[10px] text-slate-400 flex items-center gap-2 mt-0.5">
                          <span><MapPin className="w-2.5 h-2.5 inline" /> {w.location?.city || 'Mumbai'}</span>
                          <span>•</span>
                          <span>{w.experienceYears} Yrs Exp</span>
                          <span>•</span>
                          <span className="text-amber-400 font-bold">★ {w.rating}</span>
                        </p>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="text-right shrink-0">
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Available
                        </span>
                      ) : isBusy ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30" title="Cannot assign: Worker is on site">
                          <AlertTriangle className="w-3 h-3 text-amber-400" /> Busy on Site
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-500">
                          Offline
                        </span>
                      )}
                      <span className="text-xs font-bold text-cyan-400 font-mono block mt-1">₹{w.dailyRate}/day</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-slate-400 text-center py-6">No matching available workers found.</p>
            )}
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between pt-3 border-t border-white/10">
            <span className="text-xs text-cyan-400 font-bold font-mono">
              {selectedWorkerIds.length} Worker(s) Selected
            </span>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={assigning || selectedWorkerIds.length === 0}
                onClick={handleAssignSelected}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-1.5"
              >
                {assigning ? (
                  'Assigning Crew...'
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" /> Assign Selected
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AssignLabourModal;
