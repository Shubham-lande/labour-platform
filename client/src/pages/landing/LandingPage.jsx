import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
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
  MapPin,
  Clock,
  CreditCard,
  Star,
  ChevronDown,
  Activity,
  Calculator,
  Radio,
  Sliders,
  DollarSign,
  TrendingUp,
  FileCheck,
  Cpu,
  Layers,
  Compass,
  CheckCircle,
  Play,
  Flame,
  Check,
} from 'lucide-react';

const CITIES = [
  { id: 'mumbai', name: 'Mumbai BKC & Thane', coords: '19.0760° N, 72.8777° E', workersOnline: 540, speed: '1.2 mins' },
  { id: 'bangalore', name: 'Bangalore Whitefield', coords: '12.9716° N, 77.5946° E', workersOnline: 620, speed: '0.9 mins' },
  { id: 'pune', name: 'Pune Hinjewadi IT Park', coords: '18.5204° N, 73.8567° E', workersOnline: 410, speed: '1.1 mins' },
  { id: 'delhi', name: 'Delhi NCR Cyber City', coords: '28.7041° N, 77.1025° E', workersOnline: 580, speed: '1.4 mins' },
  { id: 'hyderabad', name: 'Hyderabad HITEC City', coords: '17.3850° N, 78.4867° E', workersOnline: 390, speed: '1.0 mins' },
];

const TRADE_RATES = {
  electrician: { name: 'Master Electrician', dailyRate: 950, hourlyRate: 140, icon: Zap, matchTime: '2.5 mins', glow: 'from-amber-500 to-orange-600' },
  plumber: { name: 'Hydraulic & Pipe Tech', dailyRate: 900, hourlyRate: 130, icon: HardHat, matchTime: '3.2 mins', glow: 'from-cyan-500 to-blue-600' },
  mason: { name: 'Senior Concrete & Mason', dailyRate: 850, hourlyRate: 120, icon: Building2, matchTime: '2.0 mins', glow: 'from-emerald-500 to-teal-600' },
  welder: { name: 'Structural TIG/MIG Welder', dailyRate: 1100, hourlyRate: 160, icon: Flame, matchTime: '4.1 mins', glow: 'from-fuchsia-500 to-rose-600' },
  hvac: { name: 'Industrial HVAC Specialist', dailyRate: 1050, hourlyRate: 150, icon: Cpu, matchTime: '3.5 mins', glow: 'from-violet-500 to-indigo-600' },
  helper: { name: 'Certified Site Operative', dailyRate: 650, hourlyRate: 90, icon: Users, matchTime: '1.2 mins', glow: 'from-blue-500 to-indigo-600' },
};

const SAMPLE_WORKERS = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    skill: 'Master Industrial Electrician',
    rating: 4.95,
    reviews: 184,
    shifts: 340,
    location: 'Pune Tech Zone',
    distance: '1.4 km',
    dailyRate: '₹950/day',
    verified: true,
    available: true,
    skills: ['High Voltage Panels', 'Solar Grid Fitout', 'DB Automation', 'Safety Grade A'],
    avatarBg: 'bg-gradient-to-tr from-amber-500 to-orange-600',
  },
  {
    id: 2,
    name: 'Vikramaditya Singh',
    skill: 'Senior Concrete & Masonry Specialist',
    rating: 4.9,
    reviews: 120,
    shifts: 215,
    location: 'Bangalore Phase 2',
    distance: '2.1 km',
    dailyRate: '₹850/day',
    verified: true,
    available: true,
    skills: ['RCC Casting', 'Laser Leveling', 'Structural Brickwork', 'Waterproofing'],
    avatarBg: 'bg-gradient-to-tr from-cyan-500 to-blue-600',
  },
  {
    id: 3,
    name: 'Mohd. Imran Khan',
    skill: 'Certified Precision Welder',
    rating: 4.98,
    reviews: 96,
    shifts: 180,
    location: 'Mumbai Port Hub',
    distance: '0.8 km',
    dailyRate: '₹1,100/day',
    verified: true,
    available: true,
    skills: ['TIG / MIG Argon', 'Truss Fabrication', 'Hydro-Test Certified', 'Heavy Rigging'],
    avatarBg: 'bg-gradient-to-tr from-rose-500 to-amber-600',
  },
  {
    id: 4,
    name: 'Sunil Sharma',
    skill: 'Commercial Plumbing & HVAC Lines',
    rating: 4.88,
    reviews: 142,
    shifts: 290,
    location: 'Gurugram Sector 43',
    distance: '2.8 km',
    dailyRate: '₹900/day',
    verified: true,
    available: false,
    skills: ['CPVC / UPVC', 'Hydraulic Piping', 'Pump Stations', 'Firefight Sprinklers'],
    avatarBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600',
  },
];

