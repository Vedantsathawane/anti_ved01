// models/statsModel.js — Database queries for dashboard stats
const { pool } = require('../config/db');

const statsModel = {
  // Overview KPIs
  async getOverview() {
    const [[{ totalUsers }]]   = await pool.query('SELECT COUNT(*) AS totalUsers FROM users');
    const [[{ activeUsers }]]  = await pool.query("SELECT COUNT(*) AS activeUsers FROM users WHERE status='active'");
    const [[{ adminCount }]]   = await pool.query("SELECT COUNT(*) AS adminCount FROM users WHERE role='admin'");
    const [[{ managerCount }]] = await pool.query("SELECT COUNT(*) AS managerCount FROM users WHERE role='manager'");
    const [[{ todayLogins }]]  = await pool.query(
      "SELECT COUNT(*) AS todayLogins FROM activity_logs WHERE type='login' AND DATE(created_at)=CURDATE()"
    );
    const [[{ weekLogins }]] = await pool.query(
      "SELECT COUNT(*) AS weekLogins FROM activity_logs WHERE type='login' AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)"
    );
    const [[{ newThisMonth }]] = await pool.query(
      "SELECT COUNT(*) AS newThisMonth FROM users WHERE MONTH(created_at)=MONTH(CURDATE()) AND YEAR(created_at)=YEAR(CURDATE())"
    );
    const [[{ totalActivity }]] = await pool.query('SELECT COUNT(*) AS totalActivity FROM activity_logs');

    return {
      totalUsers,
      activeUsers,
      inactiveUsers: totalUsers - activeUsers,
      adminCount,
      managerCount,
      userCount: totalUsers - adminCount - managerCount,
      todayLogins,
      weekLogins,
      newThisMonth,
      totalActivity,
      monthlyRevenue: parseFloat((totalUsers * 12.5).toFixed(2)),
      bounceRate: 24.3,
    };
  },

  // Monthly chart data
  async getMonthly() {
    const [rows] = await pool.query(
      'SELECT month_name AS month, new_users AS users, total_logins AS logins, revenue FROM monthly_stats ORDER BY year_num, month_num'
    );
    return rows;
  },

  // Recent activity log
  async getActivity(limit = 20) {
    const [rows] = await pool.query(
      `SELECT id, user_id, user_name, user_email, action, type,
              TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS mins_ago,
              created_at
       FROM activity_logs
       ORDER BY created_at DESC
       LIMIT ?`,
      [limit]
    );
    return rows.map(r => ({
      ...r,
      timeAgo: formatTimeAgo(r.mins_ago),
    }));
  },

  // Traffic sources (computed from activity types)
  async getTrafficSources() {
    const [rows] = await pool.query(
      "SELECT type, COUNT(*) AS count FROM activity_logs GROUP BY type ORDER BY count DESC"
    );
    const total = rows.reduce((s, r) => s + r.count, 0) || 1;
    const sourceMap = {
      login:    'Direct Login',
      register: 'New Registration',
      update:   'Profile Update',
      password: 'Password Change',
      reset:    'Password Reset',
      logout:   'Logout Event',
    };
    return rows.map(r => ({
      source: sourceMap[r.type] || r.type,
      count:  r.count,
      pct:    Math.round((r.count / total) * 100),
    }));
  },

  // Role distribution
  async getRoleDistribution() {
    const [rows] = await pool.query(
      "SELECT role, COUNT(*) AS count FROM users GROUP BY role"
    );
    return rows;
  },
};

function formatTimeAgo(mins) {
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins} min ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)} hr ago`;
  return `${Math.floor(mins / 1440)} days ago`;
}

module.exports = statsModel;
