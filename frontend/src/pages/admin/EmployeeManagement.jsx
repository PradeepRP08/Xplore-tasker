import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Search, CheckCircle2, XCircle, Mail, Briefcase, UserCheck, UserX } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';
import { SkeletonRow, EmptyState } from '../../components/shared/Loader';

export default function EmployeeManagement() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchEmployees = async () => {
    try {
      const { data } = await api.get('/admin/employees');
      setEmployees(data);
    } catch {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleApprove = async (id) => {
    setActionLoading(id);
    try {
      const { data } = await api.put(`/admin/approve/${id}`);
      setEmployees(prev => prev.map(e => e._id === id ? { ...e, isApproved: data.employee.isApproved } : e));
      toast.success(data.message);
    } catch {
      toast.error('Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase()) ||
      (e.department || '').toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' ? true : filter === 'approved' ? e.isApproved : !e.isApproved;
    return matchSearch && matchFilter;
  });

  const stats = {
    total: employees.length,
    approved: employees.filter(e => e.isApproved).length,
    pending: employees.filter(e => !e.isApproved).length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">Node Management</h1>
        <p className="text-white/50 mt-1 font-mono text-sm tracking-wider uppercase">Approve registrations and manage ecosystem nodes.</p>
      </motion.div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total', value: stats.total, color: 'text-white/90', bg: 'bg-white/5' },
          { label: 'Approved', value: stats.approved, color: 'text-[var(--quantum-glow)]', bg: 'bg-[var(--quantum-glow)]/10' },
          { label: 'Pending', value: stats.pending, color: 'text-[var(--quantum-fg)]', bg: 'bg-[var(--quantum-fg)]/10' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`quantum-card p-4 text-center border-white/5 ${bg}`}>
            <p className={`text-2xl font-bold ${color} drop-shadow-[0_0_10px_currentColor]`}>{value}</p>
            <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="quantum-card p-4 mb-6 flex flex-col sm:flex-row gap-3 bg-white/5 border-white/5 shadow-none">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
          <input
            type="text"
            placeholder="Search by name, email or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-2.5 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--quantum-fg)]/50 transition-all"
          />
        </div>
        <div className="flex gap-2 p-1 bg-white/5 rounded-2xl border border-white/10">
          {['all', 'approved', 'pending'].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
                filter === f 
                  ? 'bg-gradient-to-r from-[var(--quantum-fg)] to-[var(--quantum-accent)] text-black shadow-[0_0_20px_rgba(0,245,255,0.4)]' 
                  : 'text-white/40 hover:text-white hover:bg-white/5'
              }`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="quantum-card overflow-hidden border-white/5 bg-transparent shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="text-left px-6 py-5 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono">Employee</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono hidden md:table-cell">Dept</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono hidden sm:table-cell">Joined</th>
                <th className="text-left px-6 py-5 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono">Status</th>
                <th className="text-right px-6 py-5 text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono">Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState
                      icon={Users}
                      title="No employees found"
                      description={search ? 'Try adjusting your search or filter.' : 'No employees have registered yet.'}
                    />
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filtered.map((emp, i) => (
                    <motion.tr key={emp._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="table-row"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--quantum-fg)] to-[var(--quantum-accent)] flex items-center justify-center text-black text-sm font-black flex-shrink-0 shadow-[0_0_15px_rgba(0,245,255,0.3)]`}>
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-white text-sm">{emp.name}</p>
                            <p className="text-xs text-white/30 flex items-center gap-1 font-mono">
                              <Mail className="w-3 h-3 text-[var(--quantum-fg)]" />{emp.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 hidden md:table-cell">
                        <span className="inline-flex items-center gap-1.5 text-xs text-white/70 font-medium">
                          <Briefcase className="w-3.5 h-3.5 text-[var(--quantum-accent)]" />
                          {emp.department || 'General'}
                        </span>
                      </td>
                      <td className="px-6 py-4 hidden sm:table-cell">
                        <span className="text-xs text-white/40 font-mono uppercase tracking-wider">
                          {new Date(emp.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {emp.isApproved ? (
                          <span className="badge-approved"><CheckCircle2 className="w-3 h-3" /> Approved</span>
                        ) : (
                          <span className="badge-unapproved"><XCircle className="w-3 h-3" /> Pending</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleApprove(emp._id)}
                          disabled={actionLoading === emp._id}
                          className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            emp.isApproved
                              ? 'bg-red-50 text-red-600 hover:bg-red-100'
                              : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          } disabled:opacity-60`}
                        >
                          {actionLoading === emp._id ? (
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          ) : emp.isApproved ? (
                            <><UserX className="w-3.5 h-3.5" /> Revoke</>
                          ) : (
                            <><UserCheck className="w-3.5 h-3.5" /> Approve</>
                          )}
                        </button>
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
