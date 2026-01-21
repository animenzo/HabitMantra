# 🧠 HabitMantra – MERN Habit Tracker & Notes Platform

![MERN Stack](https://img.shields.io/badge/MERN-Full%20Stack-success)
![Status](https://img.shields.io/badge/Status-Production%20Ready-blue)
![License](https://img.shields.io/badge/License-MIT-green)

> **HabitMantra** is a full-stack application designed to help users build habits consistently while tracking their progress visually. It combines powerful habit analytics with a Trello-style productivity system, focusing on real-world problems like user retention, data visualization, and secure access control.

---

## 🚀 Live Demo

- **Frontend:** [https://habit-mantra.vercel.app](https://habit-mantra.vercel.app)
- **Backend API:** [https://your-app-name.onrender.com](https://your-app-name.onrender.com) _(Replace with actual URL)_

---

## ✨ Key Features

### 🔐 Authentication & Security (Production Grade)
- **Hybrid Login:** Email/Password (JWT) & Google OAuth 2.0.
- **OTP Verification:** Secure email verification flows using Nodemailer.
- **Token Management:** Access & Refresh token rotation system for secure sessions.
- **Security:** Rate limiting, Helmet headers, CORS policies, and secure cookies.
- **Protected Routes:** Middleware guards for Dashboard, Notes, and Profile.

### 📊 Habit Tracking & Analytics
- **Visual Analytics:** Weekly, Monthly, and Yearly charts using Chart.js.
- **GitHub-Style Heatmap:** A standout feature visualizing consistency over the entire year (dynamically rendered).
- **Time Travel:** Navigate previous/next weeks and compare monthly performance.
- **Smart Summaries:** Backend aggregation pipelines generate insights.

### 🗂️ Notes & Productivity Canvas
- **Trello-like Interface:** Folder → File → Card → Block hierarchy.
- **Drag-and-Drop:** Built with `@dnd-kit` for moving blocks across cards.
- **Global Search:** Auto-scrolls and highlights blocks, cards, or files.
- **Rich Content:** Link detection and real-time state synchronization.

### 🎨 UI/UX Design
- **Glassmorphism:** Modern UI with Tailwind CSS.
- **Responsive:** Fully optimized for Mobile, Tablet, and Desktop.
- **Interactivity:** Smooth animations and micro-interactions.

---

## 🧱 Tech Stack

| Domain | Technologies |
| :--- | :--- |
| **Frontend** | React.js, React Router v6, Tailwind CSS, Context API, Chart.js, DND Kit, Axios |
| **Backend** | Node.js, Express.js, Mongoose, Nodemailer, Google Auth Library |
| **Database** | MongoDB Atlas (Aggregation Pipelines) |
| **Security** | JWT (Access/Refresh), BCrypt, Helmet, Express-Rate-Limit, CORS |
| **Deployment** | Vercel (Frontend), Render (Backend) |

---

## 🏗️ Architecture

The application follows a **clean separation of concerns**:
- **Backend:** Organized into Controllers, Routes, Middleware, Services, and Utils.
- **Frontend:** Modularized into Components, Contexts, Pages, and Services.

**Security Logic:**
Passwords are hashed using `bcrypt`. APIs are protected using a custom middleware that validates JWTs. If an access token expires, the system attempts to use a secure HTTP-only refresh token to maintain the user's session without forcing a logout.

---

## ⚙️ Environment Variables

To run this project locally, you will need to add the following environment variables to your `.env` files.

**Backend (`/backend/.env`)**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
CLIENT_URL=http://localhost:5173

Endpoint,Method,Description
/auth/signup,POST,Register user and trigger OTP
/auth/verify-otp,POST,Verify email via OTP
/auth/login,POST,Login & issue Access/Refresh tokens
/analytics/weekly,GET,Fetch aggregated weekly habit data
/analytics/heatmap,GET,Fetch yearly activity for heatmap
/notes/search,GET,Global search across all notes
/notes/cards,CRUD,Manage drag-and-drop cards

HabitMantra/
│
├── backend/
│   ├── controllers/   # Route logic
│   ├── middleware/    # Auth, Error handling, Rate limits
│   ├── models/        # Mongoose Schemas
│   ├── routes/        # API Endpoints
│   ├── services/      # Business logic (Email, OAuth)
│   └── utils/         # Helpers (Tokens, Date formatting)
│
└── frontend/
    ├── components/    # Reusable UI components
    ├── context/       # Global State (Auth, Notes)
    ├── pages/         # Application Views
    ├── services/      # API calls (Axios instances)
    └── utils/         # Helpers (DnD logic, Chart config)
