import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, CheckCircle2, ChevronLeft, ShieldCheck, Zap } from 'lucide-react';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const isDark = theme === 'dark';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData.name, formData.email, formData.password);
      toast.success('Registration Encrypted. Welcome to the Elite Circle!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { icon: <User size={20} />, title: "Enroll Agent", desc: "Create your unique profile in our secure database" },
    { icon: <Zap size={20} />, title: "Configure Capital", desc: "Add liquidity instantly via local gateways" },
    { icon: <ShieldCheck size={20} />, title: "Launch Operations", desc: "Deploy engagement missions across any platform" }
  ];

  return (
    <div className={`min-h-screen flex font-sans transition-colors duration-500 ${isDark ? 'bg-background-dark text-white' : 'bg-background-light text-slate-900'}`}>
      {/* Left Side: Space Theme */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-center px-20 bg-space-stars bg-cover bg-center">
        <div className={`absolute inset-0 ${isDark ? 'bg-blue-900/60' : 'bg-primary/20'} backdrop-blur-[4px]`}></div>
        
        <div className="relative z-10 max-w-lg">
          <Link to="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-16 transition-colors font-black uppercase tracking-widest text-xs">
            <ChevronLeft size={16} /> Abort to Hub
          </Link>
          
          <h2 className="text-6xl font-black mb-10 leading-tight text-white">
            Enlist in the <br />
            Social <br />
            <span className="text-primary italic">Overdrive.</span>
          </h2>

          <div className="space-y-12">
             {steps.map((step, i) => (
                <div key={i} className="flex gap-6 items-start">
                   <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-primary border border-white/20 shrink-0 shadow-xl">
                      {step.icon}
                   </div>
                   <div>
                      <h4 className="font-bold text-xl mb-1 text-white">{step.title}</h4>
                      <p className="text-white/60 leading-relaxed italic font-medium">{step.desc}</p>
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div className="absolute top-1/4 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[120px] animate-pulse"></div>
      </div>

      {/* Right Side: Form */}
      <div className={`w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-24 relative ${isDark ? 'bg-background-dark' : 'bg-white'}`}>
        <motion.div 
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           className="w-full max-w-md pt-20 lg:pt-0"
        >
          <div className="mb-12">
            <h2 className={`text-5xl font-black mb-4 tracking-tighter ${isDark ? 'text-white' : 'text-slate-900'}`}>New Registration</h2>
            <p className={`font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Secure your position in the elite social growth network.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Agent Name</label>
              <div className="relative">
                 <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                 <input 
                    type="text" 
                    required
                    className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} border rounded-2xl py-5 pl-12 pr-6 outline-none focus:border-primary transition-all font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
                    placeholder="John Doe (Real name or Alias)"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                 />
              </div>
            </div>

            <div className="space-y-3">
              <label className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Secure Email</label>
              <div className="relative">
                 <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                 <input 
                    type="email" 
                    required
                    className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} border rounded-2xl py-5 pl-12 pr-6 outline-none focus:border-primary transition-all font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
                    placeholder="agent@boostnaija.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                 />
              </div>
            </div>

            <div className="space-y-3">
              <label className={`text-xs font-black uppercase tracking-[0.2em] ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Creation Password</label>
              <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                 <input 
                    type="password" 
                    required
                    className={`w-full ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'} border rounded-2xl py-5 pl-12 pr-6 outline-none focus:border-primary transition-all font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                 />
              </div>
            </div>

            <button 
              disabled={loading}
              className="w-full bg-primary text-white py-6 rounded-2xl font-black flex items-center justify-center gap-4 hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 active:scale-95 disabled:opacity-50 group"
            >
              {loading ? 'Committing to Ledger...' : 'Initialize Enlistment'}
              <ArrowRight className="group-hover:translate-x-2 transition-transform" size={24} />
            </button>
          </form>

          <p className={`mt-12 text-center font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Already an Agent? {' '}
            <Link to="/login" className="text-primary font-black hover:underline decoration-2 underline-offset-4">Connect Here</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
