import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { Users, ShoppingBag, BarChart3, RefreshCw, Settings, UserPlus, DollarSign, Activity, Database, ShieldAlert, TrendingUp, Search, Pocket } from 'lucide-react';
import { motion } from 'framer-motion';
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

  if (loading && !stats) return (
    <div className={`pt-48 flex flex-col items-center justify-center gap-8 ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
       <div className="w-20 h-20 border-[6px] border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20"></div>
       <div className="text-center">
          <p className="font-black text-primary uppercase tracking-[0.5em] text-xs mb-2">Decrypting Root Session</p>
          <p className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor}`}>Security Clearances Active</p>
       </div>
    </div>
  );

  return (
    <div className={`pt-28 px-6 pb-20 max-w-7xl mx-auto font-sans transition-colors duration-500`}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary shadow-lg shadow-primary/10"><ShieldAlert size={24} /></div>
             <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>Level 5 Access</p>
          </div>
          <h1 className={`text-5xl font-black mb-2 ${textColor}`}>Command Center</h1>
          <p className={`text-lg font-medium italic ${subTextColor}`}>Master control node for the entire BoostNaija infrastructure.</p>
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
          <button 
            onClick={syncServices} 
            className="flex-1 lg:flex-none flex items-center justify-center gap-4 bg-primary text-white px-8 py-4 rounded-[1.25rem] text-[10px] font-black uppercase tracking-widest hover:bg-primary-dark transition-all shadow-2xl shadow-primary/20 active:scale-95"
          >
            <Database size={18}/> Re-Sync Provider Core
          </button>
          <button 
            onClick={fetchAdminData} 
            className={`p-4 rounded-[1.25rem] border transition-all shadow-sm ${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
            <RefreshCw size={24} className={loading ? 'animate-spin text-primary' : 'text-primary'} />
          </button>
        </div>
      </div>

      {/* OS Tabs */}
      <div className={`flex gap-12 mb-16 border-b overflow-x-auto ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
        {['overview', 'agents', 'missions'].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-6 px-4 text-xs font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-primary' : `${subTextColor} hover:text-primary/70`}`}
          >
            {tab}
            {activeTab === tab && <motion.div layoutId="admintab" className="absolute bottom-0 left-0 w-full h-1.5 bg-primary rounded-full shadow-[0_-4px_20px_#3A7AFE]" />}
          </button>
        ))}
      </div>

      {activeTab === 'overview' && stats && (
        <div className="space-y-20">
          {/* Real-time Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
            <AdminStatCard icon={<Users />} label="Total Agents" value={stats.stats.totalUsers} color="border-primary" theme={theme} />
            <AdminStatCard icon={<Activity />} label="Total Missions" value={stats.stats.totalOrders} color="border-blue-500" theme={theme} />
            <AdminStatCard icon={<TrendingUp />} label="Gross Revenue" value={`₦${stats.stats.revenue.toLocaleString()}`} color="border-green-500" theme={theme} />
            <AdminStatCard icon={<DollarSign />} label="Panel Reserves" value={`$${stats.stats.panelBalance || '0.00'}`} color="border-yellow-500" theme={theme} />
          </div>

          {/* Neural Analytics */}
          <div className={`border p-12 lg:p-16 rounded-[4rem] h-[600px] shadow-3xl relative overflow-hidden group transition-colors ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
            <div className="flex justify-between items-center mb-16 relative z-10">
               <div>
                  <h3 className={`text-3xl font-black mb-2 ${textColor}`}>Network Neural Feed</h3>
                  <p className={`text-xs font-black uppercase tracking-widest ${subTextColor}`}>7-Day Strategic Performance Monitoring</p>
               </div>
               <div className="flex items-center gap-3 text-xs font-black text-green-500 bg-green-500/10 px-6 py-3 rounded-full border border-green-500/10 animate-pulse">
                  <Activity size={16} /> AUTO-SCALING ACTIVE
               </div>
            </div>
            <div className="h-[380px] relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={[
                  { name: 'Mon', revenue: 4200 },
                  { name: 'Tue', revenue: 3100 },
                  { name: 'Wed', revenue: 6400 },
                  { name: 'Thu', revenue: 8200 },
                  { name: 'Fri', revenue: 5100 },
                  { name: 'Sat', revenue: 9400 },
                  { name: 'Sun', revenue: 7800 },
                ]}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3A7AFE" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3A7AFE" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: isDark ? '#0F1115' : '#FFFFFF', 
                      border: isDark ? '1px solid #2D323A' : '1px solid #E2E8F0', 
                      borderRadius: '24px',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }} 
                  />
                  <XAxis dataKey="name" stroke={isDark ? "#475569" : "#94a3b8"} fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                  <Area type="monotone" dataKey="revenue" stroke="#3A7AFE" strokeWidth={6} fillOpacity={1} fill="url(#colorRev)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[150px] group-hover:bg-primary/10 transition-all duration-1000"></div>
          </div>
        </div>
      )}

      {activeTab === 'agents' && (
        <div className={`border rounded-[3.5rem] overflow-hidden shadow-3xl transition-colors ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
          <div className="p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-center gap-6">
             <h3 className={`text-2xl font-black ${textColor}`}>Agent Directory</h3>
             <div className="relative group w-full sm:w-80">
                <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'group-focus-within:text-primary text-slate-700' : 'text-slate-300'}`} size={18} />
                <input 
                  type="text" 
                  placeholder="Filter and search agents..." 
                  className={`w-full rounded-2xl py-3 pl-12 pr-6 border outline-none focus:border-primary/50 transition-all font-bold text-sm ${isDark ? 'bg-white/5 border-white/5 text-white placeholder:text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-400'}`}
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                />
             </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[1000px]">
              <thead className={isDark ? 'bg-white/5' : 'bg-slate-50'}>
                <tr>
                  <th className={`py-8 px-10 font-black text-[10px] uppercase tracking-[0.3em] ${subTextColor}`}>ID / Agent Metadata</th>
                  <th className={`py-8 px-10 font-black text-[10px] uppercase tracking-[0.3em] ${subTextColor}`}>Ops Liquidity</th>
                  <th className={`py-8 px-10 font-black text-[10px] uppercase tracking-[0.3em] ${subTextColor}`}>Enlistment Hash</th>
                  <th className={`py-8 px-10 font-black text-[10px] uppercase tracking-[0.3em] text-right ${subTextColor}`}>Command Override</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {users.filter(u => u.name.toLowerCase().includes(searchUser.toLowerCase()) || u.email.toLowerCase().includes(searchUser.toLowerCase())).map(u => (
                  <tr key={u._id} className={`transition-colors group ${isDark ? 'hover:bg-white/[0.01]' : 'hover:bg-slate-50'}`}>
                    <td className="py-8 px-10">
                      <div className="flex items-center gap-6">
                         <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black text-xl shadow-lg border border-primary/20">{u.name.charAt(0)}</div>
                         <div>
                            <p className={`font-black text-lg group-hover:text-primary transition-colors ${textColor}`}>{u.name}</p>
                            <p className={`text-xs italic font-black font-mono mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>{u.email}</p>
                         </div>
                      </div>
                    </td>
                    <td className="py-8 px-10">
                       <p className="font-mono font-black text-2xl text-primary italic leading-none">₦{u.walletBalance.toLocaleString()}</p>
                       <p className={`text-[10px] font-black uppercase mt-2 opacity-50 ${textColor}`}>Total Funds</p>
                    </td>
                    <td className={`py-8 px-10 text-[10px] font-black uppercase tracking-widest ${subTextColor}`}>
                       {new Date(u.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="py-8 px-10 text-right">
                       <button 
                        onClick={() => {
                          const amt = prompt('Ledger Adjustment Matrix (use negative to deduct):');
                          if (amt) adjustBalance(u._id, parseFloat(amt));
                        }}
                        className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all shadow-md active:scale-90 ${isDark ? 'bg-white/5 border-white/5 hover:bg-primary hover:text-white hover:border-primary shadow-black/40' : 'bg-white border-slate-200 hover:bg-primary hover:text-white hover:border-primary shadow-slate-100'}`}
                       >
                         Adjust Ledger
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const AdminStatCard = ({ icon, label, value, color, theme }) => {
  const isDark = theme === 'dark';
  return (
    <div className={`border-l-8 ${color} p-12 rounded-[2.5rem] shadow-2xl transition-all hover:scale-[1.03] ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
       <div className="flex justify-between items-start mb-8">
          <div className="text-primary opacity-30">{icon}</div>
          <div className={`w-4 h-4 rounded-full ${color.replace('border', 'bg')} shadow-[0_0_15px_currentColor]`}></div>
       </div>
       <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mb-3">{label}</p>
       <h4 className={`text-5xl font-black ${isDark ? 'text-white' : 'text-slate-900'} tracking-tighter`}>{value}</h4>
    </div>
  );
};

export default AdminDashboard;
