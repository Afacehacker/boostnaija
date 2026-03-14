import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { 
  CreditCard, Zap, ShieldCheck, Landmark, ArrowRight, History, 
  CheckCircle, Info, CloudLightning, Wallet as WalletIcon, 
  Unlock, Activity, ShieldAlert, Database, Lock
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
      return toast.warning('Min payload initialization: ₦500');
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
        throw new Error('Handshake bypass denied.');
      }
    } catch (err) {
      toast.error('Strategic Handshake Aborted');
    } finally {
      setLoading(false);
    }
  };

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const meshBg = isDark ? 'bg-cyber-mesh' : 'bg-light-mesh';

  return (
    <div className={`pt-32 px-6 pb-40 min-h-screen transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-start">
          
          {/* Intelligence & Data Side */}
          <motion.div
             initial={{ opacity: 0, x: -40 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.8 }}
             className="space-y-12"
          >
            <div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-3 glass-panel px-5 py-2 rounded-xl text-[10px] font-black tracking-[0.4em] text-primary mb-8 border-primary/20"
              >
                 <Database size={14} /> TREASURY NODE 01
              </motion.div>
              <h1 className={`text-6xl lg:text-8xl font-black mb-8 leading-none tracking-tighter ${textColor}`}>
                OPS <span className="text-gradient italic">LIQUIDITY</span>
              </h1>
              <p className={`text-xl font-medium leading-relaxed ${subTextColor} max-w-xl`}>
                Authorize capital handshakes to refill your strategic reserves. All transactions are routed through an encrypted <span className="text-primary italic">Secure-Uplink</span>.
              </p>
            </div>

            <motion.div 
              whileHover={{ y: -5 }}
              className={`p-12 lg:p-16 rounded-[4rem] border shadow-3xl relative overflow-hidden group ${isDark ? 'glass-panel border-white/10' : 'bg-white border-slate-100'}`}
            >
              <div className="relative z-10">
                 <p className={`text-[10px] font-black uppercase tracking-[0.5em] mb-6 ${subTextColor}`}>AVAILABLE PAYLOAD RESERVES</p>
                 <h2 className="text-7xl lg:text-8xl font-black text-primary mb-12 tracking-tighter italic">₦{user?.walletBalance.toLocaleString()}</h2>
                 
                 <div className={`inline-flex items-center gap-4 py-4 px-8 rounded-2xl border ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_#22C55E]"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest">Bank-grade Encryption Active</span>
                 </div>
              </div>
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[120px] -z-0"></div>
              <div className="absolute -bottom-10 -right-10 pointer-events-none opacity-5">
                 <Landmark size={300} />
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-8">
               {[
                 { title: 'SONIC CREDIT', desc: 'Instant ledger synchronization', icon: <Zap size={20}/> },
                 { title: 'GATEWAY BYPASS', desc: 'Zero-fee entry protocols', icon: <Unlock size={20}/> },
                 { title: 'AUTH-FLOW', desc: 'Secure 2FA handshake', icon: <ShieldCheck size={20}/> },
                 { title: 'VERIFIED RES','desc': '100% Secure Nigerian Uplink', icon: <Landmark size={20}/> }
               ].map((item, idx) => (
                 <div key={idx} className="space-y-3">
                    <div className="flex items-center gap-3">
                       <div className="text-primary">{item.icon}</div>
                       <h4 className={`text-[10px] font-black uppercase tracking-widest ${textColor}`}>{item.title}</h4>
                    </div>
                    <p className={`text-[10px] italic font-black uppercase tracking-widest ${subTextColor} opacity-60`}>{item.desc}</p>
                 </div>
               ))}
            </div>
          </motion.div>

          {/* Deposit Terminal Side */}
          <motion.div
             initial={{ opacity: 0, y: 50 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8 }}
          >
            <div className={`p-10 lg:p-16 rounded-[4.5rem] border shadow-3xl relative overflow-hidden ${isDark ? 'glass-panel border-white/10' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-16">
                 <h3 className={`text-3xl font-black flex items-center gap-4 ${textColor}`}>
                    <Activity className="text-primary" size={28} /> REFILL COMMAND
                 </h3>
                 <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/20"></span>
                 </div>
              </div>
              
              <form onSubmit={handleFunding} className="space-y-16">
                <div className="space-y-6">
                  <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>ALLOCATION PAYLOAD (NGN)</label>
                  <div className="relative group">
                    <span className="absolute left-10 top-1/2 -translate-y-1/2 font-black text-6xl text-primary/20 pointer-events-none italic">₦</span>
                    <input 
                      type="number" 
                      placeholder="5,000"
                      className={`w-full rounded-[3rem] py-12 pl-24 pr-12 outline-none border-2 transition-all text-6xl font-black tracking-tighter italic ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-800' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-300 shadow-inner'}`}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      required
                    />
                  </div>
                  <div className="flex items-center gap-4 px-6 py-2">
                     <Info size={16} className="text-primary" />
                     <p className={`text-[9px] font-black uppercase tracking-[0.3em] ${subTextColor}`}>MINIMUM INITIALIZATION: ₦500.00</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <label className={`text-[10px] font-black uppercase tracking-[0.4em] ${subTextColor}`}>ENCRYPTED PATHWAY</label>
                  <div className={`p-10 rounded-[3rem] border border-primary bg-primary/5 flex items-center justify-between group shadow-xl transition-all`}>
                     <div className="flex items-center gap-8">
                        <div className="p-5 rounded-[2rem] bg-primary group-hover:scale-110 transition-transform duration-500 shadow-[0_10px_30px_rgba(58,122,254,0.4)]">
                           <Lock className="text-white" size={32} />
                        </div>
                        <div>
                           <h4 className="text-2xl font-black text-primary tracking-tighter">PAYSTACK HANDSHAKE</h4>
                           <p className={`text-[10px] font-black uppercase tracking-widest ${subTextColor}`}>Secured Bank-Protocol v2.1</p>
                        </div>
                     </div>
                     <CheckCircle size={32} className="text-primary opacity-40" />
                  </div>
                </div>

                <button 
                  disabled={loading || !amount}
                  className="w-full btn-primary py-10 rounded-[3rem] font-black text-2xl flex items-center justify-center gap-8 shadow-[0_30px_60px_rgba(58,122,254,0.4)] disabled:opacity-20 group relative overflow-hidden transition-all active:scale-95"
                >
                  <span className="relative z-10 flex items-center justify-center gap-6 uppercase tracking-widest">
                    {loading ? 'CALIBRATING BRIDGE...' : 'AUTHORIZE INJECTION'}
                    <ArrowRight size={32} className="group-hover:translate-x-3 transition-transform duration-500" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </button>
              </form>

              <div className="mt-20 flex flex-col items-center gap-10 opacity-30 hover:opacity-100 transition-opacity duration-700">
                  <div className={`flex gap-16 grayscale items-center ${isDark ? 'invert' : ''}`}>
                     <span className="font-black text-2xl tracking-tighter italic">VISA</span>
                     <span className="font-black text-2xl tracking-tighter italic">mastercard</span>
                     <span className="font-black text-2xl tracking-tighter italic">VERVE</span>
                  </div>
                  <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
                  <p className={`text-[10px] uppercase tracking-[0.6em] font-black text-center ${subTextColor}`}>CBN AUTHORIZED SECURE ESCROW HUB</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;

