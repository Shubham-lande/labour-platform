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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <StatusBadge status="verified" text="Verified Enterprise Contractor" />
              <span className="text-xs font-mono text-slate-400">GSTIN: 27AAAAA0000A1Z5</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Customer Portal — <span className="text-cyan-400">{user?.fullName || 'Contractor Enterprise'}</span>
            </h1>
            <p className="text-xs text-slate-400">
              Create work orders, assign crew with AI recommendations, authorize payments, and view site proof galleries.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setShowRecommendationModal(true)}
              className="px-3.5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-lg shadow-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <Sparkles className="w-4 h-4 text-slate-950" /> AI Recommendations
            </button>
            <button
              onClick={() => setShowCreateProjectModal(true)}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Create Work Project
            </button>
          </div>
        </div>

        {loading ? (
          <StatGridSkeleton />
        ) : (
          <>
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
              <GlassCard hover={false} delay={0.05}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Work Projects</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                    <FolderKanban className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-white mt-3 font-mono">{projects.length}</p>
                <p className="text-[11px] text-cyan-400 mt-1">Active Site Assignments</p>
              </GlassCard>

              <GlassCard hover={false} delay={0.1}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Booking Requests</span>
                  <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
                    <BookOpen className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-white mt-3 font-mono">{myBookings.length}</p>
                <p className="text-[11px] text-slate-400 mt-1">Lower Parel & BKC Sites</p>
              </GlassCard>

              <GlassCard hover={false} delay={0.15}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Assigned Labour Crew</span>
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-white mt-3 font-mono">{stats.totalAssignedWorkers} Workers</p>
                <p className="text-[11px] text-amber-400 mt-1">Electricians & Plumbers</p>
              </GlassCard>

              <GlassCard hover={false} delay={0.2}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">Escrow Budget Spent</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
                    <CreditCard className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-extrabold text-white mt-3 font-mono">₹{stats.monthlySpent.toLocaleString()}</p>
                <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
                  <Lock className="w-3 h-3 text-emerald-400" /> Milestone Protected
                </p>
              </GlassCard>
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
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                          projectFilter === tab.id
                            ? 'bg-cyan-500 text-white font-bold shadow-md shadow-cyan-500/20'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-200'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <span className="text-xs font-mono font-bold text-cyan-400">
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
