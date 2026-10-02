import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GlassCard from '../../components/common/GlassCard';
import StatusBadge from '../../components/common/StatusBadge';
import { StatGridSkeleton } from '../../components/common/SkeletonLoader';
import PageTransition from '../../components/common/PageTransition';

// Phase 2 Labour Components
import LabourEditProfileModal from '../../components/labour/LabourEditProfileModal';
import WorkRequestCard from '../../components/booking/WorkRequestCard';

// Phase 3 Components
import AttendanceControl from '../../components/attendance/AttendanceControl';
import AttendanceHistoryTable from '../../components/attendance/AttendanceHistoryTable';
import ProjectCard from '../../components/project/ProjectCard';
import ProjectDetailsModal from '../../components/project/ProjectDetailsModal';

// Phase 4 Business Components
import ProjectChatModal from '../../components/business/ProjectChatModal';
import InvoiceModal from '../../components/business/InvoiceModal';
import PaymentHistoryTable from '../../components/business/PaymentHistoryTable';

// Phase 6 Advanced Features Components
import WorkProofGalleryModal from '../../components/advanced/WorkProofGalleryModal';
import SiteMapModal from '../../components/advanced/SiteMapModal';

import api from '../../services/api';
import {
  Briefcase,
  CalendarCheck,
  Wallet,
  Star,
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  ShieldCheck,
  HardHat,
  Zap,
  Edit3,
  MessageSquare,
  Camera,
} from 'lucide-react';

