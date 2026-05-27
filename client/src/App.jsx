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

const BubbleBackground = () => {
  const [bubbles, setBubbles] = useState([]);

  useEffect(() => {
    // Generate 15 premium floating bubbles with randomized specs
    const list = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      size: Math.floor(Math.random() * 80) + 30, // 30px to 110px
      left: Math.random() * 100, // 0% to 100%
      duration: Math.floor(Math.random() * 10) + 12, // 12s to 22s
      delay: Math.random() * 8 // 0s to 8s
    }));
    setBubbles(list);
  }, []);

  return (
    <div className="bubble-container">
      {bubbles.map((b) => (
        <div
          key={b.id}
          className="bubble"
          style={{
            width: `${b.size}px`,
            height: `${b.size}px`,
            left: `${b.left}%`,
            animationDuration: `${b.duration}s`,
            animationDelay: `${b.delay}s`
          }}
        />
      ))}
    </div>
  );
};

function App() {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme,   setTheme]   = useState(() => localStorage.getItem('theme') || 'dark');

  // Apply theme to <html>
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  // Restore session
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
        <div className="bg-animated" /><BubbleBackground /><div className="orb orb-1" /><div className="orb orb-2" />
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
          <span className="btn-spinner" style={{ width:36, height:36, borderWidth:3 }} />
        </div>
      </>
    );
  }

  return (
    <BrowserRouter>
      <div className="bg-animated" />
      <BubbleBackground />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <Routes>
        {/* Dashboard — no Navbar/Footer */}
        <Route
          path="/dashboard"
          element={
            user
              ? <Dashboard user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
              : <Navigate to="/auth" replace />
          }
        />

        {/* Public pages — with Navbar + Footer */}
        <Route path="*" element={
          <>
            <Navbar user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
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
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            <Footer />
          </>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
