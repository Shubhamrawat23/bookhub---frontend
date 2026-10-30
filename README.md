# Bookhub Assignment Frontend

Frontend application for the Bookhub Author & Admin Support System built using React, Vite, TailwindCSS, Zustand, and React Router DOM. Features a secure cookie-based session management and real-time WebSocket chat.

---

# Live Demo Links

## Author Portal

https://bookhub-front-end.vercel.app    
 or  
https://bookhub-front-end.vercel.appp/author/login


---

## Admin Portal

https://bookhub-front-end.vercel.app/admin/login

---

## Backend API

https://bookhub-back-end-production.up.railway.app

---

# Test Credentials

## Author Portal

Email: sa001@email.com
Password: 123456

##### Note: You can create/update new password for other authors also through forgot password (https://bookhub-front-end.vercel.app/author/forgot-password)
---

## Admin Portal

### ADMIN 1

Email: admin_00001@bookhub.com  
Password: admin@123

### ADMIN 2

Email: admin_00002@bookhub.com
Password: admin002@123

---

# Project Overview

This frontend powers the Bookhub publishing support platform.

The application includes:

- Author Portal
- Admin Portal
- Book Dashboard
- Support Ticket System
- Real-time Ticket Chat System (WebSockets)
- Responsive Layouts
- Secure Session Persistence (HttpOnly Cookies)

The frontend communicates with the FastAPI backend through REST APIs and persistent WebSocket connections.


---

# Tech Stack

## Frontend

- React 19
- Vite
- TailwindCSS
- React Router DOM
- Zustand

---

# Deployment

- Vercel (Frontend Hosting)
- Railway (Backend API)
- Railway PostgreSQL (Database)

---

# Frontend Features

## Author Side

- Author login
- Forgot password
- Book dashboard
- Create support tickets
- View ticket history
- Real-time ticket messaging (WebSocket)

---

## Admin Side

- Admin login
- View all tickets
- Manage ticket status
- Real-time ticket chat management (WebSocket)

---

# Project Structure

```text
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── loginCard.jsx
│   │   ├── ticketCard.jsx
│   │   └── newTktModal.jsx
│   │
│   ├── layouts/
│   │   ├── authorLayout.jsx
│   │   └── adminLayout.jsx
│   │
│   ├── pages/
│   │   ├── author/
│   │   └── admin/
│   │
│   ├── routes/
│   │   └── routes.jsx
│   │
│   ├── store/
│   │   └── store.jsx
│   │
│   ├── config.js
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── README.md
```

---

# Frontend Architecture

The frontend follows a modular component-based architecture.

---

# Frontend Flow

```text
Pages
   ↓
Layouts
   ↓
Reusable Components
   ↓
API Calls & WebSocket Connections
   ↓
FastAPI Backend
```

---

# State Management & Session Handling

Zustand is used for lightweight global UI state management.

- Session Persistence: JWT tokens are securely managed by the browser via HttpOnly Cookies (prevents XSS attacks).
- Zustand Usage: Stores the user's profile data (name, role, ID) to render the UI.
- Auth Verification (/me): On layout mount, a request is sent to /auth/me to validate the cookie and re-hydrate Zustand. If unauthorized, the user is redirected to login.



---

# Routing System

React Router DOM is used for frontend routing.

Examples:

```text
/author/login
/admin/login
/author/books
/author/tickets
/admin/query-tickets
```

---

# Environment Variables

Create a `.env` file inside frontend root.

Example:

```env
VITE_BASE_URL=https://bookhub-back-end-production.up.railway.app
```

---

# Install Dependencies

Install frontend packages:

```bash
npm install
```

---

# Package Dependencies

```json
{
  "dependencies": {
    "@tailwindcss/vite": "^4.3.0",
    "react": "^19.2.6",
    "react-dom": "^19.2.6",
    "react-router-dom": "^7.15.1",
    "tailwindcss": "^4.3.0",
    "zustand": "^5.0.13"
  }
}
```

---

# Run Frontend Locally

Start development server:

```bash
npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# Build Frontend

```bash
npm run build
```

---

# Lint Frontend

```bash
npm run lint
```

---

# Backend Integration

The frontend integrates with FastAPI backend APIs hosted on Railway.

Features integrated:

- Authentication APIs (with credentials: "include")
- Books APIs
- Ticket APIs
- Admin APIs
- WebSocket APIs

---

# API & WebSocket Communication

The frontend communicates using Fetch API.

Examples:

```text
POST /auth/author/login
GET /author/book/list
POST /ticket/create
GET /ticket/author/list
```
(All API requests include credentials: "include" to pass the HttpOnly cookies).


### WebSocket Endpoints:
``` text
ws://domain/ticket/ws/author/chat/{ticket_code}
ws://domain/ticket/ws/admin/chat/{ticket_code}
```
(WebSocket connections automatically pass the HttpOnly cookie during the handshake).

---

# UI/UX Decisions

- Minimal clean dashboard design
- Responsive layouts
- Reusable component structure
- Lightweight state management
- Fast page navigation using React Router

---

# CORS Handling

CORS configuration handled between:

- Vercel frontend
- Railway backend

to allow secure frontend-backend communication. The backend is configured with allow_credentials=True and specific origins to support HttpOnly cookies.

---

# Known Limitations

- Access tokens expire in 60 minutes (requires re-login; no refresh token flow yet).
- No push notification system yet (only in-app chat updates).

---

# Future Improvements

- Implement Refresh Token rotation for seamless session extension.
- Add global error boundary for UI crashes.
- AI-assisted ticket categorization.


---

# Design Decisions

- React chosen for component reusability
- Vite used for fast development/build performance
- Zustand selected for lightweight global state
- TailwindCSS used for rapid UI development
- React Router DOM used for SPA routing
- HttpOnly Cookies chosen over LocalStorage for secure JWT storage

---

# Tradeoffs

- WebSockets chosen over HTTP polling for chat to provide instant updates and reduce server load.
- Focused on core functionality over heavy animations
- Lightweight authentication/session system used for MVP scope

---

# Production Improvements

If evolving this project further into production:

- Implement Refresh Token flow
- Add WebSocket reconnection logic with exponential backoff
- Add Sentry for error tracking
- Implement AI-assisted ticket categorization



---