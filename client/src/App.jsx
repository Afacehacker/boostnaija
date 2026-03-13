import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Wallet from './pages/Wallet';
import Services from './pages/Services';
import Orders from './pages/Orders';
import AdminDashboard from './pages/AdminDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WhatsAppWidget from './components/WhatsAppWidget';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="h-screen flex items-center justify-center text-primary">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/dashboard" />;

  return children;
};

// Ensures dashboard pages stay dark if the user wants, or follows toggle
const DynamicThemeWrapper = ({ children }) => {
  const { pathname } = useLocation();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    // If we go to dashboard, we might want to default to dark or keep user choice
    // For now, let's allow the user toggle to persist everywhere
  }, [pathname]);

  return children;
};

import MobileBottomNav from './components/MobileBottomNav';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <DynamicThemeWrapper>
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

                <Route path="/admin" element={
                  <ProtectedRoute adminOnly={true}>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
              <WhatsAppWidget />
              <MobileBottomNav />
              <ToastContainer position="bottom-right" theme="dark" />
            </div>
          </DynamicThemeWrapper>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
