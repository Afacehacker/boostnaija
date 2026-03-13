import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { ShoppingBag, Info, AlertTriangle, ChevronRight, Zap, Target, Globe, CloudLightning, ShieldCheck, ZapOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Services = () => {
  const { user, fetchUser } = useAuth();
  const { theme } = useTheme();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState(null);
  const [orderLink, setOrderLink] = useState('');
  const [quantity, setQuantity] = useState('');
  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);
  const [currency, setCurrency] = useState('NGN');

  const isDark = theme === 'dark';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const res = await axios.get(`${API_URL}/services`);
      const data = res.data.data;
      setServices(data);
      const cats = [...new Set(data.map(s => s.category))];
      setCategories(cats);
      if (cats.length > 0) setSelectedCategory(cats[0]);
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

  const filteredServices = services.filter(s => s.category === selectedCategory);

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const meshBg = isDark ? 'bg-mesh-dark' : 'bg-mesh-light';

  return (
    <div className={`pt-28 px-6 pb-40 min-h-screen transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-primary/10 rounded-[2.5rem] flex items-center justify-center text-primary mx-auto mb-8 border border-primary/20 shadow-2xl"
          >
            <ShoppingBag size={36} />
          </motion.div>
          <h1 className={`text-5xl font-black mb-4 ${textColor}`}>New Mission</h1>
          <p className={`text-lg font-medium ${subTextColor}`}>Select your strategic target and deploy engagement units.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-8 md:p-14 rounded-[4rem] border transition-all shadow-3xl overflow-hidden relative ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}
        >
          <form onSubmit={handlePlaceOrder} className="space-y-12 relative z-10">
            {/* Category Dropdown */}
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>01. Select Department</label>
              <div className="relative group">
                <Target className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                <select 
                  className={`w-full appearance-none rounded-[2rem] py-6 pl-16 pr-10 border outline-none focus:border-primary transition-all font-bold text-lg cursor-pointer ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900 shadow-inner'}`}
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedService(null);
                  }}
                >
                  {categories.map(c => (
                    <option key={c} value={c} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 rotate-90 pointer-events-none" size={20} />
              </div>
            </div>

            {/* Service Dropdown */}
            <div className={`space-y-4 transition-all ${!selectedCategory ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
              <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>02. Choose Strategic Service</label>
              <div className="relative group">
                <CloudLightning className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                <select 
                  className={`w-full appearance-none rounded-[2rem] py-6 pl-16 pr-10 border outline-none focus:border-primary transition-all font-bold text-sm cursor-pointer ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900 shadow-inner'}`}
                  value={selectedService?._id || ''}
                  onChange={(e) => {
                    const s = filteredServices.find(srv => srv._id === e.target.value);
                    setSelectedService(s);
                  }}
                >
                  <option value="" disabled className={isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}>Select a specific unit...</option>
                  {filteredServices.map(s => (
                    <option key={s._id} value={s._id} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                      {s.name} — {formatPrice(s.sellingRate)}/1k
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 rotate-90 pointer-events-none" size={20} />
              </div>
            </div>

            <AnimatePresence>
              {selectedService && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-12 overflow-hidden"
                >
                  {/* Service Intel */}
                  <div className={`p-8 rounded-[2.5rem] border grid grid-cols-2 md:grid-cols-4 gap-6 ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100/50 border-slate-200'}`}>
                    <div>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${subTextColor} mb-1`}>Min Units</p>
                      <p className={`font-black ${textColor}`}>{selectedService.min.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${subTextColor} mb-1`}>Max Units</p>
                      <p className={`font-black ${textColor}`}>{selectedService.max.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${subTextColor} mb-1`}>Speed</p>
                      <p className="font-black text-green-500 flex items-center gap-1"><Zap size={14}/> Instant</p>
                    </div>
                    <div>
                      <p className={`text-[9px] font-black uppercase tracking-widest ${subTextColor} mb-1`}>Protection</p>
                      <p className="font-black text-primary flex items-center gap-1"><ShieldCheck size={14}/> 30D Refill</p>
                    </div>
                  </div>

                  {/* Target URL */}
                  <div className="space-y-4">
                    <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>03. Mission Objective (URL)</label>
                    <div className="relative group">
                      <Globe className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                      <input 
                        type="url" 
                        placeholder="https://instagram.com/p/..." 
                        className={`w-full rounded-[2.5rem] py-8 pl-18 pr-8 border-2 outline-none focus:border-primary transition-all font-bold ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 shadow-inner'}`}
                        value={orderLink}
                        onChange={(e) => setOrderLink(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Quantity */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>04. Engagement Strength</label>
                      <div className="relative group">
                        <Zap className="absolute left-6 top-1/2 -translate-y-1/2 text-primary" size={20} />
                        <input 
                          type="number" 
                          placeholder={`Min: ${selectedService.min}`}
                          className={`w-full rounded-[2.5rem] py-8 pl-18 pr-8 border-2 outline-none focus:border-primary transition-all text-2xl font-black ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 shadow-inner'}`}
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          min={selectedService.min}
                          max={selectedService.max}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                       <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>Charge Estimation</label>
                       <div className={`h-full rounded-[2rem] border flex items-center px-10 relative overflow-hidden ${isDark ? 'bg-primary/10 border-primary/20' : 'bg-primary/5 border-primary/10'}`}>
                          <div>
                            <p className="text-3xl font-black text-primary">
                              {quantity ? formatPrice((selectedService.sellingRate / 1000) * quantity) : formatPrice(0)}
                            </p>
                            <p className={`text-[10px] font-black uppercase tracking-widest ${subTextColor}`}>Total Resources Due</p>
                          </div>
                          <div className="absolute -right-4 -bottom-4 text-primary opacity-5 transform rotate-12">
                            <ZapOff size={100} />
                          </div>
                       </div>
                    </div>
                  </div>

                  {user?.walletBalance < ((selectedService.sellingRate / 1000) * quantity) && (
                    <div className="text-red-400 text-xs flex items-center justify-center gap-4 bg-red-400/10 p-6 rounded-[2rem] border border-red-400/20 shadow-lg">
                      <AlertTriangle size={24}/> 
                      <span className="font-bold uppercase tracking-widest text-[10px]">Insufficient Liquidity. <Link to="/dashboard/wallet" className="underline font-black decoration-primary underline-offset-8">Refill Ops Wallet</Link></span>
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={orderLoading || !quantity || user?.walletBalance < ((selectedService.sellingRate / 1000) * quantity)}
                    className="w-full btn-primary py-8 rounded-[2.5rem] font-black text-xl shadow-3xl disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-4">
                      {orderLoading ? 'Calibrating Network...' : 'Execute Strategic Mission'}
                      <ChevronRight className="group-hover:translate-x-2 transition-transform" />
                    </span>
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 blur-[120px] rounded-full -z-0"></div>
        </motion.div>

        {/* Currency Switcher Mini */}
        <div className="mt-12 flex justify-center gap-4">
           {['NGN', 'USD'].map(c => (
              <button 
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-8 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] transition-all border ${currency === c ? 'bg-primary border-primary text-white shadow-lg' : isDark ? 'bg-white/5 border-white/10 text-slate-500 hover:text-white' : 'bg-white border-slate-200 text-slate-400 hover:text-slate-900 shadow-sm'}`}
              >
                {c} MODE
              </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
