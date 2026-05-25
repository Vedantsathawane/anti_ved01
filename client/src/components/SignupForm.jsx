import { useState } from 'react';
import { authService } from '../services/authService';

// ── Icon Components ──────────────────────────────────────────
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const MailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const EyeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

const AlertIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="12"/>
    <line x1="12" y1="16" x2="12.01" y2="16"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
    <polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

// ── Password Strength Helper ─────────────────────────────────
const getPasswordStrength = (password) => {
  if (!password) return { score: 0, label: '' };
  let score = 0;
  if (password.length >= 6)  score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Strong'];
  const classNames = ['', 'weak', 'fair', 'good', 'strong', 'strong'];
  return { score, label: labels[score], className: classNames[score] };
};

// ── SignupForm Component ─────────────────────────────────────
const SignupForm = ({ onSuccess }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError]   = useState('');
  const [apiSuccess, setApiSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getPasswordStrength(form.password);

  const validate = () => {
    const errs = {};
    if (!form.name || form.name.trim().length < 2)
      errs.name = 'Name must be at least 2 characters.';
    if (!form.email)
      errs.email = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = 'Enter a valid email.';
    if (!form.password)
      errs.password = 'Password is required.';
    else if (form.password.length < 6)
      errs.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword)
      errs.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match.';
    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    setApiError('');
    setApiSuccess('');
    try {
      const res = await authService.register({
        name: form.name.trim(),
        email: form.email,
        password: form.password,
      });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setApiSuccess('Account created! Redirecting…');
      setTimeout(() => onSuccess(res.data.user), 1000);
    } catch (err) {
      setApiError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate id="signup-form">
      {apiError   && <div className="alert alert-error"   role="alert"><AlertIcon /> {apiError}</div>}
      {apiSuccess && <div className="alert alert-success" role="status"><CheckIcon /> {apiSuccess}</div>}

      {/* Name */}
      <div className="form-group">
        <label className="form-label" htmlFor="signup-name">Full Name</label>
        <div className="input-wrapper">
          <span className="input-icon"><UserIcon /></span>
          <input
            id="signup-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className={`form-input${errors.name ? ' error' : ''}`}
            placeholder="John Doe"
            autoComplete="name"
          />
        </div>
        {errors.name && <p className="field-error"><AlertIcon /> {errors.name}</p>}
      </div>

      {/* Email */}
      <div className="form-group">
        <label className="form-label" htmlFor="signup-email">Email Address</label>
        <div className="input-wrapper">
          <span className="input-icon"><MailIcon /></span>
          <input
            id="signup-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className={`form-input${errors.email ? ' error' : ''}`}
            placeholder="you@example.com"
            autoComplete="email"
          />
        </div>
        {errors.email && <p className="field-error"><AlertIcon /> {errors.email}</p>}
      </div>

      {/* Password */}
      <div className="form-group">
        <label className="form-label" htmlFor="signup-password">Password</label>
        <div className="input-wrapper">
          <span className="input-icon"><LockIcon /></span>
          <input
            id="signup-password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={form.password}
            onChange={handleChange}
            className={`form-input${errors.password ? ' error' : ''}`}
            placeholder="Create a strong password"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.password && <p className="field-error"><AlertIcon /> {errors.password}</p>}

        {/* Strength bar */}
        {form.password && (
          <>
            <div className="strength-bar" role="progressbar" aria-label="Password strength">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`strength-segment${i <= strength.score ? ` active-${strength.className}` : ''}`}
                />
              ))}
            </div>
            <p className="strength-label">Strength: {strength.label}</p>
          </>
        )}
      </div>

      {/* Confirm Password */}
      <div className="form-group">
        <label className="form-label" htmlFor="signup-confirm-password">Confirm Password</label>
        <div className="input-wrapper">
          <span className="input-icon"><LockIcon /></span>
          <input
            id="signup-confirm-password"
            type={showConfirm ? 'text' : 'password'}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            className={`form-input${errors.confirmPassword ? ' error' : ''}`}
            placeholder="Repeat your password"
            autoComplete="new-password"
          />
          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
          >
            {showConfirm ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        </div>
        {errors.confirmPassword && <p className="field-error"><AlertIcon /> {errors.confirmPassword}</p>}
      </div>

      <button type="submit" className="btn-submit" disabled={loading} id="signup-submit-btn">
        {loading && <span className="btn-spinner" />}
        {loading ? 'Creating account…' : 'Create Account'}
      </button>
    </form>
  );
};

export default SignupForm;
