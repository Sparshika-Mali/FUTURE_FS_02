import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, Edit, Users, PhoneCall, CheckCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editStatus, setEditStatus] = useState('');
  const [newNote, setNewNote] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/leads`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLeads(data);
      } else if (response.status === 401 || response.status === 403) {
        navigate('/login');
      }
    } catch (error) {
      console.error('Failed to fetch leads', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const openDrawer = (lead) => {
    setSelectedLead(lead);
    setEditStatus(lead.status);
    setNewNote('');
    setIsDrawerOpen(true);
  };

  const closeDrawer = () => {
    setIsDrawerOpen(false);
    setSelectedLead(null);
  };

  const handleUpdateLead = async () => {
    if (!selectedLead) return;
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${selectedLead._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status: editStatus,
          notes: newNote
        })
      });
      
      if (response.ok) {
        fetchLeads();
        closeDrawer();
      }
    } catch (error) {
      console.error('Failed to update lead', error);
    }
  };

  const handleDeleteLead = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) return;
    
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        fetchLeads();
      } else {
        console.error('Failed to delete lead');
      }
    } catch (error) {
      console.error('Failed to delete lead', error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'text-vibrant-primary bg-indigo-50 border-indigo-200';
      case 'Contacted': return 'text-vibrant-warning bg-orange-50 border-orange-200';
      case 'Converted': return 'text-vibrant-success bg-green-50 border-green-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const totalLeads = leads.length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;

  return (
    <div className="min-h-screen bg-vibrant-light relative overflow-hidden flex flex-col font-sans">
      <ParticlesBackground />
      <header className="bg-white/80 backdrop-blur-md border-b border-vibrant-border sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-vibrant-primary tracking-wide">Mini CRM</h1>
          <p className="text-sm text-vibrant-secondary">Administrator Dashboard</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-vibrant-secondary hover:text-vibrant-danger transition-colors font-medium"
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </header>

      <main className="flex-1 p-6 relative z-10 flex flex-col space-y-6 max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-vibrant-border flex items-center justify-between"
          >
            <div>
              <p className="text-vibrant-secondary text-sm font-medium mb-1">Total Leads</p>
              <h2 className="text-4xl font-bold text-vibrant-dark">{totalLeads}</h2>
            </div>
            <div className="p-3 bg-indigo-50 rounded-lg text-vibrant-primary">
              <Users size={24} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-vibrant-border flex items-center justify-between"
          >
            <div>
              <p className="text-vibrant-secondary text-sm font-medium mb-1">Contacted</p>
              <h2 className="text-4xl font-bold text-vibrant-warning">{contactedLeads}</h2>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-vibrant-warning">
              <PhoneCall size={24} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-vibrant-border flex items-center justify-between"
          >
            <div>
              <p className="text-vibrant-secondary text-sm font-medium mb-1">Converted</p>
              <h2 className="text-4xl font-bold text-vibrant-success">{convertedLeads}</h2>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-vibrant-success">
              <CheckCircle size={24} />
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-sm border border-vibrant-border flex-1 overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-vibrant-border flex justify-between items-center bg-slate-50/50">
            <h2 className="text-lg font-semibold text-vibrant-dark">Client Roster</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-vibrant-secondary text-sm">
                  <th className="p-4 font-semibold border-b border-vibrant-border">Name</th>
                  <th className="p-4 font-semibold border-b border-vibrant-border">Email</th>
                  <th className="p-4 font-semibold border-b border-vibrant-border">Source</th>
                  <th className="p-4 font-semibold border-b border-vibrant-border">Status</th>
                  <th className="p-4 font-semibold border-b border-vibrant-border text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {leads.map((lead, index) => (
                    <motion.tr 
                      key={lead._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer group"
                      onClick={() => openDrawer(lead)}
                    >
                      <td className="p-4 font-medium text-slate-800">{lead.name}</td>
                      <td className="p-4 text-slate-600">{lead.email}</td>
                      <td className="p-4 text-slate-500 text-sm">{lead.source}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); openDrawer(lead); }}
                            className="text-slate-400 hover:text-vibrant-primary transition-colors p-2 rounded hover:bg-white shadow-sm border border-transparent hover:border-slate-200"
                            title="Edit Lead"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteLead(lead._id, e)}
                            className="text-slate-400 hover:text-red-500 transition-colors p-2 rounded hover:bg-white shadow-sm border border-transparent hover:border-slate-200"
                            title="Delete Lead"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {leads.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-slate-500">
                      No leads found in the system.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>

      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
              onClick={closeDrawer}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-200 z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-bold text-vibrant-dark">Update Lead Details</h2>
                <button onClick={closeDrawer} className="text-slate-400 hover:text-slate-700 transition-colors">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                  <h3 className="text-xs text-vibrant-secondary font-semibold uppercase mb-1">Contact Info</h3>
                  <p className="text-lg font-bold text-vibrant-dark">{selectedLead?.name}</p>
                  <p className="text-slate-600 text-sm">{selectedLead?.email}</p>
                  <p className="text-xs text-slate-500 mt-2">Source: {selectedLead?.source}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
                  <select 
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-700 focus:outline-none focus:border-vibrant-primary focus:ring-1 focus:ring-vibrant-primary transition-all shadow-sm"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Add New Note</label>
                  <textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-3 text-slate-700 focus:outline-none focus:border-vibrant-primary focus:ring-1 focus:ring-vibrant-primary transition-all h-24 resize-none shadow-sm"
                    placeholder="Enter meeting notes, call summaries, etc..."
                  />
                </div>

                <div>
                  <h3 className="text-sm font-medium text-slate-700 mb-2">Activity Log</h3>
                  <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 max-h-48 overflow-y-auto text-sm whitespace-pre-wrap text-slate-600 font-sans shadow-inner">
                    {selectedLead?.notes || "No activity logged yet."}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-200 bg-slate-50">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateLead}
                  className="w-full bg-vibrant-primary text-white font-semibold py-3 rounded-lg hover:bg-vibrant-accent transition-all shadow-sm"
                >
                  Save Changes
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
