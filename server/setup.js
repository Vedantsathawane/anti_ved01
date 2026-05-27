// setup.js — Creates all DB tables and seeds sample data in one go
// Run with: npm run setup

require('dotenv').config();
const bcrypt = require('bcryptjs');
const mysql  = require('mysql2/promise');

const dbConfigNoDB = {
  host    : process.env.DB_HOST     || 'localhost',
  port    : parseInt(process.env.DB_PORT) || 3306,
  user    : process.env.DB_USER     || 'root',
  password: process.env.DB_PASSWORD || 'root',
};
const DB_NAME = process.env.DB_NAME || 'antigrav-users';

const sampleUsers = [
  { name:'Aryan Mehta',  email:'aryan@authvault.dev',  password:'Admin@123',  role:'admin',   status:'active'   },
  { name:'Priya Sharma', email:'priya@authvault.dev',  password:'User@1234',  role:'user',    status:'active'   },
  { name:'Rajan Kapoor', email:'rajan@authvault.dev',  password:'Manager@1',  role:'manager', status:'active'   },
  { name:'Sana Kapoor',  email:'sana@authvault.dev',   password:'User@5678',  role:'user',    status:'inactive' },
  { name:'Rohan Patel',  email:'rohan@authvault.dev',  password:'User@9012',  role:'user',    status:'active'   },
  { name:'Neha Joshi',   email:'neha@authvault.dev',   password:'Manager@2',  role:'manager', status:'active'   },
  { name:'Vikram Singh', email:'vikram@authvault.dev', password:'Admin@456',  role:'admin',   status:'active'   },
  { name:'Amit Verma',   email:'amit@authvault.dev',   password:'User@3456',  role:'user',    status:'inactive' },
  { name:'Kavya Reddy',  email:'kavya@authvault.dev',  password:'User@7890',  role:'user',    status:'active'   },
  { name:'Deepak Nair',  email:'deepak@authvault.dev', password:'User@1122',  role:'user',    status:'active'   },
];

const activityTypes = ['login','register','update','password','reset'];
const actions = {
  login:    'Logged in successfully',
  register: 'Registered a new account',
  update:   'Updated profile information',
  password: 'Changed account password',
  reset:    'Requested password reset',
};

async function setup() {
  let conn;
  try {
    // Connect without DB to create it if needed
    conn = await mysql.createConnection(dbConfigNoDB);
    console.log('✅ Connected to MySQL\n');

    // Create database
    await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await conn.query(`USE \`${DB_NAME}\``);
    console.log(`✅ Database '${DB_NAME}' ready\n`);

    // Drop & create tables
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    await conn.query('DROP TABLE IF EXISTS activity_logs');
    await conn.query('DROP TABLE IF EXISTS monthly_stats');
    await conn.query('DROP TABLE IF EXISTS users');
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    await conn.query(`
      CREATE TABLE users (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        name       VARCHAR(100) NOT NULL,
        email      VARCHAR(150) UNIQUE NOT NULL,
        password   VARCHAR(255) NOT NULL,
        role       ENUM('user','manager','admin') DEFAULT 'user',
        status     ENUM('active','inactive') DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    await conn.query(`
      CREATE TABLE activity_logs (
        id         INT AUTO_INCREMENT PRIMARY KEY,
        user_id    INT,
        user_name  VARCHAR(100),
        user_email VARCHAR(150),
        action     VARCHAR(255),
        type       ENUM('register','login','update','password','reset','logout') DEFAULT 'login',
        ip_address VARCHAR(50) DEFAULT '127.0.0.1',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `);

    await conn.query(`
      CREATE TABLE monthly_stats (
        id           INT AUTO_INCREMENT PRIMARY KEY,
        month_name   VARCHAR(10) NOT NULL,
        month_num    INT NOT NULL,
        year_num     INT NOT NULL,
        new_users    INT DEFAULT 0,
        total_logins INT DEFAULT 0,
        revenue      DECIMAL(10,2) DEFAULT 0.00
      )
    `);

    // Insert monthly stats
    const months = [
      ['Jan',1,2025,120,340,2400],['Feb',2,2025,185,520,3800],
      ['Mar',3,2025,230,680,4900],['Apr',4,2025,310,870,6200],
      ['May',5,2025,420,1100,7800],['Jun',6,2025,510,1340,9100],
      ['Jul',7,2025,640,1620,11200],
    ];
    for (const m of months) {
      await conn.query(
        'INSERT INTO monthly_stats (month_name,month_num,year_num,new_users,total_logins,revenue) VALUES (?,?,?,?,?,?)', m
      );
    }
    console.log('✅ Tables created & monthly stats inserted\n');

    // Seed users
    const insertedIds = [];
    for (const u of sampleUsers) {
      const hashed = await bcrypt.hash(u.password, 10);
      const [res] = await conn.query(
        'INSERT INTO users (name,email,password,role,status) VALUES (?,?,?,?,?)',
        [u.name, u.email, hashed, u.role, u.status]
      );
      insertedIds.push({ id: res.insertId, name: u.name, email: u.email });
      console.log(`  ✅ ${u.name} (${u.role})`);
    }

    // Seed activity logs
    console.log('\n📝 Seeding activity logs...');
    for (const user of insertedIds) {
      const count = Math.floor(Math.random() * 3) + 3;
      for (let i = 0; i < count; i++) {
        const type   = activityTypes[Math.floor(Math.random() * activityTypes.length)];
        const action = actions[type];
        const minsAgo = Math.floor(Math.random() * 300) + 1;
        const ts = new Date(Date.now() - minsAgo * 60 * 1000);
        await conn.query(
          'INSERT INTO activity_logs (user_id,user_name,user_email,action,type,created_at) VALUES (?,?,?,?,?,?)',
          [user.id, user.name, user.email, action, type, ts]
        );
      }
    }

    console.log('\n🎉 Setup complete!\n');
    console.log('─'.repeat(60));
    console.log('📋 Login Credentials:');
    console.log('─'.repeat(60));
    sampleUsers.forEach(u => {
      console.log(`  ${u.role.padEnd(8)} │ ${u.email.padEnd(28)} │ ${u.password}`);
    });
    console.log('─'.repeat(60));
    console.log('\n🚀 Now run: npm start\n');

  } catch (err) {
    console.error('❌ Setup error:', err.message);
  } finally {
    if (conn) await conn.end();
  }
}

setup();
