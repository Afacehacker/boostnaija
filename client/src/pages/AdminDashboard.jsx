import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { 
  Users, ShoppingBag, BarChart3, RefreshCw, Settings, UserPlus, 
  DollarSign, Activity, Database, ShieldAlert, TrendingUp, Search, 
  Pocket, Zap, Terminal, Lock, Globe, Cpu, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchUser, setSearchUser] = useState('');
  const { theme } = useTheme();

  const isDark = theme === 'dark';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await axios.get(`${API_URL}/admin/stats`);
      setStats(statsRes.data.data);
      const usersRes = await axios.get(`${API_URL}/admin/users`);
      setUsers(usersRes.data.data);
    } catch (err) {
      toast.error('System Access Denied: Admin Handshake Required');
    } finally {
      setLoading(false);
    }
  };

  const syncServices = async () => {
    try {
      toast.info('Rebuilding Global Provider Database...');
      await axios.post(`${API_URL}/services/sync`);
      toast.success('Core DB Synced with SMM.com.ng');
    } catch (err) {
      toast.error('Provider API Refused Handshake');
    }
  };

  const adjustBalance = async (userId, amount) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/balance`, { amount });
      toast.success('Ledger Entry Synchronized');
      fetchAdminData();
    } catch (err) {
      toast.error('Database Write Operation Failed');
    }
  };

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const meshBg = isDark ? 'bg-cyber-mesh' : 'bg-light-mesh';

  if (loading && !stats) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center gap-10 z-50 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
       <div className="relative">
          <div className="w-32 h-32 border-[8px] border-primary/20 rounded-full"></div>
          <div className="absolute inset-0 w-32 h-32 border-[8px] border-primary border-t-transparent rounded-full animate-spin shadow-[0_0_30px_#3A7AFE]"></div>
          <Lock className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary animate-pulse" size={32} />
       </div>
       <div className="text-center space-y-4">
          <h2 className="text-2xl font-black text-primary uppercase tracking-[0.5em] animate-pulse">DECRYPTING ROOT SESSION</h2>
          <div className="flex gap-2 justify-center">
             {[1,2,3,4,5].map(i => (
                <motion.div 
                  key={i} 
                  animate={{ opacity: [0.2, 1, 0.2] }} 
                  transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                  className="w-2 h-2 bg-primary rounded-full"
                ></motion.div>
             ))}
          </div>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${subTextColor}`}>Security Clearances: Level 5 Root Access</p>
       </div>
    </div>
  );

  return (
    <div className={`pt-32 px-6 pb-40 min-h-screen transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-12 mb-20">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 glass-panel px-6 py-2 rounded-xl text-[10px] font-black tracking-[0.4em] text-primary mb-6 border-primary/20"
            >
               <ShieldAlert size={14} /> LEVEL 5 ROOT ACCESS
            </motion.div>
            <h1 className={`text-6xl md:text-8xl font-black mb-4 leading-none tracking-tighter ${textColor}`}>
              COMMAND <span className="text-gradient italic">CENTER</span>
            </h1>
            <p className={`text-xl font-medium italic ${subTextColor} max-w-2xl`}>Master control node for the global <span className="text-primary font-black uppercase tracking-widest italic">Nexus Infrastructure</span>.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <button 
              onClick={syncServices} 
              className="btn-primary group flex-1 lg:flex-none flex items-center justify-center gap-5 px-10 py-6 rounded-[2rem] text-[11px] font-black uppercase tracking-widest shadow-3xl text-white outline-none active:scale-95 transition-all"
            >
              <Database size={20} className="group-hover:rotate-12 transition-transform" /> RE-SYNC PROVIDER CORE
            </button>
            <button 
              onClick={fetchAdminData} 
              className={`p-6 rounded-[2rem] border transition-all shadow-xl group ${isDark ? 'glass-panel border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
            >
              <RefreshCw size={28} className={`${loading ? 'animate-spin' : 'group-hover:rotate-180'} text-primary transition-all duration-700`} />
            </button>
          </div>
        </div>

        {/* Tactical Navigation Tabs */}
        <div className={`flex gap-16 mb-20 border-b overflow-x-auto no-scrollbar transition-colors ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          {['overview', 'agents', 'missions'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-8 px-6 text-[11px] font-black uppercase tracking-[0.5em] transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-primary' : `${subTextColor} hover:text-primary/70`}`}
            >
              {tab === 'overview' && <BarChart3 className="inline-block mr-3" size={16} />}
              {tab === 'agents' && <Users className="inline-block mr-3" size={16} />}
              {tab === 'missions' && <Activity className="inline-block mr-3" size={16} />}
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="admintab" className="absolute bottom-0 left-0 w-full h-2 bg-primary rounded-full shadow-[0_-4px_30px_#3A7AFE]" />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'overview' && stats && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-24"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
                <AdminStatCard icon={<Users />} label="ACTIVE AGENTS" value={stats.stats.totalUsers} color="#3A7AFE" theme={theme} />
                <AdminStatCard icon={<Layers />} label="TOTAL MISSIONS" value={stats.stats.totalOrders} color="#3B82F6" theme={theme} />
                <AdminStatCard icon={<TrendingUp />} label="GROSS REVENUES" value={`₦${stats.stats.revenue.toLocaleString()}`} color="#22C55E" theme={theme} />
                <AdminStatCard icon={<DollarSign />} label="PANEL RESERVES" value={`$${stats.stats.panelBalance || '0.00'}`} color="#F59E0B" theme={theme} />
              </div>

              <div className={`border p-12 lg:p-20 rounded-[5rem] min-h-[650px] shadow-3xl relative overflow-hidden group transition-all ${isDark ? 'glass-panel border-white/5' : 'bg-white border-slate-100'}`}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20 relative z-10">
                   <div>
                      <h3 className={`text-4xl font-black mb-3 ${textColor} italic`}>NEURAL DATA STREAM</h3>
                      <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>Live Strategic Performance Monitoring Grid</p>
                   </div>
                   <div className="flex items-center gap-4 text-[10px] font-black text-green-500 bg-green-500/10 px-8 py-4 rounded-2xl border border-green-500/10 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22C55E]"></div>
                      AUTO-SCALING NODE 01 ACTIVE
                   </div>
                </div>
                <div className="h-[400px] relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'MON', revenue: 4200 },
                      { name: 'TUE', revenue: 3100 },
                      { name: 'WED', revenue: 6400 },
                      { name: 'THU', revenue: 8200 },
                      { name: 'FRI', revenue: 5100 },
                      { name: 'SAT', revenue: 9400 },
                      { name: 'SUN', revenue: 7800 },
                    ]}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3A7AFE" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#3A7AFE" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: isDark ? 'rgba(15,17,21,0.9)' : 'rgba(255,255,255,0.9)', 
                          border: 'none',
                          borderRadius: '24px',
                          boxShadow: '0 40px 80px rgba(0,0,0,0.3)',
                          backdropFilter: 'blur(20px)',
                          padding: '20px'
                        }} 
                        itemStyle={{ color: '#3A7AFE', fontWeight: '900', fontSize: '14px', textTransform: 'uppercase' }}
                      />
                      <XAxis dataKey="name" stroke={isDark ? "#475569" : "#94a3b8"} fontSize={10} fontWeight="900" tickLine={false} axisLine={false} dy={20} />
                      <Area type="monotone" dataKey="revenue" stroke="#3A7AFE" strokeWidth={8} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/5 blur-[180px] -z-0"></div>
                <div className="absolute -bottom-20 -left-20 pointer-events-none opacity-5">
                   <Globe size={400} className="text-primary" />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'agents' && (
            <motion.div 
              key="agents"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`border rounded-[5rem] overflow-hidden shadow-3xl relative transition-all ${isDark ? 'glass-panel border-white/10' : 'bg-white border-slate-100'}`}
            >
              <div className="p-12 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
                 <div>
                    <h3 className={`text-4xl font-black mb-2 ${textColor}`}>AGENT DIRECTORY</h3>
                    <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>ENLISTED OPERATIVE DATABASE</p>
                 </div>
                 <div className="relative group w-full md:w-[450px]">
                    <Search className={`absolute left-8 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'group-focus-within:text-primary text-slate-700' : 'text-slate-300'}`} size={24} />
                    <input 
                      type="text" 
                      placeholder="FILTER BY CODENAME OR UPLINK..." 
                      className={`w-full rounded-[2.5rem] py-8 pl-20 pr-10 border-2 outline-none focus:border-primary/50 transition-all font-black text-xs uppercase tracking-widest ${isDark ? 'bg-white/5 border-white/5 text-white placeholder:text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400 shadow-inner'}`}
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[1200px]">
                  <thead>
                    <tr className={isDark ? 'bg-white/5' : 'bg-slate-50'}>
                      <th className={`py-12 px-12 font-black text-[11px] uppercase tracking-[0.5em] ${subTextColor}`}>OPERATIVE METADATA</th>
                      <th className={`py-12 px-12 font-black text-[11px] uppercase tracking-[0.5em] ${subTextColor}`}>LIQUIDITY ACCESS</th>
                      <th className={`py-12 px-12 font-black text-[11px] uppercase tracking-[0.5em] ${subTextColor}`}>ENLISTMENT HASH</th>
                      <th className={`py-12 px-12 font-black text-[11px] uppercase tracking-[0.5em] text-right ${subTextColor}`}>OVERRIDE PROTOCOL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.03]">
                    {users.filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())).map(u => (
                      <tr key={u._id} className={`transition-all group ${isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-slate-50'}`}>
                        <td className="py-12 px-12">
                          <div className="flex items-center gap-8">
                             <div className="w-20 h-20 rounded-[2rem] bg-primary/10 flex items-center justify-center text-primary font-black text-3xl shadow-3xl border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                                {u.name.charAt(0).toUpperCase()}
                             </div>
                             <div>
                                <p className={`font-black text-2xl group-hover:text-primary transition-colors ${textColor}`}>{u.name.toUpperCase()}</p>
                                <p className={`text-[10px] font-black uppercase tracking-widest mt-2 font-mono ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{u.email}</p>
                             </div>
                          </div>
                        </td>
                        <td className="py-12 px-12">
                           <p className="font-black text-3xl text-primary italic tracking-tighter transition-all group-hover:scale-105 origin-left">₦{u.walletBalance.toLocaleString()}</p>
                           <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-3 opacity-50 ${textColor}`}>AVAILABLE RESERVES</p>
                        </td>
                        <td className={`py-12 px-12 text-[11px] font-black uppercase tracking-[0.3em] ${subTextColor}`}>
                           {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </td>
                        <td className="py-12 px-12 text-right">
                           <button 
                            onClick={() => {
                              const amt = prompt('LEDGER ADJUSTMENT OFFSET (NGN):');
                              if (amt) adjustBalance(u._id, parseFloat(amt));
                            }}
                            className={`px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] border-2 transition-all shadow-xl active:scale-95 ${isDark ? 'bg-white/5 border-white/5 hover:bg-primary hover:text-white hover:border-primary' : 'bg-white border-slate-200 hover:bg-primary hover:text-white hover:border-primary'}`}
                           >
                             MODIFY LEDGER
                           </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const AdminStatCard = ({ icon, label, value, color, theme }) => {
  const isDark = theme === 'dark';
  return (
    <motion.div 
      whileHover={{ y: -10, scale: 1.02 }}
      className={`relative p-12 rounded-[4rem] shadow-4xl transition-all overflow-hidden border-b-8 border-transparent hover:border-primary/50 group ${isDark ? 'glass-panel border-white/5' : 'bg-white border-slate-100 shadow-2xl'}`}
    >
       <div className="flex justify-between items-start mb-10 relative z-10">
          <div className="p-6 rounded-[2rem] bg-white/5 group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-xl" style={{ color }}>
             {React.cloneElement(icon, { size: 32 })}
          </div>
          <div className="flex gap-1">
             <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
             <div className="w-2 h-2 rounded-full bg-primary/40 animate-pulse delay-75"></div>
             <div className="w-2 h-2 rounded-full bg-primary/20 animate-pulse delay-150"></div>
          </div>
       </div>
       <div className="relative z-10">
          <p className={`text-[10px] font-black uppercase tracking-[0.5em] mb-4 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
          <h4 className={`text-6xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tighter italic`}>{value}</h4>
       </div>
       <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-[80px] -z-0"></div>
       <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
    </motion.div>
  );
};

export default AdminDashboard;
