import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { CreditCard, Zap, ShieldCheck, Landmark, ArrowRight, History, CheckCircle, Info, CloudLightning, Wallet as WalletIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const Wallet = () => {
  const { user, token } = useAuth();
  const { theme } = useTheme();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [gateway, setGateway] = useState('paystack');

  const isDark = theme === 'dark';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

  const handleFunding = async (e) => {
    e.preventDefault();
    if (!amount || amount < 500) {
      return toast.warning('Minimum mission budget is ₦500');
    }

    setLoading(true);
    try {
       console.log('🔗 Initiating Capital Handshake at:', `${API_URL}/payments/paystack/initialize`);
      
      const res = await axios.post(
        `${API_URL}/payments/paystack/initialize`, 
        { amount: parseFloat(amount) },
        { 
          headers: { 
            Authorization: `Bearer ${token}` 
          } 
        }
      );
      
      const { authorization_url } = res.data.data;
      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        throw new Error('Gateway did not return an authorization bypass.');
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      console.error('❌ Strategic Handshake Failed:', errorMsg);
      toast.error(`Capital Handshake Failed: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-400' : 'text-slate-500';
  const meshBg = isDark ? 'bg-mesh-dark' : 'bg-mesh-light';

  return (
    <div className={`pt-28 px-6 pb-32 max-w-7xl mx-auto transition-colors duration-500 ${meshBg} optimize-gpu`}>
      <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
        {/* Intelligence Side */}
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-center gap-2 mb-3">
             <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary"><WalletIcon size={16} /></div>
             <p className={`text-[10px] font-black uppercase tracking-[0.3em] ${subTextColor}`}>Treasury Management</p>
          </div>
          <h1 className={`text-5xl font-black mb-6 ${textColor}`}>Ops Liquidity</h1>
          <p className={`text-lg font-medium leading-relaxed mb-12 ${subTextColor}`}>
            Refill your strategic reserves to continue launching growth missions. 
            All capital injections are secured by bank-grade encryption and 
            verified by local regulatory standards.
          </p>

          <div className={`rounded-[3rem] border p-10 lg:p-16 mb-12 relative overflow-hidden group shadow-xl transition-colors ${isDark ? 'bg-slate-900 border-white/5' : 'bg-white border-slate-100'}`}>
            <div className="relative z-10 text-center">
               <p className={`text-[10px] font-black uppercase tracking-[0.4em] mb-4 ${subTextColor}`}>Current Capital Reserves</p>
               <h2 className="text-6xl md:text-7xl font-black text-primary mb-12 tracking-tighter">₦{user?.walletBalance.toLocaleString()}</h2>
               
               <div className={`flex items-center justify-center gap-4 text-xs font-black uppercase tracking-widest p-5 rounded-2xl border ${isDark ? 'bg-white/5 border-white/5 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                 <ShieldCheck size={24} className="text-green-500"/> 
                 <span>Bank-Level Protection Active</span>
               </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] -z-0"></div>
          </div>

          <div className="space-y-10">
            <h3 className={`text-xl font-black uppercase tracking-widest flex items-center gap-4 ${subTextColor}`}>
               <CloudLightning className="text-primary" size={20} /> Reserve Features
            </h3>
            <div className="grid sm:grid-cols-2 gap-10">
               {[
                 { title: 'Sonic Credit', desc: 'Resources added to ledger in milliseconds' },
                 { title: 'Zero Tax', desc: 'We absorb all gateway processing surcharges' },
                 { title: 'NGN Direct', desc: 'Secure local currency settlement path' },
                 { title: '365 Coverage', desc: 'Systems operational 24/7/365' }
               ].map((item, i) => (
                 <div key={i} className="flex gap-4">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                       <CheckCircle size={18} />
                    </div>
                    <div>
                       <h4 className={`font-black text-sm mb-1 ${textColor}`}>{item.title}</h4>
                       <p className={`text-xs italic font-medium ${subTextColor}`}>{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>
        </motion.div>

        {/* Deposit Protocol Side */}
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
        >
          <div className={`p-8 lg:p-16 rounded-[3.5rem] border shadow-xl relative transition-colors ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-3xl font-black mb-12 flex items-center gap-4 ${textColor}`}>
               <Zap className="text-primary" size={32} /> Reload Protocol
            </h3>
            
            <form onSubmit={handleFunding} className="space-y-12">
              <div className="space-y-4">
                <label className={`text-[10px] font-black uppercase tracking-[0.3em] ${subTextColor}`}>Allocation Amount (NGN)</label>
                <div className="relative group">
                  <span className={`absolute left-8 top-1/2 -translate-y-1/2 font-black text-4xl font-sans transition-colors ${isDark ? 'text-primary' : 'text-primary/40'}`}>₦</span>
                  <input 
                    type="number" 
                    placeholder="500.00"
                    className={`w-full rounded-[2.5rem] py-10 pl-24 pr-10 outline-none border-2 transition-all text-5xl font-black tracking-tighter ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-700' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300 shadow-inner'}`}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                  />
                </div>
                <p className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-3 px-4 ${subTextColor}`}>
                   <Info size={16} className="text-primary" /> Optmized for ₦5,000+ deployments
                </p>
              </div>

              <div className="space-y-8">
                <label className={`text-[10px] font-black uppercase tracking-[0.3em] ${subTextColor}`}>Inbound Pathway (Gateway)</label>
                <div className="grid grid-cols-1">
                  <div 
                    className={`group relative p-8 rounded-[2rem] border transition-all flex flex-col items-center gap-4 border-primary bg-primary/10 shadow-2xl shadow-primary/20`}
                  >
                    <div className="text-primary transition-colors"><CreditCard size={32} /></div>
                    <span className="font-black text-xs uppercase tracking-[0.2em] text-primary">Paystack Secured</span>
                    <div className="absolute bottom-0 left-0 w-full h-1.5 bg-primary" />
                  </div>
                </div>
              </div>

              <button 
                disabled={loading || !amount}
                className="w-full btn-primary py-8 rounded-[2rem] font-black text-xl flex items-center justify-center gap-5 shadow-3xl disabled:opacity-20 group"
              >
                {loading ? 'Establishing Inbound Bridge...' : 'Authorize Liquidity Refill'}
                <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </form>

            <div className="mt-16 flex flex-col items-center gap-8 opacity-20 hover:opacity-100 transition-opacity duration-700">
                <div className={`flex gap-12 grayscale items-center ${isDark ? 'invert' : ''}`}>
                   <span className="font-black text-xl tracking-tighter">VISA</span>
                   <span className="font-black text-xl tracking-tighter italic">mastercard</span>
                   <span className="font-black text-xl tracking-tighter">VERVE</span>
                </div>
                <div className={`h-px w-20 ${isDark ? 'bg-white/10' : 'bg-slate-200'}`}></div>
                <p className={`text-[9px] uppercase tracking-[0.5em] font-black text-center ${subTextColor}`}>Secured by CBN Authorization Hub</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Wallet;
