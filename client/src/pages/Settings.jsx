import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Bell, Smartphone, Mail, Lock, ChevronRight, 
  Zap, CloudLightning, Fingerprint, Activity, ShieldAlert,
  Terminal, Globe, Cpu, Key
} from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const meshBg = isDark ? 'bg-cyber-mesh' : 'bg-light-mesh';

  const sections = [
    {
      title: "SECURITY PROTOCOLS",
      items: [
        { icon: <Fingerprint size={22} />, title: "BIOMETRIC SYNC (2FA)", desc: "AUTHORIZED MULTI-FACTOR HANDSHAKE", status: "OFFLINE" },
        { icon: <Shield size={22} />, title: "SESSION OVERWATCH", desc: "LIVE TRACKING OF ACTIVE NODES", status: "ACTIVE" },
        { icon: <Key size={22} />, title: "ENCRYPTION KEYS", desc: "RSA-4096 BIT MISSION SECURITY", status: "STABLE" }
      ]
    },
    {
      title: "SIGNAL CONFIG",
      items: [
        { icon: <Bell size={22} />, title: "MISSION TELEMETRY", desc: "LIVE UPDATES ON PAYLOAD STATUS", status: "LIVE" },
        { icon: <Activity size={22} />, title: "ALGORITHM INTEL", desc: "MARKET BREACH & TREND ALERTS", status: "SYNCED" }
      ]
    }
  ];

  return (
    <div className={`pt-32 px-6 pb-40 min-h-screen transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-5xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-20">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-4 glass-panel px-6 py-2 rounded-xl text-[10px] font-black tracking-[0.4em] text-primary mb-8 border-primary/20"
          >
             <Terminal size={14} /> SYSTEM CONFIGURATION
          </motion.div>
          <h1 className={`text-6xl md:text-8xl font-black mb-6 leading-none tracking-tighter ${textColor}`}>
            AGENT <span className="text-gradient italic">CONTROL</span>
          </h1>
          <p className={`text-xl font-medium ${subTextColor} max-w-xl leading-relaxed`}>
            Authorized operative configuration terminal. Modifying these parameters affects your <span className="text-primary font-black italic">Clearance Level</span>.
          </p>
        </div>

        <div className="space-y-20">
          {/* Operative Identity Card */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-12 lg:p-16 rounded-[4.5rem] border shadow-3xl relative overflow-hidden ${isDark ? 'glass-panel border-white/10' : 'bg-white border-slate-100 shadow-2xl'}`}
          >
            <div className="flex flex-col md:flex-row items-center gap-12 relative z-10">
              <div className="relative group">
                 <div className="w-40 h-40 rounded-[3rem] bg-primary/10 flex items-center justify-center text-primary border-4 border-primary/10 shadow-3xl transition-transform group-hover:scale-105 duration-500 overflow-hidden text-7xl font-black italic">
                    {user?.name?.[0]?.toUpperCase() || 'A'}
                 </div>
                 <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white border-4 border-background-dark">
                    <Shield size={16} fill="white" />
                 </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-6">
                 <div>
                    <h3 className={`text-4xl lg:text-5xl font-black mb-2 leading-none ${textColor}`}>{user?.name?.toUpperCase() || 'UNKNOWN OPERATIVE'}</h3>
                    <div className="flex items-center justify-center md:justify-start gap-3">
                       <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_#3A7AFE]"></span>
                       <p className={`text-[11px] font-black uppercase tracking-[0.5em] text-primary italic`}>{user?.role || 'AGENT'} RANK / CLEARANCE</p>
                    </div>
                 </div>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className={`px-6 py-4 rounded-[1.5rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'} flex items-center gap-4`}>
                       <Mail size={18} className="text-primary" />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{user?.email}</span>
                    </div>
                    <div className={`px-6 py-4 rounded-[1.5rem] border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'} flex items-center gap-4`}>
                       <Cpu size={18} className="text-primary" />
                       <span className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>NEURAL-LINK ACTIVE</span>
                    </div>
                 </div>
              </div>

              <button 
                onClick={() => toast.info('PROFILE ENCRYPTION ENABLED. MANUAL OVERRIDE DISABLED.')}
                className="btn-primary px-10 py-6 rounded-2xl text-[10px] uppercase font-black tracking-[0.3em] shadow-3xl group active:scale-95 transition-all text-white"
              >
                UPDATE DECRYPTION <ChevronRight size={16} className="inline-block ml-2 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
            <div className="absolute top-0 right-0 w-96 h-full bg-primary/5 blur-[120px] -z-0"></div>
          </motion.div>

          {/* Configuration Matrices */}
          {sections.map((section, idx) => (
            <div key={idx} className="space-y-10">
              <h4 className={`text-[10px] font-black uppercase tracking-[0.6em] ${subTextColor} flex items-center gap-4 pl-4`}>
                 <div className="h-px w-10 bg-primary/40"></div> {section.title}
              </h4>
              <div className="grid gap-6">
                {section.items.map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ scale: 1.01, x: 10 }}
                    className={`p-10 rounded-[2.5rem] border flex flex-col md:flex-row items-center justify-between transition-all group overflow-hidden relative ${isDark ? 'glass-panel border-white/10' : 'bg-white border-slate-100 shadow-xl'}`}
                  >
                    <div className="flex items-center gap-8 relative z-10 w-full md:w-auto">
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center transition-all duration-500 group-hover:bg-primary group-hover:text-white ${isDark ? 'bg-white/5 text-primary' : 'bg-slate-50 text-primary'}`}>
                        {item.icon}
                      </div>
                      <div>
                        <h5 className={`font-black text-xl mb-1 ${textColor}`}>{item.title}</h5>
                        <p className={`text-[10px] font-black uppercase tracking-widest ${subTextColor} opacity-60`}>{item.desc}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-6 mt-6 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                      <div className={`px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-[0.2em] ${
                        item.status === 'ACTIVE' || item.status === 'LIVE' || item.status === 'SYNCED' || item.status === 'STABLE'
                        ? 'bg-green-500/10 text-green-500 border-green-500/20' 
                        : 'bg-primary/10 text-primary border-primary/20'
                      }`}>
                         {item.status}
                      </div>
                      <ChevronRight size={24} className={`opacity-20 group-hover:opacity-100 group-hover:text-primary transition-all group-hover:translate-x-2`} />
                    </div>
                    
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-primary opacity-0 group-hover:opacity-40 transition-opacity"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}

          {/* Security Breach Protocols (Danger Zone) */}
          <div className="pt-20 border-t border-dashed border-red-500/20">
            <motion.div 
              whileHover={{ scale: 1.01 }}
              className={`p-12 lg:p-16 rounded-[3.5rem] border border-red-500/30 shadow-3xl relative overflow-hidden ${isDark ? 'bg-red-500/5' : 'bg-red-50'}`}
            >
              <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-12">
                 <div className="space-y-4 text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start gap-4">
                       <ShieldAlert className="text-red-500" size={32} />
                       <h4 className="text-red-500 font-black uppercase tracking-[0.4em] text-xs">Identity Termination Protocol</h4>
                    </div>
                    <p className={`text-lg font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-xl`}>
                       Executing identity wipe will permanently purge all mission logs, capital reserves, and neural links from the global matrix. This action is <span className="text-red-500 font-black italic">irreversible</span>.
                    </p>
                 </div>
                 <button className="px-12 py-6 rounded-2xl border-2 border-red-500/50 text-red-500 font-black text-[11px] uppercase tracking-[0.4em] hover:bg-red-500 hover:text-white hover:shadow-[0_20px_40px_rgba(239,68,68,0.3)] transition-all active:scale-95">
                    INITIATE SELF-DESTRUCT
                 </button>
              </div>
              <div className="absolute -bottom-20 -right-20 pointer-events-none opacity-5 text-red-500">
                 <ShieldAlert size={400} />
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

