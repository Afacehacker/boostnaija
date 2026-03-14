import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Wallet, LayoutDashboard, ShoppingCart, LogOut, User as UserIcon, List, Sun, Moon, Settings, Zap } from 'lucide-react';
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
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/dashboard/services' },
      ];

  if (user?.role === 'admin') {
    navLinks.push({ name: 'Admin', path: '/staff-portal-99', icon: <UserIcon size={18} /> });
  }

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  
  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 flex justify-center ${isScrolled ? 'pt-4 md:pt-6' : 'pt-0'}`}>
      <div className={`
        relative w-full max-w-7xl mx-4 md:mx-6 px-6 md:px-8 py-3 md:py-4 flex justify-between items-center transition-all duration-500
        ${isScrolled 
          ? `rounded-2xl md:rounded-[2rem] border ${isDark ? 'bg-slate-900/80 border-white/10' : 'bg-white/80 border-slate-200'} shadow-xl` 
          : `border-b ${isDark ? 'border-white/5 bg-background-dark/20' : 'border-slate-100 bg-white/40'}`
        }
        backdrop-blur-xl
      `}>
        <Link to="/" className={`group flex items-center gap-2 md:gap-4 transition-transform hover:scale-105 active:scale-95`}>
          <div className="relative">
            <img 
              src="/logo_3d.png" 
              alt="BoostNaija Logo" 
              className="w-8 h-8 md:w-10 md:h-10 object-contain"
            />
          </div>
          <span className={`text-xl md:text-2xl font-black tracking-tighter flex items-center gap-1 leading-none ${textColor}`}>
            BOOST<span className="text-primary italic">NAIJA</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`text-[10px] font-bold uppercase tracking-widest transition-all flex items-center gap-2 relative group px-2 py-1`}
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
          
          <div className="w-px h-6 bg-white/10"></div>

          <button 
            onClick={toggleTheme}
            className={`p-2.5 rounded-xl transition-all duration-300 ${isDark ? 'bg-white/5 hover:bg-white/10 text-primary border border-white/5' : 'bg-slate-50 hover:bg-slate-100 text-primary border border-slate-200'}`}
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-6">
              <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider leading-none">Balance</span>
                <span className={`text-lg font-black italic tracking-tighter ${textColor}`}>₦{user.walletBalance.toLocaleString()}</span>
              </div>
              <button onClick={handleLogout} className="p-2.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/10">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className={`text-xs font-bold uppercase tracking-widest transition-all ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900'}`}>Login</Link>
              <Link to="/register" className="btn-primary py-3 px-8 text-[11px] uppercase tracking-widest font-bold">Sign Up</Link>
            </div>
          )}
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-3 md:hidden">
          {user ? (
             <div className="text-right flex flex-col items-end">
                <span className={`text-sm font-black italic tracking-tighter ${textColor}`}>₦{user.walletBalance.toLocaleString()}</span>
             </div>
          ) : (
            <Link to="/login" className="btn-primary py-2 px-5 text-[10px] uppercase font-bold tracking-wider rounded-lg">Login</Link>
          )}
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-lg transition-all ${isDark ? 'bg-white/5 text-primary' : 'bg-slate-100 text-primary'}`}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
