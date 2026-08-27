import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true, onClick, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      whileHover={hover ? { y: -3, transition: { duration: 0.2 } } : undefined}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 relative overflow-hidden ${
        hover ? 'glass-card-hover cursor-pointer' : ''
      } ${className}`}
    >
      {/* Glow subtle top reflection */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
      {children}
    </motion.div>
  );
};

export default GlassCard;
