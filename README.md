🧠 HabitMantra – MERN Habit Tracker & Notes Platform

“HabitMantra is a full-stack MERN application designed to help users build habits consistently while tracking their progress visually.
It includes secure authentication, habit analytics, a GitHub-style heatmap, and a Trello-like notes system with drag-and-drop functionality.
The project focuses on real-world problems like user retention, data visualization, and secure access control.”

🏗️ Architecture Explanation

“The frontend is built with React and Tailwind CSS, while the backend uses Node.js, Express, and MongoDB.
The application follows a clean separation of concerns — controllers, routes, middleware, and services on the backend, and reusable components, contexts, and utilities on the frontend.”

🔐 Authentication (Important Interview Topic)

“I implemented a production-grade authentication system using JWT with both access and refresh tokens.
Users can sign up using email and password, verify their account via OTP sent to email, or sign in using Google OAuth.
Protected routes like Dashboard, Notes, and Profile are guarded using a PrivateRoute component and backend middleware.”

Key points to mention:

OTP verification via email

Google OAuth

Refresh tokens stored securely

Rate limiting on auth routes

Logout & session handling

📊 Habit Tracking & Analytics

“Users can create habits and mark them as completed daily.
This data is aggregated on the backend using MongoDB aggregation pipelines to generate weekly, monthly, and yearly analytics.”

Mention confidently:

Weekly / Monthly / Yearly charts

Bar & line charts

Previous / next navigation

Heatmap visualization

🔥 Heatmap Feature (Stand-out Point)

“One unique feature is a GitHub-style activity heatmap that visualizes habit consistency over time.
Each month dynamically renders the exact number of days, with spacing between months, similar to LeetCode or GitHub contributions.”

This shows:

Attention to detail

UI logic

Date handling skills

📝 Notes & Drag-and-Drop Canvas

“I also built a Trello-like notes system where users can organize content into folders, files, cards, and blocks.
Blocks can be dragged and dropped across cards using DnD Kit, with real-time state updates and backend synchronization.”

Extra brownie points:

Global search across notes

Auto-scroll & highlight on search

Link detection inside notes

🎨 UI / UX Design

“The UI uses glassmorphism and smooth animations, especially in the authentication flow.
The entire app is fully responsive and mobile-friendly, including charts and drag-and-drop layouts.”

🧪 Security & Best Practices

“I added multiple security layers including Helmet, CORS configuration, rate limiting for OTP and login, and protected APIs using JWT middleware.”

🚀 Deployment

“The frontend is deployed on Vercel, the backend on Render, and MongoDB Atlas is used for the database.
I handled CORS issues, environment variables, and production deployment constraints.”

The project focuses on real-world architecture, authentication security, analytics visualization, and smooth UX, making it a production-ready personal productivity tool.

🚀 Live Demo

🔗 Frontend: https://habit-mantra.vercel.app

🔗 Backend API: https://<your-backend>.onrender.com

✨ Key Features
🔐 Authentication & Security

Email + Password authentication (JWT based)

OTP verification via email during signup

Forgot password with secure reset flow

Google Sign-In (OAuth 2.0)

Access & Refresh token system

Protected routes (Dashboard, Notes, Profile)

Logout with token invalidation

Rate-limiting for auth & OTP endpoints

Secure cookies, CORS, Helmet security headers

📊 Habit Tracking & Analytics

Daily, weekly, monthly, and yearly habit tracking

Interactive bar charts & line charts

Heatmap view (GitHub / LeetCode style) for year-long activity

Weekly navigation (previous / next week)

Monthly comparisons between two months

Smart analytics summaries

Fully responsive charts (mobile → desktop)

🗂️ Notes & Productivity System

Folder → File → Card → Block hierarchy

Drag-and-drop blocks across cards

Real-time UI updates

Highlight & auto-scroll to searched blocks

Search across:

Blocks

Cards

Files

Folders

Rich text link detection

Minimal Trello-like canvas experience

🎨 UI / UX

Modern glassmorphism UI

Fully responsive (mobile, tablet, desktop)

Animated authentication screens

Clean dashboards with Tailwind CSS

Smooth transitions and micro-interactions

Dark-friendly color palette

🧱 Tech Stack
Frontend

React.js

React Router v6

Context API (Auth & Notes state)

Tailwind CSS

Chart.js

DND Kit

Axios

Backend

Node.js

Express.js

MongoDB + Mongoose

JWT (Access + Refresh tokens)

Nodemailer (OTP & reset emails)

Google OAuth

Rate Limiting

Helmet, CORS, Cookie Parser

Deployment

Frontend: Vercel

Backend: Render

Database: MongoDB Atlas

📁 Project Structure
HabitMantra/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   └── index.js
│
├── frontend/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── routes/
│   ├── services/
│   └── utils/
│
└── README.md

🔒 Authentication Flow

User signs up → OTP sent to email

OTP verification → account activated

Login generates access + refresh tokens

Protected routes guarded using PrivateRoute

Tokens stored securely

Logout clears session

Google OAuth available as alternative login

📊 Analytics Flow

Backend aggregates habit completion using MongoDB pipelines

Data returned per:

Week

Month

Year

Frontend renders charts dynamically

Heatmap adapts per month (28–31 days)

Navigation controls for time-based exploration

🧪 API Highlights
Endpoint	Method	Description
/auth/signup	POST	Signup with OTP
/auth/verify-otp	POST	Verify email OTP
/auth/login	POST	Login
/auth/google	POST	Google Sign-In
/analytics/weekly	GET	Weekly habit data
/analytics/monthly	GET	Monthly habit data
/analytics/yearly	GET	Yearly summary
/notes/search	GET	Global search
/notes/cards	CRUD	Card management
🛡️ Security Considerations

Passwords hashed with bcrypt

OTP expiry enforcement

Refresh token rotation

Rate-limit protection

Secure headers via Helmet

Strict CORS policy

Environment-based secrets

⚙️ Environment Variables
Backend
MONGO_URI=
JWT_SECRET=
JWT_REFRESH_SECRET=
EMAIL_USER=
EMAIL_PASS=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

Frontend
VITE_API_URL=
VITE_GOOGLE_CLIENT_ID=

🧠 What I Learned From This Project

Designing secure authentication systems

Handling CORS & deployment pitfalls

Building scalable MongoDB analytics

Creating complex responsive UIs

Managing global app state cleanly

Implementing drag-and-drop UX

Deploying full-stack apps professionally
