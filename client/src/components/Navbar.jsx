import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, Wallet, LayoutDashboard, ShoppingCart, LogOut, User as UserIcon, List, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const isLanding = location.pathname === '/';

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
    navLinks.push({ name: 'Admin', path: '/admin', icon: <UserIcon size={18} /> });
  }

  const isDark = theme === 'dark';
  const textColor = isDark ? 'text-white' : 'text-slate-900';
  const navBg = isDark ? 'bg-background-dark/80' : 'bg-white/80';
  const borderCol = isDark ? 'border-white/10' : 'border-slate-100';

  return (
    <nav className={`fixed w-full z-50 px-6 py-4 border-b transition-all duration-300 backdrop-blur-md ${navBg} ${borderCol}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/" className={`group flex items-center gap-3 transition-transform hover:scale-105`}>
          <div className="relative">
            <img 
              src="/src/assets/logo_3d.png" 
              alt="BoostNaija Logo" 
              className="w-10 h-10 object-contain animate-float"
            />
            <div className="absolute -inset-1 bg-primary/20 blur-md rounded-full -z-10 group-hover:bg-primary/40 transition-colors"></div>
          </div>
          <span className={`text-2xl font-black tracking-tighter flex items-center gap-1 ${textColor}`}>
            BOOST<span className="text-primary italic">NAIJA</span>
          </span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              className={`text-sm font-bold uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2 ${textColor}`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${isDark ? 'bg-white/5 hover:bg-white/10 text-primary' : 'bg-slate-100 hover:bg-slate-200 text-primary'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {user ? (
            <div className="flex items-center gap-6">
              <div className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-xl text-primary text-sm font-black">
                ₦{user.walletBalance.toLocaleString()}
              </div>
              <button onClick={handleLogout} className="text-slate-500 hover:text-red-500 transition-colors">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-6">
              <Link to="/login" className={`text-sm font-black uppercase tracking-widest hover:text-primary transition-colors ${textColor}`}>Login</Link>
              <Link to="/register" className="btn-primary py-2 px-6 text-xs uppercase tracking-widest">Get Started</Link>
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-4 md:hidden">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${isDark ? 'bg-white/5 text-primary' : 'bg-slate-100 text-primary'}`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button className={textColor} onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`md:hidden absolute top-full left-0 w-full border-b overflow-hidden shadow-2xl ${isDark ? 'bg-slate-900 border-white/10' : 'bg-white border-slate-100'}`}
          >
            <div className="p-8 flex flex-col gap-8">
              {navLinks.map((link) => (
                <Link 
                  key={link.name} 
                  to={link.path} 
                  className={`${textColor} text-lg font-black uppercase tracking-widest hover:text-primary flex items-center gap-4`}
                  onClick={() => setIsOpen(false)}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
              <hr className={isDark ? 'border-white/10' : 'border-slate-100'} />
              {user ? (
                <div className="space-y-6">
                   <div className="text-primary font-black text-2xl text-center">₦{user.walletBalance.toLocaleString()}</div>
                   <button 
                    onClick={handleLogout} 
                    className="w-full py-4 text-red-500 font-black uppercase tracking-widest border border-red-500/20 rounded-2xl"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/register" className="btn-primary text-center py-4" onClick={() => setIsOpen(false)}>Create Account</Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
