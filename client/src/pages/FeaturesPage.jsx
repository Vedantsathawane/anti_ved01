import { useNavigate } from 'react-router-dom';

const allFeatures = [
  { icon: '🔐', color: 'rgba(124,58,237,0.15)', title: 'JWT Authentication',      desc: 'Industry-standard JSON Web Tokens with configurable expiry, refresh token support, and automatic header injection via Axios interceptors.' },
  { icon: '🛡️', color: 'rgba(6,182,212,0.15)',  title: 'bcrypt Password Hashing',  desc: 'Passwords are hashed using bcrypt with adaptive salt rounds — making brute-force attacks computationally infeasible.' },
  { icon: '🗄️', color: 'rgba(16,185,129,0.15)', title: 'MySQL Integration',         desc: 'Persistent storage using mysql2/promise with connection pooling. All user data survives server restarts.' },
  { icon: '🧱', color: 'rgba(245,158,11,0.15)', title: 'MVC Architecture',           desc: 'Clean separation of Models, Views, and Controllers. Easy to extend, maintain, and scale as your app grows.' },
  { icon: '🔒', color: 'rgba(236,72,153,0.15)', title: 'Protected Routes',           desc: 'Middleware-based authorization guard checks JWT validity on every protected endpoint before allowing access.' },
  { icon: '✅', color: 'rgba(139,92,246,0.15)', title: 'Input Validation',           desc: 'Both client-side and server-side validation with detailed, user-friendly error messages for every field.' },
  { icon: '📱', color: 'rgba(6,182,212,0.15)',  title: 'Fully Responsive',           desc: 'Pixel-perfect on all screen sizes. Mobile-first design with touch-friendly interactive elements.' },
  { icon: '⚡', color: 'rgba(124,58,237,0.15)', title: 'High Performance',           desc: 'Connection pooling, efficient SQL queries, and React\'s virtual DOM keep the app blazing fast.' },
  { icon: '🎨', color: 'rgba(16,185,129,0.15)', title: 'Glassmorphism UI',           desc: 'Stunning dark glassmorphism design with animated gradients, micro-interactions, and smooth transitions.' },
  { icon: '💪', color: 'rgba(245,158,11,0.15)', title: 'Password Strength Meter',    desc: 'Real-time visual feedback on password quality helps users create strong, secure passwords.' },
  { icon: '🔄', color: 'rgba(236,72,153,0.15)', title: 'Session Persistence',        desc: 'JWT is stored in localStorage and restored on page refresh so users stay logged in across sessions.' },
  { icon: '🌐', color: 'rgba(139,92,246,0.15)', title: 'CORS Configured',            desc: 'Cross-origin requests from the React frontend are handled securely with proper CORS headers.' },
];

const FeaturesPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* Hero */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container text-center">
          <div className="section-label">Features</div>
          <h1 className="section-title">
            Built for <span className="text-gradient">Security & Speed</span>
          </h1>
          <p className="section-subtitle mx-auto">
            Every feature is carefully designed for production use — from the database layer to the pixel-perfect UI.
          </p>
        </div>
      </section>

      {/* Features Grid */}
      <section className="section">
        <div className="container">
          <div className="grid-3">
            {allFeatures.map((f) => (
              <div className="card" key={f.title}>
                <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <div className="section-label">Tech Stack</div>
            <h2 className="section-title">Powered By Modern Tech</h2>
          </div>
          <div className="grid-4">
            {[
              { name: 'React 18',     icon: '⚛️',  desc: 'Frontend UI library' },
              { name: 'Vite',         icon: '⚡',  desc: 'Build tool & dev server' },
              { name: 'Express.js',   icon: '🚂',  desc: 'Backend web framework' },
              { name: 'MySQL',        icon: '🗄️',  desc: 'Relational database' },
              { name: 'JWT',          icon: '🔑',  desc: 'Authentication tokens' },
              { name: 'bcryptjs',     icon: '🔒',  desc: 'Password hashing' },
              { name: 'Axios',        icon: '📡',  desc: 'HTTP client' },
              { name: 'React Router', icon: '🗺️',  desc: 'Client-side routing' },
            ].map((t) => (
              <div key={t.name} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px', textAlign: 'center', transition: 'transform 0.2s, border-color 0.2s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.borderColor = ''; }}
              >
                <div style={{ fontSize: '2rem', marginBottom: 10 }}>{t.icon}</div>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-sm">
        <div className="container">
          <div className="cta-section">
            <h2>Start Building Today</h2>
            <p>All these features are ready to use. Create your account and explore the dashboard.</p>
            <button className="btn-cta" id="features-cta-btn" onClick={() => navigate('/auth?tab=signup')}>
              Get Started Free →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
