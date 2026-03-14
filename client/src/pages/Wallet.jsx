import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { 
  CreditCard, Zap, ShieldCheck, Landmark, ArrowRight, History, 
  CheckCircle, Info, CloudLightning, Wallet as WalletIcon, 
  Unlock, Activity, ShieldAlert, Database, Lock, Plus, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
      return toast.warning('Minimum deposit is ₦500');
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${API_URL}/payments/paystack/initialize`, 
        { amount: parseFloat(amount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const { authorization_url } = res.data.data;
      if (authorization_url) {
        window.location.href = authorization_url;
      } else {
        throw new Error('Initialization failed');
      }
    } catch (err) {
      toast.error('Payment initialization failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const meshBg = isDark ? 'bg-cyber-mesh' : 'bg-light-mesh';

  return (
    <div className={`pt-24 md:pt-32 px-4 md:px-6 pb-40 min-h-screen transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* Info Side */}
          <motion.div
             initial={{ opacity: 0, x: -20 }}
             animate={{ opacity: 1, x: 0 }}
             className="space-y-8 md:space-y-12"
          >
            <div>
              <h1 className={`text-5xl lg:text-7xl font-black mb-6 leading-tight tracking-tight ${textColor}`}>
                Fund Your <br /><span className="text-primary italic">Wallet</span>
              </h1>
              <p className={`text-lg md:text-xl font-medium leading-relaxed ${subTextColor} max-w-xl`}>
                Add money to your account instantly using Paystack. We support Nigerian Bank Transfers, Cards, and USSD.
              </p>
            </div>

            <div className={`p-10 md:p-14 rounded-[2rem] md:rounded-[3rem] border shadow-xl relative overflow-hidden group ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100 shadow-lg'}`}>
              <div className="relative z-10">
                 <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${subTextColor}`}>Total Balance</p>
                 <h2 className="text-5xl md:text-7xl font-black text-primary mb-10 tracking-tight italic">₦{user?.walletBalance.toLocaleString()}</h2>
                 
                 <div className={`inline-flex items-center gap-3 py-3 px-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Secured by Paystack</span>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 pointer-events-none opacity-5">
                 <WalletIcon size={250} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               {[
                 { title: 'INSTANT CREDIT', desc: 'Money reflects instantly', icon: <Zap size={18}/> },
                 { title: 'LOWEST FEES', desc: 'No hidden charges', icon: <Plus size={18}/> },
                 { title: '100% SECURE', desc: 'Bank-grade security', icon: <ShieldCheck size={18}/> },
                 { title: 'NAIJA PRIDE', desc: 'Made for Nigerians', icon: <Landmark size={18}/> }
               ].map((item, idx) => (
                 <div key={idx} className="space-y-2">
                    <div className="flex items-center gap-2">
                       <div className="text-primary">{item.icon}</div>
                       <h4 className={`text-[11px] font-bold uppercase tracking-wider ${textColor}`}>{item.title}</h4>
                    </div>
                    <p className={`text-[10px] font-medium ${subTextColor}`}>{item.desc}</p>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Deposit Side */}
          <motion.div
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
          >
            <div className={`p-8 md:p-14 rounded-[2.5rem] md:rounded-[3.5rem] border shadow-2xl relative overflow-hidden ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-2xl md:text-3xl font-black mb-12 flex items-center gap-3 ${textColor}`}>
                 <Plus className="text-primary" size={28} /> Deposit Money
              </h3>
              
              <form onSubmit={handleFunding} className="space-y-12">
                <div className="space-y-4">
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor}`}>Amount to Add (₦)</label>
                  <div className="relative">
                    <span className="absolute left-8 top-1/2 -translate-y-1/2 font-black text-4xl text-primary/30 pointer-events-none">₦</span>
                    <input 
                      type="number" 
                      placeholder="1,000"
                      className={`w-full rounded-2xl py-8 pl-16 pr-8 outline-none border-2 transition-all text-4xl font-black ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-900 shadow-inner'}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor} flex items-center gap-2`}>
                     <Info size={14} className="text-primary" /> Minimum deposit: ₦500
                  </p>
                </div>

                <div className="space-y-6">
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor}`}>Payment Method</label>
                  <div className={`p-6 rounded-2xl border-2 border-primary bg-primary/5 flex items-center justify-between group`}>
                     <div className="flex items-center gap-6">
                        <div className="p-4 rounded-xl bg-primary text-white shadow-lg shadow-primary/20">
                           <Lock size={24} />
                        </div>
                        <div>
                           <h4 className="text-lg md:text-xl font-bold text-primary tracking-tight">Paystack (Instant)</h4>
                           <p className={`text-[9px] font-bold uppercase tracking-widest ${subTextColor}`}>Transfer, Card, USSD</p>
                        </div>
                     </div>
                     <CheckCircle size={24} className="text-primary" />
                  </div>
                </div>

                <button 
                  disabled={loading || !amount}
                  className="w-full btn-primary py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-4 shadow-xl disabled:opacity-30 group transition-all active:scale-95"
                >
                  {loading ? 'Initializing...' : 'Add Money Now'}
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </form>

              <div className="mt-16 flex flex-col items-center gap-6 opacity-40">
                  <div className={`flex gap-10 items-center ${isDark ? 'invert' : ''}`}>
                     <span className="font-bold text-xl italic">VISA</span>
                     <span className="font-bold text-xl italic">mastercard</span>
                     <span className="font-bold text-xl italic">Verve</span>
                  </div>
                  <p className={`text-[9px] font-bold uppercase tracking-widest text-center ${subTextColor}`}>Secure payment gateway</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
