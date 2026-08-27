import React from 'react';
import { motion } from 'framer-motion';
import {
  FilePlus,
  UserCheck,
  Calendar,
  Play,
  Activity,
  CheckCircle2,
  ThumbsUp,
  Lock,
} from 'lucide-react';

const STEPPER_STAGES = [
  { id: 'created', label: 'Created', icon: FilePlus },
  { id: 'labour_assigned', label: 'Labour Assigned', icon: UserCheck },
  { id: 'scheduled', label: 'Scheduled', icon: Calendar },
  { id: 'work_started', label: 'Work Started', icon: Play },
  { id: 'in_progress', label: 'In Progress', icon: Activity },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 },
  { id: 'customer_approved', label: 'Approved', icon: ThumbsUp },
  { id: 'closed', label: 'Closed', icon: Lock },
];

const ProjectStepper = ({ currentStatus = 'created', onAdvanceStatus, canUpdate = false }) => {
  const currentIndex = STEPPER_STAGES.findIndex((s) => s.id === currentStatus);
  const activeIdx = currentIndex >= 0 ? currentIndex : 0;

  return (
    <div className="w-full py-4 px-2 bg-white/5 rounded-2xl border border-white/10 overflow-x-auto custom-scrollbar">
      <div className="flex items-center justify-between min-w-[700px] relative px-4">
        {/* Progress Line */}
        <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-800 rounded-full z-0" />
        <motion.div
          className="absolute left-8 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full z-0"
          initial={{ width: '0%' }}
          animate={{
            width: `${(activeIdx / (STEPPER_STAGES.length - 1)) * 90}%`,
          }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        />

        {STEPPER_STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const isNext = idx === activeIdx + 1;

          return (
            <div key={stage.id} className="relative z-10 flex flex-col items-center group">
              <button
                disabled={!canUpdate || !isNext}
                onClick={() => isNext && onAdvanceStatus && onAdvanceStatus(stage.id)}
                className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs transition-all ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                    : isCurrent
                    ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white ring-4 ring-cyan-500/20 shadow-lg shadow-cyan-500/30 animate-pulse'
                    : isNext && canUpdate
                    ? 'bg-slate-800 text-cyan-400 border border-cyan-500/40 hover:bg-cyan-500/20 cursor-pointer'
                    : 'bg-slate-900 text-slate-600 border border-slate-800'
                }`}
                title={`${stage.label} ${isNext && canUpdate ? '(Click to advance)' : ''}`}
              >
                <Icon className="w-4 h-4" />
              </button>

              <span
                className={`text-[10px] font-bold mt-2 whitespace-nowrap ${
                  isCurrent
                    ? 'text-cyan-400 font-extrabold'
                    : isDone
                    ? 'text-emerald-400'
                    : 'text-slate-500'
                }`}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectStepper;
