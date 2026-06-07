import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { LogOut, Activity, User as UserIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
      case 'New': return 'text-cosmic-neonCyan border-cosmic-neonCyan neon-shadow-cyan';
      case 'Contacted': return 'text-cosmic-neonOrange border-cosmic-neonOrange neon-shadow-orange';
      case 'Converted': return 'text-cosmic-emerald border-cosmic-emerald neon-shadow-emerald';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-cosmic-gradient relative overflow-hidden flex flex-col">
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-cosmic-neonCyan opacity-5 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-cosmic-neonOrange opacity-5 blur-[120px] pointer-events-none"></div>

      <header className="glass-panel sticky top-0 z-20 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-white tracking-widest uppercase">Client Portal</h1>
          <p className="text-xs text-gray-400 tracking-wider">Sparshika Communication Relay</p>
        </div>
        <div className="flex items-center space-x-6">
          <div className="hidden md:flex items-center space-x-2 text-gray-300">
            <UserIcon size={16} />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-2 text-gray-400 hover:text-cosmic-neonOrange transition-colors"
          >
            <LogOut size={18} />
            <span className="uppercase text-sm tracking-widest">Disconnect</span>
          </button>
        </div>
      </header>

      <main className="flex-1 p-6 relative z-10 flex flex-col space-y-6 max-w-4xl mx-auto w-full mt-8">
        {!profile ? (
          <div className="glass-panel p-10 text-center rounded-xl">
            <Activity className="animate-pulse mx-auto text-cosmic-neonCyan mb-4" size={32} />
            <h2 className="text-xl text-white">Initializing your secure channel...</h2>
          </div>
        ) : (
          <>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass-panel p-8 rounded-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full"></div>
              <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-1">Current Workflow Status</h2>
              <div className={`inline-block px-6 py-2 mt-2 rounded-full font-bold text-lg border ${getStatusColor(profile.status)}`}>
                {profile.status}
              </div>
              <p className="mt-4 text-gray-300">
                Welcome to your secure client portal, {profile.name}. We are currently processing your request. 
                Any updates from our team will appear in your communication logs below.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-panel p-8 rounded-xl flex-1 flex flex-col"
            >
              <h2 className="text-lg font-bold uppercase tracking-wider text-white mb-6 border-b border-white/10 pb-4">Communication Logs</h2>
              <div className="bg-black/30 rounded-lg p-6 flex-1 min-h-[300px] border border-white/5 font-mono text-sm text-gray-300 whitespace-pre-wrap overflow-y-auto">
                {profile.notes || "No incoming transmissions at this time."}
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
