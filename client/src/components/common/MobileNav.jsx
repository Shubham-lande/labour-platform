import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  UserCheck,
  Briefcase,
  CalendarCheck,
  Wallet,
  Search,
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  HardHat,
  Building2,
  FileCheck,
} from 'lucide-react';

const CUSTOMER_MOBILE_ITEMS = [
  { id: 'find', label: 'Find', icon: Search },
  { id: 'bookings', label: 'Bookings', icon: BookOpen },
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'payments', label: 'Payments', icon: Wallet },
];

const MOBILE_ITEMS = {
  labour: [
    { id: 'profile', label: 'Profile', icon: UserCheck },
    { id: 'requests', label: 'Requests', icon: Briefcase },
    { id: 'jobs', label: 'My Jobs', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
  ],
  customer: CUSTOMER_MOBILE_ITEMS,
  contractor: CUSTOMER_MOBILE_ITEMS,
  admin: [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'labour', label: 'Labour', icon: HardHat },
    { id: 'customers', label: 'Clients', icon: Building2 },
    { id: 'verification', label: 'Verify', icon: FileCheck },
  ],
};

const MobileNav = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const role = user?.role || 'customer';
  const items = MOBILE_ITEMS[role] || MOBILE_ITEMS.customer;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-slate-950/90 backdrop-blur-2xl border-t border-white/15 z-40 flex items-center justify-around px-2 shadow-2xl">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-2xl transition-all cursor-pointer ${
              isActive
                ? 'bg-gradient-to-r from-purple-600/30 to-cyan-500/30 text-white font-bold border border-cyan-400/40 shadow-lg shadow-cyan-500/20 scale-105'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400 animate-pulse' : 'text-slate-400'}`} />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
