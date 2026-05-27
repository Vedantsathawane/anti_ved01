// seed.js — Seeds the database with sample users and activity logs
// Run with: npm run seed

require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql  = require('mysql2/promise');

const dbConfig = {
  host    : process.env.DB_HOST     || 'localhost',
  port    : process.env.DB_PORT     || 3306,
  user    : process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME     || 'antigrav-users',
};

const sampleUsers = [
  { name: 'Aryan Mehta',  email: 'aryan@authvault.dev',  password: 'Admin@123',    role: 'admin',   status: 'active'   },
  { name: 'Priya Sharma', email: 'priya@authvault.dev',  password: 'User@1234',    role: 'user',    status: 'active'   },
  { name: 'Rajan Kapoor', email: 'rajan@authvault.dev',  password: 'Manager@1',    role: 'manager', status: 'active'   },
  { name: 'Sana Kapoor',  email: 'sana@authvault.dev',   password: 'User@5678',    role: 'user',    status: 'inactive' },
  { name: 'Rohan Patel',  email: 'rohan@authvault.dev',  password: 'User@9012',    role: 'user',    status: 'active'   },
  { name: 'Neha Joshi',   email: 'neha@authvault.dev',   password: 'Manager@2',    role: 'manager', status: 'active'   },
  { name: 'Vikram Singh', email: 'vikram@authvault.dev', password: 'Admin@456',    role: 'admin',   status: 'active'   },
  { name: 'Amit Verma',   email: 'amit@authvault.dev',   password: 'User@3456',    role: 'user',    status: 'inactive' },
  { name: 'Kavya Reddy',  email: 'kavya@authvault.dev',  password: 'User@7890',    role: 'user',    status: 'active'   },
  { name: 'Deepak Nair',  email: 'deepak@authvault.dev', password: 'User@1122',    role: 'user',    status: 'active'   },
];

const activityTypes = ['login', 'register', 'update', 'password', 'reset'];
const actions = {
  login:    'Logged in successfully',
  register: 'Registered a new account',
  update:   'Updated profile information',
  password: 'Changed account password',
  reset:    'Requested password reset',
};

async function seed() {
  const conn = await mysql.createConnection(dbConfig);
  console.log('✅ Connected to MySQL\n');

  try {
    // Clear existing data
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('TRUNCATE TABLE activity_logs');
    await conn.query('TRUNCATE TABLE users');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🧹 Cleared existing data\n');

    // Insert users
    const insertedIds = [];
    for (const u of sampleUsers) {
      const hashed = await bcrypt.hash(u.password, 10);
      const [res] = await conn.query(
        'INSERT INTO users (name, email, password, role, status) VALUES (?, ?, ?, ?, ?)',
        [u.name, u.email, hashed, u.role, u.status]
      );
      insertedIds.push({ id: res.insertId, name: u.name, email: u.email });
      console.log(`  ✅ Created user: ${u.name} (${u.email}) — role: ${u.role}`);
    }

    // Insert activity logs (3–5 per user)
    console.log('\n📝 Seeding activity logs...');
    for (const user of insertedIds) {
      const count = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < count; i++) {
        const type   = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const action = actions[type];
        const minsAgo = Math.floor(Math.random() * 180) + 1;
        const ts = new Date(Date.now() - minsAgo * 60 * 1000);
        await conn.query(
          'INSERT INTO activity_logs (user_id, user_name, user_email, action, type, created_at) VALUES (?, ?, ?, ?, ?, ?)',
          [user.id, user.name, user.email, action, type, ts]
        );
      }
    }
    console.log('  ✅ Activity logs seeded\n');

    console.log('🎉 Database seeded successfully!\n');
    console.log('📋 Login credentials:');
    console.log('─'.repeat(55));
    sampleUsers.forEach(u => {
      console.log(`  ${u.role.padEnd(8)} | ${u.email.padEnd(25)} | ${u.password}`);
    });
    console.log('─'.repeat(55));
  } catch (err) {
    console.error('❌ Seed error:', err.message);
  } finally {
    await conn.end();
  }
}

seed();
