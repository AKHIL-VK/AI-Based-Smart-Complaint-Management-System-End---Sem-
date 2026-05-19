import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Shield, FileText, LayoutDashboard, LogOut, LogIn, UserPlus } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('complaint_token');
  const user = JSON.parse(localStorage.getItem('complaint_user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('complaint_token');
    localStorage.removeItem('complaint_user');
    window.location.href = '/#/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="p-2.5 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:border-indigo-500/40 transition-all duration-300">
                <Shield className="h-6 w-6 text-indigo-400 group-hover:rotate-6 transition-all" />
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text">
                CivicGuard <span className="text-indigo-400 font-black">AI</span>
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-4 sm:gap-6">
            
            {/* Register Complaint Form - Always public for users to file issues */}
            <Link 
              to="/register" 
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 border ${
                isActive('/register') 
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25' 
                  : 'bg-slate-800/40 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" /> Register Complaint
            </Link>

            {token ? (
              // Admin Logged In States
              <>
                <Link 
                  to="/" 
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 border ${
                    isActive('/') 
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-600/25' 
                      : 'bg-slate-800/40 text-slate-300 border-slate-700/60 hover:border-slate-500 hover:text-white'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" /> Admin Dashboard
                </Link>

                <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                  <div className="hidden md:block text-right">
                    <span className="block text-[10px] text-indigo-400 font-bold uppercase tracking-widest">Administrator</span>
                    <span className="block text-xs font-semibold text-slate-300">{user.name || 'Admin'}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-2xl text-red-400 transition-all flex items-center justify-center"
                    title="Sign Out"
                  >
                    <LogOut className="w-4.5 h-4.5" />
                  </button>
                </div>
              </>
            ) : (
              // Public Logged Out States
              <div className="flex items-center gap-3 pl-4 border-l border-slate-800">
                <Link 
                  to="/login"
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-400 hover:text-white transition-colors"
                >
                  <LogIn className="w-4 h-4" /> Admin Login
                </Link>
                
                <Link 
                  to="/signup"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-2xl text-sm font-bold text-white transition-all shadow-sm"
                >
                  <UserPlus className="w-4 h-4" /> Admin Signup
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </nav>
  );
}
