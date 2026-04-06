import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, color = 'cyan', delay = 0, sub }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotateX: 90 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ delay, duration: 0.6, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -10, rotate: 5, scale: 1.05 }}
      className="quantum-card p-6 flex flex-col items-center text-center group relative z-10 cursor-default"
      style={{ perspective: '1000px' }}
    >
      {/* Orb */}
      <motion.div 
        className="quantum-orb mb-4 group-hover:scale-110"
        animate={{ 
          rotateY: [0, 10, -10, 0],
          scale: [1, 1.02, 1, 1.02]
        }}
        transition={{ 
          rotateY: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
          scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' }
        }}
      >
        <div className="absolute inset-0 w-8 h-8 m-auto rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Icon className="w-5 h-5 text-white drop-shadow-lg" />
        </div>
      </motion.div>
      
      {/* Value */}
      <motion.p 
        className="text-3xl font-black holo-text mb-2 tracking-wide drop-shadow-2xl"
        animate={{ textShadow: ['0 0 10px var(--quantum-fg)', '0 0 20px var(--quantum-fg)', '0 0 10px var(--quantum-fg)'] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {value ?? '—'}
      </motion.p>
      
      {/* Label */}
      <p className="text-sm font-medium text-white/80 uppercase tracking-wider group-hover:text-[var(--quantum-glow)] transition-colors">
        {label}
      </p>
      
      {sub && (
        <p className="text-xs text-white/60 mt-2 font-mono animate-pulse">
          {sub}
        </p>
      )}
      
      {/* Particle trails */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-4 -right-4 w-2 h-2 bg-[var(--quantum-glow)]/50 rounded-full animate-ping-slow opacity-0 group-hover:opacity-100 delay-200"></div>
        <div className="absolute -bottom-4 left-4 w-3 h-3 bg-[var(--quantum-accent)]/40 rounded-full animate-bounce-slow opacity-0 group-hover:opacity-100 delay-300"></div>
      </div>
    </motion.div>
  );
}
