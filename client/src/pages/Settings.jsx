import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Shield, Bell, Smartphone, Mail, Lock, ChevronRight, 
  Zap, CloudLightning, Fingerprint, Activity, ShieldAlert,
  Terminal, Globe, Cpu, Key, LogOut, Settings as SettingsIcon, ShieldCheck,
  Save, Camera, Phone, CheckCircle2, X
} from 'lucide-react';
import { toast } from 'react-toastify';

const Settings = () => {
  const { user, logout, updateProfile, updatePassword } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profileData);
      toast.success('Profile updated successfully! 🇳🇬');
      setEditMode(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await updatePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      toast.success('Password changed safely! 🔒');
      setPasswordMode(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Password update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        return toast.error("File size too large (Max 2MB)");
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData({ ...profileData, avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const subTextColor = isDark ? 'text-slate-500' : 'text-slate-400';
  const meshBg = isDark ? 'bg-cyber-mesh' : 'bg-light-mesh';

  return (
    <div className={`pt-24 md:pt-32 px-4 md:px-6 pb-40 min-h-screen transition-colors duration-500 ${meshBg}`}>
      <div className="max-w-4xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-12 md:mb-16">
          <h1 className={`text-4xl md:text-6xl font-black mb-4 leading-tight tracking-tight ${textColor}`}>
            Account <span className="text-primary italic">Settings</span>
          </h1>
          <p className={`text-base md:text-xl font-medium ${subTextColor} max-w-xl leading-relaxed`}>
            Update your profile and keep your account secured.
          </p>
        </div>

        <div className="space-y-12">
          {/* User Profile Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-8 md:p-12 rounded-[2rem] md:rounded-[3rem] border shadow-xl relative overflow-hidden ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}
          >
            <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 relative z-10">
              <div className="relative group">
                 <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary/20 bg-primary/10 flex items-center justify-center">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-black italic text-primary">{user?.name?.[0]?.toUpperCase()}</span>
                    )}
                 </div>
                 <div className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary text-white border-4 border-white dark:border-slate-900 flex items-center justify-center">
                    <ShieldCheck size={16} />
                 </div>
              </div>
              
              <div className="flex-1 text-center md:text-left space-y-4">
                 <div>
                    <h3 className={`text-2xl md:text-4xl font-black mb-1 ${textColor}`}>{user?.name?.toUpperCase() || 'USER'}</h3>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                       <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                       <p className={`text-[10px] font-bold uppercase tracking-[0.3em] text-primary italic`}>{user?.role || 'Member'} — Verified</p>
                    </div>
                 </div>
                 
                 <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <div className={`px-4 py-2 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'} flex items-center gap-3`}>
                       <Mail size={16} className="text-primary" />
                       <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{user?.email}</span>
                    </div>
                    {user?.phone && (
                      <div className={`px-4 py-2 rounded-xl border ${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-50 border-slate-200'} flex items-center gap-3`}>
                        <Phone size={16} className="text-primary" />
                        <span className={`text-[10px] font-bold ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>{user.phone}</span>
                      </div>
                    )}
                 </div>
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => setEditMode(true)}
                  className="px-8 py-4 rounded-xl bg-primary text-white font-black text-xs uppercase tracking-widest hover:shadow-lg transition-all active:scale-95"
                >
                  Edit Profile
                </button>
                <button 
                  onClick={logout}
                  className={`px-8 py-4 rounded-xl border font-bold text-xs uppercase tracking-widest transition-all active:scale-95 ${isDark ? 'border-white/10 text-slate-400 hover:text-white' : 'border-slate-200 text-slate-500 hover:text-slate-900'}`}
                >
                  Sign Out
                </button>
              </div>
            </div>
          </motion.div>

          {/* Quick Settings Grid */}
          <div className="grid md:grid-cols-2 gap-8">
             <motion.button 
               whileHover={{ y: -5 }}
               onClick={() => setPasswordMode(true)}
               className={`p-8 rounded-[2rem] border text-left transition-all ${isDark ? 'bg-slate-900 border-white/5 hover:border-primary/50' : 'bg-white border-slate-100 shadow-sm hover:shadow-lg'}`}
             >
                <div className="w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
                   <Lock size={28} />
                </div>
                <h4 className={`text-xl font-black mb-2 ${textColor}`}>Security Control</h4>
                <p className={`text-xs font-medium ${subTextColor}`}>Update your password and manage active sessions.</p>
                <div className="mt-6 flex items-center gap-2 text-primary font-bold text-[10px] uppercase tracking-widest">
                   Access Settings <ChevronRight size={14} />
                </div>
             </motion.button>

             <motion.button 
               whileHover={{ y: -5 }}
               className={`p-8 rounded-[2rem] border text-left transition-all ${isDark ? 'bg-slate-900 border-white/5 hover:border-primary/50' : 'bg-white border-slate-100 shadow-sm hover:shadow-lg'}`}
             >
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center text-purple-500 mb-6">
                   <Bell size={28} />
                </div>
                <h4 className={`text-xl font-black mb-2 ${textColor}`}>Notifications</h4>
                <p className={`text-xs font-medium ${subTextColor}`}>Manage alerts for orders, payments, and system updates.</p>
                <div className="mt-6 flex items-center gap-2 text-purple-500 font-bold text-[10px] uppercase tracking-widest">
                   Manage Alerts <ChevronRight size={14} />
                </div>
             </motion.button>
          </div>

          {/* Edit Profile Modal */}
          <AnimatePresence>
            {editMode && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setEditMode(false); setProfileData({ name: user?.name, email: user?.email, phone: user?.phone, avatar: user?.avatar }); }} />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`relative w-full max-w-lg p-8 md:p-12 rounded-[2.5rem] border shadow-2xl z-[210] ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-3xl font-black mb-8 ${textColor}`}>Edit <span className="text-primary italic">Profile</span></h3>
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="flex flex-col items-center gap-4 mb-8">
                       <div className="relative group">
                          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/20 bg-primary/10 flex items-center justify-center">
                             {profileData.avatar ? (
                               <img src={profileData.avatar} alt="New Avatar" className="w-full h-full object-cover" />
                             ) : (
                               <span className="text-4xl font-black italic text-primary">{user?.name?.[0]?.toUpperCase()}</span>
                             )}
                          </div>
                          <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                             <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                             <Camera size={24} />
                          </label>
                       </div>
                       <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Tap to change photo</p>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Full Name</label>
                        <input 
                          type="text" 
                          className={`w-full py-4 px-6 rounded-xl border outline-none focus:border-primary transition-all font-bold ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                          value={profileData.name}
                          onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Phone Number</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 0810 xxx xxxx"
                          className={`w-full py-4 px-6 rounded-xl border outline-none focus:border-primary transition-all font-bold ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <button type="submit" disabled={loading} className="flex-1 bg-primary text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 hover:bg-primary/90 transition-all active:scale-95 disabled:opacity-50">
                         <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button type="button" onClick={() => setEditMode(false)} className={`px-6 rounded-xl border font-bold text-[10px] uppercase tracking-widest transition-all ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500 hover:text-slate-900'}`}>
                         Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Password Modal */}
          <AnimatePresence>
            {passwordMode && (
              <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setPasswordMode(false)} />
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className={`relative w-full max-w-md p-8 md:p-12 rounded-[2.5rem] border shadow-2xl z-[210] ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-3xl font-black mb-8 ${textColor}`}>Update <span className="text-primary italic">Security</span></h3>
                  <form onSubmit={handlePasswordUpdate} className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Current Password</label>
                       <input 
                         type="password" 
                         required
                         className={`w-full py-4 px-6 rounded-xl border outline-none focus:border-primary transition-all font-bold ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                         value={passwordData.currentPassword}
                         onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">New Password</label>
                       <input 
                         type="password" 
                         required
                         className={`w-full py-4 px-6 rounded-xl border outline-none focus:border-primary transition-all font-bold ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                         value={passwordData.newPassword}
                         onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Confirm New Password</label>
                       <input 
                         type="password" 
                         required
                         className={`w-full py-4 px-6 rounded-xl border outline-none focus:border-primary transition-all font-bold ${isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                         value={passwordData.confirmPassword}
                         onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                       />
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button type="submit" disabled={loading} className="flex-1 btn-primary py-4 rounded-xl flex items-center justify-center gap-2">
                         <Shield size={18} /> {loading ? 'Updating...' : 'Secure Account'}
                      </button>
                      <button type="button" onClick={() => setPasswordMode(false)} className={`px-6 rounded-xl border font-bold text-xs uppercase transition-all ${isDark ? 'border-white/10 text-slate-400' : 'border-slate-200 text-slate-500'}`}>
                         Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              </div>
            )}
          </AnimatePresence>

          {/* Delete Account */}
          <div className="pt-12">
            <div className={`p-8 rounded-[2rem] border border-red-500/20 shadow-lg ${isDark ? 'bg-red-500/5' : 'bg-red-50'}`}>
               <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                  <div className="text-center md:text-left">
                     <h4 className="text-red-500 font-black text-lg mb-2 flex items-center justify-center md:justify-start gap-2">
                        <ShieldAlert size={20} /> Danger Zone
                     </h4>
                     <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'} max-w-md`}>
                        This will permanently delete your orders and wallet balance. Na real talk o, this action cannot be undone.
                     </p>
                  </div>
                  <button className="px-8 py-4 rounded-xl border border-red-500/50 text-red-500 font-bold text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all">
                     Delete Account
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
