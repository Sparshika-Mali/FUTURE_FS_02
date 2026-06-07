import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, X, Edit, Users, PhoneCall, CheckCircle, Trash2,
  LayoutDashboard, StickyNote, Calendar, Contact2, Building2, TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';

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
        headers: { 'Authorization': `Bearer ${token}` }
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
      case 'New': return 'text-indigo-500 bg-indigo-50 border-indigo-200';
      case 'Contacted': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'Converted': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  const totalLeads = leads.length;
  const contactedLeads = leads.filter(l => l.status === 'Contacted').length;
  const convertedLeads = leads.filter(l => l.status === 'Converted').length;
  const conversionRate = totalLeads === 0 ? 0 : Math.round((convertedLeads / totalLeads) * 100);

  // Mock data for Line Chart
  const lineData = [
    { name: 'Jan', value: 10 },
    { name: 'Feb', value: 25 },
    { name: 'Mar', value: 15 },
    { name: 'Apr', value: 40 },
    { name: 'May', value: 22 },
    { name: 'Jun', value: 35 },
  ];

  // Data for Donut Chart (Lead Sources)
  const sourceCount = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});
  
  const pieData = Object.keys(sourceCount).map(key => ({
    name: key,
    value: sourceCount[key]
  }));
  
  if (pieData.length === 0) {
    pieData.push({ name: 'Website', value: 1 });
  }

  const PIE_COLORS = ['#6366f1', '#ec4899', '#f97316', '#22c55e', '#8b5cf6'];

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', active: true },
    { icon: StickyNote, label: 'Notes', active: false },
    { icon: Calendar, label: 'Calendar', active: false },
    { icon: Contact2, label: 'Contacts', active: false },
    { icon: Building2, label: 'Companies', active: false }
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative flex font-sans overflow-hidden text-slate-800">
      <ParticlesBackground />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 z-20 flex flex-col shadow-sm hidden md:flex relative h-screen sticky top-0">
        <div className="p-6 border-b border-slate-200">
          <h1 className="text-2xl font-bold text-indigo-600 tracking-wide">Mini CRM</h1>
          <p className="text-xs text-slate-500 mt-1 uppercase font-semibold">Workspace</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item, idx) => (
            <button 
              key={idx}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${
                item.active 
                  ? 'bg-indigo-50 text-indigo-600 font-semibold shadow-sm border border-indigo-100' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto z-10 relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-20 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Dashboard</h2>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-slate-500 hover:text-red-500 transition-colors font-medium px-4 py-2 rounded-lg hover:bg-red-50"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </header>

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full space-y-8">
          
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-sm font-medium">Total Leads</p>
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-500"><Users size={18} /></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{totalLeads}</h3>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-sm font-medium">Contacted</p>
                <div className="p-2 bg-orange-50 rounded-lg text-orange-500"><PhoneCall size={18} /></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{contactedLeads}</h3>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-sm font-medium">Converted</p>
                <div className="p-2 bg-green-50 rounded-lg text-green-500"><CheckCircle size={18} /></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{convertedLeads}</h3>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex justify-between items-start mb-4">
                <p className="text-slate-500 text-sm font-medium">Conversion Rate</p>
                <div className="p-2 bg-pink-50 rounded-lg text-pink-500"><TrendingUp size={18} /></div>
              </div>
              <h3 className="text-3xl font-bold text-slate-800">{conversionRate}%</h3>
            </motion.div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Line Chart */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-sm font-semibold text-slate-800 mb-6 uppercase tracking-wide">Activity Trend</h3>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      cursor={{ stroke: '#cbd5e1', strokeWidth: 1, strokeDasharray: '4 4' }}
                    />
                    <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6, strokeWidth: 0, fill: '#ec4899' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Donut Chart */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <h3 className="text-sm font-semibold text-slate-800 mb-2 uppercase tracking-wide">Lead Sources</h3>
              <div className="flex-1 w-full h-[250px] min-h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      itemStyle={{ color: '#334155' }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Table Row */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-sm font-semibold text-slate-800 uppercase tracking-wide">Recent Leads</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
                    <th className="p-4 font-semibold border-b border-slate-100 pl-6">Client Name</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Email Address</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Source</th>
                    <th className="p-4 font-semibold border-b border-slate-100">Status</th>
                    <th className="p-4 font-semibold border-b border-slate-100 text-right pr-6">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {leads.map((lead, index) => (
                      <motion.tr 
                        key={lead._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                        onClick={() => openDrawer(lead)}
                      >
                        <td className="p-4 pl-6 font-medium text-slate-800">{lead.name}</td>
                        <td className="p-4 text-slate-500 text-sm">{lead.email}</td>
                        <td className="p-4 text-slate-500 text-sm">{lead.source}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider border ${getStatusColor(lead.status)}`}>
                            {lead.status}
                          </span>
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <div className="flex justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                              onClick={(e) => { e.stopPropagation(); openDrawer(lead); }}
                              className="text-slate-400 hover:text-indigo-500 transition-colors p-2 rounded hover:bg-white shadow-sm border border-transparent hover:border-slate-200"
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
      </div>

      {/* Drawer */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40"
              onClick={closeDrawer}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl border-l border-slate-100 z-50 flex flex-col"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
                <h2 className="text-lg font-bold text-slate-800">Update Lead Details</h2>
                <button onClick={closeDrawer} className="text-slate-400 hover:text-slate-700 transition-colors p-2 hover:bg-slate-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100">
                  <h3 className="text-xs text-indigo-400 font-bold uppercase tracking-wider mb-1">Contact Info</h3>
                  <p className="text-xl font-bold text-indigo-900">{selectedLead?.name}</p>
                  <p className="text-indigo-600/80 text-sm mt-1">{selectedLead?.email}</p>
                  <p className="text-xs text-indigo-400 mt-3 font-medium">Source: {selectedLead?.source}</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                  <select 
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Add New Note</label>
                  <textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all h-28 resize-none"
                    placeholder="Enter meeting notes, call summaries, etc..."
                  />
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-700 mb-2">Activity Log</h3>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 max-h-48 overflow-y-auto text-sm whitespace-pre-wrap text-slate-600 font-sans shadow-inner">
                    {selectedLead?.notes || "No activity logged yet."}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateLead}
                  className="w-full bg-indigo-500 text-white font-semibold py-3.5 rounded-xl hover:bg-pink-500 transition-all shadow-md border-none"
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
