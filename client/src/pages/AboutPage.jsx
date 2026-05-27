const team = [
  { name: 'Vikram Singh',   role: 'CEO & Co-Founder',      avatar: 'VS', color: '#7c3aed', bio: 'Full-stack architect with 12 years of experience building secure web applications at scale.' },
  { name: 'Neha Joshi',     role: 'CTO & Co-Founder',      avatar: 'NJ', color: '#06b6d4', bio: 'Security expert and Node.js specialist. Previously led backend teams at top fintech companies.' },
  { name: 'Amit Verma',     role: 'Lead Frontend Engineer', avatar: 'AV', color: '#10b981', bio: 'React enthusiast and UI/UX designer who believes beautiful code and beautiful design go hand in hand.' },
  { name: 'Sana Kapoor',    role: 'Database Architect',     avatar: 'SK', color: '#f59e0b', bio: 'MySQL optimization expert with a deep passion for performance tuning and data integrity.' },
  { name: 'Rohan Patel',    role: 'DevOps Engineer',        avatar: 'RP', color: '#ec4899', bio: 'Infrastructure and deployment specialist. Keeps our systems running at 99.9% uptime.' },
  { name: 'Priya Menon',    role: 'Product Manager',        avatar: 'PM', color: '#8b5cf6', bio: 'Bridges the gap between user needs and engineering reality. Makes sure we build the right things.' },
];

const values = [
  { icon: '🔐', color: 'rgba(124,58,237,0.15)', title: 'Security First',      desc: 'We never compromise on security. Every decision is made with your users\' safety as the top priority.' },
  { icon: '✨', color: 'rgba(6,182,212,0.15)',  title: 'Developer Experience', desc: 'We believe great developer tools lead to better products. We obsess over DX so you can focus on shipping.' },
  { icon: '🚀', color: 'rgba(16,185,129,0.15)', title: 'Performance',          desc: 'Fast software is good software. We optimize every layer of the stack for maximum speed.' },
  { icon: '💬', color: 'rgba(245,158,11,0.15)', title: 'Transparency',         desc: 'Open pricing, open communication, and honest documentation. No surprises, ever.' },
];

const AboutPage = () => (
  <div className="page">
    {/* Hero */}
    <section className="section" style={{ paddingBottom: 0 }}>
      <div className="container text-center">
        <div className="section-label">About Us</div>
        <h1 className="section-title">
          Built by Developers,<br />
          <span className="text-gradient">For Developers</span>
        </h1>
        <p className="section-subtitle mx-auto">
          AuthVault was born out of frustration with complex, bloated auth libraries.
          We set out to build something clean, beautiful, and production-ready out of the box.
        </p>
      </div>
    </section>

    {/* Mission */}
    <section className="section">
      <div className="container">
        <div className="grid-2" style={{ gap: 60, alignItems: 'center' }}>
          <div>
            <div className="section-label">Our Mission</div>
            <h2 className="section-title" style={{ fontSize: '2rem' }}>Making Auth Simple, Not Simple-Minded</h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 20 }}>
              We started AuthVault in 2024 with one goal: eliminate the pain of building authentication from scratch.
              Every project needs auth — but not every developer should have to rebuild it.
            </p>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.75, marginBottom: 32 }}>
              Today, thousands of developers use AuthVault to launch faster, safer, and with more confidence.
              We're proud of what we've built and excited about where we're going.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              {[
                { num: '2024',  lbl: 'Founded'    },
                { num: '10K+',  lbl: 'Users'      },
                { num: '50K+',  lbl: 'Logins/Day' },
                { num: '99.9%', lbl: 'Uptime'     },
              ].map((s) => (
                <div key={s.lbl} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '24px 20px', textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', fontWeight: 900, background: 'linear-gradient(135deg,var(--primary-light),var(--accent-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>{s.num}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 6 }}>{s.lbl}</div>
                </div>
              ))}
            </div>
          </div>
          {/* About Team Image */}
          <div className="about-image-wrap">
            <img src="/about_team.png" alt="AuthVault Team at work" loading="lazy" />
          </div>
        </div>
      </div>
    </section>


    {/* Values */}
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 48 }}>
          <div className="section-label">Our Values</div>
          <h2 className="section-title">What Drives Us</h2>
        </div>
        <div className="grid-2">
          {values.map((v) => (
            <div key={v.title} className="card value-card">
              <div className="value-icon" style={{ background: v.color }}>{v.icon}</div>
              <div>
                <h3 style={{ fontWeight: 700, marginBottom: 8 }}>{v.title}</h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* Team */}
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <div className="text-center" style={{ marginBottom: 48 }}>
          <div className="section-label">The Team</div>
          <h2 className="section-title">Meet the People Behind AuthVault</h2>
        </div>
        <div className="grid-3">
          {team.map((m) => (
            <div key={m.name} className="card team-card">
              <div className="team-avatar" style={{ background: m.color }}>{m.avatar}</div>
              <div className="team-name">{m.name}</div>
              <div className="team-role">{m.role}</div>
              <p className="team-bio">{m.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  </div>
);

export default AboutPage;
