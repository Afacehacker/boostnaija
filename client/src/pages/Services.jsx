import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  ShoppingBag, Info, AlertTriangle, ChevronRight, Zap, Target, 
  Globe, CloudLightning, ShieldCheck, ZapOff, Search, Cpu,
  Database, Activity, Rocket, Clock
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
      toast.error('Tactical Database Connection Failed');
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
      toast.success('MISSION DEPLOYED SUCCESSFUL');
      setOrderLink('');
      setQuantity('');
      fetchUser(); 
    } catch (err) {
      toast.error(err.response?.data?.message || 'MISSION INTERRUPTED');
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
    <div className={`pt-32 px-6 pb-40 min-h-screen transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="text-center mb-20 relative">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-4 glass-panel px-6 py-3 rounded-2xl text-[10px] font-black tracking-[0.6em] text-primary mb-10 border-primary/20 shadow-2xl"
          >
             <Database size={16} /> DATA CONSOLE
          </motion.div>
          <h1 className={`text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter ${textColor}`}>
            GLOBAL <span className="text-gradient italic">ARSENAL</span>
          </h1>
          <p className={`text-xl font-medium ${subTextColor} max-w-xl mx-auto leading-relaxed`}>
            Authorized access to 5,000+ elite engagement cores. Deploy your strategic payload across the digital spectrum.
          </p>
          <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 blur-[100px] -z-10"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={`p-10 lg:p-16 rounded-[4rem] border shadow-3xl overflow-hidden relative ${isDark ? 'glass-panel border-white/10' : 'bg-white border-slate-100'}`}
        >
          <form onSubmit={handlePlaceOrder} className="space-y-12 relative z-10">
            
            {/* Search Nexus */}
            <div className="space-y-6">
              <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor} flex items-center gap-3`}>
                <Search size={14} className="text-primary" /> SEARCH MISSION DATABASE
              </label>
              <div className="relative group">
                <input 
                  type="text" 
                  placeholder="e.g. 'TikTok Followers', 'Instagram Likes'..." 
                  className={`w-full rounded-[2.5rem] py-8 pl-10 pr-10 border outline-none focus:border-primary transition-all font-black text-2xl ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-900 shadow-inner'}`}
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value) setSelectedCategory('');
                  }}
                />
                <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                   <Target size={40} />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-10">
               {/* Department Matrix */}
               <div className="space-y-6">
                 <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor} flex items-center gap-3`}>
                    <Cpu size={14} className="text-primary" /> SELECT CORE MATRIX
                 </label>
                 <div className="relative group">
                   <select 
                     className={`w-full appearance-none rounded-[2rem] py-6 px-10 border outline-none focus:border-primary transition-all font-black text-sm cursor-pointer ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900 shadow-inner'}`}
                     value={selectedCategory}
                     onChange={(e) => {
                       setSelectedCategory(e.target.value);
                       setSelectedService(null);
                       setSearchTerm('');
                     }}
                   >
                     <option value="">GLOBAL DATABASE (ALL)</option>
                     {categories.map(c => (
                       <option key={c} value={c} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                         {c.toUpperCase()}
                       </option>
                     ))}
                   </select>
                   <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 text-primary rotate-90 pointer-events-none" size={20} />
                 </div>
               </div>

               {/* Payload Selection */}
               <div className={`space-y-6 transition-all ${(!selectedCategory && !searchTerm) ? 'opacity-20 pointer-events-none grayscale' : ''}`}>
                 <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor} flex items-center gap-3`}>
                    <CloudLightning size={14} className="text-primary" /> CHOOSE PAYLOAD
                 </label>
                 <div className="relative group">
                   <select 
                     className={`w-full appearance-none rounded-[2rem] py-6 px-10 border outline-none focus:border-primary transition-all font-black text-sm cursor-pointer ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-100 text-slate-900 shadow-inner'}`}
                     value={selectedService?._id || ''}
                     onChange={(e) => {
                       const s = allFilteredServices.find(srv => srv._id === e.target.value);
                       setSelectedService(s);
                     }}
                   >
                     <option value="" disabled className={isDark ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-400'}>
                       {searchTerm ? `FOUND ${allFilteredServices.length.toLocaleString()} UNITS...` : 'SELECT PAYLOAD COHORT...'}
                     </option>
                     {allFilteredServices.map(s => (
                       <option key={s._id} value={s._id} className={isDark ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}>
                         {s.name.toUpperCase()} — {formatPrice(s.sellingRate)}
                       </option>
                     ))}
                   </select>
                   <ChevronRight className="absolute right-8 top-1/2 -translate-y-1/2 text-primary rotate-90 pointer-events-none" size={20} />
                 </div>
               </div>
            </div>

            <AnimatePresence>
              {selectedService && (
                <motion.div 
                  initial={{ opacity: 0, scaleY: 0.9 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  exit={{ opacity: 0, scaleY: 0.9 }}
                  className="space-y-12 pt-8"
                >
                  {/* Tactical Specs */}
                  <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 p-10 rounded-[3rem] border border-dashed ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
                    {[
                      { label: 'MIN PAYLOAD', val: selectedService.min.toLocaleString(), icon: <Target className="text-primary"/> },
                      { label: 'MAX PAYLOAD', val: selectedService.max.toLocaleString(), icon: <ShieldCheck className="text-primary"/> },
                      { label: 'DEP-SPEED', val: 'INSTANT', icon: <Clock className="text-green-500"/> },
                      { label: 'PROTECTION', val: 'AUTO-REFILL', icon: <ShieldCheck className="text-primary"/> }
                    ].map(spec => (
                      <div key={spec.label}>
                         <p className={`text-[8px] font-black uppercase tracking-[0.3em] ${subTextColor} mb-2 flex items-center gap-2`}>
                            {spec.icon} {spec.label}
                         </p>
                         <p className={`text-xl font-black ${textColor} italic tracking-tighter`}>{spec.val}</p>
                      </div>
                    ))}
                  </div>

                  {/* Objective URL */}
                  <div className="space-y-6">
                    <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>TARGET URL / MISSION COORDINATES</label>
                    <div className="relative group">
                      <input 
                        type="url" 
                        placeholder="https://platform.com/profile/..." 
                        className={`w-full rounded-[2.5rem] py-10 px-12 border-2 outline-none focus:border-primary transition-all font-black text-lg ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 shadow-inner'}`}
                        value={orderLink}
                        onChange={(e) => setOrderLink(e.target.value)}
                        required
                      />
                      <div className="absolute right-10 top-1/2 -translate-y-1/2 text-primary/40">
                         <Globe size={32} />
                      </div>
                    </div>
                  </div>

                  {/* Strength & Cost */}
                  <div className="grid md:grid-cols-2 gap-10">
                    <div className="space-y-6">
                      <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>ENGAGEMENT STRENGTH (QTY)</label>
                      <div className="relative group">
                        <input 
                          type="number" 
                          placeholder={`BOUNDS: ${selectedService.min} - ${selectedService.max}`}
                          className={`w-full rounded-[2.5rem] py-10 px-12 border-2 outline-none focus:border-primary transition-all text-4xl font-black ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-800' : 'bg-slate-50 border-slate-100 text-slate-900 placeholder:text-slate-300 shadow-inner'}`}
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          min={selectedService.min}
                          max={selectedService.max}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                       <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>RESOURCES REQUIRED</label>
                       <div className={`h-full rounded-[3rem] border border-primary/20 flex flex-col justify-center px-12 relative overflow-hidden ${isDark ? 'bg-primary/10' : 'bg-primary/5'}`}>
                          <p className="text-5xl font-black text-primary tracking-tighter italic">
                            {quantity ? formatPrice((selectedService.sellingRate / 1000) * quantity) : formatPrice(0)}
                          </p>
                          <p className={`text-[9px] font-black uppercase tracking-[0.5em] ${subTextColor} mt-2`}>Total Liquidity Commitment</p>
                          <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none">
                             <Rocket size={150} className="-rotate-45" />
                          </div>
                       </div>
                    </div>
                  </div>

                  {user?.walletBalance < ((selectedService.sellingRate / 1000) * quantity) ? (
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-red-400 text-xs flex items-center justify-center gap-6 bg-red-400/10 p-8 rounded-[2.5rem] border border-red-400/20 shadow-2xl"
                    >
                      <AlertTriangle size={36}/> 
                      <span className="font-black uppercase tracking-[0.2em] leading-relaxed">
                        LIQUIDITY BREACH DETECTED. <br />
                        <Link to="/dashboard/wallet" className="underline text-red-300 decoration-red-300/40 underline-offset-8 decoration-4">RELOAD OPERATIONAL CAPITAL</Link>
                      </span>
                    </motion.div>
                  ) : (
                    <button 
                      type="submit"
                      disabled={orderLoading || !quantity}
                      className="w-full btn-primary py-10 rounded-[3rem] font-black text-2xl shadow-[0_30px_60px_rgba(58,122,254,0.4)] disabled:opacity-20 disabled:grayscale disabled:cursor-not-allowed group relative overflow-hidden transition-all active:scale-95"
                    >
                      <span className="relative z-10 flex items-center justify-center gap-6">
                        {orderLoading ? 'SYNCING NEURAL NETWORK...' : 'EXECUTE MISSION DEPLOYMENT'}
                        <Rocket className="group-hover:-translate-y-2 group-hover:translate-x-2 transition-transform duration-500" size={32} />
                      </span>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </form>
          <div className="absolute top-0 right-0 w-[500px] h-full bg-primary/5 blur-[150px] -z-0"></div>
        </motion.div>

        {/* Tactical Footer Switchers */}
        <div className="mt-20 flex flex-wrap justify-center gap-6">
           {['NGN', 'USD'].map(c => (
              <button 
                key={c}
                onClick={() => setCurrency(c)}
                className={`group relative px-10 py-5 rounded-2xl overflow-hidden transition-all border ${currency === c ? 'border-primary text-white shadow-2xl' : isDark ? 'bg-white/5 border-white/5 text-slate-500 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-900 shadow-sm'}`}
              >
                <span className="relative z-10 font-black text-[10px] tracking-[0.6em] uppercase">{c} FREQUENCY</span>
                {currency === c && <div className="absolute inset-0 bg-primary animate-pulse-subtle"></div>}
              </button>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Services;

