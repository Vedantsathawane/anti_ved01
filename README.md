# AuthVault — React + Express MVC Auth App

A full-stack authentication application with Login and Sign-Up forms.

## Project Structure

```
auth-app/
├── client/     # React (Vite) frontend
└── server/     # Express.js MVC backend
```

## Backend MVC Layout

```
server/
├── config/
│   └── jwt.js              # JWT secret & expiry
├── models/
│   └── userModel.js        # User data + bcrypt password logic
├── controllers/
│   └── authController.js   # register / login / getProfile handlers
├── routes/
│   └── authRoutes.js       # Express route definitions
├── middleware/
│   └── authMiddleware.js   # JWT Bearer token verification
└── server.js               # App entry point
```

## API Endpoints

| Method | Endpoint              | Access    | Description          |
|--------|-----------------------|-----------|----------------------|
| POST   | /api/auth/register    | Public    | Create a new account |
| POST   | /api/auth/login       | Public    | Login, get JWT       |
| GET    | /api/auth/profile     | Protected | Get user profile     |
| GET    | /api/health           | Public    | Health check         |

## Running the App

### 1. Start the Backend Server

```bash
cd server
npm install   # (already done)
node server.js
# → http://localhost:5000
```

### 2. Start the Frontend

```bash
cd client
npm run dev
# → http://localhost:5173
```

### 3. Open Browser

Navigate to **http://localhost:5173**

## Features

- ✅ Register with name, email, password
- ✅ Login with email + password
- ✅ Password strength meter
- ✅ Show/hide password toggle
- ✅ JWT authentication (stored in localStorage)
- ✅ Session restored on page refresh
- ✅ Protected dashboard after login
- ✅ Sign out
- ✅ Glassmorphism dark UI

## Tech Stack

- **Frontend**: React 18 + Vite + Axios
- **Backend**: Node.js + Express.js
- **Auth**: JWT + bcryptjs
- **Pattern**: MVC (Model-View-Controller)
