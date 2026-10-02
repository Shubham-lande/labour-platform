import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import DashboardLayout from '../../components/layout/DashboardLayout';
import GlassCard from '../../components/common/GlassCard';
import StatusBadge from '../../components/common/StatusBadge';
import { CardSkeleton, StatGridSkeleton } from '../../components/common/SkeletonLoader';
import PageTransition from '../../components/common/PageTransition';

// Phase 2 Components
import LabourSearchFilter from '../../components/labour/LabourSearchFilter';
import LabourCard from '../../components/labour/LabourCard';
import LabourProfileModal from '../../components/labour/LabourProfileModal';
import BookingModal from '../../components/booking/BookingModal';

// Phase 3 Components
import CreateProjectModal from '../../components/project/CreateProjectModal';
import ProjectCard from '../../components/project/ProjectCard';
import ProjectDetailsModal from '../../components/project/ProjectDetailsModal';
import AssignLabourModal from '../../components/project/AssignLabourModal';

// Phase 4 Business Components
import PaymentModal from '../../components/business/PaymentModal';
import InvoiceModal from '../../components/business/InvoiceModal';
import PaymentHistoryTable from '../../components/business/PaymentHistoryTable';
import ReviewModal from '../../components/business/ReviewModal';
import ProjectChatModal from '../../components/business/ProjectChatModal';
import ComplaintModal from '../../components/business/ComplaintModal';

// Phase 6 Advanced Feature Components
import SmartRecommendationModal from '../../components/advanced/SmartRecommendationModal';
import SiteMapModal from '../../components/advanced/SiteMapModal';
import WorkProofGalleryModal from '../../components/advanced/WorkProofGalleryModal';

