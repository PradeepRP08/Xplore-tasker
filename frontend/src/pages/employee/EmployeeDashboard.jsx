import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ClipboardList, CheckCircle2, Clock, Loader2, TrendingUp, Star } from 'lucide-react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import StatCard from '../../components/shared/StatCard';
import StatusBadge from '../../components/shared/StatusBadge';
import { SkeletonCard, PageLoader } from '../../components/shared/Loader';
import { Link } from 'react-router-dom';

export default function EmployeeDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, tasksRes] = await Promise.all([
          api.get('/employee/stats'),
          api.get('/employee/tasks'),
        ]);
        setStats(statsRes.data);
        setRecentTasks(tasksRes.data.slice(0, 5));
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const pieData = stats ? [
    { name: 'Pending',     value: stats.pendingTasks,    color: '#f59e0b' },
    { name: 'In Progress', value: stats.inProgressTasks, color: '#3b82f6' },
    { name: 'Completed',   value: stats.completedTasks,  color: '#10b981' },
  ].filter(d => d.value > 0) : [];

  const completionRate = stats?.totalTasks
    ? Math.round((stats.completedTasks / stats.totalTasks) * 100)
    : 0;

  const greet = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">
              {greet()}, <span className="holo-text">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p className="text-white/50 mt-1">Here's a summary of your tasks and progress.</p>
          </div>
          {stats && stats.totalTasks > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10">
              <Star className="w-4 h-4 text-[var(--quantum-fg)]" />
              <span className="text-sm font-semibold text-[var(--quantum-fg)]">{completionRate}% completion rate</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Stat Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          <StatCard icon={ClipboardList} label="Total Tasks"     value={stats?.totalTasks}       color="blue"   delay={0} />
          <StatCard icon={Clock}         label="Pending"          value={stats?.pendingTasks}     color="amber"  delay={0.05} />
          <StatCard icon={Loader2}       label="In Progress"      value={stats?.inProgressTasks}  color="purple" delay={0.1} />
          <StatCard icon={CheckCircle2}  label="Completed"        value={stats?.completedTasks}   color="green"  delay={0.15} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Tasks */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-3 quantum-card p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-semibold text-white">Recent Tasks</h2>
              <p className="text-xs text-white/40 mt-0.5">Your latest assigned tasks</p>
            </div>
            <Link to="/employee/tasks"
              className="text-xs font-semibold text-[var(--quantum-fg)] hover:text-[var(--quantum-accent)] px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
              View all →
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse flex items-center gap-3 p-3">
                  <div className="w-10 h-10 bg-white/5 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                    <div className="h-3 bg-white/5 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-3">
                <ClipboardList className="w-7 h-7 text-white/30" />
              </div>
              <p className="text-white/70 font-medium mb-1">No tasks yet</p>
              <p className="text-white/30 text-sm">Your admin will assign tasks to you soon.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTasks.map((task, i) => (
                <motion.div
                  key={task._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.06 }}
                  className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-white/5 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    task.status === 'Completed' ? 'bg-emerald-500/20 border border-emerald-500/30' :
                    task.status === 'In Progress' ? 'bg-blue-500/20 border border-blue-500/30' : 'bg-amber-500/20 border border-amber-500/30'
                  }`}>
                    {task.status === 'Completed' ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> :
                     task.status === 'In Progress' ? <Loader2 className="w-5 h-5 text-blue-400" /> :
                     <Clock className="w-5 h-5 text-amber-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-white truncate">{task.title}</p>
                    <p className="text-xs text-white/30 truncate mt-0.5">{task.description}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Chart + Progress */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Pie Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="quantum-card p-6 flex-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-[var(--quantum-fg)]/10 flex items-center justify-center border border-[var(--quantum-fg)]/20">
                <TrendingUp className="w-4 h-4 text-[var(--quantum-fg)]" />
              </div>
              <div>
                <h2 className="font-semibold text-white text-sm">Task Breakdown</h2>
                <p className="text-xs text-white/40">Status distribution</p>
              </div>
            </div>
            {loading ? (
              <div className="h-44 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin" />
              </div>
            ) : pieData.length === 0 ? (
              <div className="h-44 flex items-center justify-center text-white/30 text-sm">No task data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    cx="50%" 
                    cy="45%" 
                    innerRadius={35} 
                    outerRadius={55} 
                    paddingAngle={4} 
                    dataKey="value"
                    labelLine={{ stroke: 'rgba(255,255,255,0.3)' }}
                    label={({ name, value }) => ({
                      text: `${name}: ${value}`,
                      fill: '#ffffff',
                      fontSize: 11,
                      fontWeight: 'bold',
                    })}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'rgba(10,10,26,0.95)',
                      borderRadius: '12px',
                      border: '1px solid rgba(0,245,255,0.3)',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                      color: 'white',
                      fontSize: '12px',
                      padding: '6px 12px',
                    }}
                    itemStyle={{ color: '#fff' }}
                    labelStyle={{ color: '#fff' }}
                    wrapperStyle={{ zIndex: 100 }}
                  />
                  <Legend iconType="circle" iconSize={7} wrapperStyle={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)', paddingTop: '4px' }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </motion.div>

          {/* Completion Progress */}
          {!loading && stats && stats.totalTasks > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="quantum-card p-5">
              <p className="text-sm font-semibold text-white mb-3">Overall Progress</p>
              <div className="flex items-end justify-between mb-2">
                <span className="text-3xl font-bold text-[var(--quantum-fg)]">{completionRate}%</span>
                <span className="text-xs text-white/40">{stats.completedTasks}/{stats.totalTasks} done</span>
              </div>
              <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-[var(--quantum-fg)] to-[var(--quantum-glow)] rounded-full shadow-[0_0_15px_rgba(0,245,255,0.4)]"
                />
              </div>
              <p className="text-xs text-white/30 mt-2">
                {completionRate === 100 ? '🎉 All tasks completed!' :
                 completionRate >= 50 ? 'Great progress, keep it up!' :
                 'Keep working, you\'re making progress!'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
