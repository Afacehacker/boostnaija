import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingCart, Wallet, List, TrendingUp, AlertCircle, Plus, Zap, 
  ArrowRight, Star, Shield, Activity, Globe, Cpu, Clock, Bell, Sparkles, Settings
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
    <div className={`min-h-screen pt-24 md:pt-32 pb-40 transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-8 md:mb-12 relative overflow-hidden rounded-[2rem] md:rounded-[3rem] border ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'} p-8 md:p-12 shadow-xl`}
        >
           <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-8">
              <div className="space-y-4 md:space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                       {[1,2,3].map(i => (
                         <div key={i} className="w-8 h-8 rounded-full border-2 border-white overflow-hidden shadow-sm">
                            <img src={`https://i.pravatar.cc/150?u=${i*50}`} alt="user" />
                         </div>
                       ))}
                    </div>
                    <span className={`text-[10px] md:text-[12px] font-bold uppercase tracking-widest text-primary`}>Member Status: Active 🟢</span>
                 </div>
                 
                 <h1 className={`text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight ${textColor}`}>
                   Welcome back, <br/><span className="text-primary italic">{user?.name.split(' ')[0]}!</span>
                 </h1>
                 
                 <p className={`text-base md:text-xl font-medium ${subTextColor} max-w-xl leading-relaxed`}>
                    What are we boosting today? Check out our latest services and grow your accounts instantly.
                 </p>
              </div>

              <div className="flex flex-col items-end gap-4 w-full lg:w-auto">
                 <div className={`p-6 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'} text-left md:text-right w-full lg:w-64 shadow-sm`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor} mb-1`}>YOUR STATUS</p>
                    <p className="text-2xl font-black text-primary italic uppercase tracking-tighter">Elite Member</p>
                    <div className="w-full h-1.5 bg-primary/10 rounded-full mt-4 overflow-hidden">
                       <motion.div 
                         initial={{ width: 0 }}
                         animate={{ width: '85%' }}
                         transition={{ duration: 1 }}
                         className="h-full bg-primary"
                       />
                    </div>
                 </div>
                 <Link to="/dashboard/services" className="btn-primary w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold text-lg shadow-lg hover:scale-[1.03] transition-transform">
                    <Sparkles size={20} /> New Order
                 </Link>
              </div>
           </div>
        </motion.div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8 mb-12">
            {[
              { label: 'WALLET BALANCE', value: `₦${user?.walletBalance.toLocaleString()}`, icon: <Wallet size={24}/>, color: 'text-primary', link: '/dashboard/wallet' },
              { label: 'TOTAL ORDERS', value: stats.totalOrders, icon: <List size={24}/>, color: 'text-blue-500' },
              { label: 'TOTAL SPENT', value: `₦${stats.totalSpent.toLocaleString()}`, icon: <TrendingUp size={24}/>, color: 'text-green-500' },
              { label: 'ACTIVE TASKS', value: stats.activeOrders, icon: <Clock size={24}/>, color: 'text-yellow-500' }
            ].map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className={`p-6 rounded-[1.5rem] md:rounded-[2rem] border shadow-md relative group transition-all ${isDark ? 'bg-slate-900 border-white/5 hover:border-primary/30' : 'bg-white border-slate-100 hover:border-primary/20'}`}
              >
                 <div className={`mb-4 ${stat.color}`}>
                    {stat.icon}
                 </div>
                 <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-1 ${subTextColor}`}>{stat.label}</p>
                 <h3 className={`text-xl md:text-3xl font-black ${textColor} tracking-tight`}>{stat.value}</h3>
                 {stat.link && <Link to={stat.link} className="absolute inset-0 z-10" />}
              </motion.div>
            ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 md:gap-12">
           {/* Latest News */}
           <div className="lg:col-span-2 space-y-6">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${textColor}`}>
                 <Bell size={20} className="text-primary" /> ANNOUNCEMENTS
              </h3>
              
              <div className={`p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border shadow-lg relative overflow-hidden group ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}>
                 <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                       <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Update</span>
                       <span className={`text-[10px] ${subTextColor}`}>New Service Added</span>
                    </div>
                    <h4 className={`text-2xl md:text-3xl font-black mb-4 ${textColor}`}>New: Nigerian High-Quality Likes!</h4>
                    <p className={`text-base md:text-lg ${subTextColor} mb-8 font-medium leading-relaxed`}>
                       We just added fresh Nigerian social media services. High quality, non-drop, and very fast delivery. Start boosting your visibility today!
                    </p>
                    <Link to="/dashboard/services" className="btn-primary py-4 px-8 rounded-xl flex items-center gap-2 font-bold text-sm">
                       Try It Now <ArrowRight size={18} />
                    </Link>
                 </div>
              </div>
           </div>

           {/* Quick Access */}
           <div className="lg:col-span-1 space-y-6">
              <h3 className={`text-lg font-bold flex items-center gap-2 ${textColor}`}>
                 <LayoutDashboard size={20} className="text-primary" /> QUICK ACCESS
              </h3>
              <div className="space-y-4">
                 {[
                   { to: '/dashboard/services', title: 'Order Service', desc: 'Browse all SMM packages', icon: <ShoppingCart size={20}/> },
                   { to: '/dashboard/orders', title: 'Track Orders', desc: 'Check your order status', icon: <Clock size={20}/> },
                   { to: '/dashboard/wallet', title: 'Fund Wallet', desc: 'Add money to your account', icon: <Plus size={20}/> },
                   { to: '/dashboard/settings', title: 'Settings', desc: 'Manage your profile', icon: <Settings size={20}/> }
                 ].map((op) => (
                   <Link 
                     key={op.title}
                     to={op.to}
                     className={`flex items-center gap-4 p-5 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-100 hover:bg-slate-50 shadow-sm'}`}
                   >
                      <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                         {op.icon}
                      </div>
                      <div>
                         <h4 className={`font-bold text-base ${textColor}`}>{op.title}</h4>
                         <p className={`text-[10px] font-medium ${subTextColor}`}>{op.desc}</p>
                      </div>
                   </Link>
                 ))}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
