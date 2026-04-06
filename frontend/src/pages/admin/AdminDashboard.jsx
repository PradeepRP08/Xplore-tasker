import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Users, UserCheck, ClipboardList, CheckCircle2, Clock, Loader2, TrendingUp } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LabelList,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import StatCard from '../../components/shared/StatCard';
import { SkeletonCard, PageLoader } from '../../components/shared/Loader';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data))
      .catch(() => toast.error('Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  const pieData = stats ? [
    { name: 'Pending',     value: stats.pendingTasks,    color: '#f59e0b' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' },
    { name: 'Completed',   value: stats.completedTasks,  color: '#10b981' },
  ].filter(d => d.value > 0) : [];

  const barData = stats ? [
    { label: 'Total',      value: stats.totalEmployees,    fill: '#6471f1' },
    { label: 'Approved',   value: stats.totalEmployees - stats.pendingApprovals, fill: '#10b981' },
    { label: 'Pending',    value: stats.pendingApprovals,  fill: '#f59e0b' },
  ] : [];

  return (
    <div className="min-h-screen p-4 lg:p-12 relative overflow-hidden">
      {/* Cosmic Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }} 
        animate={{ opacity: 1, scale: 1 }} 
        className="relative z-20 mb-12 text-center"
      >
        <div className="inline-block mb-6 p-4 rounded-3xl bg-[var(--quantum-glass)] backdrop-blur-xl border border-[var(--quantum-fg)]/20 shadow-2xl">
          <div className="w-20 h-20 quantum-orb mx-auto mb-4" />
          <h1 className="text-5xl lg:text-6xl font-display font-black holo-text mb-4 tracking-[0.1em] drop-shadow-2xl">
            QUANTUM DASH
          </h1>
          <p className="text-xl text-white/70 font-mono tracking-wider">Nebula Control Center • Live Data Stream</p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center text-sm uppercase tracking-wider text-white/60 font-mono">
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>● Status: ONLINE</motion.span>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} className="holo-text">● Nodes: Active</motion.span>
        </div>
      </motion.div>

      {/* Stat Cards */}
{loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16 p-8 rounded-3xl bg-[var(--quantum-glass)]/50 backdrop-blur-xl border border-[var(--quantum-fg)]/10">
          {[...Array(4)].map((_, i) => (
            <motion.div key={i} className="quantum-card p-8 h-32 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div 
          className="relative mb-20"
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ staggerChildren: 0.1 }}
        >
          {/* Orbital constellation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-4xl bg-[var(--quantum-glass)]/30 backdrop-blur-2xl border border-[var(--quantum-accent)]/15 shadow-2xl relative overflow-hidden">
            {/* Orbit rings */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-[var(--quantum-fg)]/20 rounded-full animate-spin-slow"></div>
              <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-[var(--quantum-glow)]/30 rounded-full animate-pulse delay-500"></div>
            </div>
            
            <motion.div style={{ originX: 0.5, originY: 0.5 }}>
              <StatCard icon={Users} label="NODES" value={stats?.totalEmployees} color="cyan" delay={0} />
            </motion.div>
            <motion.div style={{ originX: 0.5, originY: 0.5 }}>
              <StatCard icon={UserCheck} label="PENDING" value={stats?.pendingApprovals} color="magenta" delay={0.15} />
            </motion.div>
            <motion.div style={{ originX: 0.5, originY: 0.5 }}>
              <StatCard icon={ClipboardList} label="TASKS" value={stats?.totalTasks} color="lime" delay={0.3} />
            </motion.div>
            <motion.div style={{ originX: 0.5, originY: 0.5 }}>
              <StatCard icon={CheckCircle2} label="COMPLETE" value={stats?.completedTasks} color="violet" delay={0.45} />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Holographic Chart Portals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Task Distribution Portal */}
        <motion.div 
          initial={{ opacity: 0, rotateY: 90 }} 
          animate={{ opacity: 1, rotateY: 0 }} 
          transition={{ delay: 0.6, duration: 0.8 }} 
          className="quantum-card p-8 relative group hover:rotate-y-5"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-spectral-cyan/20 to-spectral-magenta/20 rounded-3xl blur-xl -z-10 animate-pulse"></div>
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-12 h-12 quantum-orb/50 flex items-center justify-center border-2 border-[var(--quantum-glow)]/50">
              <TrendingUp className="w-6 h-6 text-white drop-shadow-lg" />
            </div>
            <div>
              <h3 className="text-2xl font-black holo-text mb-1 tracking-wide">TASK NEBULA</h3>
              <p className="text-sm text-white/60 font-mono uppercase tracking-wider">Distribution Matrix</p>
            </div>
          </div>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="w-16 h-16 border-4 border-[var(--quantum-fg)]/30 border-t-[var(--quantum-accent)] rounded-full animate-spin shadow-2xl"></div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie 
                  data={pieData} 
                  cx="50%" 
                  cy="50%" 
                  innerRadius={50} 
                  outerRadius={80} 
                  paddingAngle={4} 
                  dataKey="value" 
                  labelLine={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 1 }}
                  label={({ name, value, percent }) => ({
                    text: `${name}: ${value} (${(percent * 100).toFixed(0)}%)`,
                    fill: '#ffffff',
                    fontSize: 12,
                    fontWeight: 'bold',
                  })}
                >
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} strokeWidth={2} stroke="rgba(255,255,255,0.15)" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,10,26,0.95)',
                    border: '1px solid rgba(0,245,255,0.3)',
                    borderRadius: '12px',
                    backdropFilter: 'blur(20px)',
                    color: 'white',
                    fontSize: '13px',
                    padding: '8px 14px',
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                  wrapperStyle={{ zIndex: 100 }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', paddingTop: '8px' }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="quantum-card p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-xl bg-[var(--quantum-fg)]/10 flex items-center justify-center border border-[var(--quantum-fg)]/20">
              <Users className="w-4 h-4 text-[var(--quantum-fg)]" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Employee Approval Stats</h2>
              <p className="text-xs text-white/40">Approval breakdown</p>
            </div>
          </div>
          {loading ? <div className="h-56 flex items-center justify-center"><div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" /></div> : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={barData} barSize={36} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" fill="none" vertical={false} />
                <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'rgba(255,255,255,0.5)' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: 'rgba(10,10,26,0.95)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0,245,255,0.3)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    color: 'white',
                    fontSize: '13px',
                    padding: '8px 14px',
                  }}
                  itemStyle={{ color: '#fff' }}
                  labelStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  wrapperStyle={{ zIndex: 100 }}
                />
                <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                  {barData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                  <LabelList dataKey="value" position="top" fill="#ffffff" fontSize={13} fontWeight="bold" offset={10} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Task progress mini cards */}
      {stats && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Pending Tasks',     value: stats.pendingTasks,    icon: Clock,    color: 'text-amber-500',  bg: 'bg-amber-50',   bar: 'bg-amber-400' },
            { label: 'In Progress Tasks', value: stats.inProgressTasks, icon: Loader2,  color: 'text-blue-500',   bg: 'bg-blue-50',    bar: 'bg-blue-400' },
            { label: 'Completed Tasks',   value: stats.completedTasks,  icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50', bar: 'bg-emerald-400' },
          ].map(({ label, value, icon: Icon, color, bg, bar }) => {
            const pct = stats.totalTasks ? Math.round((value / stats.totalTasks) * 100) : 0;
            return (
              <div key={label} className="quantum-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-9 h-9 rounded-xl ${bg.replace('bg-', 'bg-')}/10 border border-current/20 flex items-center justify-center`}>
                    <Icon className={`w-4.5 h-4.5 ${color}`} style={{ width: '18px', height: '18px' }} />
                  </div>
                  <span className={`text-2xl font-bold ${color}`}>{value}</span>
                </div>
                <p className="text-sm text-white/70 font-medium mb-2">{label}</p>
                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.5, duration: 0.8 }}
                    className={`h-full ${bar} rounded-full shadow-[0_0_10px_currentColor]`} />
                </div>
                <p className="text-xs text-white/30 mt-1">{pct}% of total</p>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
