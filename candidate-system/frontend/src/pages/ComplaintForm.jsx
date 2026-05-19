import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Send, Sparkles, User, Mail, MapPin, Layers, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

export default function ComplaintForm() {
  // Input fields state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Water Supply');
  const [location, setLocation] = useState('');

  // UI state
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // AI Preview results
  const [aiResult, setAiResult] = useState(null);

  // Validate form fields
  const validateForm = () => {
    if (!name || !email || !title || !description || !location) {
      setError('Validation Error: All fields are mandatory.');
      return false;
    }
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      setError('Validation Error: Please provide a valid email address.');
      return false;
    }
    return true;
  };

  // Preview AI Assessment
  const handleAiPreview = async () => {
    if (!title || !description) {
      setError('Please fill in at least the Title and Description to generate an AI preview.');
      return;
    }
    
    setError('');
    setAiLoading(true);
    setAiResult(null);

    try {
      const res = await axios.post('http://localhost:5000/api/ai/analyze', {
        title,
        description,
        category
      });
      setAiResult(res.data);
    } catch (err) {
      setError('Failed to trigger AI Analyzer: ' + (err.response?.data?.error || err.message));
    } finally {
      setAiLoading(false);
    }
  };

  // Submit Complaint
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/complaints', {
        name,
        email,
        title,
        description,
        category,
        location
      });
      
      setSuccess('Complaint stored successfully! Your report has been logged and analyzed by AI.');
      // Auto fill AI Result from the registered response
      setAiResult(res.data.complaint);
      
      // Clear inputs
      setName('');
      setEmail('');
      setTitle('');
      setDescription('');
      setLocation('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit complaint. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-emerald-400">
          Smart Complaint Portal
        </h1>
        <p className="text-slate-400 mt-2 max-w-xl mx-auto text-sm">
          File municipal complaints online and let our civic AI automatically route issues and prioritize response teams.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Hand: Registration Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 bg-slate-800/40 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl">
          
          <h2 className="text-xl font-bold text-white flex items-center gap-2 pb-4 border-b border-slate-700/50">
            <FileText className="w-5 h-5 text-indigo-400" /> New Complaint Registration
          </h2>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex gap-3 text-red-200 text-sm items-start">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex gap-3 text-emerald-200 text-sm items-start">
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-emerald-400 mt-0.5" />
              <span>{success}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Your Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rahul Kumar"
                  className="w-full bg-slate-900/40 border border-slate-700/80 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="rahul@gmail.com"
                  className="w-full bg-slate-900/40 border border-slate-700/80 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Category</label>
              <div className="relative">
                <Layers className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-slate-900/40 border border-slate-700/80 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all appearance-none cursor-pointer"
                >
                  <option value="Water Supply">Water Supply</option>
                  <option value="Electricity">Electricity</option>
                  <option value="Waste & Sanitation">Waste & Sanitation</option>
                  <option value="Roads & Infrastructure">Roads & Infrastructure</option>
                  <option value="Public Safety">Public Safety</option>
                  <option value="General Civic Inquiry">General Civic Inquiry</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Location (City)</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Ghaziabad"
                  className="w-full bg-slate-900/40 border border-slate-700/80 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  required
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Complaint Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Water Pipeline Leakage near Market"
              className="w-full bg-slate-900/40 border border-slate-700/80 rounded-2xl py-3 px-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <div>
            <label className="block text-slate-300 text-xs font-semibold uppercase tracking-wider mb-2">Detailed Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the complaint in detail. Explain the location, severe factors, or current impacts."
              rows={4}
              className="w-full bg-slate-900/40 border border-slate-700/80 rounded-2xl py-3 px-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              required
            />
          </div>

          <div className="flex gap-4 pt-2">
            <button
              type="button"
              onClick={handleAiPreview}
              disabled={aiLoading || loading}
              className="flex-1 py-3 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 text-indigo-300 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center justify-center gap-2"
            >
              {aiLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> AI Preview Assessment
                </>
              )}
            </button>

            <button
              type="submit"
              disabled={loading || aiLoading}
              className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white rounded-2xl font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" /> Submit Complaint
                </>
              )}
            </button>
          </div>

        </form>

        {/* Right Hand: AI Analysis Result Display Panel */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-6 shadow-xl relative overflow-hidden">
            
            {/* Background glowing decorations */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

            <h3 className="text-lg font-bold text-white flex items-center gap-2 pb-4 border-b border-slate-700/50 mb-5">
              <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" /> AI Analysis Result
            </h3>

            {aiLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <Loader2 className="w-10 h-10 text-indigo-400 animate-spin mb-4" />
                <p className="text-sm font-medium animate-pulse">Running smart civic intelligence analysis...</p>
                <p className="text-xs text-slate-500 mt-1">Classifying priority, department & auto-response</p>
              </div>
            ) : aiResult ? (
              <div className="space-y-5 animate-fadeIn">
                
                {/* Priority Status Badge */}
                <div className="flex justify-between items-center bg-slate-900/40 p-4 border border-slate-700/40 rounded-2xl">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Priority Urgency</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-1 shadow-sm ${
                      aiResult.priority === 'High' 
                        ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                        : (aiResult.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20')
                    }`}>
                      {aiResult.priority || 'Low'}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Assigned Department</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-sm">
                      {aiResult.department || 'Municipal General'}
                    </span>
                  </div>
                </div>

                {/* Complaint Summary */}
                <div>
                  <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">AI Summary Summary</span>
                  <div className="bg-slate-950/40 p-4 border border-slate-700/30 rounded-2xl text-slate-200 text-sm leading-relaxed">
                    {aiResult.summary || 'Summary has not been generated.'}
                  </div>
                </div>

                {/* Auto User Response */}
                <div>
                  <span className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Auto-generated Response</span>
                  <div className="bg-slate-950/40 p-4 border border-slate-700/30 rounded-2xl text-slate-300 text-sm leading-relaxed italic">
                    "{aiResult.autoResponse || 'Automated response has not been generated.'}"
                  </div>
                </div>

                <div className="text-center text-[10px] text-indigo-400/80 font-medium pt-2">
                  ✨ Civic AI Analysis updated successfully.
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-500 text-center px-4">
                <Sparkles className="w-10 h-10 text-slate-600 mb-4" />
                <p className="text-sm font-medium">No active analysis preview.</p>
                <p className="text-xs text-slate-600 mt-1 max-w-[250px]">
                  Fill out the complaint form and click "AI Preview Assessment" or submit to view classification results.
                </p>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
