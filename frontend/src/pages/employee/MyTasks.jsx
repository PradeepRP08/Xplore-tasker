import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Search, Calendar, Flag, ChevronDown, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import StatusBadge from '../../components/shared/StatusBadge';
import { EmptyState, PageLoader } from '../../components/shared/Loader';

const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed'];

const priorityColor = (p) => ({
  High:   'bg-red-500/20 text-red-400 border-red-500/30',
  Medium: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Low:    'bg-blue-500/20 text-blue-400 border-blue-500/30',
}[p] || 'bg-blue-500/20 text-blue-400 border-blue-500/30');

function TaskCard({ task, onStatusChange, updating }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="quantum-card p-5 flex flex-col gap-4"
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <h3 className="font-semibold text-white text-base truncate">{task.title}</h3>
            {task.priority && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${priorityColor(task.priority)}`}>
                <Flag className="w-3 h-3" />
                {task.priority}
              </span>
            )}
          </div>
          <p className="text-sm text-white/50 leading-relaxed line-clamp-2">{task.description}</p>
        </div>
        <StatusBadge status={task.status} />
      </div>

      {/* Meta */}
      <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-white/40">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            Assigned {new Date(task.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
          {task.dueDate && (
            <span className="flex items-center gap-1 text-amber-500 font-medium">
              <Calendar className="w-3 h-3" />
              Due {new Date(task.dueDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
            </span>
          )}
        </div>

        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            disabled={updating === task._id}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--quantum-fg)]/10 border border-[var(--quantum-fg)]/30 text-[var(--quantum-fg)] text-xs font-semibold hover:bg-[var(--quantum-fg)]/20 transition-colors disabled:opacity-60"
          >
            {updating === task._id ? (
              <div className="w-3.5 h-3.5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            )}
            Update Status
          </button>
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.96 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 bottom-full mb-2 w-44 bg-[#0a0a25] rounded-2xl shadow-card-hover border border-white/10 overflow-hidden z-20"
              >
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => { onStatusChange(task._id, s); setOpen(false); }}
                    className={`flex items-center gap-2.5 w-full px-4 py-3 text-sm text-left transition-colors hover:bg-white/5 ${
                      task.status === s ? 'text-[var(--quantum-fg)] font-semibold bg-[var(--quantum-fg)]/10' : 'text-white/70'
                    }`}
                  >
                    {task.status === s && <Check className="w-3.5 h-3.5 flex-shrink-0" />}
                    {task.status !== s && <div className="w-3.5" />}
                    {s}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updating, setUpdating] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/employee/tasks');
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleStatusChange = async (id, status) => {
    if (tasks.find(t => t._id === id)?.status === status) return;
    setUpdating(id);
    try {
      const { data } = await api.put(`/employee/update-task/${id}`, { status });
      setTasks(prev => prev.map(t => t._id === id ? { ...t, status: data.task.status } : t));
      toast.success(`Status updated to "${status}"`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true : t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: tasks.length,
    Pending: tasks.filter(t => t.status === 'Pending').length,
    'In Progress': tasks.filter(t => t.status === 'In Progress').length,
    Completed: tasks.filter(t => t.status === 'Completed').length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Tasks</h1>
        <p className="text-white/50 mt-1">Manage and update the status of your assigned tasks.</p>
      </motion.div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {[
          { label: 'All', value: 'all' },
          { label: 'Pending', value: 'Pending' },
          { label: 'In Progress', value: 'In Progress' },
          { label: 'Completed', value: 'Completed' },
        ].map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
              statusFilter === value
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10'
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
              statusFilter === value ? 'bg-white text-black' : 'bg-white/10 text-white/40'
            }`}>
              {counts[value]}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
        <input
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--quantum-fg)]/50 transition-all"
        />
      </div>

      {/* Task cards */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-white/10 border-t-[var(--quantum-fg)] rounded-full animate-spin" />
            <p className="text-white/30 text-sm">Loading tasks...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title={search ? 'No matching tasks' : statusFilter !== 'all' ? `No ${statusFilter} tasks` : 'No tasks yet'}
          description={
            search ? 'Try a different search term.' :
            statusFilter !== 'all' ? `You have no tasks with "${statusFilter}" status.` :
            'Your admin will assign tasks to you soon. Check back later!'
          }
        />
      ) : (
        <motion.div layout className="grid gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((task, i) => (
              <TaskCard
                key={task._id}
                task={task}
                onStatusChange={handleStatusChange}
                updating={updating}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
