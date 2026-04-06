import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PlusSquare, User, FileText, AlignLeft, Flag, Calendar, Send, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function AssignTask() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    api.get('/admin/employees')
      .then(({ data }) => setEmployees(data.filter(e => e.isApproved)))
      .catch(() => toast.error('Failed to load employees'));
  }, []);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Task title is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.assignedTo) e.assignedTo = 'Please select an employee';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (evt) => {
    evt.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/admin/assign-task', form);
      setSuccess(true);
      toast.success('Task assigned successfully!');
      setTimeout(() => {
        setSuccess(false);
        setForm({ title: '', description: '', assignedTo: '', priority: 'Medium', dueDate: '' });
      }, 2000);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign task');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (key) =>
    `w-full bg-white/5 border ${errors[key] ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-4 py-3 pl-12 text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-[var(--quantum-fg)]/50 transition-all`;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-6 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl">
        <h1 className="text-3xl font-black text-white tracking-tight uppercase">New Assignment</h1>
        <p className="text-white/50 mt-1 font-mono text-sm tracking-wider uppercase">Deploy task protocols to active ecosystem nodes.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="quantum-card p-8 border-white/5 shadow-none">
        {success && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-700">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <p className="font-medium">Task assigned successfully!</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Task Title */}
          <div>
            <label className="block text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono mb-2">
              Objective <span className="text-[var(--quantum-accent)]">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--quantum-fg)]" />
              <input
                type="text"
                placeholder="e.g. Design homepage mockup"
                value={form.title}
                onChange={(e) => { setForm({ ...form, title: e.target.value }); setErrors({ ...errors, title: '' }); }}
                className={inputClass('title')}
              />
            </div>
            {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono mb-2">
              Parameters <span className="text-[var(--quantum-accent)]">*</span>
            </label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 w-4 h-4 text-[var(--quantum-fg)]" />
              <textarea
                placeholder="Describe the task in detail..."
                value={form.description}
                onChange={(e) => { setForm({ ...form, description: e.target.value }); setErrors({ ...errors, description: '' }); }}
                rows={4}
                className={`${inputClass('description')} resize-none`}
              />
            </div>
            {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description}</p>}
          </div>

          {/* Assign To */}
          <div>
            <label className="block text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono mb-2">
              Assign Node <span className="text-[var(--quantum-accent)]">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--quantum-fg)]" />
              <select
                value={form.assignedTo}
                onChange={(e) => { setForm({ ...form, assignedTo: e.target.value }); setErrors({ ...errors, assignedTo: '' }); }}
                className={`${inputClass('assignedTo')} appearance-none`}
              >
                <option value="" className="bg-[#0a0a25]">Select node...</option>
                {employees.map(e => (
                  <option key={e._id} value={e._id} className="bg-[#0a0a25]">{e.name} — {e.email}</option>
                ))}
              </select>
            </div>
            {errors.assignedTo && <p className="mt-1 text-xs text-red-500">{errors.assignedTo}</p>}
            {employees.length === 0 && (
              <p className="mt-1 text-xs text-amber-500">No approved employees available. Approve employees first.</p>
            )}
          </div>

          {/* Priority & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono mb-2">Priority</label>
              <div className="relative">
                <Flag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--quantum-fg)]" />
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className={`${inputClass('priority')} appearance-none`}
                >
                  <option value="Low" className="bg-[#0a0a25]">🟢 Low Priority</option>
                  <option value="Medium" className="bg-[#0a0a25]">🟡 Medium Priority</option>
                  <option value="High" className="bg-[#0a0a25]">🔴 High Priority</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-white/50 uppercase tracking-[0.2em] font-mono mb-2">Temporal Limit</label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--quantum-fg)]" />
                <input
                  type="date"
                  value={form.dueDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className={inputClass('dueDate')}
                />
              </div>
            </div>
          </div>

          {/* Preview card */}
          {(form.title || form.assignedTo) && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              className="p-5 rounded-3xl border border-white/5 bg-white/5 backdrop-blur-xl">
              <p className="text-[10px] font-black text-[var(--quantum-fg)] uppercase tracking-[0.3em] font-mono mb-3">Transmission Preview</p>
              <p className="text-lg font-black text-white tracking-widest uppercase">{form.title || 'Untitled Protocol'}</p>
              {form.assignedTo && (
                <p className="text-xs text-white/50 mt-1 font-mono uppercase">
                  Target: <span className="text-[var(--quantum-fg)]">{employees.find(e => e._id === form.assignedTo)?.name}</span>
                </p>
              )}
              <div className="flex items-center gap-3 mt-4">
                <span className={`text-[10px] px-3 py-1 rounded-lg font-black uppercase tracking-wider ${
                  form.priority === 'High' ? 'bg-red-500/20 text-red-400' :
                  form.priority === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                  'bg-blue-500/20 text-blue-400'
                }`}>{form.priority} Priority</span>
                {form.dueDate && <span className="text-[10px] text-white/30 font-mono">DUE: {new Date(form.dueDate).toLocaleDateString()}</span>}
              </div>
            </motion.div>
          )}

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base"
          >
            {loading ? (
              <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Assigning...</>
            ) : (
              <><Send className="w-5 h-5" /> Assign Task</>
            )}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
