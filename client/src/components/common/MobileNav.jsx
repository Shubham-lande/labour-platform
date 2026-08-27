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

const MOBILE_ITEMS = {
  labour: [
    { id: 'profile', label: 'Profile', icon: UserCheck },
    { id: 'requests', label: 'Requests', icon: Briefcase },
    { id: 'jobs', label: 'My Jobs', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
  ],
  customer: [
    { id: 'find', label: 'Find', icon: Search },
    { id: 'bookings', label: 'Bookings', icon: BookOpen },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'payments', label: 'Payments', icon: Wallet },
  ],
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 glass-panel border-t border-white/10 z-40 flex items-center justify-around px-2">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
              isActive ? 'text-cyan-400 font-bold scale-105' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default MobileNav;
