import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';

import ProjectStepper from './ProjectStepper';
import AssignLabourModal from './AssignLabourModal';
import AddWorkUpdateModal from './AddWorkUpdateModal';
import ConfirmationModal from '../common/ConfirmationModal';
import AttendanceControl from '../attendance/AttendanceControl';
import AttendanceHistoryTable from '../attendance/AttendanceHistoryTable';

import {
  X,
  FolderKanban,
  Users,
  Activity,
  Clock,
  History,
  MapPin,
  Calendar,
  CheckCircle2,
  Play,
  Pause,
  ThumbsUp,
  AlertTriangle,
  Plus,
  ShieldCheck,
  Building2,
  Lock,
} from 'lucide-react';

const ProjectDetailsModal = ({ project, isOpen, onClose, onProjectUpdated, userRole = 'customer' }) => {
  const { toastSuccess, toastError, toastInfo } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [projectData, setProjectData] = useState(project);
  const [loading, setLoading] = useState(false);

  // Modal Sub-states
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState({ title: '', message: '', type: 'warning', action: null });

  useEffect(() => {
    if (isOpen && project) {
      setProjectData(project);
      const fetchDetails = async () => {
        try {
          const res = await api.get(`/projects/${project._id || project.id}`);
          if (res.success && res.data) {
            setProjectData(res.data);
          }
        } catch (e) {
          console.warn('Fetch project details error:', e.message);
        }
      };
      fetchDetails();
    }
  }, [isOpen, project]);

  if (!isOpen || !projectData) return null;

  const prjId = projectData._id || projectData.id;
  const isCustomer = userRole === 'customer' || userRole === 'admin';
  const isLabour = userRole === 'labour';

  // Handle Advancing Project Stepper Workflow
  const handleAdvanceStatus = async (newStatus) => {
    try {
      const res = await api.put(`/projects/${prjId}/status`, {
        status: newStatus,
        actionDetails: `Status advanced to ${newStatus.toUpperCase()}`,
      });
      if (res.success) {
        toastSuccess(`Project workflow status updated to ${newStatus.toUpperCase()}!`);
        setProjectData(res.project);
        if (onProjectUpdated) onProjectUpdated(res.project);
      }
    } catch (err) {
      toastError(err.message || 'Failed to update project status.');
    }
  };

  // Trigger Confirmation Modal for Major/Destructive Actions
  const triggerConfirmation = (actionType) => {
    if (actionType === 'start') {
      handleAdvanceStatus('in_progress');
      toastInfo('Work started! Customer dashboard updated.');
    } else if (actionType === 'pause') {
      handleAdvanceStatus('paused');
      toastInfo('Work paused.');
    } else if (actionType === 'resume') {
      handleAdvanceStatus('in_progress');
      toastInfo('Work resumed!');
    } else if (actionType === 'complete') {
      setConfirmConfig({
        title: 'Mark Work as Completed?',
        message: 'This will declare all site milestones completed at 100% progress and notify the customer for final sign-off approval.',
        type: 'warning',
        action: async () => {
          await handleAdvanceStatus('completed');
          setShowConfirmModal(false);
        },
      });
      setShowConfirmModal(true);
    } else if (actionType === 'approve') {
      setConfirmConfig({
        title: 'Approve Completed Work & Release Escrow?',
        message: 'Confirming satisfactory completion moves this work order toward final escrow payment release and customer review.',
        type: 'success',
        action: async () => {
          await handleAdvanceStatus('customer_approved');
          setShowConfirmModal(false);
        },
      });
      setShowConfirmModal(true);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/75 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-4xl glass-card rounded-3xl border border-white/10 p-6 sm:p-8 shadow-2xl z-10 my-8 max-h-[92vh] overflow-y-auto custom-scrollbar"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] px-2.5 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono font-bold">
                  {prjId}
                </span>
                <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">
                  {projectData.category}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">{projectData.name}</h2>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                <span><MapPin className="w-3.5 h-3.5 text-cyan-400 inline" /> {projectData.location?.address || 'Site Address'}, {projectData.location?.city || 'Mumbai'}</span>
                <span>•</span>
                <span className="font-mono text-cyan-300 font-bold">₹{parseInt(projectData.budget || 0, 10).toLocaleString()} Budget</span>
              </p>
            </div>

            {/* Quick Work Actions Bar */}
            <div className="flex flex-wrap items-center gap-2 shrink-0">
              {projectData.status === 'scheduled' && (
                <button
                  type="button"
                  onClick={() => triggerConfirmation('start')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Start Work
                </button>
              )}

              {projectData.status === 'in_progress' && (
                <>
                  <button
                    type="button"
                    onClick={() => triggerConfirmation('pause')}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 flex items-center gap-1 transition-colors"
                  >
                    <Pause className="w-3.5 h-3.5" /> Pause Work
                  </button>
                  <button
                    type="button"
                    onClick={() => triggerConfirmation('complete')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Complete Work
                  </button>
                </>
              )}

              {projectData.status === 'paused' && (
                <button
                  type="button"
                  onClick={() => triggerConfirmation('resume')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Resume Work
                </button>
              )}

              {projectData.status === 'completed' && isCustomer && (
                <button
                  type="button"
                  onClick={() => triggerConfirmation('approve')}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all"
                >
                  <ThumbsUp className="w-4 h-4" /> Approve Completed Work
                </button>
              )}
            </div>
          </div>

          {/* Stepper Workflow Header Bar */}
          <div className="mb-6">
            <ProjectStepper
              currentStatus={projectData.status}
              onAdvanceStatus={handleAdvanceStatus}
              canUpdate={isCustomer}
            />
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-white/10 mb-6 gap-2 overflow-x-auto custom-scrollbar">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap ${
                activeTab === 'overview'
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              Overview & Specs
            </button>
            <button
              onClick={() => setActiveTab('labour')}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'labour'
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" /> Assigned Labour ({projectData.assignedWorkers?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'updates'
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Progress Updates ({projectData.updates?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'attendance'
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" /> Attendance & Hours
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'activity'
                  ? 'text-cyan-400 border-cyan-400'
                  : 'text-slate-400 border-transparent hover:text-white'
              }`}
            >
              <History className="w-3.5 h-3.5" /> Activity History
            </button>
          </div>

          {/* TAB 1: Overview & Specs */}
          {activeTab === 'overview' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              {/* Progress Card */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-300">Milestone Progress Completion</span>
                  <span className="text-cyan-400 font-mono text-sm">{projectData.progressPercentage || 0}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
                    style={{ width: `${projectData.progressPercentage || 0}%` }}
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Project Scope & Technical Description</h4>
                <p className="text-xs text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/5 leading-relaxed">
                  {projectData.description || 'Full-scope construction site assignment.'}
                </p>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">Required Crew</span>
                  <span className="text-sm font-bold text-white">{projectData.workerCount} Workers</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">Total Budget</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">₹{parseInt(projectData.budget || 0, 10).toLocaleString()}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">Start Date</span>
                  <span className="text-xs font-bold text-white">{projectData.startDate ? new Date(projectData.startDate).toLocaleDateString() : 'Immediate'}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-white/5 border border-white/5">
                  <span className="text-[11px] text-slate-400 block">Deadline</span>
                  <span className="text-xs font-bold text-amber-400">{projectData.deadline ? new Date(projectData.deadline).toLocaleDateString() : 'Flexible'}</span>
                </div>
              </div>

              {/* Required Skills Chips */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Required Technical Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {(projectData.requiredSkills || ['Electrical Wiring', 'Sub-station Assembly']).map((sk, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: Assigned Labour Crew */}
          {activeTab === 'labour' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Assigned Workforce Roster</h4>
                {isCustomer && (
                  <button
                    onClick={() => setShowAssignModal(true)}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
                  >
                    <Plus className="w-4 h-4" /> Assign More Workers
                  </button>
                )}
              </div>

              {projectData.assignedWorkers && projectData.assignedWorkers.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {projectData.assignedWorkers.map((w, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-base overflow-hidden shrink-0">
                          {w.workerName?.[0] || 'W'}
                        </div>
                        <div>
                          <h5 className="text-xs font-bold text-white">{w.workerName || 'Assigned Worker'}</h5>
                          <p className="text-[11px] text-cyan-400 font-semibold">{w.roleTitle || 'Site Technician'}</p>
                          <span className="text-[10px] text-slate-400 block font-mono">Assigned: {new Date(w.assignedAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 capitalize">
                        {w.assignmentStatus || 'assigned'}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <Users className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">No Workers Assigned to this Project Yet</p>
                  {isCustomer && (
                    <button
                      onClick={() => setShowAssignModal(true)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-400 transition-colors inline-block mt-2"
                    >
                      Assign Available Workers
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 3: Progress Updates & Timeline Feed */}
          {activeTab === 'updates' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Site Progress Timeline Feed</h4>
                <button
                  onClick={() => setShowUpdateModal(true)}
                  className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 flex items-center gap-1.5 transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Work Update
                </button>
              </div>

              {projectData.updates && projectData.updates.length > 0 ? (
                <div className="space-y-3">
                  {projectData.updates.map((upd, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{upd.workerName || 'Skilled Labour'}</span>
                        <span className="text-cyan-400 font-mono font-bold">{upd.progressPercentage}% Milestone</span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">{upd.description}</p>
                      {upd.photoUrl && (
                        <div className="h-36 rounded-xl overflow-hidden border border-white/10 mt-2">
                          <img src={upd.photoUrl} alt="Work Proof" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="text-[10px] text-slate-500 font-mono block">
                        Logged on {new Date(upd.createdAt || Date.now()).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <Activity className="w-8 h-8 text-slate-500 mx-auto" />
                  <p className="text-xs font-bold text-slate-300">No Work Updates Posted Yet</p>
                  <button
                    onClick={() => setShowUpdateModal(true)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-400 transition-colors inline-block mt-2"
                  >
                    Post First Progress Update
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 4: Attendance & Hours */}
          {activeTab === 'attendance' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <AttendanceControl
                projectId={prjId}
                projectName={projectData.name}
                onAttendanceUpdated={() => {
                  api.get(`/projects/${prjId}`).then((res) => res.success && setProjectData(res.data));
                }}
              />
              <AttendanceHistoryTable attendanceRecords={projectData.attendance || []} />
            </motion.div>
          )}

          {/* TAB 5: Activity History */}
          {activeTab === 'activity' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Project Audit Trail</h4>
              {(projectData.activityHistory || []).map((act, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-cyan-300">{act.action}</span>
                    <p className="text-[11px] text-slate-400 mt-0.5">{act.details}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">{act.performedBy}</span>
                    <span className="text-[10px] text-slate-500 font-mono">{new Date(act.timestamp || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Sub-Modals */}
      <AssignLabourModal
        project={projectData}
        isOpen={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        onAssigned={(updatedPrj) => setProjectData(updatedPrj)}
      />

      <AddWorkUpdateModal
        project={projectData}
        isOpen={showUpdateModal}
        onClose={() => setShowUpdateModal(false)}
        onUpdateAdded={() => {
          api.get(`/projects/${prjId}`).then((res) => res.success && setProjectData(res.data));
        }}
      />

      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={confirmConfig.action}
        title={confirmConfig.title}
        message={confirmConfig.message}
        type={confirmConfig.type}
      />
    </AnimatePresence>
  );
};

export default ProjectDetailsModal;
