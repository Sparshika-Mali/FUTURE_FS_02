import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Activity, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ParticlesBackground from '../components/ParticlesBackground';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function ClientDashboard() {
  const [profile, setProfile] = useState(null);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${API_BASE_URL}/leads/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Failed to fetch profile', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'New': return 'text-indigo-500 bg-indigo-50 border-indigo-200';
      case 'Contacted': return 'text-orange-500 bg-orange-50 border-orange-200';
      case 'Converted': return 'text-green-500 bg-green-50 border-green-200';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans overflow-hidden">
      <ParticlesBackground />
      <header className="bg-white/80 backdrop-blur-md border-b border-vibrant-border sticky top-0 z-20 px-6 py-4 flex justify-between items-center shadow-sm">
        <div>
          <h1 className="text-xl font-bold text-indigo-500 tracking-wide">Client Portal</h1>
          <p className="text-sm text-violet-500">Sparshika Communication Relay</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-2 text-violet-500">
            <UserIcon size={16} />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-violet-500 hover:text-red-500 transition-colors font-medium"
          >
            <LogOut size={18} />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 relative z-10 flex flex-col space-y-6 max-w-4xl mx-auto w-full mt-8">
        {!profile ? (
          <div className="bg-white border border-vibrant-border p-10 text-center rounded-xl shadow-sm">
            <Activity className="animate-pulse mx-auto text-indigo-500 mb-4" size={32} />
            <h2 className="text-lg font-medium text-indigo-900">Loading your profile...</h2>
          </div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-vibrant-border p-8 rounded-xl shadow-sm relative overflow-hidden"
            >
              <h2 className="text-sm font-bold text-violet-500 uppercase mb-2">Current Status</h2>
              <div className={`inline-block px-6 py-2 rounded-full font-bold text-sm border ${getStatusColor(profile.status)}`}>
                {profile.status}
              </div>
              <p className="mt-4 text-slate-600 leading-relaxed">
                Welcome to your client portal, <span className="font-semibold text-indigo-900">{profile.name}</span>. We are currently reviewing your account details. 
                Any updates from our team will appear in your activity log below.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white border border-vibrant-border rounded-xl shadow-sm flex-1 flex flex-col overflow-hidden"
            >
              <div className="bg-slate-50 p-6 border-b border-vibrant-border">
                <h2 className="text-lg font-bold text-indigo-900">Activity Log</h2>
              </div>
              <div className="p-6 flex-1 min-h-[300px] text-sm text-slate-700 whitespace-pre-wrap overflow-y-auto bg-white">
                {profile.notes || "No recent activity recorded on your account."}
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
