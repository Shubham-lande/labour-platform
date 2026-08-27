import React from 'react';
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import {
  FolderKanban,
  MapPin,
  Calendar,
  Users,
  Clock,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';

const PRIORITY_BADGES = {
  urgent: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  high: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  medium: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
  low: 'bg-slate-800 text-slate-400 border-slate-700',
};

const ProjectCard = ({ project, onViewDetails, onAssignLabour, onUpdateStatus }) => {
  const {
    _id,
    id,
    name,
    category,
    location = { city: 'Mumbai' },
    workerCount = 1,
    assignedWorkers = [],
    startDate,
    deadline,
    budget = 0,
    priority = 'medium',
    status = 'created',
    progressPercentage = 0,
  } = project;

  const prjId = _id || id || 'PRJ-101';
  const assignedCount = assignedWorkers.length;

  return (
    <GlassCard className="flex flex-col justify-between space-y-4 relative overflow-hidden group">
      <div>
        {/* Header Row */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 font-mono font-bold">
                {prjId}
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border capitalize ${
                  PRIORITY_BADGES[priority] || PRIORITY_BADGES.medium
                }`}
              >
                {priority} Priority
              </span>
            </div>
            <h3 className="text-sm font-extrabold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
              {name}
            </h3>
            <p className="text-xs font-semibold text-cyan-400">{category}</p>
          </div>

          <StatusBadge status={status} />
        </div>

        {/* Location & Dates Strip */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 my-3 p-2.5 rounded-xl bg-white/5 border border-white/5">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="truncate">{location.city || 'Mumbai'}</span>
          </div>
          <div className="flex items-center gap-1.5 truncate">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{deadline ? new Date(deadline).toLocaleDateString() : 'Set Deadline'}</span>
          </div>
        </div>

        {/* Assigned Workers Avatar Row */}
        <div className="flex items-center justify-between text-xs my-2">
          <div className="flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-300 font-semibold">
              Crew: <span className="text-white font-extrabold">{assignedCount}</span> / {workerCount} Workers
            </span>
          </div>
          <span className="text-xs font-mono font-extrabold text-cyan-400">
            ₹{parseInt(budget, 10).toLocaleString()}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1 mt-3">
          <div className="flex justify-between text-[11px] font-semibold">
            <span className="text-slate-400">Completion Progress</span>
            <span className="text-cyan-400 font-mono font-bold">{progressPercentage}%</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/10">
        <button
          onClick={() => onViewDetails(project)}
          className="py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-white transition-all text-center"
        >
          Project Details
        </button>
        <button
          onClick={() => onAssignLabour(project)}
          className="py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-1"
        >
          Assign Crew <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </GlassCard>
  );
};

export default ProjectCard;
