import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Wallet, LayoutDashboard, ShoppingCart, LogOut, User as UserIcon, List, Sun, Moon, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navLinks = user 
    ? [
        { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={18} /> },
        { name: 'Services', path: '/dashboard/services', icon: <ShoppingCart size={18} /> },
        { name: 'Orders', path: '/dashboard/orders', icon: <List size={18} /> },
        { name: 'Wallet', path: '/dashboard/wallet', icon: <Wallet size={18} /> },
      ]
    : [
        { name: 'Nexus', path: '/' },
        { name: 'Arsenal', path: '/dashboard/services' },
      ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Central', path: '/staff-portal-99', icon: <UserIcon size={18} /> });
  }

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  
  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 flex justify-center ${isScrolled ? 'pt-6' : 'pt-0'}`}>
      <div className={`
        relative w-full max-w-7xl mx-6 px-8 py-4 flex justify-between items-center transition-all duration-500
        ${isScrolled 
          ? `rounded-[2rem] border ${isDark ? 'glass-panel text-glow border-white/10' : 'glass-panel-light border-slate-200'} shadow-2xl` 
          : `border-b ${isDark ? 'border-white/5 bg-background-dark/20' : 'border-slate-100 bg-white/40'}`
        }
        backdrop-blur-xl
      `}>
        <Link to="/" className={`group flex items-center gap-4 transition-transform hover:scale-105 active:scale-95`}>
          <div className="relative">
            <img 
              src="/logo_3d.png" 
              alt="BoostNaija Logo" 
              className="w-10 h-10 object-contain animate-float"
            />
            <div className="absolute -inset-2 bg-primary/30 blur-xl rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity rotate-45"></div>
          </div>
          <span className={`text-2xl font-black tracking-tighter flex items-center gap-1 leading-none ${textColor}`}>
            BOOST<span className="text-primary italic">NAIJA</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-[10px] font-black uppercase tracking-[0.3em] transition-all flex items-center gap-2 relative group px-2 py-1`}
              >
                <span className={`${isActive ? 'text-primary' : `${isDark ? 'text-slate-400 group-hover:text-white' : 'text-slate-500 group-hover:text-slate-900'}`}`}>
                  {link.name}
                </span>
                {isActive && (
                  <motion.div layoutId="nav-line" className="absolute -bottom-1 left-0 w-full h-[2px] bg-primary rounded-full shadow-[0_0_10px_#3A7AFE]" />
                )}
              </Link>
            );
          })}
          
          <div className="w-px h-6 bg-white/10 hidden lg:block"></div>

          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-2xl transition-all duration-500 ${isDark ? 'bg-white/5 hover:bg-white/10 text-primary border border-white/5' : 'bg-slate-50 hover:bg-slate-100 text-primary border border-slate-200 hover:shadow-lg'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Liquidity</span>
                <span className={`text-lg font-black italic tracking-tighter ${textColor}`}>₦{user.walletBalance.toLocaleString()}</span>
              </div>
              <button onClick={handleLogout} className="p-3 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/10">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-8">
              <Link to="/login" className={`text-xs font-black uppercase tracking-widest transition-all ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>Auth Node</Link>
              <Link to="/register" className="btn-primary py-4 px-10 text-[10px] uppercase tracking-widest">Enlist Agent</Link>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-4 md:hidden">
          {user ? (
             <div className="text-right flex flex-col items-end">
                <span className="text-[8px] font-black text-primary uppercase tracking-widest leading-none">Unit Credit</span>
                <span className={`text-sm font-black italic tracking-tighter ${textColor}`}>₦{user.walletBalance.toLocaleString()}</span>
             </div>
          ) : (
            <Link to="/login" className="btn-primary py-3 px-6 text-[10px] uppercase tracking-[0.2em] rounded-xl font-black">Login</Link>
          )}
          <button 
            onClick={toggleTheme}
            className={`p-3 rounded-xl transition-all ${isDark ? 'bg-white/5 text-primary' : 'bg-slate-100 text-primary'}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

