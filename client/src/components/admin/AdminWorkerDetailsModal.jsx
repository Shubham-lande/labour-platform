import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import StatusBadge from '../common/StatusBadge';
import GlassCard from '../common/GlassCard';
import ConfirmationModal from '../common/ConfirmationModal';
import api from '../../services/api';
import {
  X,
  UserCheck,
  ShieldAlert,
  Ban,
  Trash2,
  Briefcase,
  Star,
  CreditCard,
  History,
  FileCheck,
  MapPin,
  Building2,
  HardHat,
} from 'lucide-react';

const AdminWorkerDetailsModal = ({ isOpen, onClose, worker, onUpdated }) => {
  const { toastSuccess, toastError } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(null); // 'suspend' | 'block' | 'delete' | 'verify'

  if (!isOpen || !worker) return null;

  const handleExecuteStatusAction = async () => {
    try {
      let targetStatus = worker.status || 'active';
      let isVerified = worker.isVerified;

      if (actionType === 'suspend') targetStatus = 'suspended';
      if (actionType === 'block') targetStatus = 'blocked';
      if (actionType === 'delete') targetStatus = 'deleted';
      if (actionType === 'verify') isVerified = true;

      const res = await api.put(`/admin/labour/${worker._id || worker.id}/status`, {
        status: targetStatus,
        isVerified,
      });

      if (res.success) {
        toastSuccess(`Worker action ${actionType?.toUpperCase()} executed successfully!`);
        if (onUpdated) onUpdated();
        setShowConfirmModal(false);
        onClose();
      }
    } catch (err) {
      toastError(err.message || 'Action failed.');
    }
  };

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
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xl overflow-hidden border border-amber-400/30">
                {worker.avatar ? (
                  <img src={worker.avatar} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  worker.fullName?.[0] || 'W'
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-extrabold text-white">{worker.fullName}</h2>
                  <StatusBadge status={worker.isVerified ? 'verified' : 'pending'} />
                </div>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  ID: #{worker._id || '65f0a02'} • Role: Skilled Labour • Email: {worker.email}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Action Control Buttons Bar */}
          <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 flex-wrap">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Admin Controls:</span>
            <div className="flex items-center gap-2 flex-wrap">
              {!worker.isVerified && (
                <button
                  onClick={() => {
                    setActionType('verify');
                    setShowConfirmModal(true);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all flex items-center gap-1"
                >
                  <UserCheck className="w-3.5 h-3.5" /> Approve & Verify
                </button>
              )}
              <button
                onClick={() => {
                  setActionType('suspend');
                  setShowConfirmModal(true);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 transition-all flex items-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Suspend
              </button>
              <button
                onClick={() => {
                  setActionType('block');
                  setShowConfirmModal(true);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 transition-all flex items-center gap-1"
              >
                <Ban className="w-3.5 h-3.5" /> Block
              </button>
              <button
                onClick={() => {
                  setActionType('delete');
                  setShowConfirmModal(true);
                }}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-red-400 bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 transition-all flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete User
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex gap-2 border-b border-white/10 pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: HardHat },
              { id: 'jobs', label: 'Assigned Jobs (3)', icon: Briefcase },
              { id: 'reviews', label: 'Reviews (5)', icon: Star },
              { id: 'payments', label: 'Earnings', icon: CreditCard },
              { id: 'activity', label: 'Audit Trail', icon: History },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" /> {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="space-y-4">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <GlassCard hover={false} className="p-4 space-y-2 border border-white/10">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Profile Specs</span>
                  <p className="text-white">Primary Trade: <span className="text-cyan-300 font-semibold">Industrial Electrician</span></p>
                  <p className="text-white">Experience: <span className="font-mono text-cyan-400">7+ Years</span></p>
                  <p className="text-white">Daily Rate: <span className="font-mono text-cyan-400">₹1,200 / day</span></p>
                  <p className="text-white">City: <span className="text-slate-300">Mumbai, Maharashtra</span></p>
                </GlassCard>

                <GlassCard hover={false} className="p-4 space-y-2 border border-white/10">
                  <span className="font-bold text-slate-400 uppercase tracking-wider block">Performance Metrics</span>
                  <p className="text-white">Rating: <span className="font-bold text-amber-400">★ 4.9 / 5.0</span></p>
                  <p className="text-white">Completed Jobs: <span className="font-mono text-cyan-400">142 Projects</span></p>
                  <p className="text-white">Total Gross Earnings: <span className="font-mono text-emerald-400">₹184,000</span></p>
                  <p className="text-white">Account Status: <span className="font-bold text-emerald-400 uppercase">{worker.status || 'ACTIVE'}</span></p>
                </GlassCard>
              </div>
            )}

            {activeTab === 'jobs' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">Smart Building Automation</h4>
                    <p className="text-slate-400">Site 4B Tech Park • Role: Lead Electrician</p>
                  </div>
                  <StatusBadge status="in_progress" />
                </div>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white">Substation Transformer Setup</h4>
                    <p className="text-slate-400">Adani Electricity • Duration: 12 Days</p>
                  </div>
                  <StatusBadge status="completed" />
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <div className="flex justify-between font-bold text-white">
                    <span>Apex Buildcon Infrastructure Ltd</span>
                    <span className="text-amber-400">★ 5.0</span>
                  </div>
                  <p className="text-slate-300">Punctual, highly skilled electrical splicing work on Tower A. Zero defects logged on audit.</p>
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Total Lifetime Payouts</span>
                  <span className="font-mono text-emerald-400 font-extrabold text-sm">₹184,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Escrow Pending</span>
                  <span className="font-mono text-cyan-400 font-bold">₹24,500</span>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-2 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
                  <span className="text-cyan-300">[2026-08-26 08:30] Shift Check-In Logged</span>
                  <span className="text-slate-400">Site 4B</span>
                </div>
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex justify-between">
                  <span className="text-emerald-300">[2026-08-25 15:10] Escrow Payment Received</span>
                  <span className="text-slate-400">₹185,000</span>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleExecuteStatusAction}
        title={`Confirm ${actionType?.toUpperCase()} Worker Action`}
        message={`Are you sure you want to execute '${actionType}' on worker ${worker.fullName}? This action will update system access privileges.`}
        confirmText={`Execute ${actionType}`}
        danger={actionType === 'delete' || actionType === 'block'}
      />
    </AnimatePresence>
  );
};

export default AdminWorkerDetailsModal;
