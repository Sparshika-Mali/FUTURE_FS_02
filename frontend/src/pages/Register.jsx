import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Mail, Lock, User } from 'lucide-react';
import ParticlesBackground from '../components/ParticlesBackground';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      });
      const data = await response.json();
      
      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.message || 'Registration failed');
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-white">
      <ParticlesBackground />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="bg-white/80 backdrop-blur-md p-10 w-full max-w-md relative z-10 border border-slate-200 rounded-2xl shadow-xl animate-float"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center mb-8">
          <motion.div variants={itemVariants} className="flex justify-center mb-4">
            <div className="p-4 bg-formal-primary text-white rounded-full shadow-sm">
              <UserPlus className="w-8 h-8" />
            </div>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-2xl font-bold text-formal-primary mb-2">Sparshika CRM</motion.h1>
          <motion.p variants={itemVariants} className="text-formal-secondary text-sm">Create a new client account.</motion.p>
        </motion.div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-white text-center mb-6 text-sm bg-formal-danger py-2 px-4 rounded-lg border border-red-800 shadow-sm"
          >
            {error}
          </motion.p>
        )}

        <motion.form variants={containerVariants} initial="hidden" animate="visible" onSubmit={handleRegister} className="space-y-6">
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-formal-accent transition-colors">
              <User size={18} />
            </div>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-formal-dark focus:outline-none focus:border-formal-accent focus:ring-1 focus:ring-formal-accent transition-all placeholder-slate-400"
              placeholder="Full Name"
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-formal-accent transition-colors">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-formal-dark focus:outline-none focus:border-formal-accent focus:ring-1 focus:ring-formal-accent transition-all placeholder-slate-400"
              placeholder="Email Address"
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-formal-accent transition-colors">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-4 py-3 text-formal-dark focus:outline-none focus:border-formal-accent focus:ring-1 focus:ring-formal-accent transition-all placeholder-slate-400"
              placeholder="Password"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-formal-primary hover:bg-formal-accent text-white font-semibold py-3 rounded-xl transition-all mt-2 border-none shadow-md"
              type="submit"
            >
              Create Account
            </motion.button>
          </motion.div>
        </motion.form>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-sm text-formal-secondary"
        >
          Already have an account? <Link to="/login" className="text-formal-accent font-semibold hover:text-formal-primary transition-colors underline-offset-4 hover:underline">Log In</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
