import React from 'react';
import { Link } from 'react-router-dom';
import GlassCard from '../components/common/GlassCard';
import PageTransition from '../components/common/PageTransition';
import { Shield, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center p-6 text-center">
        <GlassCard hover={false} className="max-w-md p-8 space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-4xl font-extrabold text-white font-mono">404</h1>
          <h2 className="text-lg font-bold text-white">Page Not Found</h2>
          <p className="text-xs text-slate-400">The requested workspace route does not exist or has been moved.</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all mt-4"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Platform Home
          </Link>
        </GlassCard>
      </div>
    </PageTransition>
  );
};

export default NotFoundPage;
