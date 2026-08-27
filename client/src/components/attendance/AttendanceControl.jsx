import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import { Play, Square, Clock, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';

const AttendanceControl = ({ projectId, projectName, onAttendanceUpdated, isCheckedInInitially = false }) => {
  const { toastSuccess, toastError } = useToast();
  const [isCheckedIn, setIsCheckedIn] = useState(isCheckedInInitially);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState('08:30 AM');

  const handleToggleAttendance = async (action) => {
    setLoading(true);
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

      const res = await api.post('/attendance', {
        projectId: projectId || 'PRJ-901',
        action,
        startTime: action === 'check_in' ? timeStr : startTime,
        endTime: action === 'check_out' ? timeStr : null,
        breakMinutes: 30,
        siteLocation: 'Mumbai Site 4B',
      });

      if (res.success) {
        if (action === 'check_in') {
          setIsCheckedIn(true);
          setStartTime(timeStr);
          toastSuccess(`Attendance Checked-In logged at ${timeStr}!`);
        } else {
          setIsCheckedIn(false);
          toastSuccess(`Attendance Checked-Out logged at ${timeStr}! Total Hours: ${res.attendance?.totalHours || 8.5} hrs.`);
        }
        if (onAttendanceUpdated) onAttendanceUpdated(res.attendance);
      }
    } catch (err) {
      toastError(err.message || 'Attendance action failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl ${isCheckedIn ? 'bg-emerald-500/10 text-emerald-400' : 'bg-cyan-500/10 text-cyan-400'}`}>
          <Clock className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-extrabold text-white">Daily Attendance Punch Console</h4>
            {isCheckedIn ? (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block mr-1" /> On Shift
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                Off Shift
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            {isCheckedIn ? `Checked in since ${startTime} • Auto-calculating break-adjusted hours` : 'Press Start Shift to log attendance check-in'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full sm:w-auto">
        {!isCheckedIn ? (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleToggleAttendance('check_in')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Play className="w-3.5 h-3.5 fill-current" /> Start Attendance Shift
          </button>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={() => handleToggleAttendance('check_out')}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 shadow-md shadow-rose-500/10 transition-all flex items-center justify-center gap-1.5"
          >
            <Square className="w-3.5 h-3.5 fill-current" /> End Attendance Shift
          </button>
        )}
      </div>
    </div>
  );
};

export default AttendanceControl;
