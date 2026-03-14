import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { RefreshCcw, ExternalLink, Clock, CheckCircle, XCircle, Play, Timer, ArrowUpRight, Search, History, Cloud } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { theme } = useTheme();
  
  const isDark = theme === 'dark';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/orders`);
      setOrders(res.data.data);
    } catch (err) {
      toast.error('Failed to load order history');
    } finally {
      setLoading(false);
    }
  };

  const syncStatus = async (id) => {
    try {
      toast.info('Checking for updates...', { autoClose: 800 });
      await axios.put(`${API_URL}/orders/${id}/sync`);
      fetchOrders();
    } catch (err) {
      toast.error('Failed to sync status');
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
  const meshBg = isDark ? 'bg-cyber-mesh' : 'bg-light-mesh';

  return (
    <div className={`min-h-screen pt-24 md:pt-32 pb-40 transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-16">
        <div>
          <h1 className={`text-4xl md:text-5xl font-black mb-2 ${textColor}`}>Order <span className="text-primary italic">History</span></h1>
          <p className={`text-base md:text-lg font-medium ${subTextColor}`}>Track your social media growth orders in real-time.</p>
        </div>
        
        <div className="flex gap-4 w-full lg:w-auto">
           <div className="relative flex-1 lg:w-96">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search orders..." 
                className={`w-full rounded-2xl py-4 px-12 border outline-none focus:border-primary transition-all font-bold text-sm shadow-sm ${isDark ? 'bg-slate-900 border-white/10 text-white' : 'bg-white border-slate-200 text-slate-900'}`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           <button 
            onClick={fetchOrders}
            className={`p-4 rounded-xl border transition-all text-primary shadow-sm hover:scale-105 active:scale-95 ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'}`}
          >
            <RefreshCcw size={20} className={loading && orders.length > 0 ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {loading && orders.length === 0 ? (
        <div className="space-y-4">
           {[1,2,3,4,5].map(i => (
              <div key={i} className={`h-24 animate-pulse rounded-2xl border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-100'}`}></div>
           ))}
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className={`py-40 rounded-[2rem] md:rounded-[3rem] text-center border-2 border-dashed flex flex-col items-center gap-6 ${isDark ? 'bg-slate-900/20 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary"><Clock size={40} /></div>
          <div>
            <p className={`mb-2 text-2xl font-black ${textColor}`}>No Orders Found</p>
            <p className={`font-medium ${subTextColor}`}>You haven't placed any orders yet.</p>
          </div>
          <Link to="/dashboard/services" className="btn-primary px-8">Start Boosting Now</Link>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className={`hidden lg:block overflow-hidden rounded-[2rem] border shadow-xl transition-colors ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className={`${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'} border-b`}>
                    <th className={`py-6 px-8 font-bold uppercase text-[10px] tracking-widest ${subTextColor}`}>Service</th>
                    <th className={`py-6 px-8 font-bold uppercase text-[10px] tracking-widest ${subTextColor}`}>Target Link</th>
                    <th className={`py-6 px-8 font-bold uppercase text-[10px] tracking-widest text-center ${subTextColor}`}>Qty</th>
                    <th className={`py-6 px-8 font-bold uppercase text-[10px] tracking-widest ${subTextColor}`}>Price</th>
                    <th className={`py-6 px-8 font-bold uppercase text-[10px] tracking-widest ${subTextColor}`}>Status</th>
                    <th className={`py-6 px-8 font-bold uppercase text-[10px] tracking-widest text-right ${subTextColor}`}>Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredOrders.map((order) => {
                    const config = getStatusConfig(order.status);
                    return (
                      <tr key={order._id} className={`transition-colors ${isDark ? 'hover:bg-white/5' : 'hover:bg-slate-50'}`}>
                        <td className="py-6 px-8">
                          <p className={`font-bold text-base mb-1 ${textColor}`}>{order.serviceName}</p>
                          <p className={`text-[10px] font-bold ${subTextColor}`}>ID: {order.externalOrderId || '---'}</p>
                        </td>
                        <td className="py-6 px-8">
                          <a href={order.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs font-bold inline-flex items-center gap-1">
                             View Link <ExternalLink size={12} />
                          </a>
                        </td>
                        <td className="py-6 px-8 text-center">
                           <span className={`px-3 py-1 rounded-lg text-xs font-bold ${isDark ? 'bg-white/5 text-white' : 'bg-slate-100 text-slate-800'}`}>
                             {order.quantity.toLocaleString()}
                           </span>
                        </td>
                        <td className="py-6 px-8">
                           <p className="font-bold text-lg text-primary">₦{order.price.toLocaleString()}</p>
                        </td>
                        <td className="py-6 px-8">
                          <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold border inline-flex items-center gap-2 ${config.bg} ${config.color} ${config.border}`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="py-6 px-8 text-right">
                           <div className="flex justify-end items-center gap-4">
                              <div className="text-right">
                                 <p className={`text-xs font-bold ${textColor}`}>{new Date(order.createdAt).toLocaleDateString()}</p>
                                 <p className={`text-[10px] opacity-50 ${textColor}`}>{new Date(order.createdAt).toLocaleTimeString()}</p>
                              </div>
                              {['pending', 'processing'].includes(order.status) && (
                                <button 
                                  onClick={() => syncStatus(order._id)}
                                  className={`p-2 rounded-lg border transition-all ${isDark ? 'bg-white/5 border-white/10 text-primary' : 'bg-white border-slate-200 text-primary'}`}
                                >
                                  <RefreshCcw size={16} />
                                </button>
                              )}
                           </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden space-y-6">
            {filteredOrders.map((order) => {
              const config = getStatusConfig(order.status);
              return (
                <div key={order._id} className={`p-6 rounded-[2rem] border shadow-lg ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold border flex items-center gap-2 ${config.bg} ${config.color} ${config.border}`}>
                      {order.status}
                    </span>
                    <p className={`text-[10px] font-bold opacity-40 ${textColor}`}>{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <h3 className={`text-lg font-bold mb-1 ${textColor}`}>{order.serviceName}</h3>
                  <p className={`text-[10px] font-bold mb-6 ${subTextColor}`}>ID: {order.externalOrderId || '---'}</p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-6">
                     <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <p className={`text-[9px] font-bold mb-1 ${subTextColor}`}>Quantity</p>
                        <p className={`text-base font-black ${textColor}`}>{order.quantity.toLocaleString()}</p>
                     </div>
                     <div className={`p-4 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'}`}>
                        <p className={`text-[9px] font-bold mb-1 ${subTextColor}`}>Price</p>
                        <p className={`text-base font-black text-primary`}>₦{order.price.toLocaleString()}</p>
                     </div>
                  </div>

                  <div className="flex items-center gap-3">
                     <a href={order.link} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 flex items-center justify-center gap-2 text-xs font-bold rounded-xl border border-primary/20 text-primary bg-primary/5">
                        Link <ExternalLink size={14} />
                      </a>
                      {['pending', 'processing'].includes(order.status) && (
                        <button onClick={() => syncStatus(order._id)} className="p-3 border rounded-xl border-slate-200 text-primary">
                          <RefreshCcw size={18} />
                        </button>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
      </div>
    </div>
  );
};

export default Orders;
