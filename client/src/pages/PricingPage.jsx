import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const plans = [
  {
    name: 'Starter',
    desc: 'Perfect for side projects and learning.',
    price: 'Free',
    period: 'forever',
    badge: null,
    featured: false,
    features: [
      { label: '1 Project',             ok: true },
      { label: 'Up to 100 users',        ok: true },
      { label: 'JWT Authentication',     ok: true },
      { label: 'MySQL Integration',      ok: true },
      { label: 'Email Support',          ok: true },
      { label: 'Custom Domain',          ok: false },
      { label: 'Analytics Dashboard',    ok: false },
      { label: 'Priority Support',       ok: false },
    ],
    btnLabel: 'Get Started Free',
    btnClass: 'btn btn-secondary',
  },
  {
    name: 'Pro',
    desc: 'For professional developers and small teams.',
    price: '$12',
    period: '/month',
    badge: 'Most Popular',
    featured: true,
    features: [
      { label: 'Unlimited Projects',     ok: true },
      { label: 'Up to 10,000 users',     ok: true },
      { label: 'JWT Authentication',     ok: true },
      { label: 'MySQL Integration',      ok: true },
      { label: 'Priority Email Support', ok: true },
      { label: 'Custom Domain',          ok: true },
      { label: 'Analytics Dashboard',    ok: true },
      { label: 'Priority Support',       ok: false },
    ],
    btnLabel: 'Start Pro Trial',
    btnClass: 'btn btn-primary',
  },
  {
    name: 'Enterprise',
    desc: 'For large teams and mission-critical apps.',
    price: '$49',
    period: '/month',
    badge: null,
    featured: false,
    features: [
      { label: 'Unlimited Projects',     ok: true },
      { label: 'Unlimited Users',        ok: true },
      { label: 'JWT Authentication',     ok: true },
      { label: 'MySQL Integration',      ok: true },
      { label: '24/7 Phone Support',     ok: true },
      { label: 'Custom Domain',          ok: true },
      { label: 'Analytics Dashboard',    ok: true },
      { label: 'Priority Support',       ok: true },
    ],
    btnLabel: 'Contact Sales',
    btnClass: 'btn btn-secondary',
  },
];

const faqs = [
  { q: 'Is the Starter plan really free forever?',   a: 'Yes! The Starter plan is completely free with no credit card required. You can build and ship real projects on it.' },
  { q: 'Can I switch plans later?',                  a: 'Absolutely. You can upgrade or downgrade your plan at any time. Billing is prorated.' },
  { q: 'What database does AuthVault use?',           a: 'AuthVault uses MySQL with connection pooling for high performance. You can connect your own MySQL instance.' },
  { q: 'Is my data secure?',                          a: 'Yes. Passwords are hashed with bcrypt, tokens use HS256 JWT, and all connections are encrypted in transit.' },
  { q: 'Do you offer refunds?',                       a: 'We offer a 30-day money-back guarantee on all paid plans, no questions asked.' },
];

const PricingPage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const navigate = useNavigate();

  return (
    <div className="page">
      {/* Hero */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container text-center">
          <div className="section-label">Pricing</div>
          <h1 className="section-title">Simple, <span className="text-gradient">Transparent</span> Pricing</h1>
          <p className="section-subtitle mx-auto">
            Start free, scale as you grow. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="section">
        <div className="container">
          <div className="grid-3">
            {plans.map((p) => (
              <div key={p.name} className={`pricing-card${p.featured ? ' featured' : ''}`}>
                {p.badge && <div className="pricing-badge">{p.badge}</div>}
                <div className="pricing-name">{p.name}</div>
                <div className="pricing-desc">{p.desc}</div>
                <div className="pricing-price">
                  <span className="pricing-amount">{p.price}</span>
                  <span className="pricing-period">{p.period}</span>
                </div>
                <ul className="pricing-features">
                  {p.features.map((f) => (
                    <li key={f.label}>
                      <span className={f.ok ? 'check' : 'cross'}>{f.ok ? '✓' : '✕'}</span>
                      <span style={{ color: f.ok ? 'var(--text-secondary)' : 'var(--text-muted)' }}>{f.label}</span>
                    </li>
                  ))}
                </ul>
                <button
                  id={`pricing-${p.name.toLowerCase()}-btn`}
                  className={p.btnClass}
                  style={{ width: '100%' }}
                  onClick={() => navigate('/auth?tab=signup')}
                >
                  {p.btnLabel}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="text-center" style={{ marginBottom: 48 }}>
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
          </div>
          <div style={{ maxWidth: 720, margin: '0 auto' }}>
            {faqs.map((f, i) => (
              <div className="faq-item" key={i} id={`faq-${i}`}>
                <button className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  {f.q}
                  <span className={`faq-icon${openFaq === i ? ' open' : ''}`}>+</span>
                </button>
                {openFaq === i && <div className="faq-answer">{f.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