const LabourDashboard = () => {
  const { user, roleProfile } = useAuth();
  const { toastSuccess, toastError, toastInfo } = useToast();
  const [activeTab, setActiveTab] = useState('profile');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Profile Edit & Work Requests States
  const [showEditModal, setShowEditModal] = useState(false);
  const [availabilityStatus, setAvailabilityStatus] = useState('available');
  const [workRequests, setWorkRequests] = useState([]);

  // Phase 3, 4 & 6 States
  const [projects, setProjects] = useState([]);
  const [attendanceList, setAttendanceList] = useState([]);
  const [payments, setPayments] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Fetch initial dashboard metrics & profile
  const fetchDashboard = useCallback(async () => {
    try {
      const res = await api.get('/labour/dashboard');
      if (res.success) {
        setDashboardData(res.data);
      }
    } catch (err) {
      console.warn('Dashboard fetch warning:', err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWorkRequests = useCallback(async () => {
    try {
      const res = await api.get('/bookings/labour');
      if (res.success && res.data) {
        setWorkRequests(res.data);
      }
    } catch (e) {
      console.warn('Work requests fetch error:', e.message);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    try {
      const res = await api.get('/projects?filter=all');
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (e) {
      console.warn('Fetch projects error:', e.message);
    }
  }, []);

  const fetchAttendance = useCallback(async () => {
    try {
      const res = await api.get('/attendance');
      if (res.success && res.data) {
        setAttendanceList(res.data);
      }
    } catch (e) {
      console.warn('Fetch attendance error:', e.message);
    }
  }, []);

  const fetchPayments = useCallback(async () => {
    try {
      const res = await api.get('/payments');
      if (res.success && res.data) {
        setPayments(res.data);
      }
    } catch (e) {
      console.warn('Fetch payments error:', e.message);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
    fetchWorkRequests();
    fetchProjects();
    fetchAttendance();
    fetchPayments();
  }, [fetchDashboard, fetchWorkRequests, fetchProjects, fetchAttendance, fetchPayments]);

  useEffect(() => {
    if (roleProfile?.availabilityStatus) {
      setAvailabilityStatus(roleProfile.availabilityStatus);
    }
  }, [roleProfile]);

  const handleAvailabilityToggle = async (newStatus) => {
    setAvailabilityStatus(newStatus);
    try {
      const res = await api.put('/labour/profile/me', { availabilityStatus: newStatus });
      if (res.success) {
        toastSuccess(`Availability Status updated to: ${newStatus.toUpperCase()}`);
      }
    } catch (err) {
      toastError('Failed to toggle status.');
    }
  };

  const handleAcceptRequest = async (bookingId) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: 'accepted' });
      if (res.success) {
        toastSuccess(`Accepted Booking Request #${bookingId}! Customer notified.`);
        fetchWorkRequests();
        fetchDashboard();
        fetchProjects();
      }
    } catch (err) {
      toastError(err.message || 'Failed to accept request.');
    }
  };

  const handleRejectRequest = async (bookingId) => {
    try {
      const res = await api.put(`/bookings/${bookingId}/status`, { status: 'rejected' });
      if (res.success) {
        toastInfo(`Booking Request #${bookingId} declined.`);
        fetchWorkRequests();
      }
    } catch (err) {
      toastError(err.message || 'Failed to decline request.');
    }
  };

  const handleViewProjectDetails = (prj) => {
    setSelectedProject(prj);
    setShowProjectDetailsModal(true);
  };

  const handleOpenChat = (prj) => {
    setSelectedProject(prj || projects[0]);
    setShowChatModal(true);
  };

  const handleViewInvoice = (pay) => {
    setSelectedInvoice({
      invoiceNumber: 'INV-2026-0091',
      issueDate: pay.createdAt,
      customerName: pay.customerName || 'Apex Buildcon Ltd',
      labourName: user?.fullName || 'Rajesh Kumar',
      workDescription: 'Site Electrical Services',
      duration: '15 Days',
      dailyRate: 1200,
      additionalCharges: 5000,
      taxAmount: Math.round((pay.amount || 185000) * 0.18),
      totalAmount: pay.amount || 185000,
      paymentStatus: pay.status || 'paid',
      transactionId: pay.transactionId || 'TXN-RZP-992011',
    });
    setShowInvoiceModal(true);
  };

  const stats = dashboardData?.stats || {
    activeRequests: workRequests.filter((w) => w.status === 'pending').length || 4,
    assignedJobs: projects.length || 2,
    todayAttendanceStatus: 'Checked-In (Site 4B)',
    monthlyEarnings: payments.reduce((acc, p) => acc + (p.amount || 0), 0) || 38400,
    completedJobsTotal: 142,
    averageRating: 4.9,
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <PageTransition key={activeTab}>
        {/* Title & Quick Availability Switch Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status="verified" text="Verified Master Worker" />
              <span className="text-xs font-mono text-cyan-400 font-semibold">ID: #LBR-2026-98</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              Labour Dashboard — <span className="text-amber-400">{user?.fullName || 'Worker Profile'}</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Manage work requests, site attendance check-ins, job progress, proof uploads, and project chat stream.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => handleOpenChat(projects[0])}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 flex items-center gap-1.5 transition-all cursor-pointer shadow-sm backdrop-blur-md"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" /> Project Chat
            </button>

            {/* Availability Status Switcher */}
            <div className="flex items-center gap-1 bg-slate-900/80 p-1.5 rounded-2xl border border-white/10 shrink-0 shadow-lg backdrop-blur-xl">
              <span className="text-xs font-bold text-slate-400 pl-2 hidden sm:inline">Status:</span>
              <button
                onClick={() => handleAvailabilityToggle('available')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                  availabilityStatus === 'available'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Available
              </button>

              <button
                onClick={() => handleAvailabilityToggle('busy')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                  availabilityStatus === 'busy'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Busy
              </button>

              <button
                onClick={() => handleAvailabilityToggle('offline')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border flex items-center gap-1.5 cursor-pointer ${
                  availabilityStatus === 'offline'
                    ? 'bg-slate-700/60 text-slate-200 border-slate-600 shadow-sm'
                    : 'bg-transparent text-slate-400 border-transparent hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-slate-500" /> Offline
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Worker Status & Direct Payout Telemetry Banner */}
        <div className="mb-8 p-5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Direct UPI Escrow Payout Channel Active</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  ● Ready for Instant Settlement
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                GPS Attendance Geo-Fence calibrated. Complete on-site shift check-ins to unlock instant payouts.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('attendance')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 border border-amber-500/30 hover:bg-amber-500/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <CalendarCheck className="w-3.5 h-3.5 text-amber-400" /> GPS Check-in
            </button>
            <button
              onClick={() => setActiveTab('requests')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Briefcase className="w-3.5 h-3.5 text-cyan-400" /> Job Requests ({workRequests.filter(w => w.status === 'pending').length || 4})
            </button>
          </div>
        </div>

        {loading ? (
          <StatGridSkeleton />
        ) : (
          <>
            {/* KPI Summary Grid - Rich Gradient Frosted Glass */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Card 1: Emerald/Teal - Work Requests */}
              <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-emerald-950/70 via-slate-900/80 to-teal-950/60 border border-emerald-500/30 shadow-xl backdrop-blur-xl group hover:border-emerald-500/50 hover:shadow-emerald-900/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
                    <Briefcase className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-300 block tracking-wide">Work Requests</span>
                    <p className="text-3xl font-black text-white font-mono mt-0.5">
                      {workRequests.filter(w => w.status === 'pending').length || 4}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 animate-pulse" /> Action Required
                  </span>
                  <span className="text-slate-400">Respond →</span>
                </div>
              </div>

              {/* Card 2: Purple/Indigo - Assigned Projects */}
              <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-purple-950/70 via-slate-900/80 to-indigo-950/60 border border-purple-500/30 shadow-xl backdrop-blur-xl group hover:border-purple-500/50 hover:shadow-purple-900/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-lg shadow-purple-500/20">
                    <HardHat className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-300 block tracking-wide">Assigned Projects</span>
                    <p className="text-3xl font-black text-white font-mono mt-0.5">
                      {projects.length || 2}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs">
                  <span className="text-purple-300 font-semibold">Lower Parel & BKC Sites</span>
                  <span className="text-purple-400">View →</span>
                </div>
              </div>

              {/* Card 3: Electric Blue / Cyan - Today Attendance */}
              <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-blue-950/70 via-slate-900/80 to-cyan-950/60 border border-cyan-500/30 shadow-xl backdrop-blur-xl group hover:border-cyan-500/50 hover:shadow-cyan-900/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/20">
                    <CalendarCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-300 block tracking-wide">Today Attendance</span>
                    <p className="text-xl font-bold text-emerald-400 mt-1 truncate">
                      {stats.todayAttendanceStatus || 'Checked-In (Site 4B)'}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs">
                  <span className="text-cyan-300 font-semibold">GPS Verified 08:45 AM</span>
                  <span className="text-cyan-400">Details →</span>
                </div>
              </div>

              {/* Card 4: Amber / Gold - Monthly Earnings */}
              <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-amber-950/70 via-slate-900/80 to-orange-950/60 border border-amber-500/30 shadow-xl backdrop-blur-xl group hover:border-amber-500/50 hover:shadow-amber-900/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-300 block tracking-wide">Monthly Earnings</span>
                    <p className="text-3xl font-black text-white font-mono mt-0.5">
                      ₹{stats.monthlyEarnings.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400" /> {stats.averageRating} Rating
                  </span>
                  <span className="text-amber-300">Instant UPI →</span>
                </div>
              </div>
            </div>

            {/* TAB CONTENT PANELS */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <GlassCard hover={false} className="lg:col-span-2 space-y-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center font-bold text-white text-2xl overflow-hidden shadow-lg border border-amber-400/30">
                        {user?.avatar ? (
                          <img src={user.avatar} alt="Worker" className="w-full h-full object-cover" />
                        ) : (
                          user?.fullName?.[0] || 'W'
                        )}
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-white">{user?.fullName}</h3>
                        <p className="text-xs text-amber-400 font-semibold">
                          {roleProfile?.primarySkill || 'Master Industrial Electrician'}
                        </p>
                        <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" /> {roleProfile?.location?.city || 'Mumbai'}, Maharashtra
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowMapModal(true)}
                        className="px-3 py-2 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Service Map
                      </button>
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 transition-all flex items-center gap-1.5"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-cyan-400" /> Edit Profile
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                    <div>
                      <span className="text-[11px] text-slate-400 block">Experience</span>
                      <span className="text-sm font-bold text-white">{roleProfile?.experienceYears || 7}+ Years</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Daily Rate</span>
                      <span className="text-sm font-bold text-cyan-400 font-mono">₹{roleProfile?.dailyRate || 1200} / day</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Hourly Rate</span>
                      <span className="text-sm font-bold text-cyan-400 font-mono">₹{roleProfile?.hourlyRate || 180} / hr</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-400 block">Live Status</span>
                      <span className="text-sm font-bold text-emerald-400 capitalize">{availabilityStatus}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Certified Skill Sets</h4>
                    <div className="flex flex-wrap gap-2">
                      {(roleProfile?.skills || ['Electrical Wiring', 'High Voltage Switchgear', 'Solar Installation', 'HVAC Controls']).map((skill, idx) => (
                        <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </GlassCard>

                {/* KYC Checklist */}
                <GlassCard hover={false} className="space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" /> Verified Credentials
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-200">Aadhaar Card Identity</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-200">Industrial Trade License</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-200">Police Background Check</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                  </div>
                </GlassCard>
              </div>
            )}

            {/* Work Requests Tab */}
            {activeTab === 'requests' && (
              <GlassCard hover={false} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-white">Work Booking Requests</h3>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{workRequests.length} Requests</span>
                </div>

                <div className="space-y-3">
                  {workRequests.map((req) => (
                    <WorkRequestCard
                      key={req._id || req.id}
                      booking={req}
                      onAccept={handleAcceptRequest}
                      onReject={handleRejectRequest}
                      onViewDetails={(b) => toastInfo(`Viewing details for ${b.title}`)}
                    />
                  ))}
                </div>
              </GlassCard>
            )}

            {/* Jobs & Projects Tab */}
            {activeTab === 'jobs' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-white">My Assigned Site Projects & Work Orders</h3>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{projects.length} Active Jobs</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((prj) => (
                    <div key={prj._id || prj.id} className="space-y-2">
                      <ProjectCard
                        project={prj}
                        onViewDetails={handleViewProjectDetails}
                        onAssignLabour={handleViewProjectDetails}
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleOpenChat(prj)}
                          className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/10 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-cyan-400" /> Chat
                        </button>
                        <button
                          onClick={() => {
                            setSelectedProject(prj);
                            setShowProofModal(true);
                          }}
                          className="flex-1 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 flex items-center justify-center gap-1.5 transition-all"
                        >
                          <Camera className="w-3.5 h-3.5" /> Upload Proof
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Attendance Tab */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <AttendanceControl
                  projectId="PRJ-901"
                  projectName="Smart Building Automation"
                  onAttendanceUpdated={() => fetchAttendance()}
                />
                <AttendanceHistoryTable attendanceRecords={attendanceList} />
              </div>
            )}

            {/* Earnings & Payout History Tab */}
            {activeTab === 'earnings' && (
              <PaymentHistoryTable payments={payments} onViewInvoice={handleViewInvoice} />
            )}

            {(activeTab === 'messages' || activeTab === 'notifications' || activeTab === 'settings') && (
              <GlassCard hover={false} className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
                  <HardHat className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white capitalize">{activeTab} Management Panel</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Labour workspace active for {activeTab}. Connected to Express backend API with Mongoose schemas.
                </p>
              </GlassCard>
            )}
          </>
        )}

        {/* Modals */}
        <LabourEditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          onUpdated={() => {
            fetchDashboard();
            fetchWorkRequests();
          }}
        />

        <ProjectDetailsModal
          project={selectedProject}
          isOpen={showProjectDetailsModal}
          onClose={() => setShowProjectDetailsModal(false)}
          onProjectUpdated={() => {
            fetchProjects();
            fetchAttendance();
          }}
          userRole="labour"
        />

        <ProjectChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          project={selectedProject}
        />

        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          invoice={selectedInvoice}
        />

        <WorkProofGalleryModal
          isOpen={showProofModal}
          onClose={() => setShowProofModal(false)}
          project={selectedProject}
        />

        <SiteMapModal
          isOpen={showMapModal}
          onClose={() => setShowMapModal(false)}
        />
      </PageTransition>
    </DashboardLayout>
  );
};

export default LabourDashboard;
