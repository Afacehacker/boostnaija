import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { 
  Users, BarChart3, RefreshCw, Settings, UserPlus, 
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
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const syncServices = async () => {
    try {
      toast.info('Syncing services with provider...');
      await axios.post(`${API_URL}/services/sync`);
      toast.success('Services synchronized successfully');
    } catch (err) {
      toast.error('Failed to sync services');
    }
  };

  const adjustBalance = async (userId, amount) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/balance`, { amount });
      toast.success('Balance updated successfully');
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to update balance');
    }
  };

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const meshBg = isDark ? 'bg-cyber-mesh' : 'bg-light-mesh';

  if (loading && !stats) return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center gap-8 z-50 ${isDark ? 'bg-slate-900' : 'bg-white'}`}>
       <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
       <p className="font-bold text-primary uppercase tracking-widest text-sm animate-pulse">Loading Admin Panel...</p>
    </div>
  );

  return (
    <div className={`pt-24 md:pt-32 px-4 md:px-6 pb-40 min-h-screen transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
          <div>
            <h1 className={`text-4xl md:text-6xl font-black mb-2 ${textColor}`}>
              Admin <span className="text-primary italic">Panel</span>
            </h1>
            <p className={`text-lg font-medium ${subTextColor}`}>Manage your platform users and track performance.</p>
          </div>
          
          <div className="flex flex-wrap gap-4 w-full lg:w-auto">
            <button 
              onClick={syncServices} 
              className="btn-primary flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all"
            >
              <Database size={18} /> Sync Services
            </button>
            <button 
              onClick={fetchAdminData} 
              className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <RefreshCw size={24} className={`${loading ? 'animate-spin' : ''} text-primary`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex gap-8 mb-12 border-b overflow-x-auto no-scrollbar ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          {['overview', 'users', 'status'].map(tab => (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-4 px-4 text-[11px] font-bold uppercase tracking-widest transition-all relative whitespace-nowrap ${activeTab === tab ? 'text-primary' : `${subTextColor} hover:text-primary`}`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div layoutId="admintab" className="absolute bottom-0 left-0 w-full h-1 bg-primary rounded-full shadow-[0_0_10px_#3A7AFE]" />
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
              className="space-y-16"
            >
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                <AdminStatCard icon={<Users />} label="Total Users" value={stats.stats.totalUsers} color="#3A7AFE" theme={theme} />
                <AdminStatCard icon={<Layers />} label="Total Orders" value={stats.stats.totalOrders} color="#3B82F6" theme={theme} />
                <AdminStatCard icon={<TrendingUp />} label="Revenue" value={`₦${stats.stats.revenue.toLocaleString()}`} color="#22C55E" theme={theme} />
                <AdminStatCard icon={<DollarSign />} label="Panel Balance" value={`$${stats.stats.panelBalance || '0.00'}`} color="#F59E0B" theme={theme} />
              </div>

              <div className={`p-8 md:p-12 rounded-[2.5rem] border shadow-xl relative overflow-hidden ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                <h3 className={`text-2xl font-black mb-8 ${textColor}`}>Performance Chart</h3>
                <div className="h-[400px]">
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
                          borderRadius: '16px',
                          padding: '16px'
                        }} 
                      />
                      <XAxis dataKey="name" stroke={isDark ? "#475569" : "#94a3b8"} fontSize={10} fontWeight="bold" tickLine={false} axisLine={false} />
                      <Area type="monotone" dataKey="revenue" stroke="#3A7AFE" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div 
              key="users"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-[2rem] overflow-hidden shadow-xl ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}
            >
              <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                 <h3 className={`text-2xl font-black ${textColor}`}>User Directory</h3>
                 <div className="relative w-full md:w-96">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Search users..." 
                      className={`w-full rounded-xl py-4 pl-12 pr-6 border outline-none focus:border-primary transition-all font-bold text-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-inner'}`}
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                 </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[1000px]">
                  <thead>
                    <tr className={isDark ? 'bg-white/5' : 'bg-slate-50'}>
                      <th className={`py-6 px-8 font-bold text-[10px] uppercase tracking-widest ${subTextColor}`}>Name / Email</th>
                      <th className={`py-6 px-8 font-bold text-[10px] uppercase tracking-widest ${subTextColor}`}>Wallet Balance</th>
                      <th className={`py-6 px-8 font-bold text-[10px] uppercase tracking-widest ${subTextColor}`}>Joined Date</th>
                      <th className={`py-6 px-8 font-bold text-[10px] uppercase tracking-widest text-right ${subTextColor}`}>Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())).map(u => (
                      <tr key={u._id} className={`transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                        <td className="py-6 px-8">
                          <div className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                {u.name.charAt(0).toUpperCase()}
                             </div>
                             <div>
                                <p className={`font-bold text-base ${textColor}`}>{u.name}</p>
                                <p className={`text-[10px] ${subTextColor}`}>{u.email}</p>
                             </div>
                          </div>
                        </td>
                        <td className="py-6 px-8">
                           <p className="font-bold text-lg text-primary">₦{u.walletBalance.toLocaleString()}</p>
                        </td>
                        <td className={`py-6 px-8 text-xs font-bold ${subTextColor}`}>
                           {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-6 px-8 text-right">
                           <button 
                            onClick={() => {
                              const amt = prompt('Amount to add/subtract (₦):');
                              if (amt) adjustBalance(u._id, parseFloat(amt));
                            }}
                            className={`px-6 py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${isDark ? 'bg-white/5 border-white/10 hover:bg-primary' : 'bg-white border-slate-200 hover:bg-primary hover:text-white'}`}
                           >
                             Adjust Balance
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
    <div className={`p-8 rounded-[2rem] shadow-lg transition-all border ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
       <div className="flex justify-between items-start mb-6">
          <div className="p-4 rounded-xl bg-white/5" style={{ color }}>
             {React.cloneElement(icon, { size: 24 })}
          </div>
       </div>
       <div>
          <p className={`text-[10px] font-bold uppercase tracking-widest mb-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{label}</p>
          <h4 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tight`}>{value}</h4>
       </div>
    </div>
  );
};

export default AdminDashboard;
