import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  X,
  Bell,
  CheckCheck,
  BookOpen,
  CalendarCheck,
  CreditCard,
  Star,
  AlertTriangle,
  HardHat,
  Clock,
  Sparkles,
} from 'lucide-react';

const NotificationCenterModal = ({ isOpen, onClose, onNotificationClick }) => {
  const { toastSuccess } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications');
      if (res.success && res.data) {
        setNotifications(res.data);
      }
    } catch (e) {
      console.warn('Fetch notifications error:', e.message);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleMarkAllRead = async () => {
    try {
      const res = await api.put('/notifications/read-all');
      if (res.success) {
        toastSuccess('All notifications marked as read.');
        fetchNotifications();
      }
    } catch (err) {
      console.warn('Mark all read error:', err.message);
    }
  };

  const getIconForType = (type) => {
    switch (type) {
      case 'booking_request':
      case 'booking_accepted':
        return <BookOpen className="w-4 h-4 text-cyan-400" />;
      case 'worker_assigned':
      case 'work_started':
      case 'work_completed':
        return <HardHat className="w-4 h-4 text-emerald-400" />;
      case 'payment_received':
      case 'payment_sent':
        return <CreditCard className="w-4 h-4 text-purple-400" />;
      case 'review_submitted':
        return <Star className="w-4 h-4 text-amber-400" />;
      case 'complaint_raised':
        return <AlertTriangle className="w-4 h-4 text-rose-400" />;
      default:
        return <Bell className="w-4 h-4 text-cyan-400" />;
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-md bg-[#0F172A] border border-cyan-500/30 rounded-3xl p-6 shadow-2xl space-y-4 relative flex flex-col max-h-[580px]"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                <Bell className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-white">Notification Center</h3>
                <span className="text-xs font-mono text-cyan-400 font-bold">
                  {notifications.filter((n) => !n.isRead).length} Unread Alerts
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleMarkAllRead}
                className="px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" /> Read All
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List Stream */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
            {notifications.length > 0 ? (
              notifications.map((notif) => (
                <div
                  key={notif._id || notif.id}
                  onClick={() => {
                    if (onNotificationClick) onNotificationClick(notif);
                    onClose();
                  }}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                    !notif.isRead
                      ? 'bg-cyan-950/20 border-cyan-500/30 hover:bg-cyan-950/40 shadow-sm shadow-cyan-500/10'
                      : 'bg-white/5 border-white/5 hover:bg-white/10 opacity-75'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white/5 border border-white/10 shrink-0 mt-0.5">
                    {getIconForType(notif.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-xs font-bold text-white truncate">{notif.title}</h4>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 animate-pulse" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">{notif.text}</p>
                    <span className="text-[10px] text-slate-500 font-mono block mt-1">
                      {new Date(notif.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Bell className="w-8 h-8 mx-auto text-slate-600" />
                <p className="text-xs">No notifications yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default NotificationCenterModal;
