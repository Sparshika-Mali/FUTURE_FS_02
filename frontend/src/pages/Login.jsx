import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';


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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-100 to-indigo-50 animate-gradient" style={{ backgroundSize: '200% 200%' }}>
      {/* Minimal Abstract Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-slate-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="glass-panel p-10 w-full max-w-md relative z-10 animate-float"
      >
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center mb-8">
          <motion.div variants={itemVariants} className="flex justify-center mb-4">
            <div className="p-4 bg-formal-light rounded-full border border-formal-border text-formal-primary shadow-sm">
              <LogIn className="w-8 h-8" />
            </div>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-2xl font-bold text-formal-dark mb-2">Sparshika CRM</motion.h1>
          <motion.p variants={itemVariants} className="text-formal-secondary text-sm">Welcome Back. Please log in to your account.</motion.p>
        </motion.div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
            className="text-red-600 text-center mb-6 text-sm bg-red-50 py-2 px-4 rounded-lg border border-red-200"
          >
            {error}
          </motion.p>
        )}

        <motion.form variants={containerVariants} initial="hidden" animate="visible" onSubmit={handleLogin} className="space-y-6">
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-formal-primary transition-colors">
              <Mail size={18} />
            </div>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-formal-light border border-formal-border rounded-xl pl-12 pr-4 py-3 text-formal-dark focus:outline-none focus:border-formal-primary focus:ring-1 focus:ring-formal-primary transition-all placeholder-slate-400"
              placeholder="Email Address"
              required
            />
          </motion.div>
          
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 group-focus-within:text-formal-primary transition-colors">
              <Lock size={18} />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-formal-light border border-formal-border rounded-xl pl-12 pr-4 py-3 text-formal-dark focus:outline-none focus:border-formal-primary focus:ring-1 focus:ring-formal-primary transition-all placeholder-slate-400"
              placeholder="Password"
              required
            />
          </motion.div>

          <motion.div variants={itemVariants}>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-formal-primary hover:bg-formal-accent text-white font-semibold py-3 rounded-xl transition-all mt-2 border-none shadow-sm"
              type="submit"
            >
              Log In
            </motion.button>
          </motion.div>
        </motion.form>
        
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-center text-sm text-formal-secondary"
        >
          Don't have an account? <Link to="/register" className="text-formal-primary font-semibold hover:text-formal-accent transition-colors underline-offset-4 hover:underline">Register Here</Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
