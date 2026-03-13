import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCcw, ExternalLink, Clock, CheckCircle, XCircle, Play, Timer, ArrowUpRight, Search, History, Cloud } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/orders`);
      setOrders(res.data.data);
    } catch (err) {
      toast.error('Failed to access mission history logs');
    } finally {
      setLoading(false);
    }
  };

  const syncStatus = async (id) => {
    try {
      toast.info('Pinging Provider API...', { autoClose: 800 });
      await axios.put(`${API_URL}/orders/${id}/sync`);
      fetchOrders();
    } catch (err) {
      toast.error('Sync Handshake Failed');
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'completed': return { icon: <CheckCircle size={14} />, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' };
      case 'processing': return { icon: <Play size={14} />, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
      case 'pending': return { icon: <Timer size={14} />, color: 'text-yellow-500', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' };
      default: return { icon: <XCircle size={14} />, color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20' };
    }
  };

  const filteredOrders = orders.filter(o => 
    o.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.externalOrderId?.includes(searchTerm)
  );

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const meshBg = isDark ? 'bg-mesh-dark' : 'bg-mesh-light';

  return (
    <div className={`pt-28 px-6 pb-32 max-w-7xl mx-auto transition-colors duration-500 ${meshBg}`}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><History size={16} /></div>
             <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${subTextColor}`}>Ops Archives</p>
          </div>
          <h1 className={`text-4xl md:text-5xl font-black mb-2 ${textColor}`}>Mission Logs</h1>
          <p className={`text-lg font-medium ${subTextColor}`}>Historical data and real-time status of all active growth missions.</p>
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96 group">
              <Search className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${isDark ? 'group-focus-within:text-primary text-slate-700' : 'text-slate-300'}`} size={20} />
              <input 
                type="text" 
                placeholder="Search logs (Service, ID)..." 
                className={`w-full rounded-[1.5rem] py-5 px-14 border outline-none focus:border-primary/50 transition-all font-black text-sm shadow-sm ${isDark ? 'bg-slate-900 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
            onClick={fetchOrders}
            className={`p-5 rounded-[1.25rem] border transition-all text-primary shadow-sm hover:scale-105 active:scale-95 ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'}`}
          >
            <RefreshCcw size={24} className={loading && orders.length > 0 ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="space-y-6">
           {[1,2,3,4,5].map(i => (
              <div key={i} className={`h-24 animate-pulse rounded-[2rem] border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-100'}`}></div>
           ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={`py-40 rounded-[4rem] text-center border-2 border-dashed flex flex-col items-center gap-8 ${isDark ? 'bg-slate-900/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
          <div className="w-24 h-24 rounded-full bg-primary/5 flex items-center justify-center text-primary opacity-20"><Cloud size={48} /></div>
          <div>
            <p className={`mb-3 text-2xl font-black ${textColor}`}>No Mission Data Detected</p>
            <p className={`font-medium italic ${subTextColor}`}>You haven't initiated any social takeovers yet.</p>
          </div>
          <Link to="/dashboard/services" className="btn-primary px-10">Initiate First Mission</Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className={`hidden lg:block overflow-hidden rounded-[3rem] border shadow-3xl transition-colors ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'} border-b`}>
                    <th className={`py-8 px-10 font-black uppercase text-[10px] tracking-[0.3em] ${subTextColor}`}>Strategic Mission</th>
                    <th className={`py-8 px-10 font-black uppercase text-[10px] tracking-[0.3em] ${subTextColor}`}>Mission Target</th>
                    <th className={`py-8 px-10 font-black uppercase text-[10px] tracking-[0.3em] text-center ${subTextColor}`}>Payload</th>
                    <th className={`py-8 px-10 font-black uppercase text-[10px] tracking-[0.3em] ${subTextColor}`}>Budget Allocated</th>
                    <th className={`py-8 px-10 font-black uppercase text-[10px] tracking-[0.3em] ${subTextColor}`}>Current Status</th>
                    <th className={`py-8 px-10 font-black uppercase text-[10px] tracking-[0.3em] text-right ${subTextColor}`}>Logs</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.03]">
                  {filteredOrders.map((order) => {
                    const config = getStatusConfig(order.status);
                    return (
                      <motion.tr 
                        key={order._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={`transition-colors group ${isDark ? 'hover:bg-white/[0.01]' : 'hover:bg-slate-50'}`}
                      >
                        <td className="py-8 px-10">
                          <p className={`font-black text-lg mb-1 group-hover:text-primary transition-colors ${textColor}`}>{order.serviceName}</p>
                          <p className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Ops ID: {order.externalOrderId || 'PENDING'}</p>
                        </td>
                        <td className="py-8 px-10">
                          <a 
                            href={order.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 text-xs font-black font-mono transition-colors text-primary hover:underline hover:underline-offset-4"
                          >
                             Link Access <ExternalLink size={12} />
                          </a>
                        </td>
                        <td className="py-8 px-10 text-center">
                           <span className={`font-mono font-black border px-4 py-2 rounded-xl text-sm ${isDark ? 'bg-white/5 border-white/5 text-white' : 'bg-slate-100 border-slate-200 text-slate-800'}`}>
                             {order.quantity.toLocaleString()}
                           </span>
                        </td>
                        <td className="py-8 px-10">
                           <p className="font-black text-xl text-primary leading-none">₦{order.price.toLocaleString()}</p>
                           <p className={`text-[10px] font-black uppercase mt-2 opacity-50 ${isDark ? 'text-white' : 'text-slate-900'}`}>Total Cost</p>
                        </td>
                        <td className="py-8 px-10">
                          <span className={`px-5 py-2 rounded-full text-[10px] font-black border flex items-center gap-3 w-fit uppercase tracking-widest shadow-lg ${config.bg} ${config.color} ${config.border}`}>
                            <span className="w-1.5 h-1.5 rounded-full bg-current animate-ping"></span>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-8 px-10 text-right">
                           <div className="flex justify-end items-center gap-6">
                              <div className="text-right">
                                 <p className={`text-[10px] font-black uppercase tracking-tighter ${textColor}`}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                 <p className={`text-[9px] font-bold opacity-40 ${textColor}`}>{new Date(order.createdAt).toLocaleTimeString()}</p>
                              </div>
                              {['pending', 'processing'].includes(order.status) && (
                                <button 
                                  onClick={() => syncStatus(order._id)}
                                  className={`w-12 h-12 flex items-center justify-center border rounded-2xl transition-all shadow-sm active:scale-90 ${isDark ? 'bg-white/5 border-white/5 hover:text-primary hover:border-primary/50' : 'bg-white border-slate-200 hover:text-primary hover:border-primary/50'}`}
                                  title="Resync Status"
                                >
                                  <RefreshCcw size={18} />
                                </button>
                              )}
                           </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-8">
            {filteredOrders.map((order) => {
              const config = getStatusConfig(order.status);
              return (
                <motion.div 
                  key={order._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-10 rounded-[3rem] border shadow-2xl transition-all ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <span className={`px-5 py-2 rounded-full text-[9px] font-black border flex items-center gap-2 uppercase tracking-widest ${config.bg} ${config.color} ${config.border}`}>
                      {order.status}
                    </span>
                    <p className={`text-[9px] font-black opacity-40 uppercase tracking-widest ${textColor}`}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <h3 className={`text-xl font-black mb-1 group-hover:text-primary transition-colors ${textColor}`}>{order.serviceName}</h3>
                  <p className={`text-[9px] font-black uppercase tracking-widest mb-10 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Ops ID: {order.externalOrderId || 'PENDING'}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-10">
                     <div className={`p-5 rounded-3xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <p className={`text-[9px] uppercase font-black tracking-widest mb-1 ${subTextColor}`}>Payload</p>
                        <p className={`text-lg font-black ${textColor}`}>{order.quantity.toLocaleString()}</p>
                     </div>
                     <div className={`p-5 rounded-3xl border ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                        <p className={`text-[9px] uppercase font-black tracking-widest mb-1 ${subTextColor}`}>Investment</p>
                        <p className={`text-lg font-black text-primary`}>₦{order.price.toLocaleString()}</p>
                     </div>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                     <a 
                        href={order.link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 py-4 flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-widest rounded-2xl border transition-all text-primary border-primary/20 bg-primary/5 shadow-inner"
                      >
                         Objective <ExternalLink size={14} />
                      </a>
                      {['pending', 'processing'].includes(order.status) && (
                        <button 
                          onClick={() => syncStatus(order._id)}
                          className={`w-14 h-14 flex items-center justify-center border rounded-2xl transition-all shadow-sm active:scale-95 ${isDark ? 'bg-white/5 border-white/10 text-primary' : 'bg-white border-slate-200 text-primary'}`}
                        >
                          <RefreshCcw size={20} />
                        </button>
                      )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Orders;
