import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  BarChart, ListFilter, Search, MapPin, Sparkles, RefreshCw, 
  Trash2, AlertTriangle, Layers, User, Calendar, Edit3, HelpCircle, CheckCircle, Clock
} from 'lucide-react';
import { API_BASE } from '../config';

export default function Dashboard() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Search & Filter state
  const [searchLocation, setSearchLocation] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Selected complaint for detailed AI Modal
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Authentication check
  const token = localStorage.getItem('complaint_token');

  const fetchComplaints = async () => {
    setLoading(true);
    setError('');
    try {
      let url = `${API_BASE}/complaints`;
      
      // If we are filtering by category
      if (filterCategory) {
        url += `?category=${encodeURIComponent(filterCategory)}`;
      }

      const res = await axios.get(url);
      setComplaints(res.data);
    } catch (err) {
      setError('Failed to fetch complaints: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Triggered when searching by location (Directly uses the Q2 REST API)
  const handleLocationSearch = async (e) => {
    e.preventDefault();
    if (!searchLocation.trim()) {
      fetchComplaints();
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await axios.get(`${API_BASE}/complaints/search?location=${encodeURIComponent(searchLocation.trim())}`);
      setComplaints(res.data);
    } catch (err) {
      setError('Location Search Failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Update complaint status (Directly uses the Q2 PUT API)
  const handleStatusUpdate = async (id, currentStatus) => {
    let nextStatus = 'Pending';
    if (currentStatus === 'Pending') nextStatus = 'In Progress';
    else if (currentStatus === 'In Progress') nextStatus = 'Resolved';
    else nextStatus = 'Pending';

    try {
      const res = await axios.put(`${API_BASE}/complaints/${id}`, { status: nextStatus });
      // Update local state
      setComplaints(complaints.map(c => c._id === id ? { ...c, status: res.data.complaint.status } : c));
      if (selectedComplaint && selectedComplaint._id === id) {
        setSelectedComplaint({ ...selectedComplaint, status: res.data.complaint.status });
      }
    } catch (err) {
      setError('Failed to update status: ' + (err.response?.data?.error || err.message));
    }
  };

  // Delete complaint record (Directly uses the Q4 DELETE API)
  const handleDelete = async (id, e) => {
    e.stopPropagation(); // Avoid opening AI modal
    if (!window.confirm('Are you sure you want to remove this complaint?')) return;

    try {
      await axios.delete(`${API_BASE}/complaints/${id}`);
      setComplaints(complaints.filter(c => c._id !== id));
      if (selectedComplaint && selectedComplaint._id === id) {
        setSelectedComplaint(null);
      }
    } catch (err) {
      setError('Failed to delete complaint: ' + (err.response?.data?.error || err.message));
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [filterCategory]);

  // Compute metrics
  const totalCount = complaints.length;
  const pendingCount = complaints.filter(c => c.status === 'Pending').length;
  const inProgressCount = complaints.filter(c => c.status === 'In Progress').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;
  const highPriorityCount = complaints.filter(c => c.priority === 'High').length;

  return (
    <div className="space-y-8 max-w-7xl mx-auto py-6 px-4">
      
      {/* Upper stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-5 shadow-lg relative overflow-hidden flex items-center gap-4">
          <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-400">
            <BarChart className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total Filed</span>
            <h3 className="text-2xl font-black text-white mt-0.5">{totalCount}</h3>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-5 shadow-lg relative overflow-hidden flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-2xl border border-yellow-500/20 text-yellow-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">In Progress / Pending</span>
            <h3 className="text-2xl font-black text-white mt-0.5">{inProgressCount + pendingCount}</h3>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-5 shadow-lg relative overflow-hidden flex items-center gap-4">
          <div className="p-3 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Resolved</span>
            <h3 className="text-2xl font-black text-white mt-0.5">{resolvedCount}</h3>
          </div>
        </div>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/60 rounded-3xl p-5 shadow-lg relative overflow-hidden flex items-center gap-4 border-red-500/20">
          <div className="p-3 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Urgent Warnings</span>
            <h3 className="text-2xl font-black text-white mt-0.5">{highPriorityCount}</h3>
          </div>
        </div>

      </div>

      {/* Interactive Controls & Filters */}
      <div className="bg-slate-800/30 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        
        {/* Search Input */}
        <form onSubmit={handleLocationSearch} className="flex items-center gap-3 w-full md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              placeholder="Search by city (e.g. Ghaziabad)..."
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-2xl py-3 pl-11 pr-4 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
            />
          </div>
          <button 
            type="submit" 
            className="py-3 px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-sm font-semibold transition-all shadow-md shadow-indigo-600/25 flex items-center gap-1.5"
          >
            <Search className="w-4 h-4" /> Search
          </button>
        </form>

        {/* Filter controls */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          
          <div className="relative flex-1 md:w-60">
            <ListFilter className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-700/80 rounded-2xl py-3 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              <option value="Water Supply">Water Supply</option>
              <option value="Electricity">Electricity</option>
              <option value="Waste & Sanitation">Waste & Sanitation</option>
              <option value="Roads & Infrastructure">Roads & Infrastructure</option>
              <option value="Public Safety">Public Safety</option>
            </select>
          </div>

          <button 
            onClick={() => { setFilterCategory(''); setSearchLocation(''); fetchComplaints(); }}
            className="p-3 bg-slate-700/50 hover:bg-slate-700 border border-slate-700 rounded-2xl text-slate-300 hover:text-white transition-all shadow-sm"
            title="Reset Filters"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-200 text-sm flex gap-2 items-center">
          <AlertTriangle className="w-5 h-5 text-red-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Grid: list + AI card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Complaints List */}
        <div className="lg:col-span-8 space-y-4">
          <h2 className="text-xl font-bold text-white mb-2">Complaint Registry</h2>

          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-400 bg-slate-800/20 border border-slate-700/40 rounded-3xl">
              <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mb-4" />
              <p className="text-sm font-semibold">Fetching complaint records...</p>
            </div>
          ) : complaints.length === 0 ? (
            <div className="py-20 text-center text-slate-500 bg-slate-800/20 border border-slate-700/40 rounded-3xl">
              <HelpCircle className="w-12 h-12 text-slate-600 mx-auto mb-4" />
              <p className="text-sm font-medium">No civic complaints found matching your query.</p>
              <p className="text-xs text-slate-600 mt-1">Try resetting filters or submitting a new issue.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map(complaint => (
                <div 
                  key={complaint._id}
                  onClick={() => setSelectedComplaint(complaint)}
                  className={`bg-slate-800/40 hover:bg-slate-800/70 backdrop-blur-xl border rounded-3xl p-5 shadow-sm transition-all duration-300 cursor-pointer flex flex-col sm:flex-row justify-between items-start gap-4 relative overflow-hidden group ${
                    selectedComplaint?._id === complaint._id ? 'border-indigo-500 shadow-indigo-500/10' : 'border-slate-700/60'
                  }`}
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 bg-slate-900 text-slate-400 border border-slate-700 text-[10px] font-bold rounded-full">
                        {complaint.category}
                      </span>
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold rounded-full ${
                        complaint.priority === 'High' 
                          ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                          : (complaint.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20')
                      }`}>
                        {complaint.priority} Priority
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                        <MapPin className="w-3.5 h-3.5" /> {complaint.location}
                      </span>
                    </div>

                    <h3 className="font-bold text-white text-base tracking-tight leading-snug group-hover:text-indigo-400 transition-colors">
                      {complaint.title}
                    </h3>
                    <p className="text-slate-400 text-sm line-clamp-2 leading-relaxed">
                      {complaint.description}
                    </p>

                    <div className="flex items-center gap-4 text-[10px] text-slate-500 pt-1 font-semibold uppercase tracking-wider">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> {complaint.name}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col justify-end items-end gap-3 w-full sm:w-auto mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-700/50">
                    
                    {/* Status Toggle Button (Calls PUT status update) */}
                    <button
                      onClick={(e) => { e.stopPropagation(); handleStatusUpdate(complaint._id, complaint.status); }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold w-full sm:w-28 text-center flex items-center justify-center gap-1 transition-all ${
                        complaint.status === 'Resolved' 
                          ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                          : (complaint.status === 'In Progress' ? 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600')
                      }`}
                      title="Click to toggle status"
                    >
                      <Clock className="w-3.5 h-3.5" /> {complaint.status}
                    </button>

                    {/* Delete Action button */}
                    <button
                      onClick={(e) => handleDelete(complaint._id, e)}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 hover:border-red-500/40 rounded-xl text-red-400 transition-all flex items-center justify-center"
                      title="Delete Complaint"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Detailed AI Assessment Card */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-xl font-bold text-white mb-2">AI Analysis Dashboard</h2>

          {selectedComplaint ? (
            <div className="bg-slate-800/40 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 shadow-xl relative overflow-hidden animate-fadeIn">
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none" />

              <div className="flex justify-between items-start pb-4 border-b border-slate-700/50 mb-5">
                <div>
                  <h3 className="font-extrabold text-white text-lg tracking-tight flex items-center gap-1.5">
                    <Sparkles className="w-5 h-5 text-indigo-400" /> Assessment View
                  </h3>
                  <span className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Complaint ID: ...{selectedComplaint._id.substring(18)}</span>
                </div>
                <button 
                  onClick={() => setSelectedComplaint(null)} 
                  className="text-xs font-semibold px-2 py-1 bg-slate-700 border border-slate-600 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>

              <div className="space-y-5">
                
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Issue Topic</span>
                  <span className="block font-bold text-slate-200 text-sm">{selectedComplaint.title}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 bg-slate-900/40 p-4 border border-slate-700/40 rounded-2xl">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Priority</span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 ${
                      selectedComplaint.priority === 'High' 
                        ? 'bg-red-500/10 text-red-400' 
                        : (selectedComplaint.priority === 'Medium' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-emerald-500/10 text-emerald-400')
                    }`}>
                      {selectedComplaint.priority}
                    </span>
                  </div>

                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold">Concerns</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold mt-1 bg-indigo-500/10 text-indigo-400">
                      {selectedComplaint.department || 'Water Supply'}
                    </span>
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">AI Generated Summary</span>
                  <div className="bg-slate-950/40 p-4 border border-slate-700/30 rounded-2xl text-slate-200 text-xs leading-relaxed">
                    {selectedComplaint.summary || 'AI Summary has not been generated.'}
                  </div>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 uppercase tracking-widest font-semibold mb-1">Auto-Response Notification</span>
                  <div className="bg-slate-950/40 p-4 border border-slate-700/30 rounded-2xl text-slate-300 text-xs leading-relaxed italic">
                    "{selectedComplaint.autoResponse || 'Auto reply has not been generated.'}"
                  </div>
                </div>

                <div className="p-4 bg-slate-900/50 border border-slate-700/40 rounded-2xl text-xs text-slate-400 space-y-1.5">
                  <span className="font-semibold text-slate-300 block mb-1">Citizen Contact Details:</span>
                  <p><strong>Filer Name:</strong> {selectedComplaint.name}</p>
                  <p><strong>Email Address:</strong> {selectedComplaint.email}</p>
                  <p><strong>Location Filed:</strong> {selectedComplaint.location}</p>
                  <p><strong>Register Time:</strong> {new Date(selectedComplaint.createdAt).toLocaleString()}</p>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-slate-800/40 border border-slate-700/60 rounded-3xl p-8 text-center text-slate-500 py-24 shadow-xl">
              <Sparkles className="w-10 h-10 text-slate-700 mx-auto mb-4 animate-pulse" />
              <p className="text-sm font-semibold">Select a civic complaint card</p>
              <p className="text-xs text-slate-600 mt-1 max-w-[200px] mx-auto">
                Click any complaint card in the registry list to display the AI's priority metrics, routing recommendation, and automated citizen responses.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
