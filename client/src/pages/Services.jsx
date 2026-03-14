import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShoppingBag, Info, AlertTriangle, ChevronRight, Zap, Target, 
  Globe, CloudLightning, ShieldCheck, ZapOff, Search, Cpu,
  Database, Activity, Rocket, Clock, Heart, Plus, List
} from 'lucide-react';
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
  const [searchTerm, setSearchTerm] = useState('');

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
      const cats = [...new Set(data.map(s => s.category))].sort();
      setCategories(cats);
      if (cats.length > 0) setSelectedCategory(cats[0]);
    } catch (err) {
      toast.error('Failed to load services database');
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
      toast.success('ORDER PLACED SUCCESSFULLY!');
      setOrderLink('');
      setQuantity('');
      fetchUser(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'ORDER FAILED');
    } finally {
      setOrderLoading(false);
    }
  };

  const exchangeRate = 1800;
  const formatPrice = (price) => {
    if (currency === 'USD') return `$${(price / exchangeRate).toFixed(2)}`;
    return `₦${price.toLocaleString()}`;
  };

  const normalizeText = (text) => {
    if (!text) return '';
    return text.toString()
      .normalize('NFKD')
      .replace(/[\u{1D400}-\u{1D7FF}]/gu, char => {
        const code = char.codePointAt(0);
        if (code >= 0x1D400 && code <= 0x1D419) return String.fromCharCode(code - 0x1D400 + 65);
        if (code >= 0x1D41A && code <= 0x1D433) return String.fromCharCode(code - 0x1D41A + 97);
        if (code >= 0x1D5D4 && code <= 0x1D5ED) return String.fromCharCode(code - 0x1D5D4 + 65);
        if (code >= 0x1D5EE && code <= 0x1D607) return String.fromCharCode(code - 0x1D5EE + 97);
        return char;
      })
      .toLowerCase();
  };

  const filteredServices = services
    .filter(s => {
      const matchesCategory = selectedCategory ? s.category === selectedCategory : true;
      
      let matchesSearch = true;
      if (searchTerm) {
        const words = searchTerm.toLowerCase().split(/\s+/).filter(w => w.length > 0);
        const normName = normalizeText(s.name);
        const normCat = normalizeText(s.category);
        
        matchesSearch = words.every(word => 
          normName.includes(word) || 
          normCat.includes(word)
        );
      }
      
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => a.sellingRate - b.sellingRate);

  const allFilteredServices = searchTerm 
    ? services
        .filter(s => {
          const words = searchTerm.toLowerCase().split(/\s+/).filter(w => w.length > 0);
          const normName = normalizeText(s.name);
          const normCat = normalizeText(s.category);
          
          return words.every(word => 
            normName.includes(word) || 
            normCat.includes(word)
          );
        })
        .sort((a, b) => a.sellingRate - b.sellingRate)
    : filteredServices;

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const meshBg = isDark ? 'bg-cyber-mesh' : 'bg-light-mesh';

  return (
    <div className={`pt-24 md:pt-32 px-4 md:px-6 pb-40 min-h-screen transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-16 md:mb-20">
          <h1 className={`text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight ${textColor}`}>
            Our <span className="text-primary italic">Services</span>
          </h1>
          <p className={`text-base md:text-xl font-medium ${subTextColor} max-w-xl mx-auto leading-relaxed`}>
            Choose from thousands of high-quality services for Instagram, TikTok, YouTube, and more.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-6 md:p-12 rounded-[2rem] md:rounded-[3rem] border shadow-xl overflow-hidden relative ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}
        >
          <form onSubmit={handlePlaceOrder} className="space-y-8 md:space-y-10 relative z-10">
            
            {/* Search */}
            <div className="space-y-4">
              <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor} flex items-center gap-2`}>
                <Search size={14} className="text-primary" /> Search for a service
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="e.g. 'TikTok Followers', 'Instagram Likes'..." 
                  className={`w-full rounded-2xl py-6 pl-10 pr-6 border outline-none focus:border-primary transition-all font-bold text-lg md:text-xl ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-700' : 'bg-slate-50 border-slate-100 text-slate-900 shadow-inner'}`}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value) setSelectedCategory('');
                  }}
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
               {/* Category */}
               <div className="space-y-4">
                 <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor} flex items-center gap-2`}>
                    <List size={14} className="text-primary" /> Category
                 </label>
                 <div className="relative">
                   <select 
                     className={`w-full appearance-none rounded-2xl py-5 px-8 border outline-none focus:border-primary transition-all font-bold text-sm cursor-pointer ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900 shadow-inner'}`}
                     value={selectedCategory}
                     onChange={(e) => {
                       setSelectedCategory(e.target.value);
                       setSelectedService(null);
                       setSearchTerm('');
                     }}
                   >
                     <option value="">Choose Platform...</option>
                     {categories.map(c => (
                       <option key={c} value={c} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                         {c.toUpperCase()}
                       </option>
                     ))}
                   </select>
                   <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-primary rotate-90 pointer-events-none" size={20} />
                 </div>
               </div>

               {/* Service Selection */}
               <div className={`space-y-4 transition-all ${(!selectedCategory && !searchTerm) ? 'opacity-40 pointer-events-none' : ''}`}>
                 <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor} flex items-center gap-2`}>
                    <ShoppingCart size={14} className="text-primary" /> Select Service
                 </label>
                 <div className="relative">
                   <select 
                     className={`w-full appearance-none rounded-2xl py-5 px-8 border outline-none focus:border-primary transition-all font-bold text-sm cursor-pointer ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900 shadow-inner'}`}
                     value={selectedService?._id || ''}
                     onChange={(e) => {
                       const s = allFilteredServices.find(srv => srv._id === e.target.value);
                       setSelectedService(s);
                     }}
                   >
                     <option value="" disabled className={isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}>
                       {searchTerm ? `Found ${allFilteredServices.length.toLocaleString()} results...` : 'Select a package...'}
                     </option>
                     {allFilteredServices.map(s => (
                       <option key={s._id} value={s._id} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                         {s.name.toUpperCase()} — {formatPrice(s.sellingRate)}
                       </option>
                     ))}
                   </select>
                   <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 text-primary rotate-90 pointer-events-none" size={20} />
                 </div>
               </div>
            </div>

            <AnimatePresence>
              {selectedService && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-8 md:space-y-10 border-t pt-10 border-white/10"
                >
                  {/* Service Details */}
                  <div className={`grid grid-cols-2 md:grid-cols-4 gap-6 p-8 rounded-3xl border border-dashed ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    {[
                      { label: 'MIN ORDER', val: selectedService.min.toLocaleString(), icon: <Target size={16} className="text-primary"/> },
                      { label: 'MAX ORDER', val: selectedService.max.toLocaleString(), icon: <ShieldCheck size={16} className="text-primary"/> },
                      { label: 'SPEED', val: 'Fast Delivery', icon: <Zap size={16} className="text-yellow-500"/> },
                      { label: 'REFILL', val: 'Available', icon: <Plus size={16} className="text-green-500"/> }
                    ].map(spec => (
                      <div key={spec.label}>
                         <p className={`text-[8px] md:text-[9px] font-bold uppercase tracking-widest ${subTextColor} mb-1 flex items-center gap-2`}>
                            {spec.icon} {spec.label}
                         </p>
                         <p className={`text-base md:text-lg font-black ${textColor} tracking-tight`}>{spec.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Order Link */}
                  <div className="space-y-4">
                    <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor}`}>Link / Username</label>
                    <div className="relative">
                      <input 
                        type="url" 
                        placeholder="https://www.instagram.com/p/..." 
                        className={`w-full rounded-2xl py-6 px-8 border outline-none focus:border-primary transition-all font-bold text-base ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-900 shadow-inner'}`}
                        value={orderLink}
                        onChange={(e) => setOrderLink(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Quantity & Total */}
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor}`}>Quantity</label>
                      <input 
                        type="number" 
                        placeholder={`Min: ${selectedService.min}`}
                        className={`w-full rounded-2xl py-6 px-8 border outline-none focus:border-primary transition-all text-3xl font-black ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-900 shadow-inner'}`}
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        min={selectedService.min}
                        max={selectedService.max}
                        required
                      />
                    </div>
                    
                    <div className="space-y-4">
                       <label className={`text-[10px] font-black uppercase tracking-[0.2em] ${subTextColor}`}>Total Cost</label>
                       <div className={`h-full rounded-3xl border border-primary/20 flex flex-col justify-center px-8 relative overflow-hidden ${isDark ? 'bg-primary/10' : 'bg-primary/5'}`}>
                          <p className="text-4xl font-black text-primary tracking-tighter italic">
                            {quantity ? formatPrice((selectedService.sellingRate / 1000) * quantity) : formatPrice(0)}
                          </p>
                          <p className={`text-[9px] font-bold uppercase tracking-widest ${subTextColor} mt-1`}>Amount to be deducted</p>
                       </div>
                    </div>
                  </div>

                  {user?.walletBalance < ((selectedService.sellingRate / 1000) * quantity) ? (
                    <div className="text-red-400 text-xs flex items-center justify-center gap-4 bg-red-400/10 p-6 rounded-2xl border border-red-400/20">
                      <AlertTriangle size={24}/> 
                      <span className="font-bold uppercase tracking-tight">
                        Insufficient balance. <Link to="/dashboard/wallet" className="underline font-black">Refill Wallet</Link>
                      </span>
                    </div>
                  ) : (
                    <button 
                      type="submit"
                      disabled={orderLoading || !quantity}
                      className="w-full btn-primary py-6 rounded-2xl font-bold text-xl shadow-lg disabled:opacity-30 group relative transition-all active:scale-95"
                    >
                      {orderLoading ? 'Processing Order...' : 'Place Order Now'}
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Currency Switcher */}
        <div className="mt-12 flex justify-center gap-4">
           {['NGN', 'USD'].map(c => (
              <button 
                key={c}
                onClick={() => setCurrency(c)}
                className={`px-8 py-3 rounded-xl font-bold text-xs transition-all border ${currency === c ? 'bg-primary text-white border-primary shadow-lg' : isDark ? 'bg-white/5 border-white/5 text-slate-400 hover:text-white' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm'}`}
              >
                {c}
              </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Services;
