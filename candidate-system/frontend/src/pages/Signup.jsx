import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { UserPlus, Lock, Mail, User, AlertTriangle, Sparkles } from 'lucide-react';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all input fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', { name, email, password });
      
      // Store token and user data in localStorage
      localStorage.setItem('complaint_token', res.data.token);
      localStorage.setItem('complaint_user', JSON.stringify(res.data.user));
      
      // Navigate to dashboard
      navigate('/');
      window.location.reload(); // Refresh to update context
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please check your data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-800/50 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow Effect Decorative background */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20">
            <Sparkles className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Admin Registration</h2>
          <p className="text-slate-400 text-sm mt-2">Create your administrator account to manage public issues</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-200 text-sm items-start">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSignup} className="space-y-5">
          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Full Name</label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rahul Kumar"
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="rahul@gmail.com"
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/60 border border-slate-700/80 rounded-2xl py-3 pl-12 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? 'Registering Account...' : (
              <>
                <UserPlus className="w-5 h-5" /> Sign Up
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-700/50 pt-6">
          <p className="text-slate-400 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-semibold underline decoration-indigo-400/30 transition-colors">
              Login here
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
