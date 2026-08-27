import React from 'react';
import StatusBadge from '../common/StatusBadge';
import { Calendar, Clock, MapPin, CheckCircle2, Building2, User } from 'lucide-react';

const AttendanceHistoryTable = ({ attendanceRecords = [] }) => {
  if (!attendanceRecords || attendanceRecords.length === 0) {
    return (
      <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/5 space-y-2">
        <Clock className="w-8 h-8 text-slate-500 mx-auto" />
        <p className="text-xs font-bold text-slate-300">No Site Attendance Records Logged Yet</p>
        <p className="text-[11px] text-slate-400">Attendance punches logged by assigned labourers will appear here.</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto custom-scrollbar rounded-2xl border border-white/10 glass-panel">
      <table className="w-full text-left text-xs text-slate-300 min-w-[650px]">
        <thead className="bg-white/5 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-white/10">
          <tr>
            <th className="py-3.5 px-4">Date</th>
            <th className="py-3.5 px-4">Worker</th>
            <th className="py-3.5 px-4">Project / Site</th>
            <th className="py-3.5 px-4">Check-In</th>
            <th className="py-3.5 px-4">Check-Out</th>
            <th className="py-3.5 px-4">Break</th>
            <th className="py-3.5 px-4 font-mono text-cyan-400">Total Hours</th>
            <th className="py-3.5 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5 font-medium">
          {attendanceRecords.map((rec, idx) => {
            const workerName = rec.workerName || rec.worker?.fullName || 'Skilled Labour';
            const avatar = rec.worker?.avatar || '';
            const prjName = rec.projectName || rec.project?.name || 'Site Work';

            return (
              <tr key={rec._id || idx} className="hover:bg-white/5 transition-colors">
                <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                  {rec.date}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-bold text-[10px] overflow-hidden shrink-0">
                      {avatar ? <img src={avatar} alt={workerName} className="w-full h-full object-cover" /> : workerName[0]}
                    </div>
                    <span className="font-bold text-white text-xs">{workerName}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 max-w-[180px] truncate" title={prjName}>
                  <span className="text-cyan-300 font-semibold">{prjName}</span>
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                  {rec.startTime || '08:30 AM'}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-300 whitespace-nowrap">
                  {rec.endTime || '—'}
                </td>
                <td className="py-3.5 px-4 font-mono text-slate-400 whitespace-nowrap">
                  {rec.breakMinutes || 30} mins
                </td>
                <td className="py-3.5 px-4 font-mono font-bold text-cyan-400 text-sm whitespace-nowrap">
                  {rec.totalHours ? `${rec.totalHours} hrs` : 'In Progress'}
                </td>
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {rec.status === 'checked_in' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Checked-In
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      Checked-Out
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceHistoryTable;
