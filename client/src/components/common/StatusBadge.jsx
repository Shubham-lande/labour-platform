import React from 'react';
import { STATUS_VARIANTS } from '../../theme/designTokens';

const StatusBadge = ({ status = 'active', text, className = '' }) => {
  const variant = STATUS_VARIANTS[status] || {
    label: status,
    bg: 'bg-slate-800/60 text-slate-300 border-slate-700',
  };

  const displayText = text || variant.label;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-md transition-colors ${variant.bg} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      {displayText}
    </span>
  );
};

export default StatusBadge;
