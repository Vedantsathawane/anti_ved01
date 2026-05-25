import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  pie:      "M21.21 15.89A10 10 0 1 1 8 2.83M22 12A10 10 0 0 0 12 2v10z",
  settings: "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41",
  bell:     "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0",
  search:   "M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z",
  logout:   "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  trend:    "M23 6l-9.5 9.5-5-5L1 18M17 6h6v6",
  shield:   "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  file:     "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8",
  check:    "M20 6L9 17l-5-5",
  arrow:    "M5 12h14M12 5l7 7-7 7",
  dot:      "M12 12m-2 0a2 2 0 1 0 4 0 2 2 0 1 0-4 0",
  mail:     "M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm18 2l-10 7L2 6",
  home:     "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
};

// ── Sample Data ───────────────────────────────────────────────
const recentActivity = [
  { id:1, user:'Aryan Mehta',   action:'Registered a new account',        time:'2 min ago',  avatar:'AM', color:'#7c3aed', type:'register' },
  { id:2, user:'Priya Sharma',  action:'Logged in from Mumbai',            time:'8 min ago',  avatar:'PS', color:'#06b6d4', type:'login'    },
  { id:3, user:'Rajan Kapoor',  action:'Updated profile information',      time:'15 min ago', avatar:'RK', color:'#10b981', type:'update'   },
  { id:4, user:'Sana Kapoor',   action:'Changed account password',         time:'32 min ago', avatar:'SK', color:'#f59e0b', type:'password' },
  { id:5, user:'Rohan Patel',   action:'Logged in from Delhi',             time:'1 hr ago',   avatar:'RP', color:'#ec4899', type:'login'    },
  { id:6, user:'Neha Joshi',    action:'Registered a new account',         time:'2 hr ago',   avatar:'NJ', color:'#8b5cf6', type:'register' },
  { id:7, user:'Vikram Singh',  action:'Requested password reset',         time:'3 hr ago',   avatar:'VS', color:'#ef4444', type:'reset'    },
];

const usersData = [
  { id:1,  name:'Aryan Mehta',   email:'aryan@example.com',   role:'Admin',    status:'Active',   joined:'Jan 12, 2025', avatar:'AM', color:'#7c3aed' },
  { id:2,  name:'Priya Sharma',  email:'priya@example.com',   role:'User',     status:'Active',   joined:'Feb 03, 2025', avatar:'PS', color:'#06b6d4' },
  { id:3,  name:'Rajan Kapoor',  email:'rajan@example.com',   role:'Manager',  status:'Active',   joined:'Feb 18, 2025', avatar:'RK', color:'#10b981' },
  { id:4,  name:'Sana Kapoor',   email:'sana@example.com',    role:'User',     status:'Inactive', joined:'Mar 01, 2025', avatar:'SK', color:'#f59e0b' },
  { id:5,  name:'Rohan Patel',   email:'rohan@example.com',   role:'User',     status:'Active',   joined:'Mar 14, 2025', avatar:'RP', color:'#ec4899' },
  { id:6,  name:'Neha Joshi',    email:'neha@example.com',    role:'Manager',  status:'Active',   joined:'Apr 02, 2025', avatar:'NJ', color:'#8b5cf6' },
  { id:7,  name:'Vikram Singh',  email:'vikram@example.com',  role:'Admin',    status:'Active',   joined:'Apr 20, 2025', avatar:'VS', color:'#ef4444' },
  { id:8,  name:'Amit Verma',    email:'amit@example.com',    role:'User',     status:'Inactive', joined:'May 05, 2025', avatar:'AV', color:'#0891b2' },
  { id:9,  name:'Kavya Reddy',   email:'kavya@example.com',   role:'User',     status:'Active',   joined:'May 12, 2025', avatar:'KR', color:'#7c3aed' },
  { id:10, name:'Deepak Nair',   email:'deepak@example.com',  role:'User',     status:'Active',   joined:'May 20, 2025', avatar:'DN', color:'#10b981' },
];

const monthlyData = [
  { month:'Jan', users:120, logins:340, revenue:2400 },
  { month:'Feb', users:185, logins:520, revenue:3800 },
  { month:'Mar', users:230, logins:680, revenue:4900 },
  { month:'Apr', users:310, logins:870, revenue:6200 },
  { month:'May', users:420, logins:1100,revenue:7800 },
  { month:'Jun', users:510, logins:1340,revenue:9100 },
  { month:'Jul', users:640, logins:1620,revenue:11200 },
];

