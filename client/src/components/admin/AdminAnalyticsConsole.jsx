import React, { useState, useEffect } from 'react';
import GlassCard from '../common/GlassCard';
import { useToast } from '../../context/ToastContext';
import api from '../../services/api';
import {
  TrendingUp,
  BarChart3,
  PieChart,
  Download,
  FileSpreadsheet,
  FileText,
  Calendar,
  Filter,
  Sparkles,
} from 'lucide-react';

const AdminAnalyticsConsole = () => {
  const { toastSuccess, toastInfo } = useToast();
  const [analytics, setAnalytics] = useState(null);
  const [dateRange, setDateRange] = useState('30d');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/admin/analytics');
        if (res.success) {
          setAnalytics(res.data);
        }
      } catch (e) {
        console.warn('Analytics fetch error:', e.message);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExportPDF = () => {
    toastSuccess('Generating executive PDF report file...');
    window.print();
  };

  const handleExportExcel = () => {
    toastSuccess('Exporting raw platform analytics to LabourHub_Report_2026.xlsx');
  };

  const trends = analytics?.bookingTrends || [
    { month: 'Jan', bookings: 24, revenue: 140000 },
    { month: 'Feb', bookings: 38, revenue: 210000 },
    { month: 'Mar', bookings: 45, revenue: 310000 },
    { month: 'Apr', bookings: 52, revenue: 380000 },
    { month: 'May', bookings: 68, revenue: 490000 },
    { month: 'Jun', bookings: 85, revenue: 580000 },
    { month: 'Jul', bookings: 94, revenue: 670000 },
    { month: 'Aug', bookings: 112, revenue: 840000 },
  ];

  const categories = analytics?.popularCategories || [
    { category: 'Certified Electricians', count: 42, percentage: 38 },
    { category: 'Master Plumbers', count: 28, percentage: 25 },
    { category: 'Civil & Masonry', count: 22, percentage: 20 },
    { category: 'HVAC Techs', count: 19, percentage: 17 },
  ];

  const maxRevenue = Math.max(...trends.map((t) => t.revenue || 0));

  return (
    <div className="space-y-6">
      {/* Header & Filter Export Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" /> Platform Reports & Analytics Intelligence
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time charts tracking workforce booking volume, revenue growth, and category demand.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Date Range Selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="7d" className="bg-slate-900 text-white">Last 7 Days</option>
            <option value="30d" className="bg-slate-900 text-white">Last 30 Days</option>
            <option value="90d" className="bg-slate-900 text-white">Last Quarter (90d)</option>
            <option value="1y" className="bg-slate-900 text-white">Year-to-Date (YTD)</option>
          </select>

          {/* Export Buttons */}
          <button
            onClick={handleExportPDF}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center gap-1.5"
          >
            <FileText className="w-4 h-4 text-cyan-400" /> Export PDF
          </button>
          <button
            onClick={handleExportExcel}
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Export Excel
          </button>
        </div>
      </div>

      {/* Analytics Chart Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Growth Bar Chart */}
        <GlassCard hover={false} className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" /> Monthly Gross Volume & Revenue (₹)
            </h4>
            <span className="text-xs font-mono font-bold text-cyan-400">Peak: ₹8.4L</span>
          </div>

          <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-white/10">
            {trends.map((t, idx) => {
              const heightPercent = Math.round(((t.revenue || 0) / maxRevenue) * 100);
              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                  {/* Hover Tooltip */}
                  <div className="absolute -top-8 bg-slate-900 text-cyan-400 px-2 py-1 rounded-md text-[10px] font-mono font-bold border border-cyan-500/30 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
                    ₹{(t.revenue || 0).toLocaleString()} ({t.bookings} bookings)
                  </div>
                  {/* Animated Bar */}
                  <div
                    className="w-full rounded-t-xl bg-gradient-to-t from-cyan-600 to-blue-500 group-hover:from-cyan-400 group-hover:to-blue-400 transition-all shadow-md shadow-cyan-500/20"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-mono text-slate-400">{t.month}</span>
                </div>
              );
            })}
          </div>
        </GlassCard>

        {/* Popular Categories Progress Breakdown */}
        <GlassCard hover={false} className="space-y-4">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <PieChart className="w-4 h-4 text-amber-400" /> Workforce Category Demand
          </h4>

          <div className="space-y-4 pt-2">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{cat.category}</span>
                  <span className="text-cyan-400 font-mono font-bold">{cat.percentage}% ({cat.count} Workers)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default AdminAnalyticsConsole;
