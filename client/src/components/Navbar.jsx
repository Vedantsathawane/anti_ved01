import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
  </svg>
);

const Navbar = ({ user, onLogout }) => {
  const [scrolled, setScrolled]   = useState(false);
  const [menuOpen, setMenuOpen]   = useState(false);
  const location  = useLocation();
  const navigate  = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  const navLinks = [
    { to: '/',         label: 'Home' },
    { to: '/features', label: 'Features' },
    { to: '/pricing',  label: 'Pricing' },
    { to: '/about',    label: 'About' },
    { to: '/contact',  label: 'Contact' },
  ];

  return (
    <>
      <nav className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/" className="nav-logo" id="nav-logo">
            <div className="nav-logo-icon"><ShieldIcon /></div>
            AuthVault
          </Link>

          {/* Desktop Links */}
          <ul className="nav-links">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={isActive(l.to)} id={`nav-${l.label.toLowerCase()}`}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="nav-actions">
            {user ? (
              <>
                <button className="btn-nav-ghost" onClick={() => navigate('/dashboard')} id="nav-dashboard-btn">
                  Dashboard
                </button>
                <button className="btn-nav-primary" onClick={handleLogout} id="nav-logout-btn">
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <button className="btn-nav-ghost" onClick={() => navigate('/auth')} id="nav-login-btn">
                  Sign In
                </button>
                <button className="btn-nav-primary" onClick={() => navigate('/auth?tab=signup')} id="nav-signup-btn">
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
            id="nav-hamburger"
          >
            <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px,5px)' : '' }} />
            <span style={{ opacity: menuOpen ? 0 : 1 }} />
            <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px,-5px)' : '' }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`nav-mobile-menu${menuOpen ? ' open' : ''}`} id="nav-mobile-menu">
        {navLinks.map((l) => (
          <Link key={l.to} to={l.to} className={isActive(l.to)}>
            {l.label}
          </Link>
        ))}
        <div className="mobile-actions">
          {user ? (
            <>
              <button className="btn-nav-ghost" style={{ flex: 1 }} onClick={() => navigate('/dashboard')}>Dashboard</button>
              <button className="btn-nav-primary" style={{ flex: 1 }} onClick={handleLogout}>Sign Out</button>
            </>
          ) : (
            <>
              <button className="btn-nav-ghost" style={{ flex: 1 }} onClick={() => navigate('/auth')}>Sign In</button>
              <button className="btn-nav-primary" style={{ flex: 1 }} onClick={() => navigate('/auth?tab=signup')}>Get Started</button>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
