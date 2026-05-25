import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import SignupForm from '../components/SignupForm';

const ShieldIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
  </svg>
);

const AuthPage = ({ onAuthenticated }) => {
  const [searchParams]        = useSearchParams();
  const [activeTab, setActiveTab] = useState('login');
  const navigate              = useNavigate();

  // Support ?tab=signup from Navbar "Get Started" button
  useEffect(() => {
    if (searchParams.get('tab') === 'signup') setActiveTab('signup');
  }, [searchParams]);

  const handleSuccess = (user) => {
    onAuthenticated(user);
    navigate('/dashboard');
  };

  return (
    <div className="page page-center">
      <div className="auth-card">
        {/* Brand */}
        <div className="brand">
          <div className="brand-icon"><ShieldIcon /></div>
          <h1 className="brand-title">AuthVault</h1>
          <p className="brand-subtitle">
            {activeTab === 'login'
              ? 'Welcome back! Sign in to continue.'
              : 'Create your account to get started.'}
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="tab-switcher" role="tablist">
          <button
            id="tab-login"
            role="tab"
            aria-selected={activeTab === 'login'}
            className={`tab-btn${activeTab === 'login' ? ' active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Sign In
          </button>
          <button
            id="tab-signup"
            role="tab"
            aria-selected={activeTab === 'signup'}
            className={`tab-btn${activeTab === 'signup' ? ' active' : ''}`}
            onClick={() => setActiveTab('signup')}
          >
            Create Account
          </button>
        </div>

        {/* Forms */}
        {activeTab === 'login'
          ? <LoginForm  onSuccess={handleSuccess} />
          : <SignupForm onSuccess={handleSuccess} />}

        {/* Footer */}
        <hr className="divider" />
        <p className="text-center text-sm text-muted">
          {activeTab === 'login' ? (
            <>Don&apos;t have an account?{' '}
              <button id="switch-to-signup" onClick={() => setActiveTab('signup')}
                style={{ background:'none', border:'none', color:'var(--primary-light)', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.875rem', fontWeight:500 }}>
                Sign up free
              </button>
            </>
          ) : (
            <>Already have an account?{' '}
              <button id="switch-to-login" onClick={() => setActiveTab('login')}
                style={{ background:'none', border:'none', color:'var(--primary-light)', cursor:'pointer', fontFamily:'Inter,sans-serif', fontSize:'0.875rem', fontWeight:500 }}>
                Sign in
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
