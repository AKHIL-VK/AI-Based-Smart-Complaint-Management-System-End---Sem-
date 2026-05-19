import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Protected from './components/Protected';
import Dashboard from './pages/Dashboard';
import ComplaintForm from './pages/ComplaintForm';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-slate-300 antialiased selection:bg-indigo-500/30">
        
        {/* Responsive Modern Header */}
        <Navbar />

        {/* Core Main Layout */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          <Routes>
            
            {/* 🔑 Protected Admin Dashboard */}
            <Route 
              path="/" 
              element={
                <Protected>
                  <Dashboard />
                </Protected>
              } 
            />

            {/* 📝 Public Complaint Submission Form */}
            <Route path="/register" element={<ComplaintForm />} />

            {/* 🔓 Public Authentication Pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />

            {/* 🔀 Fallback wildcard route */}
            <Route path="*" element={<Navigate to="/" replace />} />

          </Routes>
        </main>
        
        {/* Footer */}
        <footer className="py-6 border-t border-slate-800 bg-slate-950/20 text-center text-xs text-slate-500 font-semibold tracking-wider uppercase">
          © 2026 CivicGuard AI System • AIML Blended Division • Q4 MERN ESE Exam
        </footer>

      </div>
    </Router>
  );
}

export default App;
