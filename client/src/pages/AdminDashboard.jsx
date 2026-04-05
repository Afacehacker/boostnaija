import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  Users, BarChart3, RefreshCw, Settings, UserPlus, 
  DollarSign, Activity, Database, ShieldAlert, TrendingUp, Search, 
  Pocket, Zap, Terminal, Lock, Globe, Cpu, Layers, Plus, Bell, Trash2, ExternalLink, ArrowRight, Send, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [searchUser, setSearchUser] = useState('');
  const [orders, setOrders] = useState([]);
  const [searchOrder, setSearchOrder] = useState('');
  const [showNotifModal, setShowNotifModal] = useState(false);
  const [newNotif, setNewNotif] = useState({ title: '', message: '', type: 'info' });
  const [pendingPayments, setPendingPayments] = useState([]);
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState('');
  const [replyImage, setReplyImage] = useState(null);
  const { theme } = useTheme();
  const { token } = useAuth();

  const isDark = theme === 'dark';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchAdminData();
    fetchNotifications();
    fetchOrders();
    fetchPendingPayments();
    fetchChats();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const statsRes = await axios.get(`${API_URL}/admin/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(statsRes.data.data);
      const usersRes = await axios.get(`${API_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(usersRes.data.data);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/notifications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data.data);
    } catch (err) {
      console.error('Failed to fetch notifications');
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data.data);
    } catch (err) {
      console.error('Failed to fetch orders');
    }
  };

  const fetchPendingPayments = async () => {
    try {
      const res = await axios.get(`${API_URL}/payments/manual/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPendingPayments(res.data.data);
    } catch (err) {
      console.error('Failed to fetch pending payments');
    }
  };

  const fetchChats = async () => {
    try {
      const res = await axios.get(`${API_URL}/support/admin/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(res.data.data);
    } catch (err) {
      console.error('Failed to fetch chats');
    }
  };

  const fetchUserChat = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/support/admin/chats/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessages(res.data.data);
      setSelectedChat(userId);
    } catch (err) {
      toast.error('Failed to load chat');
    }
  };

  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim() && !replyImage) return;
    try {
      await axios.post(`${API_URL}/support/reply/${selectedChat}`, 
        { message: reply, image: replyImage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply('');
      setReplyImage(null);
      fetchUserChat(selectedChat);
    } catch (err) {
      toast.error('Failed to send reply');
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
          } else {
            if (height > MAX_HEIGHT) { width *= MAX_HEIGHT / height; height = MAX_HEIGHT; }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleAdminFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setReplyImage(compressed);
      } catch (err) {
        toast.error('Failed to process image');
      }
    }
  };

  const processPayment = async (id, status) => {
    try {
      await axios.put(`${API_URL}/payments/manual/${id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`Payment ${status === 'success' ? 'confirmed' : 'rejected'}`);
      fetchPendingPayments();
      fetchAdminData();
    } catch (err) {
      toast.error('Action failed');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      await axios.delete(`${API_URL}/admin/users/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('User deleted successfully');
      fetchAdminData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user');
    }
  };

  const sendNotification = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/notifications`, newNotif, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Broadcast sent to all agents! 📢');
      setShowNotifModal(false);
      setNewNotif({ title: '', message: '', type: 'info' });
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to send broadcast');
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`${API_URL}/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Notification removed');
      fetchNotifications();
    } catch (err) {
      toast.error('Failed to remove notification');
    }
  };

  const syncServices = async () => {
    try {
      toast.info('Syncing services with provider...');
      await axios.post(`${API_URL}/services/sync`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Services synchronized successfully');
    } catch (err) {
      toast.error('Failed to sync services');
    }
  };

  const adjustBalance = async (userId, amount) => {
    try {
      await axios.put(`${API_URL}/admin/users/${userId}/balance`, 
        { amount },
        { headers: { Authorization: `Bearer ${token}` } }
      );
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
              onClick={() => {
                fetchAdminData();
                fetchOrders();
              }} 
              className={`p-4 rounded-2xl border transition-all ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <RefreshCw size={24} className={`${loading ? 'animate-spin' : ''} text-primary`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`flex gap-8 mb-12 border-b overflow-x-auto no-scrollbar ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
          {['overview', 'users', 'orders', 'payments', 'support', 'notifications', 'status'].map(tab => (
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

          {activeTab === 'notifications' && (
            <motion.div 
               key="notifications"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-8"
            >
               <div className="flex justify-between items-center">
                  <h3 className={`text-2xl font-black ${textColor}`}>System Broadcasts</h3>
                  <button 
                    onClick={() => setShowNotifModal(true)}
                    className="btn-primary flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold uppercase"
                  >
                    <Plus size={18} /> New Broadcast
                  </button>
               </div>

               <div className="grid gap-6">
                  {notifications.map(n => (
                    <div key={n._id} className={`p-8 rounded-[2rem] border flex justify-between items-center ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                       <div>
                          <div className="flex items-center gap-3 mb-2">
                             <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${n.type === 'urgent' ? 'bg-red-500/20 text-red-500' : 'bg-primary/20 text-primary'}`}>{n.type}</span>
                             <span className={`text-[10px] font-bold ${subTextColor}`}>{new Date(n.createdAt).toLocaleString()}</span>
                          </div>
                          <h4 className={`text-xl font-bold ${textColor}`}>{n.title}</h4>
                          <p className={`text-sm ${subTextColor}`}>{n.message}</p>
                       </div>
                       <button 
                        onClick={() => deleteNotification(n._id)}
                        className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                       >
                         <ShieldAlert size={18} />
                       </button>
                    </div>
                  ))}
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
                             <div className="flex shrink-0 gap-2 justify-end">
                                <button 
                                 onClick={() => {
                                   const amt = prompt('Amount to add/subtract (₦):');
                                   if (amt) adjustBalance(u._id, parseFloat(amt));
                                 }}
                                 className={`px-4 py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${isDark ? 'bg-white/5 border-white/10 hover:bg-primary' : 'bg-white border-slate-200 hover:bg-primary hover:text-white'}`}
                                >
                                  Adjust Balance
                                </button>
                                <button 
                                 onClick={() => deleteUser(u._id)}
                                 className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                >
                                  <Trash2 size={16} />
                                </button>
                             </div>
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </motion.div>
          )}

          {activeTab === 'orders' && (
            <motion.div 
               key="orders"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className={`border rounded-[2rem] overflow-hidden shadow-xl ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}
            >
               <div className="p-8 border-b border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                  <h3 className={`text-2xl font-black ${textColor}`}>Recent Orders</h3>
                  <div className="relative w-full md:w-96">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                     <input 
                       type="text" 
                       placeholder="Search orders..." 
                       className={`w-full rounded-xl py-4 pl-12 pr-6 border outline-none focus:border-primary transition-all font-bold text-sm ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-inner'}`}
                       value={searchOrder}
                       onChange={(e) => setSearchOrder(e.target.value)}
                     />
                  </div>
               </div>
               <div className="overflow-x-auto">
                 <table className="w-full text-left min-w-[1000px]">
                   <thead>
                     <tr className={isDark ? 'bg-white/5' : 'bg-slate-50'}>
                       <th className={`py-6 px-8 font-bold text-[10px] uppercase tracking-widest ${subTextColor}`}>User</th>
                       <th className={`py-6 px-8 font-bold text-[10px] uppercase tracking-widest ${subTextColor}`}>Order Details</th>
                       <th className={`py-6 px-8 font-bold text-[10px] uppercase tracking-widest ${subTextColor}`}>Status</th>
                       <th className={`py-6 px-8 font-bold text-[10px] uppercase tracking-widest text-right ${subTextColor}`}>Date</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                     {orders.filter(o => 
                        o.serviceName.toLowerCase().includes(searchOrder.toLowerCase()) || 
                        o.userId?.name.toLowerCase().includes(searchOrder.toLowerCase()) ||
                        o.externalOrderId?.includes(searchOrder)
                     ).map(o => (
                       <tr key={o._id} className={`transition-all ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                         <td className="py-6 px-8">
                            <p className={`font-bold text-base ${textColor}`}>{o.userId?.name || 'Deleted User'}</p>
                            <p className={`text-[10px] ${subTextColor}`}>{o.userId?.email || '---'}</p>
                         </td>
                         <td className="py-6 px-8">
                            <p className={`font-bold text-sm ${textColor}`}>{o.serviceName}</p>
                            <div className="flex items-center gap-3">
                               <p className="text-primary font-bold text-lg">₦{o.price.toLocaleString()}</p>
                               <span className={`text-[10px] ${subTextColor}`}>Qty: {o.quantity.toLocaleString()}</span>
                            </div>
                            <a href={o.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-[10px] font-bold inline-flex items-center gap-1">
                               View Link <ExternalLink size={10} />
                            </a>
                         </td>
                         <td className="py-6 px-8">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-2 ${
                               o.status === 'completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                               o.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                               'bg-blue-500/10 text-blue-500 border-blue-500/20'
                            }`}>
                               {o.status}
                            </span>
                         </td>
                         <td className={`py-6 px-8 text-right text-xs font-bold ${subTextColor}`}>
                            {new Date(o.createdAt).toLocaleString()}
                         </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </motion.div>
          )}

          {activeTab === 'payments' && (
            <motion.div 
               key="payments"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="space-y-8"
            >
               <h3 className={`text-2xl font-black ${textColor}`}>Manual Payments Confirmation</h3>
               {pendingPayments.length > 0 ? (
                 <div className="grid md:grid-cols-2 gap-8">
                    {pendingPayments.map(p => (
                      <div key={p._id} className={`p-8 rounded-[2rem] border ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100 shadow-lg'}`}>
                         <div className="flex justify-between items-start mb-6">
                            <div>
                               <p className={`font-bold ${textColor}`}>{p.user?.name}</p>
                               <p className={`text-[10px] ${subTextColor}`}>{p.user?.email}</p>
                            </div>
                            <p className="text-primary font-black text-2xl italic">₦{p.amount.toLocaleString()}</p>
                         </div>
                         
                         <div className="mb-6 rounded-xl overflow-hidden border border-white/5">
                            <img src={p.receipt} alt="receipt" className="w-full h-auto max-h-64 object-contain bg-black/20" />
                         </div>

                         <div className="flex gap-4">
                            <button 
                              onClick={() => processPayment(p._id, 'success')}
                              className="flex-1 py-4 rounded-xl bg-green-500 text-white font-bold text-xs uppercase tracking-widest hover:bg-green-600 transition-all"
                            >
                               Confirm Payment
                            </button>
                            <button 
                              onClick={() => processPayment(p._id, 'rejected')}
                              className="px-6 py-4 rounded-xl border border-red-500/20 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                            >
                               Reject
                            </button>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="p-20 text-center opacity-30">
                    <p className={`text-lg font-bold ${subTextColor}`}>No pending payments to confirm.</p>
                 </div>
               )}
            </motion.div>
          )}

          {activeTab === 'support' && (
            <motion.div 
               key="support"
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               className="grid lg:grid-cols-3 gap-8"
            >
               {/* Chat List */}
               <div className={`lg:col-span-1 rounded-[2rem] border overflow-hidden ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                  <div className="p-6 border-b border-white/5">
                     <h4 className={`font-black ${textColor}`}>Messages</h4>
                  </div>
                  <div className="divide-y divide-white/5 overflow-y-auto max-h-[600px]">
                     {chats.map(chat => (
                        <button 
                          key={chat._id}
                          onClick={() => fetchUserChat(chat._id)}
                          className={`w-full p-6 text-left transition-all hover:bg-primary/5 ${selectedChat === chat._id ? 'bg-primary/10 border-l-4 border-primary' : ''}`}
                        >
                           <div className="flex justify-between items-start mb-1">
                              <p className={`font-bold text-sm ${textColor}`}>{chat.user.name}</p>
                              {chat.unreadCount > 0 && (
                                <span className="bg-primary text-white text-[8px] font-black px-2 py-1 rounded-full">{chat.unreadCount}</span>
                              )}
                           </div>
                           <p className={`text-[10px] truncate ${subTextColor}`}>{chat.lastMessage}</p>
                        </button>
                     ))}
                  </div>
               </div>

               {/* Chat View */}
               <div className={`lg:col-span-2 rounded-[2rem] border flex flex-col h-[600px] overflow-hidden ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                  {selectedChat ? (
                    <>
                      <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                         <h4 className={`font-black ${textColor}`}>Chat Thread</h4>
                         <button onClick={() => fetchUserChat(selectedChat)} className="p-2 rounded-lg hover:bg-white/10 text-primary">
                            <RefreshCw size={18} />
                         </button>
                      </div>
                      <div className="flex-1 p-6 overflow-y-auto space-y-4">
                         {messages.map((m, i) => (
                           <div key={i} className={`flex ${m.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] p-4 rounded-2xl text-sm font-medium ${m.sender === 'admin' ? 'bg-primary text-white rounded-tr-none' : `${isDark ? 'bg-white/10 text-slate-200' : 'bg-slate-100 text-slate-800'} rounded-tl-none`}`}>
                                 {m.image && (
                                    <img src={m.image} alt="attachment" className="rounded-lg mb-2 max-w-full h-auto cursor-pointer" onClick={() => window.open(m.image, '_blank')} />
                                 )}
                                 {m.message && <p>{m.message}</p>}
                                 <p className="text-[8px] mt-1 opacity-50 uppercase font-black">{new Date(m.createdAt).toLocaleTimeString()}</p>
                              </div>
                           </div>
                         ))}
                      </div>
                      <form onSubmit={handleReply} className="p-6 border-t border-white/5 bg-white/5">
                         {replyImage && (
                            <div className="relative mb-4 inline-block">
                               <img src={replyImage} alt="preview" className="h-20 w-20 object-cover rounded-lg border-2 border-primary" />
                               <button 
                                 type="button" 
                                 onClick={() => setReplyImage(null)}
                                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg hover:scale-110 transition-all"
                               >
                                  <X size={12} />
                               </button>
                            </div>
                         )}
                         <div className="flex gap-4">
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleAdminFileChange}
                              id="chat-image-admin"
                              className="hidden"
                            />
                            <label 
                              htmlFor="chat-image-admin"
                              className={`p-4 rounded-xl border border-white/10 flex items-center justify-center cursor-pointer transition-all ${isDark ? 'hover:bg-white/5 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}
                            >
                               <ImageIcon size={24} />
                            </label>
                            <input 
                              type="text" 
                              placeholder="Type your reply..."
                              className={`flex-1 bg-white/5 border border-white/10 rounded-xl px-6 py-4 outline-none focus:border-primary transition-all font-bold text-sm ${textColor}`}
                              value={reply}
                              onChange={(e) => setReply(e.target.value)}
                            />
                            <button type="submit" className="p-4 rounded-xl bg-primary text-white hover:scale-105 transition-all shadow-lg" disabled={!reply.trim() && !replyImage}>
                               <ArrowRight size={24} />
                            </button>
                         </div>
                      </form>
                    </>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center opacity-20 p-10 text-center">
                       <Activity size={80} className="mb-6" />
                       <p className={`text-xl font-black ${textColor}`}>Select a chat to view messages</p>
                    </div>
                  )}
               </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Notification Modal */}
        <AnimatePresence>
           {showNotifModal && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowNotifModal(false)} />
                 <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`relative w-full max-w-lg p-8 md:p-12 rounded-[2.5rem] border shadow-2xl z-[210] ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-3xl font-black mb-8 ${textColor}`}>New <span className="text-primary italic">Broadcast</span></h3>
                    <form onSubmit={sendNotification} className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Title</label>
                          <input 
                            type="text" 
                            required
                            className={`w-full py-4 px-6 rounded-xl border outline-none focus:border-primary transition-all font-bold ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                            value={newNotif.title}
                            onChange={(e) => setNewNotif({...newNotif, title: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Type</label>
                          <select 
                            className={`w-full py-4 px-6 rounded-xl border outline-none focus:border-primary transition-all font-bold ${isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                            value={newNotif.type}
                            onChange={(e) => setNewNotif({...newNotif, type: e.target.value})}
                          >
                             <option value="info">Information</option>
                             <option value="warning">Warning</option>
                             <option value="urgent">Urgent Alert</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Message</label>
                          <textarea 
                            rows="4"
                            required
                            className={`w-full py-4 px-6 rounded-xl border outline-none focus:border-primary transition-all font-bold ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                            value={newNotif.message}
                            onChange={(e) => setNewNotif({...newNotif, message: e.target.value})}
                          />
                       </div>
                       <div className="flex gap-4 pt-4">
                          <button type="submit" className="flex-1 btn-primary py-4 rounded-xl flex items-center justify-center gap-2 font-black uppercase tracking-widest text-xs">
                             <TrendingUp size={18} /> Send Broadcast
                          </button>
                          <button type="button" onClick={() => setShowNotifModal(false)} className={`px-6 rounded-xl border font-bold text-[10px] uppercase transition-all ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                             Cancel
                          </button>
                       </div>
                    </form>
                 </motion.div>
              </div>
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
