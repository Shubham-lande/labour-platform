import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { ROLE_CONFIG } from '../../theme/designTokens';
import NotificationCenterModal from '../business/NotificationCenterModal';
import api from '../../services/api';
import {
  Bell,
  Search,
  LogOut,
  User,
  Shield,
  ChevronDown,
  Sparkles,
  HardHat,
  Building2,
  Lock,
} from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const { toastInfo } = useToast();
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [unreadCount, setUnreadCount] = useState(2);

  const roleInfo = ROLE_CONFIG[user?.role] || ROLE_CONFIG.customer;

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/notifications');
        if (res.success) {
          setUnreadCount(res.unreadCount || 0);
        }
      } catch (e) {
        console.warn('Notification fetch warning:', e.message);
      }
    };
    fetchUnread();
  }, []);

  return (
    <header className="h-16 px-6 glass-panel border-b border-white/10 sticky top-0 z-20 flex items-center justify-between gap-4">
      {/* Search Input */}
      <div className="flex-1 max-w-md relative hidden sm:block">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search jobs, projects, skilled workers, or reports..."
          className="w-full pl-10 pr-4 py-2 text-xs rounded-xl glass-input placeholder:text-slate-500 font-medium"
        />
      </div>

      {/* Center/Right Info & Role Badge */}
      <div className="flex items-center gap-3.5 ml-auto">
        {/* Role Badge Pill */}
        <div
          className={`px-3 py-1.5 rounded-xl border flex items-center gap-2 text-xs font-bold shadow-sm ${roleInfo.color}`}
        >
          {user?.role === 'admin' && <Shield className="w-3.5 h-3.5" />}
          {user?.role === 'labour' && <HardHat className="w-3.5 h-3.5" />}
          {user?.role === 'customer' && <Building2 className="w-3.5 h-3.5" />}
          <span>{roleInfo.label}</span>
        </div>

        {/* Notifications Icon with Animated Pulse Badge */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationsModal(true)}
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors relative border border-white/5"
            title="Notification Center"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <>
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400" />
              </>
            )}
          </button>
        </div>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-left transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white text-xs overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user?.fullName?.[0] || 'U'
              )}
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-bold text-white leading-none">{user?.fullName || 'User'}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{user?.email || 'user@labourhub.com'}</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl glass-card border border-white/10 p-2 shadow-2xl z-50">
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-xs font-bold text-white">{user?.fullName}</p>
                <p className="text-[11px] text-cyan-400 font-mono capitalize">{user?.role} Account</p>
              </div>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  toastInfo('Security Settings & Password Change');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
              >
                <Lock className="w-3.5 h-3.5 text-cyan-400" /> Security & Key Auth
              </button>
              <button
                onClick={() => {
                  setShowUserMenu(false);
                  logout();
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-rose-400 hover:bg-rose-500/10 transition-colors mt-1"
              >
                <LogOut className="w-3.5 h-3.5" /> End Session (Logout)
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Notification Center Modal */}
      <NotificationCenterModal
        isOpen={showNotificationsModal}
        onClose={() => setShowNotificationsModal(false)}
      />
    </header>
  );
};

export default Header;
