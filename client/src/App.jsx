import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Navbar       from './components/Navbar';
import Footer       from './components/Footer';

import HomePage     from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import PricingPage  from './pages/PricingPage';
import AboutPage    from './pages/AboutPage';
import ContactPage  from './pages/ContactPage';
import AuthPage     from './pages/AuthPage';
import Dashboard    from './pages/Dashboard';
import NotFoundPage from './pages/NotFoundPage';

import './index.css';

// Pages that show Navbar + Footer
const PUBLIC_PAGES = ['/', '/features', '/pricing', '/about', '/contact', '/auth'];

function App() {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    try {
      const savedUser  = localStorage.getItem('user');
      const savedToken = localStorage.getItem('token');
      if (savedUser && savedToken) setUser(JSON.parse(savedUser));
    } catch {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  }, []);

  const handleAuthenticated = (userData) => setUser(userData);
  const handleLogout        = () => setUser(null);

  if (loading) {
    return (
      <>
        <div className="bg-animated" /><div className="orb orb-1" /><div className="orb orb-2" />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
          <span className="btn-spinner" style={{ width:36, height:36, borderWidth:3 }} />
        </div>
      </>
    );
  }

  return (
    <BrowserRouter>
      <div className="bg-animated" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Routes>
        {/* Dashboard — no Navbar/Footer */}
        <Route
          path="/dashboard"
          element={
            user
              ? <Dashboard user={user} onLogout={handleLogout} />
              : <Navigate to="/auth" replace />
          }
        />

        {/* All public pages — with Navbar + Footer */}
        <Route path="*" element={
          <>
            <Navbar user={user} onLogout={handleLogout} />
            <Routes>
              <Route path="/"         element={<HomePage />} />
              <Route path="/features" element={<FeaturesPage />} />
              <Route path="/pricing"  element={<PricingPage />} />
              <Route path="/about"    element={<AboutPage />} />
              <Route path="/contact"  element={<ContactPage />} />
              <Route path="/auth"     element={
                user
                  ? <Navigate to="/dashboard" replace />
                  : <AuthPage onAuthenticated={handleAuthenticated} />
              } />
              <Route path="*"         element={<NotFoundPage />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
