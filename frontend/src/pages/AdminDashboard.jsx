import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, X, Edit, Users, PhoneCall, CheckCircle, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
    e.stopPropagation(); // Prevent opening the edit drawer
    if (!window.confirm('Are you sure you want to delete this signal? This action cannot be undone.')) return;
    
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
      case 'New': return 'text-cosmic-neonCyan border-cosmic-neonCyan neon-shadow-cyan';
      case 'Contacted': return 'text-cosmic-neonOrange border-cosmic-neonOrange neon-shadow-orange';
      case 'Converted': return 'text-cosmic-emerald border-cosmic-emerald neon-shadow-emerald';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  const totalLeads = leads.length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;

  return (
    <div className="min-h-screen bg-cosmic-gradient relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cosmic-neonCyan opacity-5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cosmic-emerald opacity-5 blur-[120px] pointer-events-none"></div>

      <header className="glass-panel sticky top-0 z-20 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">Admin Dashboard</h1>
          <p className="text-xs text-gray-400 tracking-wider">Sparshika CRM System</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center space-x-2 text-gray-300 hover:text-cosmic-neonOrange transition-colors"
        >
          <LogOut size={18} />
          <span className="uppercase text-sm tracking-widest">Disconnect</span>
        </button>
      </header>

      <main className="flex-1 p-6 relative z-10 flex flex-col space-y-6 max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-panel p-6 rounded-xl flex items-center justify-between group hover:border-white/20 transition-all"
          >
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Total Signals</p>
              <h2 className="text-4xl font-bold text-white">{totalLeads}</h2>
            </div>
            <div className="p-3 bg-white/5 rounded-lg text-white">
              <Users size={24} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-panel p-6 rounded-xl flex items-center justify-between hover:border-white/20 transition-all group"
          >
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Contacted</p>
              <h2 className="text-4xl font-bold text-cosmic-neonOrange neon-text-orange">{contactedLeads}</h2>
            </div>
            <div className="p-3 bg-cosmic-neonOrange/10 rounded-lg text-cosmic-neonOrange">
              <PhoneCall size={24} />
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass-panel p-6 rounded-xl flex items-center justify-between hover:border-white/20 transition-all group"
          >
            <div>
              <p className="text-gray-400 text-sm uppercase tracking-wider mb-1">Converted</p>
              <h2 className="text-4xl font-bold text-cosmic-emerald neon-text-emerald">{convertedLeads}</h2>
            </div>
            <div className="p-3 bg-cosmic-emerald/10 rounded-lg text-cosmic-emerald">
              <CheckCircle size={24} />
            </div>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-panel rounded-xl flex-1 overflow-hidden flex flex-col"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-semibold uppercase tracking-wider">Client Inventory</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/5 text-gray-400 text-sm uppercase tracking-wider">
                  <th className="p-4 font-medium border-b border-white/10">Name</th>
                  <th className="p-4 font-medium border-b border-white/10">Email</th>
                  <th className="p-4 font-medium border-b border-white/10">Source</th>
                  <th className="p-4 font-medium border-b border-white/10">Status</th>
                  <th className="p-4 font-medium border-b border-white/10 text-right">Actions</th>
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
                      className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => openDrawer(lead)}
                    >
                      <td className="p-4 font-medium text-gray-200">{lead.name}</td>
                      <td className="p-4 text-gray-400">{lead.email}</td>
                      <td className="p-4 text-gray-400 text-sm">{lead.source}</td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end space-x-3 opacity-50 group-hover:opacity-100 transition-opacity">
                          <button 
                            onClick={(e) => { e.stopPropagation(); openDrawer(lead); }}
                            className="text-gray-400 hover:text-cosmic-neonCyan transition-colors p-2 rounded-lg hover:bg-white/5"
                            title="Edit Signal"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={(e) => handleDeleteLead(lead._id, e)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-white/5"
                            title="Delete Signal"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                {leads.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">
                      No signals detected in the sector.
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
              className="fixed inset-0 bg-black/80 z-40"
              onClick={closeDrawer}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0c0822]/95 backdrop-blur-xl shadow-2xl border-l border-white/10 z-50 flex flex-col"
            >
              <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                <h2 className="text-xl font-bold uppercase tracking-wider">Modify Signal</h2>
                <button onClick={closeDrawer} className="text-gray-400 hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                  <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-1">Entity Details</h3>
                  <p className="text-xl font-bold text-white">{selectedLead?.name}</p>
                  <p className="text-gray-400">{selectedLead?.email}</p>
                  <p className="text-sm text-gray-500 mt-2">Source: {selectedLead?.source}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">Workflow State</label>
                  <select 
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cosmic-neonCyan transition-all"
                  >
                    <option value="New" className="bg-cosmic-darker">New</option>
                    <option value="Contacted" className="bg-cosmic-darker">Contacted</option>
                    <option value="Converted" className="bg-cosmic-darker">Converted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2 uppercase tracking-wider">Append Logs</label>
                  <textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cosmic-neonCyan transition-all h-24 resize-none"
                    placeholder="Enter mission notes..."
                  />
                </div>

                <div>
                  <h3 className="text-sm text-gray-400 uppercase tracking-wider mb-3">Communication Logs</h3>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10 max-h-48 overflow-y-auto text-sm whitespace-pre-wrap text-gray-300 font-mono">
                    {selectedLead?.notes || "No logs available."}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-white/5">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateLead}
                  className="w-full bg-transparent border border-cosmic-neonCyan text-cosmic-neonCyan neon-text-cyan font-bold py-3 rounded-lg uppercase tracking-wider hover:bg-cosmic-neonCyan hover:text-cosmic-darker transition-all"
                >
                  Save Modifications
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