const LIVE_STREAM_EVENTS = [
  '⚡ Metro Express Infra deployed 24 Certified Masons • Thane Mega Site',
  '🔒 ₹95,000 Milestone Escrow secured for Lodha Bellissimo Electrical Phase 3',
  '🌟 Rajesh K. earned 5-Star Rating for High-Voltage Switchgear Installation',
  '🟢 48 Verified Structural Welders auto-checked in via GPS Radar at Pune Hub',
  '💳 Instant direct UPI Escrow ₹64,200 disbursed to 8 Plumbers in 4.2 seconds',
];

const LandingPage = () => {
  const [selectedCity, setSelectedCity] = useState(CITIES[0]);
  const [activeWorkerIdx, setActiveWorkerIdx] = useState(0);

  const [selectedTrade, setSelectedTrade] = useState('electrician');
  const [teamSize, setTeamSize] = useState(6);
  const [projectDays, setProjectDays] = useState(14);

  const [activeTab, setActiveTab] = useState('radar');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchSuccess, setDispatchSuccess] = useState(false);

  const [streamIndex, setStreamIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const streamTimer = setInterval(() => {
      setStreamIndex((prev) => (prev + 1) % LIVE_STREAM_EVENTS.length);
    }, 4000);

    const workerCycleTimer = setInterval(() => {
      setActiveWorkerIdx((prev) => (prev + 1) % SAMPLE_WORKERS.length);
    }, 5000);

    return () => {
      clearInterval(streamTimer);
      clearInterval(workerCycleTimer);
    };
  }, []);

  const handleSimulateDispatch = () => {
    setIsDispatching(true);
    setDispatchSuccess(false);
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchSuccess(true);
      setTimeout(() => setDispatchSuccess(false), 5000);
    }, 1600);
  };

  const trade = TRADE_RATES[selectedTrade];
  const totalWages = trade.dailyRate * teamSize * projectDays;
  const escrowGuarantee = Math.round(totalWages * 1.05);
  const activeWorker = SAMPLE_WORKERS[activeWorkerIdx];

  return (
    <div className="min-h-screen bg-hero-image text-slate-100 overflow-x-hidden selection:bg-indigo-500 selection:text-white relative">
      {/* Top Glass Navbar */}
      <nav className="h-20 px-6 lg:px-16 glass-panel sticky top-0 z-50 flex items-center justify-between shadow-2xl backdrop-blur-2xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 via-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/25">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-extrabold tracking-tight text-white block leading-none">
              Labour<span className="text-cyan-400">Hub</span>
            </span>
            <span className="text-[10px] text-cyan-300 font-mono tracking-widest uppercase font-bold flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Enterprise Workforce OS
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-200">
          <a href="#radar-terminal" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400" /> Live Dispatch Radar
          </a>
          <a href="#calculator" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5 text-amber-400" /> Cost Calculator
          </a>
          <a href="#capabilities" className="hover:text-cyan-400 transition-colors">
            Capabilities
          </a>
          <a href="#talent-matrix" className="hover:text-cyan-400 transition-colors">
            Certified Labour
          </a>
          <a href="#faq" className="hover:text-cyan-400 transition-colors">
            Enterprise FAQ
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-white/10 transition-all border border-white/10"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-cyan-500/25 transition-all flex items-center gap-2 group hover:scale-[1.02]"
          >
            Get Started Free <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </nav>

      {/* Live Activity Telemetry Bar */}
      <div className="bg-slate-950/80 border-b border-white/10 py-2.5 px-6 text-center text-xs overflow-hidden backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 font-mono">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold uppercase tracking-wider text-[11px] bg-cyan-950/60 px-2.5 py-0.5 rounded-md border border-cyan-500/40">
            <Activity className="w-3 h-3 animate-spin text-cyan-400" /> LIVE NETWORK
          </span>
          <AnimatePresence mode="wait">
            <motion.span
              key={streamIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-slate-200 truncate font-medium"
            >
              {LIVE_STREAM_EVENTS[streamIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-cyan-500/40 bg-slate-900/80 text-cyan-300 text-xs font-bold shadow-lg backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Enterprise Workforce OS & Automated Escrow</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.14]">
              Deploy Certified <br />
              <span className="shimmer-headline">
                Blue-Collar Workforce
              </span>{' '}
              In Minutes.
            </h1>

            <p className="text-base sm:text-lg text-slate-200 max-w-xl font-normal leading-relaxed drop-shadow-md">
              Connect certified electricians, masons, plumbers, and structural crews with automated GPS geo-fenced attendance, milestone escrow protection, and instant KYC verification.
            </p>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/15 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-md">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Aadhaar & ITI Skill Verified
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/15 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-md">
                <Shield className="w-4 h-4 text-cyan-400" /> 100% Escrow Milestone Payouts
              </div>
              <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 border border-white/15 text-xs font-semibold text-slate-200 shadow-sm backdrop-blur-md">
                <Radio className="w-4 h-4 text-amber-400" /> 50m GPS Geo-Radius Sync
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-4">
              <Link
                to="/register"
                className="px-8 py-4 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-xl shadow-cyan-500/25 transition-all flex items-center justify-center gap-2 group hover:scale-[1.02]"
              >
                Start Free Enterprise Trial
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#radar-terminal"
                className="px-8 py-4 rounded-2xl text-sm font-bold text-slate-200 bg-slate-900/80 border border-white/15 hover:border-cyan-400/40 hover:bg-slate-800/80 transition-all flex items-center justify-center gap-2 shadow-lg backdrop-blur-md"
              >
                <Play className="w-3.5 h-3.5 text-cyan-400" />
                Live Dispatch Simulator
              </a>
            </div>
          </motion.div>

          {/* Hero Right: Live Dispatch Terminal */}
          <motion.div
            id="radar-terminal"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5"
          >
            <div className="glow-border-card p-6 shadow-2xl relative overflow-hidden bg-slate-950/85 backdrop-blur-xl">
              {/* Terminal Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center">
                    <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">City Dispatch Radar</h3>
                    <p className="text-[10px] text-cyan-400 font-mono">Live GPS Telemetry</p>
                  </div>
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                  {selectedCity.workersOnline} ONLINE
                </span>
              </div>

              {/* City Switcher */}
              <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
                {CITIES.map((city) => {
                  const isCityActive = city.id === selectedCity.id;
                  return (
                    <button
                      key={city.id}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                        isCityActive
                          ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md'
                          : 'bg-white/5 text-slate-400 hover:bg-white/10'
                      }`}
                    >
                      {city.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>

              {/* Radar Screen Visual */}
              <div className="relative h-48 rounded-2xl bg-slate-950/90 border border-cyan-500/30 flex items-center justify-center overflow-hidden mb-4 shadow-inner">
                <div className="absolute w-44 h-44 rounded-full border border-cyan-500/20" />
                <div className="absolute w-32 h-32 rounded-full border border-cyan-500/30" />
                <div className="absolute w-20 h-20 rounded-full border border-cyan-500/40" />
                <div className="absolute w-4 h-4 rounded-full bg-cyan-500/40 animate-ping" />
                <div className="absolute w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-md shadow-cyan-400" />

                {/* Radar Sweep Line */}
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/25 via-transparent to-transparent animate-radar origin-center pointer-events-none" />

                {/* Blips */}
                {SAMPLE_WORKERS.map((worker, idx) => {
                  const isSelected = idx === activeWorkerIdx;
                  const positions = [
                    { top: '25%', left: '30%' },
                    { top: '65%', left: '68%' },
                    { top: '22%', left: '72%' },
                    { top: '68%', left: '26%' },
                  ];
                  const pos = positions[idx % positions.length];
                  return (
                    <motion.div
                      key={worker.id}
                      animate={{ scale: isSelected ? [1, 1.25, 1] : 1 }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="absolute z-10 cursor-pointer"
                      style={{ top: pos.top, left: pos.left }}
                      onClick={() => setActiveWorkerIdx(idx)}
                    >
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-white shadow-md ${
                          isSelected
                            ? 'bg-cyan-400 ring-4 ring-cyan-500/40'
                            : 'bg-slate-700 border border-slate-600'
                        }`}
                      >
                        {idx + 1}
                      </div>
                    </motion.div>
                  );
                })}

                <div className="absolute bottom-2.5 left-3 text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 bg-slate-900/90 px-2.5 py-0.5 rounded-md backdrop-blur-sm border border-slate-800">
                  <MapPin className="w-3 h-3 text-cyan-400" /> {selectedCity.coords}
                </div>
              </div>

              {/* Matched Worker Card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeWorker.id}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl ${activeWorker.avatarBg} flex items-center justify-center font-bold text-white text-sm shadow-md`}
                      >
                        {activeWorker.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-white">{activeWorker.name}</h4>
                          <span className="w-3.5 h-3.5 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[9px] font-bold">
                            ✓
                          </span>
                        </div>
                        <p className="text-[11px] text-cyan-400 font-semibold">{activeWorker.skill}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-extrabold text-emerald-400">{activeWorker.dailyRate}</span>
                      <p className="text-[10px] text-slate-400">{activeWorker.distance} to site</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1.5 border-t border-white/5 text-[11px]">
                    <span className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {activeWorker.rating} ({activeWorker.reviews} reviews)
                    </span>
                    <span className="text-emerald-400 font-semibold">● Ready for Dispatch</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Action Button */}
              <div className="mt-3">
                {dispatchSuccess ? (
                  <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" /> Crew Dispatched to Site! ETA: 8 Mins
                  </div>
                ) : (
                  <button
                    onClick={handleSimulateDispatch}
                    disabled={isDispatching}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isDispatching ? (
                      <span className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                        Routing GPS Coordinates & Escrow Lock...
                      </span>
                    ) : (
                      <>
                        Simulate 1-Click Worker Dispatch →
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Real-time Platform Metrics Bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 text-left">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-2xl sm:text-3xl font-black text-cyan-400 font-mono">16,800+</p>
              <Users className="w-5 h-5 text-cyan-400/80" />
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-1">Verified Skilled Workers</p>
            <p className="text-[10px] text-emerald-400 font-bold mt-0.5">↑ +24% MoM Deployment</p>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">₹68.5 Cr</p>
              <CreditCard className="w-5 h-5 text-emerald-400/80" />
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-1">Escrow Payroll Settled</p>
            <p className="text-[10px] text-slate-400 font-bold mt-0.5">100% On-Time Clearance</p>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-2xl sm:text-3xl font-black text-blue-400 font-mono">99.9%</p>
              <Activity className="w-5 h-5 text-blue-400/80" />
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-1">Geo-Fenced Shift Precision</p>
            <p className="text-[10px] text-cyan-400 font-bold mt-0.5">&lt; 3.8 min match latency</p>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-2xl sm:text-3xl font-black text-purple-400 font-mono">4,890+</p>
              <Building2 className="w-5 h-5 text-purple-400/80" />
            </div>
            <p className="text-xs text-slate-300 font-semibold mt-1">Active Site Contractors</p>
            <p className="text-[10px] text-purple-400 font-bold mt-0.5">Pan-India Coverage</p>
          </div>
        </div>
      </section>

      {/* Interactive Workforce & Escrow Budget Estimator */}
      <section id="calculator" className="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="glass-card p-8 lg:p-12 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40 font-mono">
              WORKFORCE BUDGET CALCULATOR
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
              Estimate Site Crew & Escrow Allocation
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Customize trade requirements, team size, and project duration to view transparent wages and escrow reserves.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <label className="text-xs font-bold text-cyan-300 uppercase tracking-wider block mb-3 font-mono">
                  1. Select Specialized Trade Requirement
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {Object.entries(TRADE_RATES).map(([key, item]) => {
                    const isSelected = selectedTrade === key;
                    const Icon = item.icon;
                    return (
                      <button
                        key={key}
                        onClick={() => setSelectedTrade(key)}
                        className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-cyan-500/25 border-cyan-400 text-white shadow-lg shadow-cyan-500/20'
                            : 'bg-white/5 border-white/10 text-slate-300 hover:border-white/20'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`} />
                        <p className="text-xs font-bold truncate text-white">{item.name}</p>
                        <p className="text-[10px] text-cyan-300 font-mono">₹{item.dailyRate}/day</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300 font-mono">
                    <span>2. Team Size</span>
                    <span className="text-cyan-400 text-sm font-bold">{teamSize} Specialists</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={teamSize}
                    onChange={(e) => setTeamSize(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1 worker</span>
                    <span>25</span>
                    <span>50 workers</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold text-slate-300 font-mono">
                    <span>3. Shift Duration</span>
                    <span className="text-cyan-400 text-sm font-bold">{projectDays} Days</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="90"
                    value={projectDays}
                    onChange={(e) => setProjectDays(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                    <span>1 day</span>
                    <span>45 days</span>
                    <span>90 days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Cost Summary Card */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-cyan-500/30 text-white space-y-5 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold text-slate-300 uppercase font-mono">Budget Breakdown</span>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                  Dispatch: {trade.matchTime}
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between text-slate-300">
                  <span>Daily Base Wage:</span>
                  <span className="font-mono text-white">₹{trade.dailyRate}/specialist</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Total Shift Hours:</span>
                  <span className="font-mono text-white">{teamSize * 8 * projectDays} Man-Hours</span>
                </div>
                <div className="flex justify-between text-slate-300">
                  <span>Gross Shift Wages:</span>
                  <span className="font-mono text-white">₹{totalWages.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold pt-2 border-t border-white/10">
                  <span className="flex items-center gap-1.5">
                    <Shield className="w-4 h-4 text-emerald-400" /> Milestone Escrow Total:
                  </span>
                  <span className="font-mono text-lg font-black text-emerald-400">
                    ₹{escrowGuarantee.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Link
                to="/register"
                className="w-full py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-600 via-cyan-500 to-blue-600 hover:from-indigo-500 hover:to-blue-500 shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all"
              >
                Hire {teamSize}-Person Crew Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Capabilities Tabs */}
      <section id="capabilities" className="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40 font-mono">
            CORE PLATFORM CAPABILITIES
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">Zero-Friction Enterprise Protocols</h2>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center gap-2 mb-10 overflow-x-auto pb-2">
          {[
            { id: 'radar', label: '1. GPS Geo-Radius Attendance', icon: MapPin },
            { id: 'escrow', label: '2. Escrow Milestone Contracts', icon: Shield },
            { id: 'kyc', label: '3. Biometric KYC Vault', icon: FileCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-lg'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10 border border-white/10'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab Content Panels */}
        <div className="glass-card p-8 rounded-3xl">
          {activeTab === 'radar' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-bold">Patented Geo-Radius Engine</span>
                <h3 className="text-2xl font-bold text-white">Automated Site Attendance With GPS Geo-Fencing</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Workers can only check in when their mobile GPS verifies they are physically within the 50-meter project perimeter. Eliminate timesheet fraud and automate accurate daily wage disbursements.
                </p>
                <div className="space-y-2 text-xs text-slate-200 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Real-time biometric timestamps & GPS sync
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Auto-calculated overtime with contractor signoff
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Live site headcount dashboard with daily reports
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-cyan-500/30 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <span className="text-xs font-mono text-cyan-400 font-bold">SITE RADIUS: 50m (ACTIVE)</span>
                  <span className="text-xs text-emerald-400 font-bold">● 24/24 Verified on Site</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-white font-bold">Rajesh Kumar (Electrician)</span>
                    <span className="text-emerald-400 font-mono font-bold">08:00 AM • Verified in Perimeter</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-white font-bold">Vikram Singh (Mason)</span>
                    <span className="text-emerald-400 font-mono font-bold">08:02 AM • Verified in Perimeter</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <span className="text-white font-bold">Mohd Imran (Welder)</span>
                    <span className="text-emerald-400 font-mono font-bold">08:05 AM • Verified in Perimeter</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'escrow' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">Zero Payment Risk</span>
                <h3 className="text-2xl font-bold text-white">Smart Milestone Escrow Payouts</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Contractors deposit funds into secure RBI-compliant escrow before work begins. Payments release automatically upon contractor photo proof approval, protecting both contractor budgets and worker wages.
                </p>
                <div className="space-y-2 text-xs text-slate-200 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Milestone 1, 2 & Final completion gates
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> Instant direct UPI/IMPS bank transfers
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> GST compliant invoices generated automatically
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-emerald-500/30 space-y-4">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-300 font-bold">Project Milestone Progress</span>
                  <span className="text-emerald-400 font-mono font-bold">65% Completed</span>
                </div>
                <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-[65%]" />
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-[11px] pt-2">
                  <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold">
                    Phase 1 (Paid)
                  </div>
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold">
                    Phase 2 (In Escrow)
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 text-slate-400 font-bold">Phase 3 (Pending)</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'kyc' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-4">
                <span className="text-xs font-mono text-purple-400 uppercase tracking-wider font-bold">Zero Impersonation</span>
                <h3 className="text-2xl font-bold text-white">Biometric & Govt ID Verification</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Every worker on LabourHub undergoes multi-layer identity verification, trade license verification, and safety protocol accreditation prior to shift dispatch.
                </p>
                <div className="space-y-2 text-xs text-slate-200 font-medium">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" /> Aadhaar OTP verification & Face match
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" /> NSDC / ITI Trade Certificate Validation
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-purple-400" /> Background verified safety rating score
                  </div>
                </div>
              </div>
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-purple-500/30 space-y-3 text-xs">
                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/15 border border-purple-500/30">
                  <span className="font-bold text-white">Govt. Aadhaar Verification</span>
                  <span className="text-emerald-400 font-bold">✓ 100% Passed</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/15 border border-purple-500/30">
                  <span className="font-bold text-white">Trade Skill Assessment</span>
                  <span className="text-emerald-400 font-bold">✓ Grade A (Master)</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-purple-500/15 border border-purple-500/30">
                  <span className="font-bold text-white">Safety Protocol Clearance</span>
                  <span className="text-emerald-400 font-bold">✓ Certified</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Certified Labour Showcase Grid */}
      <section id="talent-matrix" className="py-20 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40 font-mono">
            VERIFIED TALENT POOL
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">Top-Rated Available Specialists</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_WORKERS.map((worker) => (
            <div key={worker.id} className="glass-card p-6 space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div
                    className={`w-12 h-12 rounded-2xl ${worker.avatarBg} flex items-center justify-center font-bold text-white text-lg shadow-lg`}
                  >
                    {worker.name[0]}
                  </div>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      worker.available
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {worker.available ? '🟢 Available' : '🟡 On Site'}
                  </span>
                </div>

                <div className="mt-3">
                  <h4 className="text-base font-bold text-white">{worker.name}</h4>
                  <p className="text-xs text-cyan-400 font-semibold">{worker.skill}</p>
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" /> {worker.rating}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span>{worker.shifts} Shifts</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {worker.skills.slice(0, 3).map((sk, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-slate-300 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">Day Wage</span>
                  <span className="text-xs font-bold text-white">{worker.dailyRate}</span>
                </div>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 transition-all"
                >
                  Book Specialist
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enterprise FAQ Accordion */}
      <section id="faq" className="py-20 px-6 lg:px-16 max-w-4xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40 font-mono">
            ENTERPRISE FAQ
          </span>
          <h2 className="text-3xl font-black text-white tracking-tight">Everything You Need To Know</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does the Escrow Payment protection work?',
              a: 'When you book a worker or launch a project, the required amount is safely locked in our RBI-compliant escrow account. Funds are only transferred to the worker once you review and approve the shift or milestone deliverables.',
            },
            {
              q: 'How fast can a contractor hire workers on LabourHub?',
              a: 'Using our GPS Geo-Radius Dispatch engine, standard trade requests (electricians, masons, plumbers, helpers) are matched and confirmed on average in under 4 minutes with instant WhatsApp notification.',
            },
            {
              q: 'How are workers verified on the platform?',
              a: 'Every worker undergoes automated Aadhaar OTP verification, trade skill certificate validation (NSDC/ITI where applicable), and admin review before receiving job bookings.',
            },
            {
              q: 'How does attendance geo-fencing work?',
              a: 'When workers arrive at your project site, they check in via the LabourHub mobile web portal. The system verifies their GPS coordinates are within 50 meters of your site perimeter to prevent fake attendance.',
            },
          ].map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div key={idx} className="glass-card rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-cyan-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-white/5 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Pre-Footer Action Banner */}
      <section className="py-16 px-6 lg:px-16 max-w-7xl mx-auto">
        <div className="p-8 lg:p-14 rounded-3xl bg-gradient-to-r from-slate-900/90 via-indigo-950/90 to-slate-900/90 border border-white/15 text-white text-center space-y-6 relative overflow-hidden shadow-2xl backdrop-blur-xl">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Ready to Streamline Your Workforce Operations?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Join 4,800+ contractors and 16,000+ skilled tradespeople building with LabourHub.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl text-sm font-extrabold text-slate-950 bg-white hover:bg-slate-100 shadow-xl transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              Get Started Free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 rounded-2xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all"
            >
              Explore Live Portals
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-10 px-6 lg:px-16 text-center text-xs text-slate-400 bg-slate-950/80 backdrop-blur-md">
        <p>© 2026 LabourHub Enterprise Workforce OS. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
