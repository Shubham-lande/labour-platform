// Reusable Design Tokens for LabourHub Platform

export const COLORS = {
  bgPrimary: '#0B0F17',
  bgSecondary: '#111827',
  bgCard: 'rgba(15, 23, 42, 0.65)',
  accentCyan: '#06B6D4',
  accentBlue: '#3B82F6',
  accentEmerald: '#10B981',
  accentPurple: '#8B5CF6',
  accentAmber: '#F59E0B',
  accentRose: '#F43F5E',
  borderSubtle: 'rgba(255, 255, 255, 0.08)',
  textMuted: '#9CA3AF',
  textBright: '#F9FAFB',
};

export const ROLE_CONFIG = {
  admin: {
    label: 'Enterprise Admin',
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    iconName: 'ShieldAlert',
  },
  labour: {
    label: 'Skilled Labour / Worker',
    color: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    iconName: 'HardHat',
  },
  customer: {
    label: 'Customer / Contractor',
    color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    iconName: 'Building2',
  },
  contractor: {
    label: 'Customer / Contractor',
    color: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    iconName: 'Building2',
  },
};

export const STATUS_VARIANTS = {
  verified: { label: 'Verified', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  pending: { label: 'Pending Review', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  active: { label: 'Active', bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  completed: { label: 'Completed', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  cancelled: { label: 'Cancelled', bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30' },
};
