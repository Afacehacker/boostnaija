import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Services from './pages/Services';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TelegramWidget from './components/TelegramWidget';
import MobileBottomNav from './components/MobileBottomNav';

// Ensures document title updates and navigation scrolls to top
const AppEnrichment = () => {
  const { pathname } = useLocation();
  const [isNavigating, setIsNavigating] = React.useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsNavigating(true);
    const timer = setTimeout(() => setIsNavigating(false), 600);
    
    // Dynamic Page Titles
    const titles = {
      '/': 'BoostNaija | Social Authority Hub',
      '/login': 'Login | Access Command Console',
      '/register': 'Register | Enlist as Agent',
      '/dashboard': 'Dashboard | Operation Control',
      '/dashboard/wallet': 'Vault | Capital Assets',
      '/dashboard/services': 'Store | Strategic Services',
      '/dashboard/orders': 'Missions | Deployment Logs',
      '/dashboard/settings': 'Settings | Security Protocols',
      '/staff-portal-99': 'Admin | Terminal Root Access'
    };
    
    document.title = titles[pathname] || 'BoostNaija | Premium SMM Nigeria';
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <AnimatePresence>
      {isNavigating && (
        <motion.div 
          initial={{ width: 0, opacity: 1 }}
          animate={{ width: '100%', opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="fixed top-0 left-0 h-[3px] bg-primary z-[9999] shadow-[0_0_15px_#3A7AFE]"
        />
      )}
    </AnimatePresence>
  );
};

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center gap-6 bg-slate-900">
       <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin shadow-2xl shadow-primary/20"></div>
       <p className="font-black text-primary uppercase tracking-[0.5em] text-[10px] animate-pulse">Decrypting Access...</p>
    </div>
  );
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;

  return children;
};

// ... (DynamicThemeWrapper remains same if needed, but AppEnrichment handles the main logic now)

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppEnrichment />
          <div className="min-h-screen transition-colors duration-500">
            <Navbar />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/wallet" element={
                <ProtectedRoute>
                  <Wallet />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/services" element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/dashboard/settings" element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />

              <Route path="/staff-portal-99" element={
                <ProtectedRoute adminOnly={true}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <TelegramWidget />
            <MobileBottomNav />
            <ToastContainer position="bottom-right" theme="dark" />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
