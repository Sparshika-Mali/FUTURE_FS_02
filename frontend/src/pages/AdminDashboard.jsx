import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LogOut, X, Edit, Users, PhoneCall, CheckCircle, Trash2,
  LayoutDashboard, StickyNote, Calendar as CalendarIcon, Contact2, Building2, TrendingUp
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
  const [activeTab, setActiveTab] = useState('dashboard');
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

  const lineData = [
    { name: 'Jan', value: 10 },
    { name: 'Feb', value: 25 },
    { name: 'Mar', value: 15 },
    { name: 'Apr', value: 40 },
    { name: 'May', value: 22 },
    { name: 'Jun', value: Math.max(35, totalLeads) },
  ];

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

  const PIE_COLORS = ['#6366f1', '#ec4899', '#f97316', '#22c55e', '#8b5cf6', '#14b8a6', '#f43f5e'];

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
    { icon: StickyNote, label: 'Notes', id: 'notes' },
    { icon: CalendarIcon, label: 'Calendar', id: 'calendar' },
    { icon: Contact2, label: 'Contacts', id: 'contacts' },
    { icon: Building2, label: 'Companies', id: 'companies' }
  ];

  // --- Views ---
  const renderDashboard = () => (
    <div className="space-y-8">
      {/* Unique Vibrant KPI Cards (Deviating from the reference photo intentionally) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-2xl shadow-lg border border-indigo-400 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><Users size={64} /></div>
          <div className="relative z-10">
            <p className="text-indigo-100 text-sm font-semibold uppercase tracking-wider mb-2">Total Leads</p>
            <h3 className="text-4xl font-extrabold">{totalLeads}</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-orange-400 to-orange-500 p-6 rounded-2xl shadow-lg border border-orange-300 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><PhoneCall size={64} /></div>
          <div className="relative z-10">
            <p className="text-orange-100 text-sm font-semibold uppercase tracking-wider mb-2">Contacted</p>
            <h3 className="text-4xl font-extrabold">{contactedLeads}</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-gradient-to-br from-green-400 to-green-500 p-6 rounded-2xl shadow-lg border border-green-300 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><CheckCircle size={64} /></div>
          <div className="relative z-10">
            <p className="text-green-100 text-sm font-semibold uppercase tracking-wider mb-2">Converted</p>
            <h3 className="text-4xl font-extrabold">{convertedLeads}</h3>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-gradient-to-br from-pink-500 to-pink-600 p-6 rounded-2xl shadow-lg border border-pink-400 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20"><TrendingUp size={64} /></div>
          <div className="relative z-10">
            <p className="text-pink-100 text-sm font-semibold uppercase tracking-wider mb-2">Conversion Rate</p>
            <h3 className="text-4xl font-extrabold">{conversionRate}%</h3>
          </div>
        </motion.div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-400 mb-6 uppercase tracking-widest">Activity Trend</h3>
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
                <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8, strokeWidth: 0, fill: '#ec4899' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
          <h3 className="text-sm font-bold text-slate-400 mb-2 uppercase tracking-widest">Lead Sources</h3>
          <div className="flex-1 w-full h-[250px] min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={65}
                  outerRadius={90}
                  paddingAngle={6}
                  dataKey="value"
                  stroke="none"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#334155', fontWeight: 'bold' }}
                />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Embedded Table for Dashboard View */}
      {renderTable()}
    </div>
  );

  const renderTable = () => (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }} className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white">
        <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Client Directory</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-400 text-xs uppercase tracking-wider">
              <th className="p-4 font-semibold border-b border-slate-100 pl-6">Client Name</th>
              <th className="p-4 font-semibold border-b border-slate-100">Email Address</th>
              <th className="p-4 font-semibold border-b border-slate-100">Source</th>
              <th className="p-4 font-semibold border-b border-slate-100">Status</th>
              <th className="p-4 font-semibold border-b border-slate-100 text-right pr-6">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {leads.map((lead) => (
                <motion.tr 
                  key={lead._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="border-b border-slate-50 hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  onClick={() => openDrawer(lead)}
                >
                  <td className="p-4 pl-6 font-bold text-slate-700">{lead.name}</td>
                  <td className="p-4 text-slate-500 text-sm font-medium">{lead.email}</td>
                  <td className="p-4 text-slate-500 text-sm">{lead.source}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest border ${getStatusColor(lead.status)}`}>
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
  );

  const renderNotes = () => {
    const leadsWithNotes = leads.filter(l => l.notes && l.notes.trim() !== '');
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-slate-800">Client Notes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leadsWithNotes.map(lead => (
            <motion.div key={lead._id} initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="bg-yellow-50 p-6 rounded-2xl border border-yellow-200 shadow-sm hover:shadow-md transition-shadow relative">
              <div className="absolute top-0 right-0 w-8 h-8 bg-yellow-200 rounded-bl-2xl rounded-tr-2xl opacity-50"></div>
              <h3 className="font-bold text-slate-800 mb-1">{lead.name}</h3>
              <p className="text-xs text-yellow-600 font-semibold mb-4 uppercase">{lead.status}</p>
              <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{lead.notes}</p>
              <button onClick={() => openDrawer(lead)} className="mt-4 text-xs font-bold text-indigo-500 hover:text-indigo-600 flex items-center space-x-1">
                <Edit size={12}/> <span>Edit Note</span>
              </button>
            </motion.div>
          ))}
          {leadsWithNotes.length === 0 && (
            <div className="col-span-full bg-white p-10 text-center rounded-2xl border border-slate-100">
              <StickyNote size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500 font-medium">No notes have been added to any clients yet.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderCalendar = () => (
    <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[500px] text-center">
      <div className="p-6 bg-indigo-50 rounded-full mb-6">
        <CalendarIcon size={64} className="text-indigo-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">Calendar Integration</h2>
      <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed">
        Sync your Google or Outlook calendar to view upcoming client follow-ups and scheduled meetings directly in Mini CRM.
      </p>
      <button className="mt-8 px-8 py-3 bg-indigo-500 text-white rounded-xl font-bold hover:bg-pink-500 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 duration-200">
        Connect Calendar
      </button>
    </div>
  );

  const renderCompanies = () => (
    <div className="bg-white p-12 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center justify-center min-h-[500px] text-center">
      <div className="p-6 bg-pink-50 rounded-full mb-6">
        <Building2 size={64} className="text-pink-400" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-3">Company Directory Beta</h2>
      <p className="text-slate-500 max-w-md mx-auto text-lg leading-relaxed">
        We are building a robust B2B company tracking system. Soon you will be able to automatically group leads by their organization and view company-level metrics.
      </p>
      <div className="mt-8 inline-flex items-center space-x-2 px-6 py-2 bg-slate-100 text-slate-600 rounded-full font-semibold text-sm">
        <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
        <span>Coming in v2.0</span>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch(activeTab) {
      case 'dashboard': return renderDashboard();
      case 'notes': return renderNotes();
      case 'calendar': return renderCalendar();
      case 'contacts': return <div className="space-y-6"><h2 className="text-xl font-bold text-slate-800">All Contacts</h2>{renderTable()}</div>;
      case 'companies': return renderCompanies();
      default: return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex font-sans overflow-hidden text-slate-800">
      <ParticlesBackground />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 z-20 flex flex-col shadow-lg hidden md:flex relative h-screen sticky top-0">
        <div className="p-6 border-b border-slate-100 bg-white">
          <h1 className="text-2xl font-black text-indigo-600 tracking-tight flex items-center space-x-2">
            <span className="bg-indigo-600 text-white p-1.5 rounded-lg"><LayoutDashboard size={20}/></span>
            <span>Mini CRM</span>
          </h1>
          <p className="text-[10px] text-slate-400 mt-2 uppercase font-black tracking-widest">Admin Workspace</p>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto bg-white">
          {navItems.map((item) => (
            <button 
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                activeTab === item.id 
                  ? 'bg-indigo-50 text-indigo-600 font-bold shadow-sm border border-indigo-100 transform scale-[1.02]' 
                  : 'text-slate-500 font-medium hover:bg-slate-50 hover:text-slate-700 hover:translate-x-1'
              }`}
            >
              <item.icon size={20} className={activeTab === item.id ? 'text-indigo-500' : 'text-slate-400'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto z-10 relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 sticky top-0 z-30 px-8 py-4 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab}</h2>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-slate-500 hover:text-red-500 transition-colors font-bold px-4 py-2 rounded-xl hover:bg-red-50 border border-transparent hover:border-red-100"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </header>

        <main className="flex-1 p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderMainContent()}
            </motion.div>
          </AnimatePresence>
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
              className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40"
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
                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                  <h3 className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-2">Contact Info</h3>
                  <p className="text-xl font-black text-indigo-900">{selectedLead?.name}</p>
                  <p className="text-indigo-600/80 text-sm mt-1 font-medium">{selectedLead?.email}</p>
                  <div className="mt-4 inline-block px-3 py-1 bg-indigo-100 rounded-full text-indigo-600 text-xs font-bold">
                    Source: {selectedLead?.source}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Status</label>
                  <select 
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 font-medium focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all cursor-pointer"
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Converted">Converted</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Lead Notes</label>
                  <textarea 
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200 transition-all h-32 resize-none"
                    placeholder="Enter meeting notes, call summaries, etc..."
                  />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-700 mb-2">Saved Notes History</h3>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 max-h-48 overflow-y-auto text-sm whitespace-pre-wrap text-slate-600 font-medium shadow-inner">
                    {selectedLead?.notes || <span className="italic text-slate-400">No notes saved yet.</span>}
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-slate-100 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleUpdateLead}
                  className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-pink-500 transition-colors shadow-lg border-none"
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
