import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  UserCheck,
  Briefcase,
  CalendarCheck,
  Wallet,
  MessageSquare,
  Bell,
  User,
  Search,
  BookOpen,
  FolderKanban,
  PlusCircle,
  Users,
  CreditCard,
  Star,
  LayoutDashboard,
  ShieldCheck,
  FileCheck,
  AlertTriangle,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  HardHat,
  Building2,
  Shield,
} from 'lucide-react';

const CUSTOMER_MENU = [
  { id: 'find', label: 'Find Labour', icon: Search, badge: 'Hire' },
  { id: 'bookings', label: 'My Bookings', icon: BookOpen },
  { id: 'projects', label: 'My Projects', icon: FolderKanban },
  { id: 'create', label: 'Create Work', icon: PlusCircle },
  { id: 'workers', label: 'Assigned Workers', icon: Users, badge: '24' },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'messages', label: 'Messages', icon: MessageSquare },
  { id: 'notifications', label: 'Notifications', icon: Bell, badge: '5' },
  { id: 'reviews', label: 'Worker Reviews', icon: Star },
];

const MENU_ITEMS_BY_ROLE = {
  labour: [
    { id: 'profile', label: 'My Profile', icon: UserCheck, badge: 'Active' },
    { id: 'requests', label: 'Work Requests', icon: Briefcase, badge: '4 New' },
    { id: 'jobs', label: 'My Jobs', icon: BookOpen },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
    { id: 'earnings', label: 'Earnings', icon: Wallet },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: '2' },
    { id: 'notifications', label: 'Notifications', icon: Bell, badge: '3' },
    { id: 'settings', label: 'Account Settings', icon: Settings },
  ],
  customer: CUSTOMER_MENU,
  contractor: CUSTOMER_MENU,
  admin: [
    { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'labour', label: 'Labour Management', icon: HardHat, badge: '1.2k' },
    { id: 'customers', label: 'Customer Management', icon: Building2 },
    { id: 'bookings', label: 'All Bookings', icon: BookOpen },
    { id: 'projects', label: 'All Projects', icon: FolderKanban },
    { id: 'verification', label: 'Verification Queue', icon: FileCheck, badge: '5 Pending' },
    { id: 'payments', label: 'Payments & Escrow', icon: CreditCard },
    { id: 'complaints', label: 'Complaints & Disputes', icon: AlertTriangle },
    { id: 'reports', label: 'System Reports', icon: BarChart3 },
    { id: 'settings', label: 'Platform Settings', icon: Settings },
  ],
};

const Sidebar = ({ activeTab, setActiveTab, collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const role = user?.role || 'customer';
  const menuItems = MENU_ITEMS_BY_ROLE[role] || MENU_ITEMS_BY_ROLE.customer;

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-white/10 glass-panel h-screen sticky top-0 transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-white block leading-none">
                Labour<span className="text-cyan-400">Hub</span>
              </span>
              <span className="text-[10px] text-cyan-400/80 font-mono tracking-widest uppercase">
                Enterprise v1.0
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 custom-scrollbar">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10 font-semibold'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-white/5'
              }`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span
                  className={`ml-auto px-2 py-0.5 text-[10px] font-bold rounded-full border ${
                    isActive
                      ? 'bg-cyan-500/30 text-cyan-300 border-cyan-400/40'
                      : 'bg-white/10 text-slate-300 border-white/10'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Footer Summary */}
      <div className="p-3 border-t border-white/10">
        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl bg-white/5 border border-white/5 ${
            collapsed ? 'justify-center' : ''
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center font-bold text-cyan-400 border border-white/10 shrink-0 overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              user?.fullName?.[0] || 'U'
            )}
          </div>
          {!collapsed && (
            <div className="overflow-hidden flex-1">
              <p className="text-xs font-bold text-white truncate">{user?.fullName || 'Active User'}</p>
              <p className="text-[11px] text-cyan-400 capitalize font-mono">{user?.role || 'Guest'}</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
