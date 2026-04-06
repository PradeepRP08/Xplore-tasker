import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ClipboardList, Search, Trash2, Filter, User } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import StatusBadge from '../../components/shared/StatusBadge';
import { SkeletonRow, EmptyState } from '../../components/shared/Loader';

export default function TaskManagement() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteLoading, setDeleteLoading] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/admin/tasks');
      setTasks(data);
    } catch {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTasks(); }, []);

  const handleDelete = async (id) => {
    setDeleteLoading(id);
    try {
      await api.delete(`/admin/tasks/${id}`);
      setTasks(prev => prev.filter(t => t._id !== id));
      toast.success('Task deleted');
    } catch {
      toast.error('Failed to delete task');
    } finally {
      setDeleteLoading(null);
      setConfirmDelete(null);
    }
  };

  const filtered = tasks.filter(t => {
    const matchSearch =
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      (t.assignedTo?.name || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' ? true : t.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const priorityBadge = (p) => {
    const map = { 
      High: 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]', 
      Medium: 'bg-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]', 
      Low: 'bg-blue-500/20 text-blue-400 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
    };
    return <span className={`inline-flex px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${map[p] || map.Low}`}>{p || 'Medium'}</span>;
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Task Monitor</h1>
        <p className="text-white/50 mt-1 font-mono text-sm tracking-wider uppercase">Real-time status tracking of all ecosystem operations.</p>
      </motion.div>

      {/* Status overview pills */}
      <div className="flex gap-4 flex-wrap mb-8 p-1 bg-white/5 rounded-2xl w-fit border border-white/5">
        {[
          { label: 'All', value: 'all', count: tasks.length, color: 'var(--quantum-fg)' },
          { label: 'Pending', value: 'Pending', count: tasks.filter(t => t.status === 'Pending').length, color: 'var(--quantum-fg)' },
          { label: 'In Progress', value: 'In Progress', count: tasks.filter(t => t.status === 'In Progress').length, color: 'var(--quantum-accent)' },
          { label: 'Completed', value: 'Completed', count: tasks.filter(t => t.status === 'Completed').length, color: 'var(--quantum-glow)' },
        ].map(({ label, value, count, color }) => (
          <button key={value} onClick={() => setStatusFilter(value)}
            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 flex items-center gap-3 ${
              statusFilter === value 
                ? 'bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)] border border-white/20' 
                : 'text-white/40 hover:text-white hover:bg-white/5'
            }`}>
            {label}
            <span className={`text-[10px] px-2 py-0.5 rounded-md font-mono ${statusFilter === value ? 'bg-white text-black' : 'bg-white/10 text-white/40'}`}>
              {count}
            </span>
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="quantum-card p-4 mb-8 bg-white/5 border-white/5">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Search tasks or employee names..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none text-white placeholder:text-white/20 focus:ring-0 text-sm pl-11"
          />
        </div>
      </div>

      {/* Table */}
      <div className="quantum-card overflow-hidden border-white/5 bg-transparent shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left px-6 py-5 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono">Task Profile</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono hidden md:table-cell">Operator</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono hidden lg:table-cell">Priority</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono hidden sm:table-cell">Temporal</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono">Quantum Status</th>
                <th className="text-right px-6 py-5 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState icon={ClipboardList} title="No tasks found" description="No tasks match your current search or filter." />
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filtered.map((task, i) => (
                    <motion.tr key={task._id}
                      initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                      className="table-row">
                    <td className="px-6 py-5">
                      <p className="font-bold text-white text-sm tracking-wide">{task.title}</p>
                      <p className="text-xs text-white/30 mt-1 line-clamp-1 font-mono uppercase tracking-tighter">{task.description}</p>
                    </td>
                      <td className="px-6 py-5 hidden md:table-cell">
                        {task.assignedTo ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--quantum-fg)] to-[var(--quantum-accent)] flex items-center justify-center text-black text-xs font-black shadow-[0_0_15px_rgba(0,245,255,0.2)]">
                              {task.assignedTo.name?.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-xs font-bold text-white uppercase tracking-tight">{task.assignedTo.name}</p>
                              <p className="text-[10px] text-white/30 font-mono">{task.assignedTo.email}</p>
                            </div>
                          </div>
                        ) : <span className="text-white/20 text-xs font-mono">UNASSIGNED</span>}
                      </td>
                      <td className="px-6 py-4 hidden lg:table-cell">{priorityBadge(task.priority)}</td>
                      <td className="px-6 py-5 hidden sm:table-cell">
                        <span className="text-xs font-mono text-white/40 uppercase tracking-widest">
                          {new Date(task.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                        </span>
                      </td>
                      <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                      <td className="px-6 py-4 text-right">
                        {confirmDelete === task._id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button onClick={() => handleDelete(task._id)} disabled={deleteLoading === task._id}
                              className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-medium hover:bg-red-600 disabled:opacity-60">
                              {deleteLoading === task._id ? '...' : 'Confirm'}
                            </button>
                            <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200">
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(task._id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
