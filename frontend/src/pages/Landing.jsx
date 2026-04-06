import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Users, CheckSquare, ArrowRight, Shield, BarChart3 } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-brand-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center max-w-2xl relative z-10"
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-3 mb-8"
        >
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center shadow-glow">
            <span className="text-white font-black text-2xl">T</span>
          </div>
          <span className="text-3xl font-bold text-white tracking-tight">Tasker</span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
          Manage Tasks,{' '}
          <span className="bg-gradient-to-r from-brand-400 to-violet-400 bg-clip-text text-transparent">
            Effortlessly
          </span>
        </h1>
        <p className="text-slate-400 text-lg mb-12 leading-relaxed">
          A powerful task management system for admins and employees. Assign, track, and complete tasks with a beautifully modern interface.
        </p>

        {/* Feature chips */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {[
            { icon: Shield, label: 'Role-based Access' },
            { icon: BarChart3, label: 'Live Analytics' },
            { icon: CheckSquare, label: 'Task Tracking' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-slate-300 text-sm backdrop-blur-sm">
              <Icon className="w-4 h-4 text-brand-400" />
              {label}
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/admin/login')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 text-white font-semibold rounded-2xl shadow-glow transition-all duration-200 text-base"
          >
            <Shield className="w-5 h-5" />
            Admin Portal
            <ArrowRight className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/employee/login')}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-2xl transition-all duration-200 backdrop-blur-sm text-base"
          >
            <Users className="w-5 h-5" />
            Employee Portal
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        <p className="mt-8 text-slate-500 text-sm">
          New employee?{' '}
          <button onClick={() => navigate('/employee/register')} className="text-brand-400 hover:text-brand-300 font-medium underline underline-offset-2">
            Register here
          </button>
        </p>
      </motion.div>
    </div>
  );
}
