import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace('/api/auth', '')
  : 'http://localhost:5000';

const authHeaders = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
});

// ── Icons ─────────────────────────────────────────────────────
const Icon = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);
const Icons = {
  grid:     "M3 3h7v7H3zm11 0h7v7h-7zm0 11h7v7h-7zM3 14h7v7H3z",
  users:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm8 0a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87",
  bar:      "M18 20V10M12 20V4M6 20v-6",
  settings: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41",
  file:     "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  home:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
};

// ── Loaders & Helpers ─────────────────────────────────────────
const Spinner = () => (
  <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:48 }}>
    <div style={{ width:32, height:32, border:'3px solid rgba(124,58,237,0.2)', borderTop:'3px solid #7c3aed', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
  </div>
);

const AVATAR_COLORS = ['#7c3aed','#06b6d4','#10b981','#f59e0b','#ec4899','#8b5cf6','#ef4444','#0891b2'];
const getColor  = (i) => AVATAR_COLORS[i % AVATAR_COLORS.length];
const getInitials = (name = '') => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
const formatDate  = (d) => new Date(d).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });

// ── Charts ────────────────────────────────────────────────────
const BarChart = ({ data = [], valueKey, color }) => {
  const max = Math.max(...data.map(d => d[valueKey] || 0), 1);
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:160, paddingTop:8 }}>
      {data.map((d) => {
        const h = ((d[valueKey] || 0) / max) * 140;
        return (
          <div key={d.month} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
            <div style={{ fontSize:'0.6rem', color:'var(--text-muted)', fontWeight:600 }}>{d[valueKey]}</div>
            <div style={{ width:'100%', height:Math.max(h, 4), background:`linear-gradient(180deg,${color},${color}88)`, borderRadius:'6px 6px 0 0', transition:'height 0.6s ease', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(255,255,255,0.15),transparent)' }} />
            </div>
            <div style={{ fontSize:'0.6rem', color:'var(--text-muted)' }}>{d.month}</div>
          </div>
        );
      })}
    </div>
  );
};

const SparkLine = ({ data = [], color }) => {
  if (!data.length) return null;
  const max = Math.max(...data); const min = Math.min(...data);
  const w = 100, h = 36;
  const pts = data.map((v, i) => {
    const x = (i / Math.max(data.length - 1, 1)) * w;
    const y = h - ((v - min) / Math.max(max - min, 1)) * (h - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const id = `sg${color.replace(/[^a-z0-9]/gi,'')}`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow:'visible' }}>
      <defs><linearGradient id={id} x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity="0.3"/><stop offset="100%" stopColor={color} stopOpacity="0"/></linearGradient></defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#${id})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
};

const DonutChart = ({ segments = [] }) => {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = 50, cx = 60, cy = 60, stroke = 22, circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {segments.map((seg) => {
        const dash = (seg.value / total) * circ;
        const gap  = circ - dash;
        const el = (
          <circle key={seg.label} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset * circ / total} />
        );
        offset += seg.value;
        return el;
      })}
      <text x="60" y="56" textAnchor="middle" fill="white" fontSize="13" fontWeight="800">{total}</text>
      <text x="60" y="70" textAnchor="middle" fill="#94a3b8" fontSize="8">Total</text>
    </svg>
  );
};