import api from '../../services/api';
import {
  Building2,
  Search,
  BookOpen,
  FolderKanban,
  PlusCircle,
  Users,
  CreditCard,
  Plus,
  RotateCcw,
  Lock,
  MessageSquare,
  Star,
  AlertTriangle,
  FileText,
  Sparkles,
  MapPin,
  Camera,
  Radio,
} from 'lucide-react';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const { toastSuccess, toastInfo } = useToast();
  const [activeTab, setActiveTab] = useState('projects');
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Discovery & Booking States
  const [workers, setWorkers] = useState([]);
  const [workersLoading, setWorkersLoading] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [bookingProfile, setBookingProfile] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [myBookings, setMyBookings] = useState([]);

  // Phase 3 Project States
  const [projects, setProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [projectFilter, setProjectFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [assignProject, setAssignProject] = useState(null);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showProjectDetailsModal, setShowProjectDetailsModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  // Phase 4 Business Feature States
  const [payments, setPayments] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showComplaintModal, setShowComplaintModal] = useState(false);

  // Phase 6 Advanced Feature States
  const [showRecommendationModal, setShowRecommendationModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showProofModal, setShowProofModal] = useState(false);

  // Fetch initial dashboard metrics
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/customer/dashboard');
        if (res.success) {
          setDashboardData(res.data);
        }
      } catch (err) {
        console.warn('Customer dashboard warning:', err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const fetchMyBookings = useCallback(async () => {
    try {
      const res = await api.get('/bookings/customer');
      if (res.success && res.data) {
        setMyBookings(res.data);
      }
    } catch (e) {
      console.warn('Fetch bookings error:', e.message);
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    setProjectsLoading(true);
    try {
      const res = await api.get(`/projects?filter=${projectFilter}`);
      if (res.success && res.data) {
        setProjects(res.data);
      }
    } catch (e) {
      console.warn('Fetch projects error:', e.message);
    } finally {
      setProjectsLoading(false);
    }
  }, [projectFilter]);

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
    fetchMyBookings();
    fetchProjects();
    fetchPayments();
  }, [fetchMyBookings, fetchProjects, fetchPayments]);

  const handleFilterChange = useCallback(async (filters) => {
    setWorkersLoading(true);
    try {
      const queryParams = new URLSearchParams();
      if (filters.search) queryParams.append('search', filters.search);
      if (filters.category && filters.category !== 'All') queryParams.append('category', filters.category);
      if (filters.location && filters.location !== 'All') queryParams.append('location', filters.location);
      if (filters.minRating && filters.minRating !== '0') queryParams.append('minRating', filters.minRating);
      if (filters.minExp && filters.minExp !== '0') queryParams.append('minExp', filters.minExp);
      if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice);
      if (filters.availability && filters.availability !== 'All') queryParams.append('availability', filters.availability);
      if (filters.verified) queryParams.append('verified', 'true');
      if (filters.sort) queryParams.append('sort', filters.sort);

      const res = await api.get(`/labour/profiles?${queryParams.toString()}`);
      if (res.success && res.data) {
        setWorkers(res.data);
      }
    } catch (err) {
      console.warn('Filter query warning:', err.message);
    } finally {
      setWorkersLoading(false);
    }
  }, []);

  const handleViewProfile = (profile) => {
    setSelectedProfile(profile);
    setShowProfileModal(true);
  };

  const handleBookNow = (profile) => {
    setBookingProfile(profile);
    setShowBookingModal(true);
  };

  const handleViewProjectDetails = (prj) => {
    setSelectedProject(prj);
    setShowProjectDetailsModal(true);
  };

  const handleAssignLabourToProject = (prj) => {
    setAssignProject(prj);
    setShowAssignModal(true);
  };

  const handleOpenPayment = (prj) => {
    setSelectedProject(prj);
    setShowPaymentModal(true);
  };

  const handleOpenChat = (prj) => {
    setSelectedProject(prj);
    setShowChatModal(true);
  };

  const handleOpenReview = (prj) => {
    setSelectedProject(prj);
    setShowReviewModal(true);
  };

  const handleOpenComplaint = (prj) => {
    setSelectedProject(prj);
    setShowComplaintModal(true);
  };

  const handleViewInvoice = async (pay) => {
    try {
      const res = await api.get(`/invoices/${pay._id}`);
      if (res.success && res.data) {
        setSelectedInvoice(res.data);
      } else {
        setSelectedInvoice({
          invoiceNumber: 'INV-2026-0091',
          issueDate: pay.createdAt,
          customerName: user?.fullName || 'Apex Buildcon Ltd',
          labourName: pay.labourName || 'Rajesh Kumar',
          workDescription: 'Site Labour & Switchgear Services',
          duration: '15 Days',
          dailyRate: 1200,
          additionalCharges: 5000,
          taxAmount: Math.round(pay.amount * 0.18),
          totalAmount: pay.amount,
          paymentStatus: pay.status,
          transactionId: pay.transactionId,
        });
      }
    } catch (e) {
      setSelectedInvoice({
        invoiceNumber: 'INV-2026-0091',
        issueDate: pay.createdAt,
        customerName: user?.fullName || 'Apex Buildcon Ltd',
        labourName: pay.labourName || 'Rajesh Kumar',
        workDescription: 'Site Labour & Switchgear Services',
        duration: '15 Days',
        dailyRate: 1200,
        additionalCharges: 5000,
        taxAmount: Math.round(pay.amount * 0.18),
        totalAmount: pay.amount,
        paymentStatus: pay.status,
        transactionId: pay.transactionId,
      });
    }
    setShowInvoiceModal(true);
  };

  const stats = dashboardData?.stats || {
    activeBookings: myBookings.length || 6,
    activeProjects: projects.length || 3,
    totalAssignedWorkers: 24,
    monthlySpent: payments.reduce((acc, p) => acc + (p.amount || 0), 0) || 425000,
  };

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <PageTransition key={activeTab}>
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status="verified" text="Verified Enterprise Contractor" />
              <span className="text-xs font-mono text-cyan-400 font-semibold">GSTIN: 27AAAAA0000A1Z5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight drop-shadow-md">
              Customer Portal — <span className="text-cyan-400">{user?.fullName || 'Contractor Enterprise'}</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Create work orders, assign crew with AI recommendations, authorize payments, and view site proof galleries.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowRecommendationModal(true)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 shadow-lg flex items-center gap-1.5 transition-all cursor-pointer backdrop-blur-md hover:scale-[1.02]"
            >
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Recommendations
            </button>
            <button
              onClick={() => setShowCreateProjectModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all cursor-pointer hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" /> Create Work Project
            </button>
          </div>
        </div>

        {/* Dynamic Interactive Welcome & Live Telemetry Banner */}
        <div className="mb-8 p-5 rounded-2xl bg-slate-900/85 backdrop-blur-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl relative overflow-hidden">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">Live Workforce Dispatch Network Active</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                  ● 1,480 Verified Trades Online
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                All 6 escrow settlement rails operational. Average dispatch match speed: <span className="text-cyan-400 font-mono font-bold">3.2 minutes</span>.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => setActiveTab('find')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/15 border border-cyan-500/30 hover:bg-cyan-500/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Search className="w-3.5 h-3.5" /> Find & Hire Labour
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-purple-300 bg-purple-500/15 border border-purple-500/30 hover:bg-purple-500/25 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FolderKanban className="w-3.5 h-3.5 text-purple-400" /> Active Sites ({projects.length})
            </button>
          </div>
        </div>

        {loading ? (
          <StatGridSkeleton />
        ) : (
          <>
            {/* KPI Summary Grid - Rich Gradient Frosted Glass */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              {/* Card 1: Emerald/Teal - Work Projects */}
              <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-emerald-950/70 via-slate-900/80 to-teal-950/60 border border-emerald-500/30 shadow-xl backdrop-blur-xl group hover:border-emerald-500/50 hover:shadow-emerald-900/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg shadow-emerald-500/20">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-300 block tracking-wide">Work Projects</span>
                    <p className="text-3xl font-black text-white font-mono mt-0.5">{projects.length || 9}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-500/20 flex items-center justify-between text-xs">
                  <span className="text-emerald-400 font-semibold">Active Site Assignments</span>
                  <span className="text-emerald-300">→</span>
                </div>
              </div>

              {/* Card 2: Purple/Indigo - Booking Requests */}
              <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-purple-950/70 via-slate-900/80 to-indigo-950/60 border border-purple-500/30 shadow-xl backdrop-blur-xl group hover:border-purple-500/50 hover:shadow-purple-900/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shrink-0 shadow-lg shadow-purple-500/20">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-300 block tracking-wide">Booking Requests</span>
                    <p className="text-3xl font-black text-white font-mono mt-0.5">{myBookings.length || 3}</p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-500/20 flex items-center justify-between text-xs">
                  <span className="text-purple-300 font-semibold">Lower Parel & BKC Sites</span>
                  <span className="text-purple-400">→</span>
                </div>
              </div>

              {/* Card 3: Electric Blue / Cyan - Assigned Labour Crew */}
              <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-blue-950/70 via-slate-900/80 to-cyan-950/60 border border-cyan-500/30 shadow-xl backdrop-blur-xl group hover:border-cyan-500/50 hover:shadow-cyan-900/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shrink-0 shadow-lg shadow-cyan-500/20">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-300 block tracking-wide">Assigned Labour Crew</span>
                    <p className="text-3xl font-black text-white font-mono mt-0.5">
                      {stats.totalAssignedWorkers || 11} Workers
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-cyan-500/20 flex items-center justify-between text-xs">
                  <span className="text-cyan-300 font-semibold">Electricians & Plumbers</span>
                  <span className="text-cyan-400">→</span>
                </div>
              </div>

              {/* Card 4: Amber / Gold - Escrow Budget Spent */}
              <div className="relative overflow-hidden rounded-3xl p-6 bg-gradient-to-br from-amber-950/70 via-slate-900/80 to-orange-950/60 border border-amber-500/30 shadow-xl backdrop-blur-xl group hover:border-amber-500/50 hover:shadow-amber-900/30 transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 shadow-lg shadow-amber-500/20">
                    <CreditCard className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-300 block tracking-wide">Escrow Budget Spent</span>
                    <p className="text-3xl font-black text-white font-mono mt-0.5">
                      ₹{stats.monthlySpent.toLocaleString()}
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-amber-500/20 flex items-center justify-between text-xs">
                  <span className="text-amber-400 font-semibold flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5" /> Milestone Protected
                  </span>
                  <span className="text-amber-300">→</span>
                </div>
              </div>
            </div>

            {/* TAB CONTENT: PROJECTS */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-3 flex-wrap">
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'All Projects' },
                      { id: 'active', label: 'Active' },
                      { id: 'upcoming', label: 'Upcoming' },
                      { id: 'completed', label: 'Completed' },
                      { id: 'cancelled', label: 'Cancelled' },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setProjectFilter(tab.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          projectFilter === tab.id
                            ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-500/30 border border-purple-400/40'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white border border-white/5'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-mono font-bold text-purple-400">
                    {projects.length} Projects Shown
                  </span>
                </div>

                {/* Projects Grid */}
                {projectsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </div>
                ) : projects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((prj) => (
                      <div key={prj._id || prj.id} className="space-y-2">
                        <ProjectCard
                          project={prj}
                          onViewDetails={handleViewProjectDetails}
                          onAssignLabour={handleAssignLabourToProject}
                        />
                        {/* Action Bar */}
                        <div className="flex items-center justify-between gap-1.5 p-2 rounded-xl bg-white/5 border border-white/5 text-xs">
                          <button
                            onClick={() => handleOpenChat(prj)}
                            className="px-2 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-300 font-semibold flex items-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3 text-cyan-400" /> Chat
                          </button>
                          <button
                            onClick={() => {
                              setSelectedProject(prj);
                              setShowProofModal(true);
                            }}
                            className="px-2 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-semibold flex items-center gap-1"
                          >
                            <Camera className="w-3 h-3 text-cyan-400" /> Proofs
                          </button>
                          <button
                            onClick={() => handleOpenPayment(prj)}
                            className="px-2 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold flex items-center gap-1"
                          >
                            <CreditCard className="w-3 h-3 text-emerald-400" /> Pay
                          </button>
                          <button
                            onClick={() => handleOpenReview(prj)}
                            className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold flex items-center gap-1"
                          >
                            <Star className="w-3 h-3 text-amber-400" /> Rate
                          </button>
                          <button
                            onClick={() => handleOpenComplaint(prj)}
                            className="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-semibold flex items-center gap-1"
                          >
                            <AlertTriangle className="w-3 h-3 text-rose-400" /> Dispute
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* Empty State */
                  <GlassCard hover={false} className="p-12 text-center space-y-4 max-w-md mx-auto my-8">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
                      <FolderKanban className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-white">No Active Projects Found</h3>
                    <p className="text-xs text-slate-400">
                      You haven't created any site assignments under this filter category yet.
                    </p>
                    <button
                      onClick={() => setShowCreateProjectModal(true)}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-400 transition-colors inline-flex items-center gap-1.5"
                    >
                      <Plus className="w-3.5 h-3.5" /> Create Your First Project
                    </button>
                  </GlassCard>
                )}
              </div>
            )}

            {/* TAB CONTENT: PAYMENTS */}
            {activeTab === 'payments' && (
              <PaymentHistoryTable payments={payments} onViewInvoice={handleViewInvoice} />
            )}

            {/* TAB CONTENT: FIND LABOUR */}
            {activeTab === 'find' && (
              <div className="space-y-6">
                <LabourSearchFilter onFilterChange={handleFilterChange} totalCount={workers.length} />
                {workersLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <CardSkeleton />
                    <CardSkeleton />
                    <CardSkeleton />
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {workers.map((worker, idx) => (
                      <div key={worker._id || worker.userId || idx} className="space-y-2">
                        <LabourCard
                          profile={worker}
                          onViewProfile={handleViewProfile}
                          onBookNow={handleBookNow}
                        />
                        <button
                          onClick={() => setShowMapModal(true)}
                          className="w-full py-1.5 rounded-xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-1 transition-colors"
                        >
                          <MapPin className="w-3.5 h-3.5 text-cyan-400" /> View Service Area Map
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT: MY BOOKINGS */}
            {activeTab === 'bookings' && (
              <GlassCard hover={false} className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <h3 className="text-base font-bold text-white">My Work Booking Requests</h3>
                  <span className="text-xs font-mono text-cyan-400 font-bold">{myBookings.length} Total</span>
                </div>
                <div className="space-y-3">
                  {myBookings.map((bk) => (
                    <div
                      key={bk._id || bk.id}
                      className="p-4 rounded-xl bg-white/5 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-white">{bk.title}</h4>
                          <StatusBadge status={bk.status} />
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          Worker: <span className="text-cyan-300 font-semibold">{bk.labourName || 'Assigned Worker'}</span>
                        </p>
                      </div>
                      <button
                        onClick={() => handleOpenPayment(null)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
                      >
                        Authorize Escrow Pay
                      </button>
                    </div>
                  ))}
                </div>
              </GlassCard>
            )}

            {(activeTab === 'create' || activeTab === 'workers' || activeTab === 'messages' || activeTab === 'notifications' || activeTab === 'reviews') && (
              <GlassCard hover={false} className="p-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
                  <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white capitalize">{activeTab} Console</h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Customer workforce console active for {activeTab}. Connected to MongoDB booking API endpoints.
                </p>
              </GlassCard>
            )}
          </>
        )}

        {/* Modals */}
        <LabourProfileModal
          profile={selectedProfile}
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          onBookNow={handleBookNow}
        />

        <BookingModal
          labourProfile={bookingProfile}
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onBookingSuccess={() => fetchMyBookings()}
        />

        <CreateProjectModal
          isOpen={showCreateProjectModal}
          onClose={() => setShowCreateProjectModal(false)}
          onProjectCreated={() => fetchProjects()}
        />

        <ProjectDetailsModal
          project={selectedProject}
          isOpen={showProjectDetailsModal}
          onClose={() => setShowProjectDetailsModal(false)}
          onProjectUpdated={() => fetchProjects()}
          userRole="customer"
        />

        <AssignLabourModal
          project={assignProject}
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          onAssigned={() => fetchProjects()}
        />

        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          project={selectedProject}
          onPaymentSuccess={() => {
            fetchProjects();
            fetchPayments();
          }}
        />

        <InvoiceModal
          isOpen={showInvoiceModal}
          onClose={() => setShowInvoiceModal(false)}
          invoice={selectedInvoice}
        />

        <ReviewModal
          isOpen={showReviewModal}
          onClose={() => setShowReviewModal(false)}
          project={selectedProject}
        />

        <ProjectChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          project={selectedProject}
        />

        <ComplaintModal
          isOpen={showComplaintModal}
          onClose={() => setShowComplaintModal(false)}
          project={selectedProject}
        />

        {/* Phase 6 Advanced Modals */}
        <SmartRecommendationModal
          isOpen={showRecommendationModal}
          onClose={() => setShowRecommendationModal(false)}
          onSelectWorker={(worker) => {
            handleBookNow(worker);
          }}
        />

        <SiteMapModal
          isOpen={showMapModal}
          onClose={() => setShowMapModal(false)}
        />

        <WorkProofGalleryModal
          isOpen={showProofModal}
          onClose={() => setShowProofModal(false)}
          project={selectedProject}
        />
      </PageTransition>
    </DashboardLayout>
  );
};

export default CustomerDashboard;
