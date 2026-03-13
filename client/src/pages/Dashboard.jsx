import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from 'framer-motion';
import { ShoppingCart, Wallet, List, TrendingUp, AlertCircle, Plus, Zap, ArrowRight, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const [stats, setStats] = useState({ totalOrders: 0, activeOrders: 0, totalSpent: 0 });
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  const isDark = theme === 'dark';

  useEffect(() => {
    fetchStats();
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
  const meshBg = isDark ? 'bg-mesh-dark' : 'bg-mesh-light';

  return (
    <div className={`pt-28 px-6 pb-32 max-w-7xl mx-auto font-sans transition-colors duration-500 ${meshBg}`}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`mb-12 bg-gradient-to-br ${isDark ? 'from-primary/20 via-primary/5 to-transparent border-primary/10' : 'from-primary/10 via-white/50 to-white border-slate-100'} p-10 lg:p-14 rounded-[3rem] border relative overflow-hidden shadow-2xl`}
      >
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-10">
           <div>
              <div className="flex items-center gap-3 mb-4">
                 <div className="bg-primary text-white p-2 rounded-xl shadow-lg shadow-primary/30"><Star size={20} fill="currentColor" /></div>
                 <span className={`text-xs font-black uppercase tracking-widest ${subTextColor}`}>Authenticated Agent Session</span>
              </div>
              <h1 className={`text-4xl lg:text-5xl font-black mb-3 ${textColor}`}>Morning, {user?.name.split(' ')[0]}!</h1>
              <p className={`text-lg font-medium ${subTextColor} max-w-md`}>The SMM engine is primed and ready. Your visibility metrics are performing efficiently.</p>
           </div>
           <div className="flex gap-4">
              <Link to="/dashboard/services" className="btn-primary flex items-center gap-3 px-8 shadow-xl shadow-primary/20">
                 <Plus size={20} /> New Mission
              </Link>
           </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 blur-[120px] -z-0"></div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <StatCard 
          icon={<Wallet className="text-primary" size={24} />} 
          label="Liquidity Available" 
          value={`₦${user?.walletBalance.toLocaleString()}`} 
          trend="Top Up Wallet"
          link="/dashboard/wallet"
          theme={theme}
        />
        <StatCard 
          icon={<ShoppingCart className="text-blue-500" size={24} />} 
          label="Missions Completed" 
          value={stats.totalOrders} 
          trend="Lifetime Log"
          theme={theme}
        />
        <StatCard 
          icon={<TrendingUp className="text-green-500" size={24} />} 
          label="Resource Investment" 
          value={`₦${stats.totalSpent.toLocaleString()}`} 
          trend="Total Spent"
          theme={theme}
        />
        <StatCard 
          icon={<AlertCircle className="text-purple-500" size={24} />} 
          label="Active Deployments" 
          value={stats.activeOrders} 
          trend="In Progress"
          theme={theme}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-12">
        {/* Shortcut Ops */}
        <div className="lg:col-span-1 space-y-8">
           <h3 className={`text-xl font-black uppercase tracking-widest flex items-center gap-3 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
             <Zap size={22} className="text-primary" /> Rapid Ops
           </h3>
           <div className="space-y-4">
              <ShortcutLink 
                to="/dashboard/services" 
                title="Service Store" 
                desc="Browse 5,000+ SMM packages"
                icon={<ShoppingCart />}
                theme={theme}
              />
              <ShortcutLink 
                to="/dashboard/orders" 
                title="Mission Tracking" 
                desc="Live status for active orders"
                icon={<List />}
                theme={theme}
              />
              <ShortcutLink 
                to="/dashboard/wallet" 
                title="Capital Refill" 
                desc="Add NGN via Secure Uplink"
                icon={<Wallet />}
                theme={theme}
              />
           </div>
        </div>

        {/* Intelligence Card */}
        <div className="lg:col-span-2">
           <div className={`rounded-[3.5rem] border p-12 h-full relative overflow-hidden group shadow-2xl transition-all ${isDark ? 'bg-slate-900 border-white/5 hover:border-primary/20' : 'bg-white border-slate-100 hover:border-primary/10'}`}>
              <div className="relative z-10">
                 <div className="flex items-center gap-3 mb-8">
                    <div className="bg-primary/20 text-primary p-2 rounded-lg font-black text-[10px] uppercase tracking-widest">Growth Intel</div>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                 </div>
                 <h2 className={`text-4xl font-black mb-6 ${textColor}`}>TikTok <span className="text-primary italic">Viral Formula</span></h2>
                 <p className={`text-lg ${subTextColor} mb-12 max-w-lg leading-relaxed font-medium`}>
                   Our internal data shows TikTok views with +80% retention are peaking right now. 
                   Deploy your campaigns now to catch the algorithm wave.
                 </p>
                 <Link to="/dashboard/services" className="btn-primary inline-flex items-center gap-3 group">
                    Deploy Strategic Growth <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                 </Link>
              </div>
              <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-primary/10 rounded-full blur-[100px] group-hover:bg-primary/20 transition-all duration-700"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, trend, link, theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`p-8 rounded-[2.5rem] border transition-all group overflow-hidden relative shadow-lg ${isDark ? 'bg-slate-900 border-white/5 hover:border-primary/20' : 'bg-white border-slate-100 hover:border-primary/10'}`}>
      <div className="flex justify-between items-start mb-8">
        <div className={`p-4 rounded-2xl group-hover:scale-110 transition-transform ${isDark ? 'bg-white/5' : 'bg-primary/5'}`}>
          {icon}
        </div>
        {link ? (
          <Link to={link} className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline underline-offset-4">{trend}</Link>
        ) : (
          <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{trend}</span>
        )}
      </div>
      <p className={`text-sm mb-2 font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
      <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{value}</h3>
      <div className="absolute top-0 right-0 w-1.5 h-full bg-primary/0 group-hover:bg-primary/40 transition-all"></div>
    </div>
  );
};

const ShortcutLink = ({ to, title, desc, icon, theme }) => {
  const isDark = theme === 'dark';
  return (
    <Link to={to} className={`flex items-center gap-6 border p-6 rounded-[2rem] transition-all group shadow-sm ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-primary/20' : 'bg-white border-slate-100 hover:bg-slate-50 hover:border-primary/20'}`}>
       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${isDark ? 'bg-white/5 group-hover:bg-primary group-hover:text-white' : 'bg-slate-50 group-hover:bg-primary group-hover:text-white'}`}>
         {icon}
       </div>
       <div>
         <h4 className={`font-black text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>{title}</h4>
         <p className={`text-[10px] uppercase tracking-widest font-black italic ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</p>
       </div>
    </Link>
  );
};

export default Dashboard;