const reports = [
  { id:1, title:'Monthly User Growth Report',  date:'May 25, 2025', status:'Ready',   size:'2.4 MB', type:'PDF' },
  { id:2, title:'Revenue Analytics Q2 2025',   date:'May 20, 2025', status:'Ready',   size:'1.8 MB', type:'PDF' },
  { id:3, title:'Security Audit Report',        date:'May 15, 2025', status:'Ready',   size:'3.1 MB', type:'PDF' },
  { id:4, title:'User Engagement Summary',      date:'May 10, 2025', status:'Ready',   size:'1.2 MB', type:'PDF' },
  { id:5, title:'Database Performance Report',  date:'May 01, 2025', status:'Pending', size:'—',      type:'PDF' },
];

// ── Bar Chart (CSS) ───────────────────────────────────────────
const BarChart = ({ data, valueKey, color }) => {
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div style={{ display:'flex', alignItems:'flex-end', gap:8, height:160, paddingTop:8 }}>
      {data.map((d) => {
        const h = (d[valueKey] / max) * 140;
        return (
          <div key={d.month} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
            <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', fontWeight:600 }}>{d[valueKey]}</div>
            <div style={{ width:'100%', height:h, background:`linear-gradient(180deg,${color},${color}88)`, borderRadius:'6px 6px 0 0', transition:'height 0.5s ease', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(255,255,255,0.15),transparent)' }} />
            </div>
            <div style={{ fontSize:'0.65rem', color:'var(--text-muted)' }}>{d.month}</div>
          </div>
        );
      })}
    </div>
  );
};

// ── Mini Line Chart (SVG) ─────────────────────────────────────
const SparkLine = ({ data, color }) => {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const w = 120, h = 40;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / (max - min + 1)) * h;
    return `${x},${y}`;
  }).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow:'visible' }}>
      <defs>
        <linearGradient id={`sg-${color.replace('#','')}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3"/>
          <stop offset="100%" stopColor={color} stopOpacity="0"/>
        </linearGradient>
      </defs>
      <polygon points={`0,${h} ${pts} ${w},${h}`} fill={`url(#sg-${color.replace('#','')})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
};

// ── Donut Chart ───────────────────────────────────────────────
const DonutChart = ({ segments }) => {
  const total = segments.reduce((s, x) => s + x.value, 0);
  let offset = 0;
  const r = 50, cx = 60, cy = 60, stroke = 22;
  const circ = 2 * Math.PI * r;
  return (
    <svg width="120" height="120" viewBox="0 0 120 120">
      {segments.map((seg) => {
        const dash = (seg.value / total) * circ;
        const gap = circ - dash;
        const el = (
          <circle key={seg.label} cx={cx} cy={cy} r={r}
            fill="none" stroke={seg.color} strokeWidth={stroke}
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset * circ / total}
            style={{ transition: 'stroke-dasharray 0.6s ease' }}
          />
        );
        offset += seg.value;
        return el;
      })}
      <text x="60" y="56" textAnchor="middle" fill="white" fontSize="14" fontWeight="800">{total}</text>
      <text x="60" y="70" textAnchor="middle" fill="#94a3b8" fontSize="8">Users</text>
    </svg>
  );
};

