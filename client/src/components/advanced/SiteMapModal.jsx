import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StatusBadge from '../common/StatusBadge';
import GlassCard from '../common/GlassCard';
import { X, MapPin, Navigation, Compass, Layers, ShieldCheck } from 'lucide-react';

const SiteMapModal = ({ isOpen, onClose, worker, locationName = 'Lower Parel & BKC Commercial Belt, Mumbai' }) => {
  const [distanceRadius, setDistanceRadius] = useState('within_10km');

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="w-full max-w-2xl bg-[#0F172A] border border-cyan-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <StatusBadge status="verified" text="Privacy-Protected Service Area" />
                <span className="text-[10px] font-mono text-cyan-400">Pluggable Google Maps / Leaflet Canvas</span>
              </div>
              <h2 className="text-xl font-extrabold text-white mt-1 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" /> Geographic Service Location & Distance Radius
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Privacy Notice Banner */}
          <div className="p-3.5 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex items-center gap-3 text-xs text-cyan-200">
            <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
            <span>Worker home address is protected. Displaying verified commercial service area radius for deployment.</span>
          </div>

          {/* Distance Filter Switcher */}
          <div className="flex items-center justify-between gap-2 p-3 rounded-2xl bg-white/5 border border-white/10 flex-wrap">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Distance Radius Filter:</span>
            <div className="flex gap-1.5 flex-wrap">
              {[
                { id: 'within_5km', label: 'Within 5 km' },
                { id: 'within_10km', label: 'Within 10 km' },
                { id: 'within_25km', label: 'Within 25 km' },
                { id: 'any', label: 'Any Distance' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  type="button"
                  onClick={() => setDistanceRadius(btn.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    distanceRadius === btn.id
                      ? 'bg-cyan-500 text-white shadow-md shadow-cyan-500/20'
                      : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>

          {/* Map Viewer Canvas Component */}
          <div className="h-64 rounded-2xl bg-slate-900 border border-cyan-500/30 relative overflow-hidden flex items-center justify-center group shadow-inner">
            {/* Visual Grid Map Overlay simulation */}
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            
            {/* Pluggable Pin Container */}
            <div className="relative z-10 text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-cyan-500/20 border-2 border-cyan-400 text-cyan-400 flex items-center justify-center mx-auto shadow-lg shadow-cyan-500/30 animate-pulse">
                <Navigation className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-extrabold text-white">{locationName}</h4>
              <p className="text-xs text-slate-400 font-mono">Latitude: 19.0176° N • Longitude: 72.8561° E</p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default SiteMapModal;
