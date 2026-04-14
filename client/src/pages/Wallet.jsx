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
  const [receipt, setReceipt] = useState(null);
  const [preview, setPreview] = useState(null);

  const isDark = theme === 'dark';
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

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
          
          // Max dimensions
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compress quality
          const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
          resolve(dataUrl);
        };
      };
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const compressed = await compressImage(file);
        setPreview(compressed);
        setReceipt(file);
      } catch (err) {
        toast.error('Failed to process image');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleFunding = async (e) => {
    e.preventDefault();
    if (!amount || amount < 500) {
      return toast.warning('Minimum deposit is ₦500');
    }
    if (!preview) {
      return toast.warning('Please upload your payment receipt');
    }

    setLoading(true);
    try {
      await axios.post(
        `${API_URL}/payments/manual/submit`, 
        { 
          amount: parseFloat(amount),
          receipt: preview 
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      toast.success('Payment submitted! Admin will confirm shortly.');
      setAmount('');
      setReceipt(null);
      setPreview(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please try again.');
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
              <div className={`p-6 rounded-2xl border-2 border-red-500/20 bg-red-500/5 mb-8`}>
                 <p className="text-red-500 font-bold text-sm flex items-center gap-2">
                    <ShieldAlert size={20} /> IMPORTANT NOTICE
                 </p>
                 <p className={`text-sm mt-2 font-medium ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    Please <b>don't send with Opay</b>, it takes over 2 hours to receive money from Opay. 
                    Use any other banks like Palmpay, Monipoint, Kuda, etc., if you want your deposit to be processed quickly.
                 </p>
              </div>
              <p className={`text-lg md:text-xl font-medium leading-relaxed ${subTextColor} max-w-xl`}>
                Transfer the amount you want to deposit to the account below, then upload the receipt for confirmation.
              </p>
            </div>

            <div className={`p-10 md:p-14 rounded-[2rem] md:rounded-[3rem] border shadow-xl relative overflow-hidden group ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100 shadow-lg'}`}>
              <div className="relative z-10">
                 <p className={`text-[10px] font-bold uppercase tracking-widest mb-4 ${subTextColor}`}>Our Account Details</p>
                 <div className="space-y-4">
                    <div>
                       <p className={`text-[10px] font-bold ${subTextColor} uppercase`}>Bank Name</p>
                       <h3 className={`text-2xl font-black ${textColor}`}>Mint - Finex MFB</h3>
                    </div>
                    <div>
                       <p className={`text-[10px] font-bold ${subTextColor} uppercase`}>Account Number</p>
                       <h3 className="text-4xl md:text-5xl font-black text-primary tracking-tighter">1008155188</h3>
                    </div>
                    <div>
                       <p className={`text-[10px] font-bold ${subTextColor} uppercase`}>Account Name</p>
                       <h3 className={`text-2xl font-black ${textColor}`}>salaudeen Afeez</h3>
                    </div>
                 </div>
                 
                 <div className={`mt-10 inline-flex items-center gap-3 py-3 px-6 rounded-xl border ${isDark ? 'bg-white/5 border-white/10 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>
                    <CheckCircle size={18} className="text-green-500" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Manual Confirmation</span>
                 </div>
              </div>
              <div className="absolute -bottom-10 -right-10 pointer-events-none opacity-5">
                 <WalletIcon size={250} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               {[
                 { title: 'FAST APPOVAL', desc: 'Verified in minutes', icon: <Zap size={18}/> },
                 { title: 'LOWEST FEES', desc: 'No transaction charges', icon: <Plus size={18}/> },
                 { title: '100% SECURE', desc: 'Direct bank transfer', icon: <ShieldCheck size={18}/> },
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
                 <Plus className="text-primary" size={28} /> Confirm Deposit
              </h3>
              
              <form onSubmit={handleFunding} className="space-y-12">
                <div className="space-y-4">
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor}`}>Amount Transferred (₦)</label>
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
                  <label className={`text-[10px] font-bold uppercase tracking-widest ${subTextColor}`}>Upload Receipt</label>
                  <div className={`relative group`}>
                     <input 
                       type="file" 
                       accept="image/*"
                       onChange={handleFileChange}
                       className="hidden"
                       id="receipt-upload"
                     />
                     <label 
                       htmlFor="receipt-upload"
                       className={`flex flex-col items-center justify-center gap-4 p-10 rounded-2xl border-2 border-dashed cursor-pointer transition-all ${preview ? 'border-primary bg-primary/5' : `${isDark ? 'border-white/10 hover:border-primary/50 bg-white/5' : 'border-slate-200 hover:border-primary/50 bg-slate-50'}`}`}
                     >
                        {preview ? (
                          <img src={preview} alt="receipt" className="max-h-40 rounded-lg shadow-md" />
                        ) : (
                          <>
                            <CloudLightning size={40} className="text-primary" />
                            <div className="text-center">
                               <p className={`font-bold ${textColor}`}>Click to upload image</p>
                               <p className={`text-[10px] ${subTextColor} uppercase font-black`}>PNG, JPG or JPEG</p>
                            </div>
                          </>
                        )}
                     </label>
                  </div>
                </div>

                <button 
                  disabled={loading || !amount || !preview}
                  className="w-full btn-primary py-6 rounded-2xl font-bold text-xl flex items-center justify-center gap-4 shadow-xl disabled:opacity-30 group transition-all active:scale-95"
                >
                  {loading ? 'Submitting...' : 'Confirm Payment'}
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                </button>
              </form>

              <div className="mt-16 flex flex-col items-center gap-6 opacity-40">
                  <p className={`text-[9px] font-bold uppercase tracking-widest text-center ${subTextColor}`}>Our admins will verify and credit your wallet immediately they receive the alert.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