// ── Overview View ─────────────────────────────────────────────
const OverviewView = ({ user }) => {
  const kpis = [
    { label:'Total Users',    val:'10,284', change:'+12.5%', up:true,  icon:'👥', color:'#7c3aed', spark:[80,95,110,130,160,185,210] },
    { label:'Active Sessions', val:'1,847',  change:'+8.2%',  up:true,  icon:'⚡', color:'#06b6d4', spark:[60,75,70,90,110,130,185] },
    { label:'Monthly Revenue', val:'₹9,140', change:'+18.3%', up:true,  icon:'💰', color:'#10b981', spark:[40,55,75,90,120,150,200] },
    { label:'Bounce Rate',    val:'24.3%',  change:'-3.1%',  up:false, icon:'📉', color:'#f59e0b', spark:[80,75,72,68,64,60,55] },
  ];

  return (
    <div>
      {/* Welcome */}
      <div style={{ marginBottom:28 }}>
        <h1 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:4 }}>
          Good {new Date().getHours()<12?'Morning':new Date().getHours()<17?'Afternoon':'Evening'}, {user?.name?.split(' ')[0] || 'Admin'} 👋
        </h1>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem' }}>
          Here's what's happening with your company today.
        </p>
      </div>

      {/* KPI Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {kpis.map((k) => (
          <div key={k.label} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:'20px 20px 16px', transition:'transform 0.2s,border-color 0.2s', cursor:'default' }}
            onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-3px)';e.currentTarget.style.borderColor='rgba(255,255,255,0.16)'}}
            onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.borderColor=''}}
          >
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <div>
                <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.06em' }}>{k.label}</p>
                <p style={{ fontSize:'1.7rem', fontWeight:800 }}>{k.val}</p>
              </div>
              <div style={{ fontSize:'1.4rem' }}>{k.icon}</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:'0.78rem', color: k.up ? '#10b981' : '#ef4444', fontWeight:600 }}>
                {k.up ? '↑' : '↓'} {k.change} vs last month
              </span>
              <SparkLine data={k.spark} color={k.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:24 }}>
        {/* Bar Chart */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
            <div>
              <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:2 }}>User Growth</h3>
              <p style={{ fontSize:'0.8rem', color:'var(--text-muted)' }}>Monthly registered users</p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {['7D','1M','6M'].map((t,i)=>(
                <button key={t} style={{ padding:'4px 10px', borderRadius:6, border:'1px solid var(--border)', background: i===2?'var(--primary)':'transparent', color: i===2?'white':'var(--text-muted)', fontSize:'0.75rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>{t}</button>
              ))}
            </div>
          </div>
          <BarChart data={monthlyData} valueKey="users" color="#7c3aed" />
        </div>

        {/* Donut */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:4 }}>User Roles</h3>
          <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:20 }}>Distribution by role</p>
          <div style={{ display:'flex', alignItems:'center', gap:20 }}>
            <DonutChart segments={[
              { label:'Users',    value:7820, color:'#7c3aed' },
              { label:'Managers', value:1840, color:'#06b6d4' },
              { label:'Admins',   value:624,  color:'#10b981' },
            ]} />
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              {[
                { label:'Users',    val:'7,820', color:'#7c3aed' },
                { label:'Managers', val:'1,840', color:'#06b6d4' },
                { label:'Admins',   val:'624',   color:'#10b981' },
              ].map(s=>(
                <div key={s.label} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:10, height:10, borderRadius:3, background:s.color, flexShrink:0 }} />
                  <div>
                    <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{s.label}</div>
                    <div style={{ fontSize:'0.875rem', fontWeight:600 }}>{s.val}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Revenue + Activity */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        {/* Revenue Chart */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:4 }}>Revenue Trend</h3>
          <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:16 }}>Monthly revenue in ₹</p>
          <BarChart data={monthlyData} valueKey="revenue" color="#10b981" />
        </div>

        {/* Recent Activity */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:16 }}>Recent Activity</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {recentActivity.slice(0,5).map(a=>(
              <div key={a.id} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:34, height:34, borderRadius:'50%', background:a.color, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.7rem', flexShrink:0 }}>{a.avatar}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontSize:'0.825rem', fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{a.user}</p>
                  <p style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{a.action}</p>
                </div>
                <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', flexShrink:0 }}>{a.time}</span>
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
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');

  const filtered = usersData.filter(u =>
    (filter === 'All' || u.status === filter || u.role === filter) &&
    (u.name.toLowerCase().includes(search.toLowerCase()) ||
     u.email.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
        <div>
          <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>User Management</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>{usersData.length} total users registered</p>
        </div>
        <button style={{ padding:'10px 20px', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', border:'none', borderRadius:10, color:'white', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'Inter,sans-serif', display:'flex', alignItems:'center', gap:8 }} id="add-user-btn">
          + Add User
        </button>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:12, marginBottom:20, alignItems:'center', flexWrap:'wrap' }}>
        <div style={{ position:'relative', flex:'1', minWidth:200 }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'0.875rem' }}>🔍</span>
          <input id="users-search" type="text" placeholder="Search users..." value={search} onChange={e=>setSearch(e.target.value)}
            style={{ width:'100%', padding:'10px 14px 10px 36px', background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:10, color:'var(--text-primary)', fontFamily:'Inter,sans-serif', fontSize:'0.875rem', outline:'none' }} />
        </div>
        <div style={{ display:'flex', gap:6 }}>
          {['All','Active','Inactive','Admin','Manager'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} id={`filter-${f.toLowerCase()}`}
              style={{ padding:'8px 14px', borderRadius:8, border:'1px solid var(--border)', background:filter===f?'var(--primary)':'var(--bg-card)', color:filter===f?'white':'var(--text-secondary)', fontSize:'0.8rem', fontWeight:500, cursor:'pointer', fontFamily:'Inter,sans-serif', transition:'all 0.2s' }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr style={{ borderBottom:'1px solid var(--border)' }}>
              {['User','Email','Role','Status','Joined','Actions'].map(h=>(
                <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u,i)=>(
              <tr key={u.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', transition:'background 0.15s' }}
                onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
                onMouseLeave={e=>e.currentTarget.style.background=''}>
                <td style={{ padding:'14px 20px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:'50%', background:u.color, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.75rem', flexShrink:0 }}>{u.avatar}</div>
                    <span style={{ fontWeight:500, fontSize:'0.9rem' }}>{u.name}</span>
                  </div>
                </td>
                <td style={{ padding:'14px 20px', fontSize:'0.875rem', color:'var(--text-secondary)' }}>{u.email}</td>
                <td style={{ padding:'14px 20px' }}>
                  <span style={{ padding:'3px 10px', borderRadius:6, fontSize:'0.75rem', fontWeight:600,
                    background: u.role==='Admin'?'rgba(124,58,237,0.15)':u.role==='Manager'?'rgba(6,182,212,0.15)':'rgba(255,255,255,0.05)',
                    color: u.role==='Admin'?'#a78bfa':u.role==='Manager'?'#67e8f9':'var(--text-secondary)'
                  }}>{u.role}</span>
                </td>
                <td style={{ padding:'14px 20px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                    <div style={{ width:6, height:6, borderRadius:'50%', background:u.status==='Active'?'#10b981':'#ef4444' }} />
                    <span style={{ fontSize:'0.875rem', color:u.status==='Active'?'#10b981':'#ef4444' }}>{u.status}</span>
                  </div>
                </td>
                <td style={{ padding:'14px 20px', fontSize:'0.875rem', color:'var(--text-muted)' }}>{u.joined}</td>
                <td style={{ padding:'14px 20px' }}>
                  <div style={{ display:'flex', gap:6 }}>
                    <button style={{ padding:'5px 12px', borderRadius:6, border:'1px solid var(--border)', background:'transparent', color:'var(--text-secondary)', fontSize:'0.75rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Edit</button>
                    <button style={{ padding:'5px 12px', borderRadius:6, border:'1px solid rgba(239,68,68,0.3)', background:'rgba(239,68,68,0.08)', color:'#fca5a5', fontSize:'0.75rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>Remove</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div style={{ textAlign:'center', padding:'40px', color:'var(--text-muted)' }}>
            No users found matching your search.
          </div>
        )}
      </div>
    </div>
  );
};

// ── Analytics View ────────────────────────────────────────────
const AnalyticsView = () => {
  const metrics = [
    { label:'Page Views',      val:'284,921', change:'+22%', color:'#7c3aed', spark:[100,130,120,160,190,210,250] },
    { label:'Unique Visitors', val:'42,830',  change:'+14%', color:'#06b6d4', spark:[60,80,75,100,120,135,160]  },
    { label:'Avg Session',     val:'4m 32s',  change:'+5%',  color:'#10b981', spark:[40,45,42,55,60,62,72]      },
    { label:'Conversion Rate', val:'3.84%',   change:'+1.2%',color:'#f59e0b', spark:[20,25,28,30,35,38,45]      },
  ];

  const traffic = [
    { source:'Organic Search', pct:42, color:'#7c3aed' },
    { source:'Direct',         pct:28, color:'#06b6d4' },
    { source:'Social Media',   pct:18, color:'#10b981' },
    { source:'Referrals',      pct:12, color:'#f59e0b' },
  ];

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>Analytics</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>Track your platform's performance and user behaviour.</p>
      </div>

      {/* Metric Cards */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
        {metrics.map(m=>(
          <div key={m.label} style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:'20px' }}>
            <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>{m.label}</p>
            <p style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:8 }}>{m.val}</p>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:'0.78rem', color:'#10b981', fontWeight:600 }}>↑ {m.change}</span>
              <SparkLine data={m.spark} color={m.color} />
            </div>
          </div>
        ))}
      </div>

      {/* Logins Bar Chart */}
      <div style={{ display:'grid', gridTemplateColumns:'3fr 2fr', gap:16, marginBottom:24 }}>
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:4 }}>Daily Logins</h3>
          <p style={{ fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:16 }}>Login activity per month</p>
          <BarChart data={monthlyData} valueKey="logins" color="#06b6d4" />
        </div>

        {/* Traffic Sources */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
          <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:20 }}>Traffic Sources</h3>
          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {traffic.map(t=>(
              <div key={t.source}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                  <span style={{ fontSize:'0.85rem', color:'var(--text-secondary)' }}>{t.source}</span>
                  <span style={{ fontSize:'0.85rem', fontWeight:600 }}>{t.pct}%</span>
                </div>
                <div style={{ height:6, background:'rgba(255,255,255,0.05)', borderRadius:3, overflow:'hidden' }}>
                  <div style={{ height:'100%', width:`${t.pct}%`, background:`linear-gradient(90deg,${t.color},${t.color}88)`, borderRadius:3, transition:'width 0.8s ease' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Full */}
      <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:24 }}>
        <h3 style={{ fontWeight:700, fontSize:'1rem', marginBottom:16 }}>Full Activity Log</h3>
        <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
          {recentActivity.map((a,i)=>(
            <div key={a.id} style={{ display:'flex', alignItems:'center', gap:14, padding:'12px 0', borderBottom: i<recentActivity.length-1?'1px solid rgba(255,255,255,0.04)':'' }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:a.color, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.75rem', flexShrink:0 }}>{a.avatar}</div>
              <div style={{ flex:1 }}>
                <p style={{ fontSize:'0.875rem', fontWeight:500 }}><strong>{a.user}</strong> — {a.action}</p>
              </div>
              <span style={{ fontSize:'0.78rem', color:'var(--text-muted)', flexShrink:0 }}>{a.time}</span>
              <span style={{ padding:'3px 10px', borderRadius:6, fontSize:'0.7rem', fontWeight:600, flexShrink:0,
                background: a.type==='register'?'rgba(16,185,129,0.15)':a.type==='login'?'rgba(124,58,237,0.15)':'rgba(255,255,255,0.06)',
                color: a.type==='register'?'#6ee7b7':a.type==='login'?'#a78bfa':'var(--text-muted)'
              }}>{a.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ── Reports View ──────────────────────────────────────────────
const ReportsView = () => (
  <div>
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24 }}>
      <div>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>Reports</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>Download and manage your company reports.</p>
      </div>
      <button style={{ padding:'10px 20px', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', border:'none', borderRadius:10, color:'white', fontWeight:600, fontSize:'0.875rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }} id="generate-report-btn">
        + Generate Report
      </button>
    </div>

    {/* Summary Cards */}
    <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16, marginBottom:24 }}>
      {[
        { label:'Total Reports', val:'24',   icon:'📄', color:'rgba(124,58,237,0.15)' },
        { label:'Ready',         val:'22',   icon:'✅', color:'rgba(16,185,129,0.15)' },
        { label:'Pending',       val:'2',    icon:'⏳', color:'rgba(245,158,11,0.15)' },
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

    {/* Reports Table */}
    <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, overflow:'hidden' }}>
      <table style={{ width:'100%', borderCollapse:'collapse' }}>
        <thead>
          <tr style={{ borderBottom:'1px solid var(--border)' }}>
            {['Report Name','Date','Type','Size','Status','Action'].map(h=>(
              <th key={h} style={{ padding:'14px 20px', textAlign:'left', fontSize:'0.75rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {reports.map((r,i)=>(
            <tr key={r.id} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', transition:'background 0.15s' }}
              onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.03)'}
              onMouseLeave={e=>e.currentTarget.style.background=''}>
              <td style={{ padding:'16px 20px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                  <div style={{ width:36, height:36, borderRadius:10, background:'rgba(124,58,237,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem' }}>📄</div>
                  <span style={{ fontWeight:500, fontSize:'0.9rem' }}>{r.title}</span>
                </div>
              </td>
              <td style={{ padding:'16px 20px', fontSize:'0.875rem', color:'var(--text-muted)' }}>{r.date}</td>
              <td style={{ padding:'16px 20px' }}><span style={{ padding:'3px 10px', borderRadius:6, fontSize:'0.75rem', fontWeight:600, background:'rgba(124,58,237,0.12)', color:'#a78bfa' }}>{r.type}</span></td>
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
  </div>
);

// ── Settings View ─────────────────────────────────────────────
const SettingsView = ({ user }) => {
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div style={{ marginBottom:24 }}>
        <h1 style={{ fontSize:'1.5rem', fontWeight:800, marginBottom:4 }}>Settings</h1>
        <p style={{ color:'var(--text-secondary)', fontSize:'0.875rem' }}>Manage your account and company preferences.</p>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
        {/* Profile Settings */}
        <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:28 }}>
          <h3 style={{ fontWeight:700, marginBottom:20, fontSize:'1rem' }}>👤 Profile Information</h3>
          {[
            { label:'Full Name',   id:'set-name',    val:user?.name  || '',    type:'text'  },
            { label:'Email',       id:'set-email',   val:user?.email || '',    type:'email' },
            { label:'Job Title',   id:'set-title',   val:'Administrator',      type:'text'  },
            { label:'Department',  id:'set-dept',    val:'Engineering',        type:'text'  },
          ].map(f=>(
            <div key={f.id} style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.04em' }}>{f.label}</label>
              <input id={f.id} type={f.type} defaultValue={f.val}
                style={{ width:'100%', padding:'10px 14px', background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:9, color:'var(--text-primary)', fontFamily:'Inter,sans-serif', fontSize:'0.9rem', outline:'none' }} />
            </div>
          ))}
          <button id="save-profile-btn" onClick={()=>{setSaved(true);setTimeout(()=>setSaved(false),2000)}}
            style={{ width:'100%', padding:'11px', background:'linear-gradient(135deg,#7c3aed,#5b21b6)', border:'none', borderRadius:9, color:'white', fontWeight:600, fontSize:'0.9rem', cursor:'pointer', fontFamily:'Inter,sans-serif', marginTop:4 }}>
            {saved ? '✅ Saved!' : 'Save Changes'}
          </button>
        </div>

        {/* Security */}
        <div style={{ display:'flex', flexDirection:'column', gap:20 }}>
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:28 }}>
            <h3 style={{ fontWeight:700, marginBottom:16, fontSize:'1rem' }}>🔒 Security</h3>
            {[
              { label:'Current Password', id:'set-curr-pw', type:'password', val:'••••••••' },
              { label:'New Password',     id:'set-new-pw',  type:'password', val:'' },
              { label:'Confirm Password', id:'set-conf-pw', type:'password', val:'' },
            ].map(f=>(
              <div key={f.id} style={{ marginBottom:14 }}>
                <label style={{ display:'block', fontSize:'0.8rem', color:'var(--text-muted)', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.04em' }}>{f.label}</label>
                <input id={f.id} type={f.type} defaultValue={f.val}
                  style={{ width:'100%', padding:'10px 14px', background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:9, color:'var(--text-primary)', fontFamily:'Inter,sans-serif', fontSize:'0.9rem', outline:'none' }} />
              </div>
            ))}
            <button id="change-password-btn" style={{ width:'100%', padding:'11px', background:'transparent', border:'1px solid var(--border)', borderRadius:9, color:'var(--text-primary)', fontWeight:600, fontSize:'0.9rem', cursor:'pointer', fontFamily:'Inter,sans-serif' }}>
              Update Password
            </button>
          </div>

          {/* Notifications */}
          <div style={{ background:'var(--bg-card)', border:'1px solid var(--border)', borderRadius:16, padding:28 }}>
            <h3 style={{ fontWeight:700, marginBottom:16, fontSize:'1rem' }}>🔔 Notifications</h3>
            {[
              { label:'New user registrations', id:'notif-register', checked:true  },
              { label:'Login alerts',           id:'notif-login',    checked:true  },
              { label:'Weekly digest email',    id:'notif-digest',   checked:false },
              { label:'Security alerts',        id:'notif-security', checked:true  },
            ].map(n=>(
              <div key={n.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'10px 0', borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ fontSize:'0.875rem', color:'var(--text-secondary)' }}>{n.label}</span>
                <input id={n.id} type="checkbox" defaultChecked={n.checked}
                  style={{ width:16, height:16, accentColor:'#7c3aed', cursor:'pointer' }} />
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
  const [activeNav, setActiveNav] = useState('overview');
  const [notifsOpen, setNotifsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { id:'overview',  label:'Overview',  icon:'grid'     },
    { id:'users',     label:'Users',     icon:'users'    },
    { id:'analytics', label:'Analytics', icon:'bar'      },
    { id:'reports',   label:'Reports',   icon:'file'     },
    { id:'settings',  label:'Settings',  icon:'settings' },
  ];

  const initials = user?.name
    ? user.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2)
    : 'U';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    onLogout();
    navigate('/');
  };

  const renderView = () => {
    switch(activeNav) {
      case 'overview':  return <OverviewView user={user} />;
      case 'users':     return <UsersView />;
      case 'analytics': return <AnalyticsView />;
      case 'reports':   return <ReportsView />;
      case 'settings':  return <SettingsView user={user} />;
      default:          return <OverviewView user={user} />;
    }
  };

  return (
    <div style={{ display:'flex', minHeight:'100vh', position:'relative', zIndex:1 }}>

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside style={{
        width:240, flexShrink:0,
        background:'rgba(8,8,18,0.85)',
        backdropFilter:'blur(20px)',
        borderRight:'1px solid var(--border)',
        display:'flex', flexDirection:'column',
        position:'fixed', top:0, left:0, bottom:0, zIndex:100
      }}>
        {/* Logo */}
        <div style={{ padding:'24px 20px', borderBottom:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:11, background:'linear-gradient(135deg,#7c3aed,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 4px 14px rgba(124,58,237,0.45)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
              </svg>
            </div>
            <div>
              <div style={{ fontWeight:800, fontSize:'1rem', background:'linear-gradient(135deg,#f1f5f9,#a78bfa)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>AuthVault</div>
              <div style={{ fontSize:'0.65rem', color:'var(--text-muted)', marginTop:1 }}>Company Dashboard</div>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div style={{ padding:'12px 12px 0' }}>
          <button
            id="back-to-home-btn"
            onClick={() => navigate('/')}
            style={{ display:'flex', alignItems:'center', gap:8, width:'100%', padding:'10px 12px', borderRadius:10, border:'1px solid var(--border)', background:'rgba(255,255,255,0.04)', color:'var(--text-secondary)', fontFamily:'Inter,sans-serif', fontSize:'0.825rem', fontWeight:500, cursor:'pointer', transition:'all 0.15s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color='var(--text-primary)'; e.currentTarget.style.borderColor='rgba(255,255,255,0.18)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.borderColor='var(--border)'; }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Home
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'16px 12px', display:'flex', flexDirection:'column', gap:4 }}>
          <p style={{ fontSize:'0.65rem', color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.1em', padding:'4px 8px 8px', fontWeight:700 }}>Main Menu</p>
          {navItems.map(item=>(
            <button key={item.id} id={`sidebar-${item.id}`} onClick={()=>setActiveNav(item.id)}
              style={{
                display:'flex', alignItems:'center', gap:12,
                padding:'11px 12px', borderRadius:10,
                border:'none', width:'100%', textAlign:'left',
                background: activeNav===item.id ? 'linear-gradient(135deg,rgba(124,58,237,0.2),rgba(124,58,237,0.08))' : 'transparent',
                color: activeNav===item.id ? '#a78bfa' : 'var(--text-muted)',
                fontFamily:'Inter,sans-serif', fontSize:'0.875rem', fontWeight: activeNav===item.id ? 600 : 400,
                cursor:'pointer',
                borderLeft: activeNav===item.id ? '2px solid #7c3aed' : '2px solid transparent',
                transition:'all 0.15s'
              }}>
              <Icon d={Icons[item.icon]} size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* User Profile at Bottom */}
        <div style={{ padding:'16px 12px', borderTop:'1px solid var(--border)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 8px', borderRadius:10, marginBottom:8 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.8rem', flexShrink:0 }}>{initials}</div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'0.85rem', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{user?.email || ''}</div>
            </div>
          </div>
          <button id="sidebar-logout-btn" onClick={handleLogout}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:10, border:'none', width:'100%', background:'rgba(239,68,68,0.08)', color:'#fca5a5', fontFamily:'Inter,sans-serif', fontSize:'0.825rem', fontWeight:500, cursor:'pointer', transition:'background 0.15s' }}
            onMouseEnter={e=>e.currentTarget.style.background='rgba(239,68,68,0.15)'}
            onMouseLeave={e=>e.currentTarget.style.background='rgba(239,68,68,0.08)'}>
            <Icon d={Icons.logout} size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main Area ─────────────────────────────────────────── */}
      <div style={{ marginLeft:240, flex:1, display:'flex', flexDirection:'column', minHeight:'100vh' }}>

        {/* Top Bar */}
        <header style={{
          position:'sticky', top:0, zIndex:50,
          height:64, display:'flex', alignItems:'center', justifyContent:'space-between',
          padding:'0 28px',
          background:'rgba(8,8,18,0.8)',
          backdropFilter:'blur(16px)',
          borderBottom:'1px solid var(--border)'
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:14 }}>
            <button
              id="topbar-home-btn"
              onClick={() => navigate('/')}
              title="Back to Home"
              style={{ width:36, height:36, borderRadius:9, border:'1px solid var(--border)', background:'var(--bg-card)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'var(--text-secondary)', transition:'all 0.15s', flexShrink:0 }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(124,58,237,0.15)'; e.currentTarget.style.color='#a78bfa'; e.currentTarget.style.borderColor='rgba(124,58,237,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='var(--bg-card)'; e.currentTarget.style.color='var(--text-secondary)'; e.currentTarget.style.borderColor='var(--border)'; }}
            >
              🏠
            </button>
            <div>
              <h2 style={{ fontSize:'1rem', fontWeight:700, textTransform:'capitalize' }}>{activeNav}</h2>
              <p style={{ fontSize:'0.72rem', color:'var(--text-muted)' }}>
                {new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}
              </p>
            </div>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            {/* Search */}
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--text-muted)', fontSize:'0.8rem' }}>🔍</span>
              <input placeholder="Quick search..." id="topbar-search"
                style={{ padding:'8px 14px 8px 30px', background:'var(--bg-input)', border:'1px solid var(--border)', borderRadius:9, color:'var(--text-primary)', fontFamily:'Inter,sans-serif', fontSize:'0.825rem', outline:'none', width:200 }} />
            </div>

            {/* Notifications */}
            <div style={{ position:'relative' }}>
              <button id="notif-btn" onClick={()=>setNotifsOpen(v=>!v)}
                style={{ width:38, height:38, borderRadius:10, border:'1px solid var(--border)', background:'var(--bg-card)', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', position:'relative' }}>
                🔔
                <div style={{ position:'absolute', top:6, right:6, width:8, height:8, borderRadius:'50%', background:'#ef4444', border:'2px solid #080812' }} />
              </button>
              {notifsOpen && (
                <div style={{ position:'absolute', top:44, right:0, width:300, background:'rgba(14,14,28,0.98)', border:'1px solid var(--border)', borderRadius:14, padding:12, boxShadow:'0 20px 40px rgba(0,0,0,0.5)', zIndex:200 }}>
                  <p style={{ fontSize:'0.8rem', fontWeight:700, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.06em', padding:'4px 8px 10px' }}>Notifications</p>
                  {recentActivity.slice(0,4).map(a=>(
                    <div key={a.id} style={{ display:'flex', gap:10, padding:'10px 8px', borderRadius:9, transition:'background 0.15s', cursor:'pointer' }}
                      onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.04)'}
                      onMouseLeave={e=>e.currentTarget.style.background=''}>
                      <div style={{ width:30, height:30, borderRadius:'50%', background:a.color, display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.65rem', flexShrink:0 }}>{a.avatar}</div>
                      <div>
                        <p style={{ fontSize:'0.8rem', fontWeight:500 }}>{a.user}</p>
                        <p style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{a.action}</p>
                        <p style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:2 }}>{a.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Avatar */}
            <div style={{ width:38, height:38, borderRadius:'50%', background:'linear-gradient(135deg,#7c3aed,#06b6d4)', display:'flex', alignItems:'center', justifyContent:'center', color:'white', fontWeight:700, fontSize:'0.85rem', cursor:'pointer' }} id="topbar-avatar">
              {initials}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex:1, padding:'28px', overflowY:'auto' }}>
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
