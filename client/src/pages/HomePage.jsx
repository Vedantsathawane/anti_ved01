import { useNavigate } from 'react-router-dom';

const features = [
  { icon: '🔐', color: 'rgba(124,58,237,0.15)', title: 'JWT Authentication',  desc: 'Industry-standard JSON Web Tokens with configurable expiry and automatic refresh.' },
  { icon: '🛡️', color: 'rgba(6,182,212,0.15)',  title: 'Password Hashing',    desc: 'bcrypt with salt rounds ensures passwords are never stored in plain text.' },
  { icon: '⚡', color: 'rgba(16,185,129,0.15)', title: 'Lightning Fast',       desc: 'Optimized MySQL queries with connection pooling for blazing fast response times.' },
  { icon: '🎨', color: 'rgba(236,72,153,0.15)', title: 'Beautiful UI',         desc: 'Glassmorphism dark theme with smooth animations and micro-interactions.' },
  { icon: '🔒', color: 'rgba(245,158,11,0.15)', title: 'Route Protection',     desc: 'Middleware-based route guards prevent unauthorized access to protected pages.' },
  { icon: '📱', color: 'rgba(139,92,246,0.15)', title: 'Fully Responsive',     desc: 'Looks great on all screen sizes from mobile phones to large desktop monitors.' },
];

const testimonials = [
  { name: 'Aryan Mehta',   role: 'Full Stack Developer', avatar: 'AM', color: '#7c3aed', stars: 5, text: 'AuthVault saved me days of setup time. The MVC backend is clean, well-structured, and easy to extend. Absolutely love it.' },
  { name: 'Priya Sharma',  role: 'Startup Founder',      avatar: 'PS', color: '#06b6d4', stars: 5, text: 'The UI is stunning. Our users love the sign-up experience. The password strength meter is a small touch that makes a huge difference.' },
  { name: 'Rajan Kapoor',  role: 'Backend Engineer',     avatar: 'RK', color: '#10b981', stars: 5, text: 'Clean code, solid security practices, and excellent MySQL integration. This is production-ready from day one.' },
];

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            Now with MySQL Integration
          </div>

          <h1 className="hero-title">
            Secure Auth,<br />
            <span className="text-gradient">Beautifully Built</span>
          </h1>

          <p className="hero-subtitle">
            A full-stack authentication system with React frontend and Express MVC backend.
            JWT tokens, bcrypt hashing, MySQL database — production-ready from day one.
          </p>

          <div className="hero-actions">
            <button className="btn btn-primary btn-lg" id="hero-get-started" onClick={() => navigate('/auth?tab=signup')}>
              🚀 Get Started Free
            </button>
            <button className="btn btn-secondary btn-lg" id="hero-features" onClick={() => navigate('/features')}>
              See Features →
            </button>
          </div>

          {/* Hero Image */}
          <div className="hero-image-wrap">
            <div className="hero-image-bar" />
            <img src="/hero_banner.png" alt="AuthVault Security Dashboard" loading="eager" />
            <div className="hero-image-overlay" />
          </div>
        </div>
      </section>


      {/* ── Stats ────────────────────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div className="stats-strip">
            {[
              { num: '10K+',  lbl: 'Developers' },
              { num: '99.9%', lbl: 'Uptime SLA' },
              { num: '< 50ms',lbl: 'API Response' },
              { num: '256-bit', lbl: 'Encryption' },
            ].map((s) => (
              <div className="stat-item" key={s.lbl}>
                <div className="stat-num">{s.num}</div>
                <div className="stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: 60 }}>
            <div className="section-label">Features</div>
            <h2 className="section-title">Everything You Need</h2>
            <p className="section-subtitle mx-auto">Built with best practices in security, performance, and developer experience.</p>
          </div>
          <div className="grid-3">
            {features.map((f) => (
              <div className="card" key={f.title}>
                <div className="feature-icon" style={{ background: f.color }}>{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────── */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 60 }}>
            <div className="section-label">Testimonials</div>
            <h2 className="section-title">Loved by Developers</h2>
          </div>
          <div className="grid-3">
            {testimonials.map((t) => (
              <div className="testimonial-card" key={t.name}>
                <div className="testimonial-stars">{'★'.repeat(t.stars)}</div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar" style={{ background: t.color }}>{t.avatar}</div>
                  <div>
                    <div className="testimonial-name">{t.name}</div>
                    <div className="testimonial-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="section-sm">
        <div className="container">
          <div className="cta-section">
            <h2>Ready to Get Started?</h2>
            <p>Join thousands of developers who trust AuthVault for their authentication needs. Free to start, no credit card required.</p>
            <button className="btn-cta" id="cta-signup-btn" onClick={() => navigate('/auth?tab=signup')}>
              Create Free Account →
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
