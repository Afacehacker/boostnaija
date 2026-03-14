import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Wallet, List, TrendingUp, AlertCircle, Plus, Zap, 
  ArrowRight, Star, Shield, Activity, Globe, Cpu, Clock, Bell
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState({ totalOrders: 0, activeOrders: 0, totalSpent: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchStats();
    setTimeout(() => setIsLoaded(true), 100);
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${API_URL}/orders`);
      const orders = res.data.data;
      const spent = orders.reduce((acc, curr) => acc + curr.price, 0);
      const active = orders.filter(o => ['pending', 'processing'].includes(o.status)).length;
      setStats({
        totalOrders: orders.length,
        activeOrders: active,
        totalSpent: spent
      });
    } catch (err) {
      console.error('Failed to fetch stats');
    }
  };

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const meshBg = isDark ? 'bg-cyber-mesh' : 'bg-light-mesh';

  return (
    <div className={`min-h-screen pt-32 pb-40 transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Command Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`mb-12 relative overflow-hidden rounded-[4rem] border ${isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-slate-200'} p-10 lg:p-16 shadow-3xl`}
        >
           <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-12">
              <div className="space-y-6">
                 <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-10 h-10 rounded-xl border-2 border-background-dark overflow-hidden">
                            <img src={`https://i.pravatar.cc/150?u=${i*50}`} alt="avatar" />
                         </div>
                       ))}
                    </div>
                    <div className={`h-1.5 w-1.5 rounded-full bg-green-500 shadow-[0_0_10px_#22C55E] animate-pulse`}></div>
                    <span className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>Neural Link Established</span>
                 </div>
                 
                 <h1 className={`text-5xl lg:text-7xl font-black tracking-tight leading-none ${textColor}`}>
                   NEO-BASE <br/><span className="text-gradient italic text-6xl">OPERATIVE:</span> {user?.name.split(' ')[0]}
                 </h1>
                 
                 <p className={`text-xl font-medium ${subTextColor} max-w-xl leading-relaxed`}>
                   Authorized access granted to <span className="text-primary font-black uppercase tracking-widest italic">BoostNaija Arsenal</span>. Global engage-signals are optimized for deployment.
                 </p>
              </div>

              <div className="flex flex-col items-end gap-6 w-full lg:w-auto">
                 <div className={`p-6 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'} text-right w-full lg:w-64`}>
                    <p className={`text-[10px] font-black uppercase tracking-widest ${subTextColor} mb-2`}>AGENT RANK</p>
                    <p className="text-2xl font-black text-primary italic">ELITE ENVOY</p>
                    <div className="w-full h-1 bg-white/10 rounded-full mt-4 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '75%' }}
                         transition={{ duration: 1.5, delay: 0.5 }}
                         className="h-full bg-primary"
                       />
                    </div>
                 </div>
                 <Link to="/dashboard/services" className="btn-primary w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-lg group shadow-[0_20px_40px_rgba(58,122,254,0.3)] hover:scale-[1.03] transition-transform">
                    <Zap size={20} fill="white" /> DEPLOY MISSION
                 </Link>
              </div>
           </div>
           
           <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -z-0"></div>
           <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-4/5 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
        </motion.div>

        {/* Stats Command Deck */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
           <AnimatePresence>
              {[
                { label: 'LIQUID CAPITAL', value: `₦${user?.walletBalance.toLocaleString()}`, icon: <Wallet />, color: 'primary', trend: '+12% this week', link: '/dashboard/wallet' },
                { label: 'COMPLETED MISSIONS', value: stats.totalOrders, icon: <Activity />, color: 'blue-500', trend: 'Lifetime Log' },
                { label: 'RESOURCE BURN', value: `₦${stats.totalSpent.toLocaleString()}`, icon: <TrendingUp />, color: 'green-500', trend: 'Optimization: Max' },
                { label: 'ACTIVE SIGNALS', value: stats.activeOrders, icon: <Cpu />, color: 'purple-500', trend: 'Live Processing' }
              ].map((stat, idx) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * idx }}
                  whileHover={{ y: -10 }}
                  className={`p-8 rounded-[3rem] border shadow-2xl overflow-hidden relative group transition-all duration-500 ${isDark ? 'bg-slate-900 border-white/5 hover:border-primary/50' : 'bg-white border-slate-100 hover:border-primary/20'}`}
                >
                   <div className="flex justify-between items-start mb-10">
                      <div className={`p-5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:bg-primary group-hover:text-white ${isDark ? 'bg-white/5 text-primary' : 'bg-primary/5 text-primary'}`}>
                         {React.cloneElement(stat.icon, { size: 32 })}
                      </div>
                      <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/10 ${isDark ? 'bg-white/5 text-slate-400' : 'bg-slate-50 text-slate-500'}`}>
                         {stat.trend}
                      </span>
                   </div>
                   <p className={`text-[10px] font-black uppercase tracking-[0.3em] mb-3 ${subTextColor} italic`}>{stat.label}</p>
                   <h3 className={`text-4xl font-black ${textColor} tracking-tighter`}>{stat.value}</h3>
                   {stat.link && (
                     <Link to={stat.link} className="absolute inset-0 z-20"></Link>
                   )}
                   <div className="absolute top-0 right-0 w-2 h-full bg-primary opacity-0 group-hover:opacity-40 transition-opacity"></div>
                </motion.div>
              ))}
           </AnimatePresence>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
           {/* Intelligence Feed */}
           <div className="lg:col-span-2 space-y-8">
              <div className="flex items-center justify-between mb-2">
                 <h3 className={`text-xl font-black uppercase tracking-widest flex items-center gap-3 ${textColor}`}>
                    <Globe size={20} className="text-primary animate-spin-slow" /> WORLD SIGNAL INTEL
                 </h3>
                 <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className={`text-[9px] font-black uppercase tracking-widest ${subTextColor}`}>Live Updates</span>
                 </div>
              </div>
              
              <motion.div 
                whileHover={{ scale: 1.01 }}
                className={`p-10 lg:p-14 rounded-[4rem] border shadow-3xl relative overflow-hidden group ${isDark ? 'glass-panel border-white/10' : 'glass-panel-light border-slate-200'}`}
              >
                 <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-10">
                       <span className="bg-primary/20 text-primary px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest italic border border-primary/20">Critical Alert</span>
                       <span className={`text-xs font-medium ${subTextColor}`}>6 mins ago</span>
                    </div>
                    <h4 className={`text-4xl font-black mb-6 ${textColor} leading-tight`}>IG Algorithm Nexus <span className="text-primary italic">Compromised.</span></h4>
                    <p className={`text-lg ${subTextColor} mb-12 max-w-xl font-medium leading-relaxed`}>
                       Internal metrics indicate a 400% surge in Reels engagement for accounts deploying "High-Octane HQ" packages. Priority 1 Agents are advised to capitalize on this breach immediately.
                    </p>
                    <div className="flex flex-wrap gap-4">
                       <Link to="/dashboard/services" className="btn-primary py-5 px-10 rounded-2xl flex items-center gap-4 font-black group">
                          CAPITALIZE NOW <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform duration-500" />
                       </Link>
                    </div>
                 </div>
                 <div className="absolute top-0 right-0 w-80 h-full bg-primary/5 -z-0 blur-3xl group-hover:bg-primary/10 transition-all duration-1000"></div>
                 <div className="absolute -bottom-20 -right-20 pointer-events-none opacity-10 group-hover:opacity-20 transition-opacity">
                    <Activity size={300} strokeWidth={1} />
                 </div>
              </motion.div>
           </div>

           {/* Rapid Sector Ops */}
           <div className="lg:col-span-1 space-y-8">
              <h3 className={`text-xl font-black uppercase tracking-widest flex items-center gap-3 ${textColor}`}>
                 <Shield size={20} className="text-primary" /> SECTOR ACCESS
              </h3>
              <div className="space-y-4">
                 {[
                   { to: '/dashboard/services', title: 'ARSENAL HUB', desc: '5,000+ Engagement Cores', icon: <ShoppingCart /> },
                   { to: '/dashboard/orders', title: 'LOGISTICS TRACK', desc: 'Real-time Deployment Status', icon: <Clock /> },
                   { to: '/dashboard/wallet', title: 'CAPITAL RELOAD', desc: 'Secure NGN Funding Node', icon: <Zap /> },
                   { to: '/dashboard/settings', title: 'SYSTEM CONFIG', desc: 'Neural Interface Prefs', icon: <Cpu /> }
                 ].map((op, idx) => (
                   <Link 
                     key={op.title}
                     to={op.to}
                     className={`flex items-center gap-6 p-8 rounded-[2.5rem] border shadow-xl transition-all group relative overflow-hidden ${isDark ? 'bg-white/5 border-white/5 hover:bg-primary hover:border-primary' : 'bg-white border-slate-100 hover:bg-primary hover:border-primary'}`}
                   >
                      <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:bg-white group-hover:text-primary ${isDark ? 'bg-white/5 text-primary' : 'bg-primary/5 text-primary'}`}>
                         {React.cloneElement(op.icon, { size: 28 })}
                      </div>
                      <div className="relative z-10">
                         <h4 className={`text-xl font-black leading-tight ${isDark ? 'text-white group-hover:text-white' : 'text-slate-900 group-hover:text-white'}`}>{op.title}</h4>
                         <p className={`text-[10px] font-black uppercase tracking-widest italic transition-colors ${isDark ? 'text-slate-500 group-hover:text-white/60' : 'text-slate-400 group-hover:text-white/60'}`}>{op.desc}</p>
                      </div>
                      <div className="absolute top-0 right-0 w-32 h-full bg-white/10 -skew-x-12 translate-x-40 group-hover:translate-x-10 transition-transform duration-700"></div>
                   </Link>
                 ))}
              </div>
           </div>
        </div>

        {/* Global Network Heartbeat */}
        <div className="mt-32 p-10 lg:p-14 rounded-[4rem] border border-dashed border-primary/20 flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left relative overflow-hidden">
           <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative">
                 <div className="w-24 h-24 rounded-full border-4 border-primary/10 flex items-center justify-center relative z-10">
                    <Activity className="text-primary animate-pulse" size={40} />
                 </div>
                 <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 -z-0"></div>
              </div>
              <div>
                 <p className={`text-[10px] font-black uppercase tracking-[0.5em] mb-4 ${subTextColor}`}>Global Traffic Nodes</p>
                 <div className="flex gap-4 mb-4 justify-center md:justify-start">
                    <div className="h-1.5 w-12 bg-primary rounded-full"></div>
                    <div className="h-1.5 w-12 bg-white/10 rounded-full"></div>
                    <div className="h-1.5 w-12 bg-white/10 rounded-full"></div>
                 </div>
                 <h5 className={`text-2xl font-black ${textColor}`}>3.2M SIGNALS DEPLOYED <span className="text-primary italic">LAST 24H</span></h5>
              </div>
           </div>
           <Link to="/dashboard/services" className="px-10 py-5 rounded-2xl border-2 border-primary/50 text-primary font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/10">
              Verify Global Status
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