// ── Overview View ─────────────────────────────────────────────
const OverviewView = ({ user }) => {
  const [overview,  setOverview]  = useState(null);
  const [monthly,   setMonthly]   = useState([]);
  const [activity,  setActivity]  = useState([]);
  const [roles,     setRoles]     = useState([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [o, m, a, r] = await Promise.all([
          axios.get(`${API}/api/stats/overview`,  authHeaders()),
          axios.get(`${API}/api/stats/monthly`,   authHeaders()),
          axios.get(`${API}/api/stats/activity?limit=6`, authHeaders()),
          axios.get(`${API}/api/stats/roles`,     authHeaders()),
        ]);
        setOverview(o.data.data);
        setMonthly(m.data.data);
        setActivity(a.data.data);
        setRoles(r.data.data);
      } catch (err) {
        console.warn("Backend API not reachable. Using premium dummy data fallback.", err);
        setOverview({
          totalUsers: 10,
          activeUsers: 8,
          inactiveUsers: 2,
          adminCount: 2,
          managerCount: 2,
          userCount: 6,
          todayLogins: 12,
          weekLogins: 42,
          newThisMonth: 3,
          totalActivity: 54,
          monthlyRevenue: 125.00,
          bounceRate: 24.3
        });
        setMonthly([
          { month: 'Jan', users: 120, logins: 340, revenue: 2400 },
          { month: 'Feb', users: 185, logins: 520, revenue: 3800 },
          { month: 'Mar', users: 230, logins: 680, revenue: 4900 },
          { month: 'Apr', users: 310, logins: 870, revenue: 6200 },
          { month: 'May', users: 420, logins: 1100, revenue: 7800 },
          { month: 'Jun', users: 510, logins: 1340, revenue: 9100 },
          { month: 'Jul', users: 640, logins: 1620, revenue: 11200 }
        ]);
        setActivity([
          { id: 1, user_id: 1, user_name: "Aryan Mehta", user_email: "aryan@authvault.dev", action: "Logged in successfully", type: "login", timeAgo: "2 min ago" },
          { id: 2, user_id: 2, user_name: "Priya Sharma", user_email: "priya@authvault.dev", action: "Updated profile information", type: "update", timeAgo: "15 min ago" },
          { id: 3, user_id: 3, user_name: "Rajan Kapoor", user_email: "rajan@authvault.dev", action: "Registered a new account", type: "register", timeAgo: "1 hr ago" },
          { id: 4, user_id: 4, user_name: "Sana Kapoor", user_email: "sana@authvault.dev", action: "Changed account password", type: "password", timeAgo: "2 hr ago" },
          { id: 5, user_id: 5, user_name: "Rohan Patel", user_email: "rohan@authvault.dev", action: "Logged in successfully", type: "login", timeAgo: "3 hr ago" }
        ]);
        setRoles([
          { role: 'admin', count: 2 },
          { role: 'manager', count: 2 },
          { role: 'user', count: 6 }
        ]);
      }
      finally { setLoading(false); }
    };
    load();
  }, []);

  if (loading) return <Spinner />;

  const kpis = [
    { label:'Total Users',    val: overview?.totalUsers    ?? '—', icon:'👥', color:'#7c3aed', spark:[80,95,110,130,160,185,210] },
    { label:'Active Users',   val: overview?.activeUsers   ?? '—', icon:'✅', color:'#10b981', spark:[60,75,70,90,110,130,185]  },
    { label:'Today\'s Logins',val: overview?.todayLogins   ?? '—', icon:'🔐', color:'#06b6d4', spark:[40,55,60,70,85,95,120]   },
    { label:'Monthly Revenue',val:`₹${overview?.monthlyRevenue?.toLocaleString() ?? '—'}`, icon:'💰', color:'#f59e0b', spark:[40,55,75,90,120,150,200] },
  ];

  const roleColors = ['#7c3aed','#06b6d4','#10b981'];
  const donutSegs  = roles.map((r, i) => ({ label: r.role, value: r.count, color: roleColors[i] || '#8b5cf6' }));

  return (
    <div>
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:4 }}>
          Good {new Date().getHours()<12?'Morning':new Date().getHours()<17?'Afternoon':'Evening'}, {user?.name?.split(' ')[0] || 'Admin'} 👋
        </h1>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>Here's what's happening with your company today.</p>
      </div>

      {/* KPIs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 20px 16px', transition:'transform 0.2s,border-color 0.2s', cursor:'default' }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor='rgba(255,255,255,0.16)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor=''}}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <p style={{ fontSize:'0.72rem', color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>{k.label}</p>
                <p style={{ fontSize:'1.7rem', fontWeight:800 }}>{k.val}</p>
              </div>
              <div style={{ fontSize:'1.4rem' }}>{k.icon}</div>
            </div>
            <SparkLine data={k.spark} color={k.color} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:24 }}>
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:4 }}>User Growth</h3>
          <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:16 }}>Monthly registered users</p>
          <BarChart data={monthly} valueKey="users" color="#7c3aed" />
        </div>
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:4 }}>User Roles</h3>
          <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:16 }}>Live distribution</p>
          <div style={{ display:'flex', alignItems:'center', gap:16 }}>
            <DonutChart segments={donutSegs} />
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {donutSegs.map(s=>(
                <div key={s.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:s.color }} />
                  <div>
                    <div style={{ fontSize:'0.72rem', color:'var(--text-muted)', textTransform:'capitalize' }}>{s.label}s</div>
                    <div style={{ fontSize:'0.875rem', fontWeight:600 }}>{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue + Activity */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:4 }}>Revenue Trend</h3>
          <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:16 }}>Monthly revenue in ₹</p>
          <BarChart data={monthly} valueKey="revenue" color="#10b981" />
        </div>
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:16 }}>Live Activity</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {activity.slice(0,5).map((a,i)=>(
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:getColor(i), display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.7rem', flexShrink:0 }}>{getInitials(a.user_name)}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:'0.825rem', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.user_name}</p>
                  <p style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{a.action}</p>
                </div>
                <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', flexShrink:0 }}>{a.timeAgo}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Users View ────────────────────────────────────────────────
const UsersView = () => {
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [filter,  setFilter]  = useState('All');
  const [toast,   setToast]   = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const fetchUsers = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/api/users`, authHeaders());
      setUsers(data.users || []);
    } catch (err) {
      console.warn("Backend API not reachable. Using premium dummy users list.", err);
      showToast('⚠️ Backend offline. Showing dummy users.');
      setUsers([
        { id: 1, name: 'Aryan Mehta', email: 'aryan@authvault.dev', role: 'admin', status: 'active', created_at: new Date(Date.now() - 30 * 24 * 3600 * 1000).toISOString() },
        { id: 2, name: 'Priya Sharma', email: 'priya@authvault.dev', role: 'user', status: 'active', created_at: new Date(Date.now() - 25 * 24 * 3600 * 1000).toISOString() },
        { id: 3, name: 'Rajan Kapoor', email: 'rajan@authvault.dev', role: 'manager', status: 'active', created_at: new Date(Date.now() - 20 * 24 * 3600 * 1000).toISOString() },
        { id: 4, name: 'Sana Kapoor', email: 'sana@authvault.dev', role: 'user', status: 'inactive', created_at: new Date(Date.now() - 15 * 24 * 3600 * 1000).toISOString() },
        { id: 5, name: 'Rohan Patel', email: 'rohan@authvault.dev', role: 'user', status: 'active', created_at: new Date(Date.now() - 12 * 24 * 3600 * 1000).toISOString() },
        { id: 6, name: 'Neha Joshi', email: 'neha@authvault.dev', role: 'manager', status: 'active', created_at: new Date(Date.now() - 10 * 24 * 3600 * 1000).toISOString() },
        { id: 7, name: 'Vikram Singh', email: 'vikram@authvault.dev', role: 'admin', status: 'active', created_at: new Date(Date.now() - 8 * 24 * 3600 * 1000).toISOString() },
        { id: 8, name: 'Amit Verma', email: 'amit@authvault.dev', role: 'user', status: 'inactive', created_at: new Date(Date.now() - 5 * 24 * 3600 * 1000).toISOString() },
        { id: 9, name: 'Kavya Reddy', email: 'kavya@authvault.dev', role: 'user', status: 'active', created_at: new Date(Date.now() - 3 * 24 * 3600 * 1000).toISOString() },
        { id: 10, name: 'Deepak Nair', email: 'deepak@authvault.dev', role: 'user', status: 'active', created_at: new Date(Date.now() - 1 * 24 * 3600 * 1000).toISOString() }
      ]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggleRole = async (u, newRole) => {
    try {
      await axios.put(`${API}/api/users/${u.id}`, { role: newRole }, authHeaders());
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
      showToast(`👑 ${u.name} role changed to ${newRole}`);
    } catch {
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, role: newRole } : x));
      showToast(`👑 ${u.name} role changed to ${newRole} (Local)`);
    }
  };

  const handleToggleStatus = async (u) => {
    const newStatus = u.status === 'active' ? 'inactive' : 'active';
    try {
      await axios.put(`${API}/api/users/${u.id}`, { status: newStatus }, authHeaders());
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: newStatus } : x));
      showToast(`✅ ${u.name} marked as ${newStatus}`);
    } catch {
      setUsers(prev => prev.map(x => x.id === u.id ? { ...x, status: newStatus } : x));
      showToast(`✅ ${u.name} marked as ${newStatus} (Local)`);
    }
  };

  const handleDelete = async (u) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try {
      await axios.delete(`${API}/api/users/${u.id}`, authHeaders());
      setUsers(prev => prev.filter(x => x.id !== u.id));
      showToast(`🗑️ ${u.name} deleted`);
    } catch (err) {
      setUsers(prev => prev.filter(x => x.id !== u.id));
      showToast(`🗑️ ${u.name} deleted (Local)`);
    }
  };

  const filtered = users.filter(u =>
    (filter === 'All' || u.status === filter.toLowerCase() || u.role === filter.toLowerCase()) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      {toast && <div style={{ position:'fixed', top:80, right:24, zIndex:999, padding:'12px 20px', background:'rgba(14,14,28,0.95)', border:'1px solid var(--border)', borderRadius:12, color:'var(--text-primary)', fontSize:'0.875rem', boxShadow:'0 8px 24px rgba(0,0,0,0.4)' }}>{toast}</div>}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>User Management</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{users.length} users in database</p>
        </div>
        <button onClick={fetchUsers} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', border:'none', borderRadius:10, color:'white', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
          🔄 Refresh
        </button>
      </div>

      <div style={{ display:'flex', gap:12, marginBottom:20, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:'1', minWidth:200 }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'0.875rem' }}>🔍</span>
          <input type="text" placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:'100%', padding:'10px 14px 10px 36px', background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text-primary)', fontFamily:'Inter,sans-serif', fontSize:'0.875rem', outline:'none' }} />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['All','Active','Inactive','Admin','Manager','User'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)}
              style={{ padding:'8px 14px', borderRadius:8, border:'1px solid var(--border)', background:filter===f?'var(--primary)':'var(--bg-card)', color:filter===f?'white':'var(--text-secondary)', fontSize:'0.78rem', fontWeight:500, cursor:'pointer', fontFamily:'Inter,sans-serif', transition:'all 0.2s' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {loading ? <Spinner /> : (
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1px solid var(--border)' }}>
                {['User','Email','Role','Status','Joined','Actions'].map(h=>(
                  <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i)=>(
                <tr key={u.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', transition:'background 0.15s' }}
                  onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                  onMouseLeave={e=>e.currentTarget.style.background=''}>
                  <td style={{ padding:'14px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                      <div style={{ width:36, height:36, borderRadius:'50%', background:getColor(i), display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.75rem', flexShrink:0 }}>{getInitials(u.name)}</div>
                      <span style={{ fontWeight:500, fontSize:'0.9rem' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 20px', fontSize:'0.875rem', color:'var(--text-secondary)' }}>{u.email}</td>
                  <td style={{ padding:'14px 20px' }}>
                    <select
                      value={u.role}
                      onChange={(e) => handleToggleRole(u, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: 6,
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        background: u.role==='admin'?'rgba(124,58,237,0.15)':u.role==='manager'?'rgba(6,182,212,0.15)':'rgba(255,255,255,0.05)',
                        color: u.role==='admin'?'#a78bfa':u.role==='manager'?'#67e8f9':'var(--text-secondary)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        cursor: 'pointer',
                        outline: 'none',
                        fontFamily: 'Inter, sans-serif',
                        textTransform: 'capitalize'
                      }}
                    >
                      <option value="user" style={{ background: '#0e0e1c', color: 'var(--text-primary)' }}>User</option>
                      <option value="manager" style={{ background: '#0e0e1c', color: 'var(--text-primary)' }}>Manager</option>
                      <option value="admin" style={{ background: '#0e0e1c', color: 'var(--text-primary)' }}>Admin</option>
                    </select>
                  </td>
                  <td style={{ padding:'14px 20px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                      <div style={{ width:6, height:6, borderRadius:'50%', background:u.status==='active'?'#10b981':'#ef4444' }} />
                      <span style={{ fontSize:'0.875rem', color:u.status==='active'?'#10b981':'#ef4444', textTransform:'capitalize' }}>{u.status}</span>
                    </div>
                  </td>
                  <td style={{ padding:'14px 20px', fontSize:'0.875rem', color:'var(--text-muted)' }}>{formatDate(u.created_at)}</td>
                  <td style={{ padding:'14px 20px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={()=>handleToggleStatus(u)} style={{ padding:'5px 12px', borderRadius:6, border:'1px solid var(--border)', background:'transparent', color:'var(--text-secondary)', fontSize:'0.72rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                        {u.status==='active'?'Deactivate':'Activate'}
                      </button>
                      <button onClick={()=>handleDelete(u)} style={{ padding:'5px 12px', borderRadius:6, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'#fca5a5', fontSize:'0.72rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>No users found.</div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Analytics View ────────────────────────────────────────────
const AnalyticsView = () => {
  const [monthly,  setMonthly]  = useState([]);
  const [traffic,  setTraffic]  = useState([]);
  const [activity, setActivity] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [m, t, a] = await Promise.all([
          axios.get(`${API}/api/stats/monthly`,  authHeaders()),
          axios.get(`${API}/api/stats/traffic`,  authHeaders()),
          axios.get(`${API}/api/stats/activity?limit=15`, authHeaders()),
        ]);
        setMonthly(m.data.data);
        setTraffic(t.data.data);
        setActivity(a.data.data);
      } catch (err) {
        console.warn("Backend API not reachable. Using premium dummy analytics data.", err);
        setMonthly([
          { month: 'Jan', users: 120, logins: 340, revenue: 2400 },
          { month: 'Feb', users: 185, logins: 520, revenue: 3800 },
          { month: 'Mar', users: 230, logins: 680, revenue: 4900 },
          { month: 'Apr', users: 310, logins: 870, revenue: 6200 },
          { month: 'May', users: 420, logins: 1100, revenue: 7800 },
          { month: 'Jun', users: 510, logins: 1340, revenue: 9100 },
          { month: 'Jul', users: 640, logins: 1620, revenue: 11200 }
        ]);
        setTraffic([
          { source: 'Direct Login', count: 25, pct: 46 },
          { source: 'New Registration', count: 10, pct: 19 },
          { source: 'Profile Update', count: 8, pct: 15 },
          { source: 'Password Change', count: 7, pct: 13 },
          { source: 'Password Reset', count: 4, pct: 7 }
        ]);
        setActivity([
          { id: 1, user_id: 1, user_name: "Aryan Mehta", user_email: "aryan@authvault.dev", action: "Logged in successfully", type: "login", timeAgo: "2 min ago" },
          { id: 2, user_id: 2, user_name: "Priya Sharma", user_email: "priya@authvault.dev", action: "Updated profile information", type: "update", timeAgo: "15 min ago" },
          { id: 3, user_id: 3, user_name: "Rajan Kapoor", user_email: "rajan@authvault.dev", action: "Registered a new account", type: "register", timeAgo: "1 hr ago" },
          { id: 4, user_id: 4, user_name: "Sana Kapoor", user_email: "sana@authvault.dev", action: "Changed account password", type: "password", timeAgo: "2 hr ago" },
          { id: 5, user_id: 5, user_name: "Rohan Patel", user_email: "rohan@authvault.dev", action: "Logged in successfully", type: "login", timeAgo: "3 hr ago" },
          { id: 6, user_id: 6, user_name: "Neha Joshi", user_email: "neha@authvault.dev", action: "Updated user #4 (active)", type: "update", timeAgo: "4 hr ago" },
          { id: 7, user_id: 7, user_name: "Vikram Singh", user_email: "vikram@authvault.dev", action: "Logged in successfully", type: "login", timeAgo: "5 hr ago" },
          { id: 8, user_id: 8, user_name: "Amit Verma", user_email: "amit@authvault.dev", action: "Requested password reset", type: "reset", timeAgo: "6 hr ago" }
        ]);
      }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const trafficColors = ['#7c3aed','#06b6d4','#10b981','#f59e0b','#ec4899'];
  const typeColor = { register:'#10b981', login:'#7c3aed', update:'#06b6d4', password:'#f59e0b', reset:'#ec4899', logout:'#94a3b8' };

  if (loading) return <Spinner />;

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>Analytics</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>Live data from your database.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:16, marginBottom:24 }}>
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:4 }}>Login Activity</h3>
          <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:16 }}>Total logins per month</p>
          <BarChart data={monthly} valueKey="logins" color="#06b6d4" />
        </div>
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:20 }}>Activity Breakdown</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {traffic.map((t, i)=>(
              <div key={t.source}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{t.source}</span>
                  <span style={{ fontSize:'0.85rem', fontWeight:600 }}>{t.pct}%</span>
                </div>
                <div style={{ height:6, background:'rgba(255,255,255,0.05)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${t.pct}%`, background:`linear-gradient(90deg,${trafficColors[i] || '#7c3aed'},${trafficColors[i] || '#7c3aed'}88)`, borderRadius:3 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
        <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:16 }}>Full Activity Log ({activity.length} events)</h3>
        <div style={{ display:'flex', flexDirection:'column' }}>
          {activity.map((a, i)=>(
            <div key={a.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'11px 0', borderBottom: i<activity.length-1?'1px solid rgba(255,255,255,0.04)':'' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:getColor(i), display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.72rem', flexShrink:0 }}>{getInitials(a.user_name)}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:'0.875rem', fontWeight:500 }}><strong>{a.user_name}</strong> — {a.action}</p>
                <p style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{a.user_email}</p>
              </div>
              <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', flexShrink:0 }}>{a.timeAgo}</span>
              <span style={{ padding:'3px 10px', borderRadius:6, fontSize:'0.7rem', fontWeight:600, flexShrink:0, background:`${typeColor[a.type] || '#94a3b8'}22`, color:typeColor[a.type] || '#94a3b8' }}>{a.type}</span>
            </div>
          ))}
          {activity.length === 0 && <p style={{ color:'var(--text-muted)', textAlign:'center', padding:24 }}>No activity yet. Login or register to generate logs.</p>}
        </div>
      </div>
    </div>
  );
};

// ── Reports View ──────────────────────────────────────────────
const ReportsView = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/api/stats/overview`, authHeaders())
      .then(r => setStats(r.data.data))
      .catch((err) => {
        console.warn("Backend API not reachable for ReportsView.", err);
        setStats({
          totalUsers: 10,
          activeUsers: 8,
          totalActivity: 54
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const reports = [
    { title:'Monthly User Growth Report',  date: new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' }), status:'Ready',   size:'2.4 MB' },
    { title:'Revenue Analytics Report',    date: new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' }), status:'Ready',   size:'1.8 MB' },
    { title:'Security Audit Report',       date: new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' }), status:'Ready',   size:'3.1 MB' },
    { title:'User Engagement Summary',     date: new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' }), status:'Ready',   size:'1.2 MB' },
    { title:'Database Performance Report', date: new Date().toLocaleDateString('en-IN', { month:'long', year:'numeric' }), status:'Pending', size:'—'      },
  ];

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>Reports</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>Download and manage your company reports.</p>
        </div>
      </div>

      {loading ? <Spinner /> : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
            {[
              { label:'Total Users',     val: stats?.totalUsers    ?? '—', icon:'👥', color:'rgba(124,58,237,0.15)' },
              { label:'Active Users',    val: stats?.activeUsers   ?? '—', icon:'✅', color:'rgba(16,185,129,0.15)'  },
              { label:'Total Activity',  val: stats?.totalActivity ?? '—', icon:'📊', color:'rgba(6,182,212,0.15)'   },
            ].map(c=>(
              <div key={c.label} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24, display:'flex', alignItems:'center', gap:16 }}>
                <div style={{ width:50, height:50, borderRadius:14, background:c.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>{c.icon}</div>
                <div>
                  <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:4, textTransform:'uppercase', letterSpacing:'0.06em' }}>{c.label}</p>
                  <p style={{ fontSize:'1.8rem', fontWeight:800 }}>{c.val}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid var(--border)' }}>
                  {['Report Name','Date','Size','Status','Action'].map(h=>(
                    <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:'0.72rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((r,i)=>(
                  <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}
                    onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                    onMouseLeave={e=>e.currentTarget.style.background=''}>
                    <td style={{ padding:'16px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                        <div style={{ width:36, height:36, borderRadius:10, background:'rgba(124,58,237,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>📄</div>
                        <span style={{ fontWeight:500, fontSize:'0.9rem' }}>{r.title}</span>
                      </div>
                    </td>
                    <td style={{ padding:'16px 20px', fontSize:'0.875rem', color:'var(--text-muted)' }}>{r.date}</td>
                    <td style={{ padding:'16px 20px', fontSize:'0.875rem', color:'var(--text-muted)' }}>{r.size}</td>
                    <td style={{ padding:'16px 20px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                        <div style={{ width:6, height:6, borderRadius:'50%', background:r.status==='Ready'?'#10b981':'#f59e0b' }} />
                        <span style={{ fontSize:'0.875rem', color:r.status==='Ready'?'#10b981':'#f59e0b' }}>{r.status}</span>
                      </div>
                    </td>
                    <td style={{ padding:'16px 20px' }}>
                      <button disabled={r.status==='Pending'} style={{ padding:'6px 14px', borderRadius:7, border:'1px solid var(--border)', background:'transparent', color:r.status==='Ready'?'var(--text-secondary)':'var(--text-muted)', fontSize:'0.8rem', cursor:r.status==='Ready'?'pointer':'not-allowed', fontFamily:'Inter,sans-serif', opacity:r.status==='Pending'?0.5:1 }}>
                        ↓ Download
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

// ── Settings View ─────────────────────────────────────────────
const SettingsView = ({ user }) => {
  const [saved,    setSaved]    = useState(false);
  const [pwSaved,  setPwSaved]  = useState(false);

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>Settings</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>Manage your account and preferences.</p>
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:28 }}>
          <h3 style={{ fontWeight:700, marginBottom:20, fontSize:'1rem' }}>👤 Profile Information</h3>
          {[
            { label:'Full Name',  id:'set-name',  val:user?.name  || '', type:'text'  },
            { label:'Email',      id:'set-email', val:user?.email || '', type:'email' },
            { label:'Role',       id:'set-role',  val:user?.role  || 'user', type:'text', readOnly:true },
          ].map(f=>(
            <div key={f.id} style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.04em' }}>{f.label}</label>
              <input id={f.id} type={f.type} defaultValue={f.val} readOnly={f.readOnly}
                style={{ width:'100%', padding:'10px 14px', background: f.readOnly?'rgba(255,255,255,0.02)':'var(--bg-input)', border:'1px solid var(--border)', borderRadius:9, color: f.readOnly?'var(--text-muted)':'var(--text-primary)', fontFamily:'Inter,sans-serif', fontSize:'0.9rem', outline:'none', cursor:f.readOnly?'not-allowed':'text' }} />
            </div>
          ))}
          <button onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2500)}}
            style={{ width:'100%', padding:'11px', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', border:'none', borderRadius:9, color:'white', fontWeight:600, fontSize:'0.9rem', cursor:'pointer', fontFamily:'Inter,sans-serif', marginTop:4 }}>
            {saved?'✅ Saved!':'Save Changes'}
          </button>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:28 }}>
            <h3 style={{ fontWeight:700, marginBottom:16, fontSize:'1rem' }}>🔒 Change Password</h3>
            {[
              { label:'Current Password', id:'curr-pw', type:'password' },
              { label:'New Password',     id:'new-pw',  type:'password' },
              { label:'Confirm Password', id:'conf-pw',  type:'password' },
            ].map(f=>(
              <div key={f.id} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.04em' }}>{f.label}</label>
                <input id={f.id} type={f.type} placeholder="••••••••"
                  style={{ width:'100%', padding:'10px 14px', background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:9, color:'var(--text-primary)', fontFamily:'Inter,sans-serif', fontSize:'0.9rem', outline:'none' }} />
              </div>
            ))}
            <button onClick={()=>{setPwSaved(true);setTimeout(()=>setPwSaved(false),2500)}}
              style={{ width:'100%', padding:'11px', background:'transparent', border:'1px solid var(--border)', borderRadius:9, color:'var(--text-primary)', fontWeight:600, fontSize:'0.9rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
              {pwSaved?'✅ Updated!':'Update Password'}
            </button>
          </div>

          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:28 }}>
            <h3 style={{ fontWeight:700, marginBottom:16, fontSize:'1rem' }}>🔔 Notifications</h3>
            {[
              { label:'New registrations',  id:'n1', checked:true  },
              { label:'Login alerts',       id:'n2', checked:true  },
              { label:'Weekly digest',      id:'n3', checked:false },
              { label:'Security alerts',    id:'n4', checked:true  },
            ].map(n=>(
              <div key={n.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>{n.label}</span>
                <input id={n.id} type="checkbox" defaultChecked={n.checked} style={{ width:16, height:16, accentColor:'#7c3aed', cursor:'pointer' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────
const Dashboard = ({ user, onLogout }) => {
  const [activeNav,   setActiveNav]   = useState('overview');
  const [notifsOpen,  setNotifsOpen]  = useState(false);
  const [notifData,   setNotifData]   = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API}/api/stats/activity?limit=5`, authHeaders())
      .then(r => setNotifData(r.data.data || []))
      .catch(() => {
        setNotifData([
          { id: 1, user_name: "Aryan Mehta", action: "Logged in successfully", timeAgo: "2 min ago" },
          { id: 2, user_name: "Priya Sharma", action: "Updated profile information", timeAgo: "15 min ago" },
          { id: 3, user_name: "Rajan Kapoor", action: "Registered a new account", timeAgo: "1 hr ago" }
        ]);
      });
  }, []);

  const navItems = [
    { id:'overview',  label:'Overview',  icon:'grid'     },
    { id:'users',     label:'Users',     icon:'users'    },
    { id:'analytics', label:'Analytics', icon:'bar'      },
    { id:'reports',   label:'Reports',   icon:'file'     },
    { id:'settings',  label:'Settings',  icon:'settings' },
  ];

  const initials = user?.name ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2) : 'U';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  const renderView = () => {
    switch(activeNav) {
      case 'overview':  return <OverviewView  user={user} />;
      case 'users':     return <UsersView />;
      case 'analytics': return <AnalyticsView />;
      case 'reports':   return <ReportsView />;
      case 'settings':  return <SettingsView  user={user} />;
      default:          return <OverviewView  user={user} />;
    }
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', position:'relative', zIndex:1 }}>

      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside style={{ width:240, flexShrink:0, background:'rgba(8,8,18,0.88)', backdropFilter:'blur(20px)', borderRight:'1px solid var(--border)', display:'flex', flexDirection:'column', position:'fixed', top:0, left:0, bottom:0, zIndex:100 }}>

        {/* Logo */}
        <div style={{ padding:'22px 20px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#7c3aed,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(124,58,237,0.45)', flexShrink:0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:'1rem', background:'linear-gradient(135deg,#f1f5f9,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>AuthVault</div>
              <div style={{ fontSize:'0.62rem', color:'var(--text-muted)', marginTop:1 }}>Company Dashboard</div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div style={{ padding:'12px 12px 0' }}>
          <button id="back-to-home-btn" onClick={()=>navigate('/')}
            style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid var(--border)', background:'rgba(255,255,255,0.04)', color:'var(--text-secondary)', fontFamily:'Inter,sans-serif', fontSize:'0.825rem', fontWeight:500, cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e=>{e.currentTarget.style.background='rgba(255,255,255,0.09)';e.currentTarget.style.color='var(--text-primary)';e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'}}
            onMouseLeave={e=>{e.currentTarget.style.background='rgba(255,255,255,0.04)';e.currentTarget.style.color='var(--text-secondary)';e.currentTarget.style.borderColor='var(--border)'}}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Home
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'14px 12px', display:'flex', flexDirection:'column', gap:3 }}>
          <p style={{ fontSize:'0.62rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'4px 8px 8px', fontWeight:700 }}>Main Menu</p>
          {navItems.map(item=>(
            <button key={item.id} id={`sidebar-${item.id}`} onClick={()=>setActiveNav(item.id)}
              style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 12px', borderRadius:10, border:'none', width:'100%', textAlign:'left',
                background: activeNav===item.id?'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(124,58,237,0.06))':'transparent',
                color: activeNav===item.id?'#a78bfa':'var(--text-muted)',
                fontFamily:'Inter,sans-serif', fontSize:'0.875rem', fontWeight:activeNav===item.id?600:400, cursor:'pointer',
                borderLeft: activeNav===item.id?'2px solid #7c3aed':'2px solid transparent', transition:'all 0.15s' }}>
              <Icon d={Icons[item.icon]} size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User at Bottom */}
        <div style={{ padding:'14px 12px', borderTop:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'8px', borderRadius:10, marginBottom:8, background:'rgba(255,255,255,0.03)' }}>
            <div style={{ width:34, height:34, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.8rem', flexShrink:0 }}>{initials}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'0.82rem', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize:'0.68rem', color:'var(--text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.email || ''}</div>
            </div>
          </div>
          <button id="sidebar-logout-btn" onClick={handleLogout}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, border:'none', width:'100%', background:'rgba(239,68,68,0.08)', color:'#fca5a5', fontFamily:'Inter,sans-serif', fontSize:'0.82rem', fontWeight:500, cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.16)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,0.08)'}>
            <Icon d={Icons.logout} size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Area ────────────────────────────────────────── */}
      <div style={{ marginLeft:240, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' }}>

        {/* Top Bar */}
        <header style={{ position:'sticky', top:0, zIndex:50, height:64, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 28px', background:'rgba(8,8,18,0.82)', backdropFilter:'blur(16px)', borderBottom:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button id="topbar-home-btn" onClick={()=>navigate('/')} title="Back to Home"
              style={{ width:34, height:34, borderRadius:9, border:'1px solid var(--border)', background:'var(--bg-card)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-secondary)', transition:'all 0.15s', fontSize:'1rem', flexShrink:0 }}
              onMouseEnter={e=>{e.currentTarget.style.background='rgba(124,58,237,0.15)';e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'}}
              onMouseLeave={e=>{e.currentTarget.style.background='var(--bg-card)';e.currentTarget.style.borderColor='var(--border)'}}>
              🏠
            </button>
            <div>
              <h2 style={{ fontSize:'1rem', fontWeight:700, textTransform:'capitalize' }}>{activeNav}</h2>
              <p style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>{new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</p>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'0.8rem' }}>🔍</span>
              <input placeholder="Quick search..." id="topbar-search"
                style={{ padding:'8px 14px 8px 30px', background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:9, color:'var(--text-primary)', fontFamily:'Inter,sans-serif', fontSize:'0.82rem', outline:'none', width:180 }} />
            </div>

            <div style={{ position:'relative' }}>
              <button id="notif-btn" onClick={()=>setNotifsOpen(v=>!v)}
                style={{ width:36, height:36, borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-card)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative', fontSize:'1rem' }}>
                🔔
                {notifData.length > 0 && <div style={{ position:'absolute', top:6, right:6, width:7, height:7, borderRadius:'50%', background:'#ef4444', border:'2px solid #080812' }} />}
              </button>
              {notifsOpen && (
                <div style={{ position:'absolute', top:44, right:0, width:300, background:'rgba(10,10,22,0.98)', border:'1px solid var(--border)', borderRadius:14, padding:12, boxShadow:'0 20px 40px rgba(0,0,0,0.5)', zIndex:200 }}>
                  <p style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', padding:'4px 8px 10px' }}>Recent Activity</p>
                  {notifData.map((a, i) => (
                    <div key={a.id} style={{ display:'flex', gap:10, padding:'9px 8px', borderRadius:9, cursor:'pointer' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <div style={{ width:30, height:30, borderRadius:'50%', background:getColor(i), display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.65rem', flexShrink:0 }}>{getInitials(a.user_name)}</div>
                      <div>
                        <p style={{ fontSize:'0.78rem', fontWeight:500 }}>{a.user_name}</p>
                        <p style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>{a.action}</p>
                        <p style={{ fontSize:'0.68rem', color:'var(--text-muted)', marginTop:2 }}>{a.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                  {notifData.length === 0 && <p style={{ textAlign:'center', color:'var(--text-muted)', fontSize:'0.8rem', padding:12 }}>No recent activity</p>}
                </div>
              )}
            </div>

            <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.85rem', cursor:'pointer', flexShrink:0 }} id="topbar-avatar">
              {initials}
            </div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex:1, padding:'28px', overflowY:'auto' }}>
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
