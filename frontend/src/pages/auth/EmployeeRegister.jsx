import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus, Mail, Lock, Eye, EyeOff, User, Briefcase, ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../utils/api';

export default function EmployeeRegister() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '', department: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Full name is required';
    if (!form.email) e.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post('/employee/register', {
        name: form.name, email: form.email, password: form.password, department: form.department,
      });
      setSuccess(true);
      toast.success('Registration successful! Awaiting admin approval.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Registration Successful!</h2>
          <p className="text-slate-500 mb-8">Your account has been created. Please wait for admin approval before you can log in.</p>
          <button onClick={() => navigate('/employee/login')} className="btn-primary px-8 py-3">
            Go to Login
          </button>
        </motion.div>
      </div>
    );
  }

  const field = (key, label, type, placeholder, icon, extraProps = {}) => (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <div className="auth-input-wrapper">
        <Icon className="auth-input-icon w-4 h-4" />
        <input
          type={type}
          placeholder={placeholder}
          value={form[key]}
          onChange={(e) => { setForm({ ...form, [key]: e.target.value }); setErrors({ ...errors, [key]: '' }); }}
          className={`auth-input ${errors[key] ? 'border-red-400' : ''}`}
          {...extraProps}
        />
      </div>
      {errors[key] && <p className="mt-1 text-xs text-red-500">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-5/12 bg-gradient-to-br from-slate-950 via-slate-900 to-violet-900 p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-violet-500/15 rounded-full blur-3xl" />
        <Link to="/" className="flex items-center gap-3 relative z-10">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-violet-500 flex items-center justify-center">
            <span className="text-white font-black text-base">T</span>
          </div>
          <span className="text-xl font-bold text-white">Tasker</span>
        </Link>
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/20">
            <UserPlus className="w-8 h-8 text-violet-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">Join the<br />Team</h2>
          <p className="text-slate-400 text-lg leading-relaxed">Register your account and start collaborating with your team once approved by an admin.</p>
        </motion.div>
        <p className="text-slate-600 text-sm relative z-10">© 2024 Tasker.</p>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 bg-slate-50 overflow-y-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md py-8">
          <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 text-sm mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
              <div className="auth-input-wrapper">
                <User className="auth-input-icon w-4 h-4" />
                <input type="text" placeholder="John Doe" value={form.name}
                  onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors({ ...errors, name: '' }); }}
                  className={`auth-input ${errors.name ? 'border-red-400' : ''}`} />
              </div>
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail className="auth-input-icon w-4 h-4" />
                <input type="email" placeholder="you@company.com" value={form.email}
                  onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
                  className={`auth-input ${errors.email ? 'border-red-400' : ''}`} />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Department <span className="text-slate-400">(optional)</span></label>
              <div className="auth-input-wrapper">
                <Briefcase className="auth-input-icon w-4 h-4" />
                <input type="text" placeholder="e.g. Engineering, Design" value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className="auth-input" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon w-4 h-4" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Min. 6 characters" value={form.password}
                  onChange={(e) => { setForm({ ...form, password: e.target.value }); setErrors({ ...errors, password: '' }); }}
                  className={`auth-input pr-11 ${errors.password ? 'border-red-400' : ''}`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
              <div className="auth-input-wrapper">
                <Lock className="auth-input-icon w-4 h-4" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Repeat your password" value={form.confirmPassword}
                  onChange={(e) => { setForm({ ...form, confirmPassword: e.target.value }); setErrors({ ...errors, confirmPassword: '' }); }}
                  className={`auth-input ${errors.confirmPassword ? 'border-red-400' : ''}`} />
              </div>
              {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
            </div>

            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
              className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base mt-2">
              {loading ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating account...</>
              ) : (
                <><UserPlus className="w-5 h-5" /> Create Account</>
              )}
            </motion.button>
          </form>

          <p className="mt-6 text-center text-slate-500 text-sm">
            Already have an account?{' '}
            <Link to="/employee/login" className="text-brand-600 font-medium hover:underline">Sign in</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
