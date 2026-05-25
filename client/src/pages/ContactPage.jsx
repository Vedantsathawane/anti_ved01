import { useState } from 'react';

const ContactPage = () => {
  const [form, setForm]       = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent]       = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setSent(true); setLoading(false); }, 1500);
  };

  const infoCards = [
    { icon: '📧', color: 'rgba(124,58,237,0.15)', label: 'Email Us',         value: 'hello@authvault.dev' },
    { icon: '💬', color: 'rgba(6,182,212,0.15)',  label: 'Live Chat',         value: 'Available 9am–6pm IST' },
    { icon: '📍', color: 'rgba(16,185,129,0.15)', label: 'Headquarters',      value: 'Bengaluru, India' },
    { icon: '⚡', color: 'rgba(245,158,11,0.15)', label: 'Response Time',     value: 'Within 24 hours' },
  ];

  return (
    <div className="page">
      {/* Hero */}
      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="container text-center">
          <div className="section-label">Contact</div>
          <h1 className="section-title">
            Get in <span className="text-gradient">Touch</span>
          </h1>
          <p className="section-subtitle mx-auto">
            Have a question, found a bug, or want to discuss enterprise plans?
            We'd love to hear from you.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="section-sm">
        <div className="container">
          <div className="grid-4">
            {infoCards.map((c) => (
              <div key={c.label} className="contact-info-card" style={{ flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <div className="contact-icon" style={{ background: c.color }}>{c.icon}</div>
                <div>
                  <div className="contact-label">{c.label}</div>
                  <div className="contact-value">{c.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div style={{ maxWidth: 680, margin: '0 auto' }}>
            <div className="card" style={{ padding: '48px 40px' }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎉</div>
                  <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 12 }}>Message Sent!</h2>
                  <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28 }}>
                    Thanks for reaching out, <strong>{form.name}</strong>!<br />
                    We'll get back to you within 24 hours.
                  </p>
                  <button
                    className="btn btn-secondary"
                    id="contact-send-another"
                    onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }); }}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 8 }}>Send Us a Message</h2>
                  <p style={{ color: 'var(--text-secondary)', marginBottom: 32, fontSize: '0.9rem' }}>
                    Fill out the form and our team will get back to you shortly.
                  </p>

                  <form onSubmit={handleSubmit} id="contact-form">
                    <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="contact-name">Your Name</label>
                        <div className="input-wrapper">
                          <span className="input-icon">👤</span>
                          <input id="contact-name" type="text" name="name" value={form.name} onChange={handleChange}
                            className="form-input" placeholder="John Doe" required />
                        </div>
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" htmlFor="contact-email">Email Address</label>
                        <div className="input-wrapper">
                          <span className="input-icon">✉️</span>
                          <input id="contact-email" type="email" name="email" value={form.email} onChange={handleChange}
                            className="form-input" placeholder="you@example.com" required />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-subject">Subject</label>
                      <div className="input-wrapper">
                        <span className="input-icon">📌</span>
                        <input id="contact-subject" type="text" name="subject" value={form.subject} onChange={handleChange}
                          className="form-input" placeholder="How can we help?" required />
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="form-label" htmlFor="contact-message">Message</label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        className="form-input"
                        placeholder="Tell us more about your question or issue..."
                        rows={6}
                        required
                        style={{ paddingLeft: 14, resize: 'vertical', minHeight: 140 }}
                      />
                    </div>

                    <button type="submit" className="btn-submit" disabled={loading} id="contact-submit-btn">
                      {loading && <span className="btn-spinner" />}
                      {loading ? 'Sending…' : '🚀 Send Message'}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
