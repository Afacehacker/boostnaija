import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Search, Filter, ShoppingBag, Info, AlertTriangle, ChevronRight, X, Zap, Target, Globe, CloudLightning } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Services = () => {
  const { user, fetchUser } = useAuth();
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const [selectedService, setSelectedService] = useState(null);
  const [orderLink, setOrderLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [orderLoading, setOrderLoading] = useState(false);
  const [currency, setCurrency] = useState('NGN');

  const isDark = theme === 'dark';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/services`);
      const data = res.data.data;
      setServices(data);
      const cats = ['All', ...new Set(data.map(s => s.category))];
      setCategories(cats);
    } catch (err) {
      toast.error('Failed to load global services');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!selectedService) return;
    
    setOrderLoading(true);
    try {
      await axios.post(`${API_URL}/orders`, {
        serviceId: selectedService.externalId,
        link: orderLink,
        quantity: parseInt(quantity)
      });
      toast.success('Mission Launched! Check History.');
      setSelectedService(null);
      setOrderLink('');
      setQuantity('');
      fetchUser(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'Mission Aborted: Provider Error');
    } finally {
      setOrderLoading(false);
    }
  };

  const exchangeRate = 1800;
  const formatPrice = (price) => {
    if (currency === 'USD') return `$${(price / exchangeRate).toFixed(2)}`;
    return `₦${price.toLocaleString()}`;
  };

  const filteredServices = services.filter(s => {
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';

  return (
    <div className={`pt-28 px-6 pb-20 max-w-7xl mx-auto transition-colors duration-500`}>
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-10 mb-16">
        <div>
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><Target size={16} /></div>
             <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${subTextColor}`}>Ops Storefront</p>
          </div>
          <h1 className={`text-5xl font-black mb-2 ${textColor}`}>Service Catalog</h1>
          <p className={`text-lg font-medium ${subTextColor}`}>Enlist the best engagement units for your social missions.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
          {/* Currency Toggle */}
          <div className={`${isDark ? 'bg-slate-900 border-white/5' : 'bg-slate-100 border-slate-200'} p-1.5 rounded-2xl border flex shadow-sm`}>
             <button 
                onClick={() => setCurrency('NGN')}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${currency === 'NGN' ? 'bg-primary text-white shadow-lg' : isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
             >
                NGN
             </button>
             <button 
                onClick={() => setCurrency('USD')}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all ${currency === 'USD' ? 'bg-primary text-white shadow-lg' : isDark ? 'text-slate-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
             >
                USD
             </button>
          </div>

          <div className="relative group flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 transition-colors group-focus-within:text-primary" size={20} />
            <input 
              type="text" 
              placeholder="Filter by keyword..." 
              className={`w-full lg:w-80 border rounded-[1.25rem] py-4 pl-12 pr-6 outline-none focus:border-primary/50 transition-all font-bold text-sm shadow-sm ${isDark ? 'bg-slate-900 border-white/5 text-white placeholder:text-slate-700' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="relative">
            <select 
              className={`border rounded-[1.25rem] py-4 px-8 pr-12 outline-none focus:border-primary/50 appearance-none font-black uppercase text-[10px] tracking-widest cursor-pointer shadow-sm ${isDark ? 'bg-slate-900 border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-500'}`}
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 rotate-90 pointer-events-none" size={16} />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
           {[1,2,3,4,5,6].map(i => (
              <div key={i} className={`h-80 rounded-[3rem] animate-pulse border ${isDark ? 'bg-slate-900/50 border-white/5' : 'bg-slate-50 border-slate-100'}`}></div>
           ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredServices.map(service => (
            <motion.div 
              key={service._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -8 }}
              className={`border p-10 rounded-[3.5rem] flex flex-col justify-between transition-all relative overflow-hidden group shadow-2xl ${isDark ? 'bg-slate-900 border-white/5 hover:border-primary/30' : 'bg-white border-slate-100 hover:border-primary/20'}`}
            >
              <div>
                <div className="flex justify-between items-start mb-8">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full border ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    {service.category}
                  </span>
                  <div className="text-right">
                    <p className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'}`}>{formatPrice(service.sellingRate)}</p>
                    <p className={`text-[10px] uppercase font-black tracking-widest mt-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>per 1k units</p>
                  </div>
                </div>
                <h3 className={`text-2xl font-black mb-8 leading-[1.2] group-hover:text-primary transition-colors ${textColor}`}>{service.name}</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-12">
                   <div className={`p-4 rounded-[1.5rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                      <p className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Min Ops</p>
                      <p className={`text-lg font-black ${textColor}`}>{service.min.toLocaleString()}</p>
                   </div>
                   <div className={`p-4 rounded-[1.5rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                      <p className={`text-[10px] uppercase font-black tracking-widest mb-1 ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Max Ops</p>
                      <p className={`text-lg font-black ${textColor}`}>{service.max.toLocaleString()}</p>
                   </div>
                </div>
              </div>
              
              <button 
                onClick={() => setSelectedService(service)}
                className={`w-full py-5 rounded-[1.5rem] transition-all font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-3 border ${isDark ? 'bg-white/5 border-white/10 text-white group-hover:bg-primary group-hover:border-primary' : 'bg-slate-100 border-slate-100 text-slate-900 group-hover:bg-primary group-hover:border-primary group-hover:text-white'}`}
              >
                Assemble Unit <ChevronRight size={16} />
              </button>
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/5 blur-3xl rounded-full -z-0"></div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Order Configuration Modal */}
      <AnimatePresence>
        {selectedService && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/95 backdrop-blur-xl"
              onClick={() => setSelectedService(null)}
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 100 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 100 }}
              className={`relative w-full max-w-xl p-12 lg:p-16 rounded-[4rem] border transition-colors shadow-3xl ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}
            >
              <button onClick={() => setSelectedService(null)} className="absolute top-10 right-10 text-slate-500 hover:text-primary transition-colors">
                <X size={32} />
              </button>

              <div className="mb-12 text-center">
                 <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20 shadow-2xl animate-pulse">
                    <CloudLightning size={36} />
                 </div>
                 <h2 className={`text-4xl font-black mb-3 ${textColor}`}>Mission Briefing</h2>
                 <p className={`font-medium italic ${subTextColor} max-w-xs mx-auto`}>Targeting: {selectedService.name}</p>
              </div>

              <form onSubmit={handlePlaceOrder} className="space-y-10">
                <div className="space-y-4">
                  <label className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Mission Objective (URL)</label>
                  <div className="relative">
                    <Globe className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <input 
                      type="url" 
                      placeholder="https://instagram.com/p/..." 
                      className={`w-full rounded-[1.5rem] py-6 pl-14 pr-6 border outline-none focus:border-primary transition-all font-bold ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                      value={orderLink}
                      onChange={(e) => setOrderLink(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className={`text-[10px] font-black uppercase tracking-[0.3em] ${isDark ? 'text-slate-600' : 'text-slate-400'}`}>Engagement Strength (Quantity)</label>
                  <div className="relative">
                    <Zap className="absolute left-5 top-1/2 -translate-y-1/2 text-primary" size={20} />
                    <input 
                      type="number" 
                      placeholder={`Min: ${selectedService.min}`}
                      className={`w-full rounded-[1.5rem] py-6 pl-14 pr-6 border outline-none focus:border-primary transition-all text-2xl font-black ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900'}`}
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      min={selectedService.min}
                      max={selectedService.max}
                      required
                    />
                  </div>
                </div>

                <div className={`p-10 rounded-[2.5rem] border flex justify-between items-center ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-100 shadow-inner'}`}>
                  <div>
                    <p className={`text-[10px] font-black uppercase tracking-widest mb-2 ${subTextColor}`}>Total Resources Due</p>
                    <p className="text-4xl font-black text-primary">
                      {quantity ? formatPrice((selectedService.sellingRate / 1000) * quantity) : formatPrice(0)}
                    </p>
                  </div>
                  <div className="text-right">
                     <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${subTextColor}`}>Unit Cost</p>
                     <p className={`font-black italic ${isDark ? 'text-white/60' : 'text-slate-500'}`}>{formatPrice(selectedService.sellingRate)}/1k</p>
                  </div>
                </div>

                {user?.walletBalance < ((selectedService.sellingRate / 1000) * quantity) && (
                  <div className="text-red-400 text-xs flex items-center justify-center gap-4 bg-red-400/10 p-5 rounded-[1.5rem] border border-red-400/20 shadow-lg">
                    <AlertTriangle size={24}/> 
                    <span className="font-bold">Insufficient Liquidity. <Link to="/dashboard/wallet" className="underline font-black decoration-primary underline-offset-8">Refill Ops Wallet</Link></span>
                  </div>
                )}

                <button 
                  type="submit"
                  disabled={orderLoading || !quantity || user?.walletBalance < ((selectedService.sellingRate / 1000) * quantity)}
                  className="w-full btn-primary py-7 rounded-[2rem] font-black text-xl shadow-3xl disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed group"
                >
                  <span className="flex items-center justify-center gap-4">
                    {orderLoading ? 'Calibrating Network...' : 'Execute Mission Now'}
                    <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                  </span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Services;
