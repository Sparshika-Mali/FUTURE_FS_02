import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import ParticleVortex from '../components/ParticleVortex';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        if (data.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Server connection failed');
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Particle Vortex Background Effect */}
      <ParticleVortex />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass-panel p-10 w-full max-w-md relative z-10 animate-float"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center mb-8">
          <motion.div variants={itemVariants} className="flex justify-center mb-4">
            <div className="p-4 bg-cosmic-neonCyan/10 rounded-full border border-cosmic-neonCyan/30 shadow-[0_0_15px_rgba(0,243,255,0.3)]">
              <LogIn className="text-cosmic-neonCyan w-8 h-8" />
            </div>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl font-bold text-white tracking-widest uppercase mb-2">Sparshika CRM</motion.h1>
          <motion.p variants={itemVariants} className="text-cosmic-neonCyan neon-text-cyan tracking-widest text-sm uppercase">System Authentication</motion.p>
        </motion.div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-red-400 text-center mb-6 text-sm bg-red-900/20 py-2 px-4 rounded-lg border border-red-500/30"
          >
            {error}
          </motion.p>
        )}

        <motion.form variants={containerVariants} initial="hidden" animate="visible" onSubmit={handleLogin} className="space-y-6">
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-cosmic-neonCyan transition-colors">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cosmic-neonCyan focus:ring-1 focus:ring-cosmic-neonCyan transition-all placeholder-gray-500"
              placeholder="Email Identifier"
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-gray-400 group-focus-within:text-cosmic-neonCyan transition-colors">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-cosmic-neonCyan focus:ring-1 focus:ring-cosmic-neonCyan transition-all placeholder-gray-500"
              placeholder="Passcode"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button 
              whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 243, 255, 0.5)" }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-cosmic-neonCyan to-blue-500 text-white font-bold py-3 rounded-xl uppercase tracking-wider transition-all mt-2 border-none"
              type="submit"
            >
              Establish Connection
            </motion.button>
          </motion.div>
        </motion.form>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-sm text-gray-400"
        >
          No active uplink? <Link to="/register" className="text-cosmic-neonCyan font-semibold hover:text-white transition-colors underline-offset-4 hover:underline">Register Signal</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
