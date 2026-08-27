import React from 'react';
import GlassCard from '../common/GlassCard';
import StatusBadge from '../common/StatusBadge';
import { History, Shield, HardHat, Building2, Clock, Activity } from 'lucide-react';

const AdminActivityLogTable = ({ logs = [] }) => {
  return (
    <GlassCard hover={false} className="space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-400" /> Platform Security & Activity Audit Trail
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable system logs recording user events, milestone payments, and status transitions.
          </p>
        </div>
        <span className="text-xs font-mono text-cyan-400 font-bold">{logs.length} Logged Events</span>
      </div>

      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full text-left text-xs whitespace-nowrap min-w-[700px]">
          <thead>
            <tr className="border-b border-white/10 text-slate-400 font-semibold uppercase text-[10px] tracking-wider">
              <th className="pb-3 px-3">Timestamp</th>
              <th className="pb-3 px-3">Actor / Performer</th>
              <th className="pb-3 px-3">Role</th>
              <th className="pb-3 px-3">Event Type</th>
              <th className="pb-3 px-3">Audit Details</th>
              <th className="pb-3 px-3 text-center">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 font-mono">
            {logs.map((log) => (
              <tr key={log._id || log.id} className="hover:bg-white/5 transition-colors">
                <td className="py-3 px-3 text-slate-400 font-sans">
                  {new Date(log.createdAt || Date.now()).toLocaleString()}
                </td>
                <td className="py-3 px-3 text-white font-sans font-bold">{log.performedBy || 'System Engine'}</td>
                <td className="py-3 px-3">
                  <span className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold bg-white/5 text-slate-300 border border-white/10">
                    {log.actorRole || 'user'}
                  </span>
                </td>
                <td className="py-3 px-3 text-cyan-300 font-sans font-semibold">{log.event}</td>
                <td className="py-3 px-3 text-slate-300 font-sans truncate max-w-xs">{log.details}</td>
                <td className="py-3 px-3 text-center font-sans">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                      log.severity === 'success'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : log.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : log.severity === 'danger'
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    }`}
                  >
                    {log.severity || 'info'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

export default AdminActivityLogTable;
