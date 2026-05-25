# 🛡️ AuthVault — Full-Stack Auth App

A modern, production-ready authentication system built with **React + Vite** (frontend) and **Express MVC + MySQL** (backend).

## 🌐 Live Demo
> Deploy on Vercel using the guide below.

---

## ✨ Features
- 🔐 JWT Authentication
- 🛡️ bcrypt Password Hashing
- 🗄️ MySQL Database with Connection Pooling
- 🧱 MVC Architecture (Express.js)
- 📱 Fully Responsive Dark Glassmorphism UI
- 📊 Company Dashboard with Charts & Analytics
- 🗺️ Multi-page (Home, Features, Pricing, About, Contact, Auth, Dashboard)

---

## 🗂️ Project Structure

```
auth-app/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── components/   # Navbar, Footer, LoginForm, SignupForm
│   │   ├── pages/        # All pages (Home, Dashboard, etc.)
│   │   └── services/     # API service layer
│   └── .env.example
├── server/          # Express MVC backend
│   ├── config/      # DB + JWT config
│   ├── controllers/ # Business logic
│   ├── models/      # Database queries
│   ├── routes/      # API routes
│   ├── middleware/  # Auth middleware
│   ├── database.sql # MySQL schema
│   └── .env.example
└── .gitignore
```

---

## 🚀 Local Setup

### 1. MySQL Setup
Run `server/database.sql` in MySQL Workbench to create the database.

### 2. Backend
```bash
cd server
cp .env.example .env    # Fill in your DB credentials
npm install
npm start               # Runs on http://localhost:5000
```

### 3. Frontend
```bash
cd client
npm install
npm run dev             # Runs on http://localhost:5173
```

---

## ☁️ Deploy on Vercel

### Backend
1. Import `server/` folder as a new Vercel project
2. Add environment variables (from `.env.example`)
3. Deploy → copy the URL (e.g. `https://your-api.vercel.app`)

### Frontend
1. Import `client/` folder as a new Vercel project
2. Add env variable: `VITE_API_URL=https://your-api.vercel.app/api/auth`
3. Deploy 🎉

---

## 🔑 Environment Variables

### Backend (`server/.env`)
| Variable | Description |
|---|---|
| `DB_HOST` | MySQL host |
| `DB_USER` | MySQL username |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret key for JWT |
| `FRONTEND_URL` | Your frontend Vercel URL |

### Frontend (`client/.env.local`)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Your backend API URL |

---

## 📄 License
MIT
