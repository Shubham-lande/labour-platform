import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import GlassCard from '../../components/common/GlassCard';
import StatusBadge from '../../components/common/StatusBadge';
import {
  Shield,
  HardHat,
  Building2,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Lock,
  Users,
  Award,
  Globe2,
} from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 overflow-x-hidden selection:bg-cyan-500 selection:text-white">
      {/* Top Glass Navbar */}
      <nav className="h-20 px-6 lg:px-16 glass-panel border-b border-white/10 sticky top-0 z-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
              Labour<span className="text-cyan-400">Hub</span>
            </span>
            <span className="text-[10px] text-cyan-400/80 font-mono tracking-widest uppercase">
              Enterprise Workforce OS
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-300">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Platform Capabilities</a>
          <a href="#roles" className="hover:text-cyan-400 transition-colors">Workforce Roles</a>
          <a href="#security" className="hover:text-cyan-400 transition-colors">Enterprise Security</a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all border border-transparent hover:border-white/10"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2"
          >
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 lg:px-16 max-w-7xl mx-auto text-center">
        {/* Ambient Glow background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/20 to-blue-600/10 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-bold shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Enterprise-Grade Labour Management Platform
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-tight">
            Seamless On-Demand <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Workforce Booking & Management
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Connect certified blue-collar professionals with enterprise contractors. Features instant role-based access, attendance tracking, escrow payouts, and automated KYC verification.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 shadow-xl shadow-cyan-500/30 transition-all flex items-center justify-center gap-2 group"
            >
              Start Free Enterprise Trial{' '}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-extrabold text-slate-200 glass-card hover:border-cyan-500/40 transition-all"
            >
              Explore Live Demo Portals
            </Link>
          </div>
        </motion.div>

        {/* Platform Stat Banner */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20 relative z-10 text-left">
          <GlassCard hover={false} delay={0.1}>
            <p className="text-3xl font-extrabold text-cyan-400 font-mono">12,400+</p>
            <p className="text-xs text-slate-400 font-semibold mt-1">Verified Skilled Workers</p>
          </GlassCard>
          <GlassCard hover={false} delay={0.2}>
            <p className="text-3xl font-extrabold text-emerald-400 font-mono">₹45.2 Cr</p>
            <p className="text-xs text-slate-400 font-semibold mt-1">Escrow Payroll Processed</p>
          </GlassCard>
          <GlassCard hover={false} delay={0.3}>
            <p className="text-3xl font-extrabold text-blue-400 font-mono">99.8%</p>
            <p className="text-xs text-slate-400 font-semibold mt-1">On-Time Shift Fulfillment</p>
          </GlassCard>
          <GlassCard hover={false} delay={0.4}>
            <p className="text-3xl font-extrabold text-purple-400 font-mono">3,800+</p>
            <p className="text-xs text-slate-400 font-semibold mt-1">Infrastructure Contractors</p>
          </GlassCard>
        </div>
      </section>

      {/* Role Selection Pathways */}
      <section id="roles" className="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-2">
          <StatusBadge status="active" text="Tailored Role Dashboards" />
          <h2 className="text-3xl font-bold text-white tracking-tight">Built For Every Enterprise Stakeholder</h2>
          <p className="text-sm text-slate-400">Select your role to explore dedicated workflow controls</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Labour Card */}
          <GlassCard className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
                <HardHat className="w-6 h-6 text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Skilled Worker / Labour</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Accept high-paying job requests, track daily site attendance, manage earnings, and receive instant direct payments.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Daily/Hourly Job Booking</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Attendance GPS Check-in</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-amber-400" /> Instant Bank Payroll</li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 rounded-xl text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 text-center block transition-all"
            >
              Join as Skilled Worker
            </Link>
          </GlassCard>

          {/* Customer Card */}
          <GlassCard className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-4">
                <Building2 className="w-6 h-6 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Customer / Contractor</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Hire certified electrician, plumber, mason, and general labor crews. Manage project sites with automated escrow protection.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> On-Demand Crew Hiring</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Escrow Milestone Payments</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" /> Real-time Project Tracking</li>
              </ul>
            </div>
            <Link
              to="/register"
              className="w-full py-3 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 text-center block transition-all"
            >
              Hire Skilled Labour
            </Link>
          </GlassCard>

          {/* Admin Card */}
          <GlassCard className="space-y-4 flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-bold text-white">Enterprise Platform Admin</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Full platform oversight. Audit KYC verification queues, resolve worker disputes, manage payouts, and review system analytics.
              </p>
              <ul className="mt-4 space-y-2 text-xs text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> KYC Verification Queue</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> System Dispute Resolution</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-purple-400" /> Full Audit Log Analytics</li>
              </ul>
            </div>
            <Link
              to="/login"
              className="w-full py-3 rounded-xl text-xs font-bold text-purple-300 bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-center block transition-all"
            >
              Access Admin Portal
            </Link>
          </GlassCard>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6 lg:px-16 text-center text-xs text-slate-500">
        <p>© 2026 LabourHub Enterprise Platform. All rights reserved. Designed for MNC workforce operations.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
