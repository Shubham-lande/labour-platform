// Enterprise Design Tokens for LabourHub

export const COLORS = {
  bgPrimary: '#F8FAFC',
  bgSurface: '#FFFFFF',
  bgMuted: '#F1F5F9',
  brandIndigo: '#4F46E5',
  brandBlue: '#2563EB',
  brandEmerald: '#059669',
  brandAmber: '#D97706',
  brandRose: '#E11D48',
  borderSubtle: '#E2E8F0',
  textMain: '#0F172A',
  textMuted: '#475569',
  textLight: '#64748B',
};

export const ROLE_CONFIG = {
  admin: {
    label: 'Enterprise Admin',
    color: 'bg-purple-50 text-purple-700 border-purple-200 shadow-sm font-bold',
    iconName: 'ShieldAlert',
  },
  labour: {
    label: 'Skilled Labour / Worker',
    color: 'bg-amber-50 text-amber-800 border-amber-200 shadow-sm font-bold',
    iconName: 'HardHat',
  },
  customer: {
    label: 'Customer / Contractor',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm font-bold',
    iconName: 'Building2',
  },
  contractor: {
    label: 'Customer / Contractor',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm font-bold',
    iconName: 'Building2',
  },
};

export const STATUS_VARIANTS = {
  verified: { label: 'Verified', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold' },
  pending: { label: 'Pending Review', bg: 'bg-amber-50 text-amber-700 border-amber-200 font-bold' },
  active: { label: 'Active', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold' },
  in_progress: { label: 'In Progress', bg: 'bg-blue-50 text-blue-700 border-blue-200 font-bold' },
  completed: { label: 'Completed', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold' },
  cancelled: { label: 'Cancelled', bg: 'bg-rose-50 text-rose-700 border-rose-200 font-bold' },
};
