import React from 'react';
import StatusBadge from '../common/StatusBadge';
import {
  Building2,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  CheckCircle2,
  XCircle,
  Eye,
  Users,
} from 'lucide-react';

const WorkRequestCard = ({ booking, onAccept, onReject, onViewDetails }) => {
  const {
    _id,
    id,
    customerName,
    title,
    category,
    description,
    location = { city: 'Mumbai' },
    startDate,
    endDate,
    workerCount = 1,
    estimatedBudget = 0,
    status = 'pending',
  } = booking;

  const bookingId = _id || id || 'WR-101';
  const isPending = status === 'pending';

  return (
    <div className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h4 className="text-sm font-extrabold text-white">{title || 'Work Booking Request'}</h4>
          <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono font-bold">
            {bookingId}
          </span>
          <StatusBadge status={status} />
        </div>

        <p className="text-xs text-slate-400 flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1">
            <Building2 className="w-3.5 h-3.5 text-cyan-400" /> {customerName || 'Client Contractor'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {location.city || 'Mumbai'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-amber-400" /> {workerCount} Worker(s)
          </span>
        </p>

        {description && (
          <p className="text-xs text-slate-300 line-clamp-1 italic mt-1">{description}</p>
        )}
      </div>

      {/* Budget & Action Buttons */}
      <div className="flex items-center gap-4 shrink-0 justify-between md:justify-end">
        <div className="text-left md:text-right">
          <span className="text-[10px] text-slate-400 block leading-none">Escrow Budget</span>
          <span className="text-base font-extrabold text-emerald-400 font-mono">
            ₹{estimatedBudget.toLocaleString()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onViewDetails && (
            <button
              onClick={() => onViewDetails(booking)}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          {isPending && onAccept && (
            <button
              onClick={() => onAccept(bookingId)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Accept
            </button>
          )}

          {isPending && onReject && (
            <button
              onClick={() => onReject(bookingId)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-rose-300 bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 transition-colors flex items-center gap-1"
            >
              <XCircle className="w-3.5 h-3.5" /> Reject
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default WorkRequestCard;
