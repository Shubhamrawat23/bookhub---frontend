# BookLeaf Assignment Frontend

Frontend application for the BookLeaf Author & Admin Support System built using React, Vite, TailwindCSS, Zustand, and React Router DOM.

---

# Live Demo Links

## Author Portal

https://bookleafpub-frontend.vercel.app  
 or  
https://bookleafpub-frontend.vercel.app/author/login


---

## Admin Portal

https://bookleafpub-frontend.vercel.app/admin/login

---

## Backend API

https://bookleafpub-backend-production.up.railway.app

---

# Test Credentials

## Author Portal

Email: priya.sharma@email.com  
Password: 123456

##### Note: You can create/update new password for other authors also through forgot password (https://bookleafpub-frontend.vercel.app/author/forgot-password)
---

## Admin Portal

### ADMIN 1

Email: admin_00001@bookleafpub.com  
Password: admin@123

### ADMIN 2

Email: admin_00002@bookleafpub.com  
Password: admin002@123

---

# Project Overview

This frontend powers the BookLeaf publishing support platform.

The application includes:

- Author Portal
- Admin Portal
- Book Dashboard
- Support Ticket System
- Ticket Chat System
- Responsive Layouts
- Session Persistence using Zustand

The frontend communicates with the FastAPI backend through REST APIs.

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
- Ticket messaging system

---

## Admin Side

- Admin login
- View all tickets
- Manage ticket status
- Ticket chat management

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
API Calls
   ↓
FastAPI Backend
```

---

# State Management

Zustand is used for lightweight global state management.

Features handled through Zustand:

- Author session persistence
- Admin session persistence
- Ticket state handling
- LocalStorage persistence

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
VITE_BASE_URL=https://bookleafpub-backend-production.up.railway.app
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

- Authentication APIs
- Books APIs
- Ticket APIs
- Admin APIs

---

# Session Handling

Current implementation uses:

- Zustand store
- LocalStorage persistence

This allows:

- Persistent login sessions
- Role-based frontend access
- Session restore after refresh

---

# API Communication

The frontend communicates using Fetch API.

Examples:

```text
POST /auth/author/login
GET /author/book/list
POST /ticket/create
GET /ticket/author/list
```

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

to allow secure frontend-backend communication.

---

# Known Limitations

- JWT authentication not implemented yet
- Polling used instead of WebSockets
- Basic session persistence
- No notification system yet
- No advanced search/filter system yet

---

# Future Improvements

- JWT authentication
- Protected route middleware
- WebSocket real-time messaging
- Notification system
- Better error boundaries
- Infinite scroll/pagination
- Dark mode
- AI-assisted ticket categorization

---

# Design Decisions

- React chosen for component reusability
- Vite used for fast development/build performance
- Zustand selected for lightweight global state
- TailwindCSS used for rapid UI development
- React Router DOM used for SPA routing

---

# Tradeoffs

- Polling used instead of WebSockets for assignment simplicity
- Focused on core functionality over heavy animations
- Lightweight authentication/session system used for MVP scope

---

# Production Improvements

If evolving this project further into production:

- JWT refresh token flow
- RBAC authorization
- WebSocket-based live updates
- Redis caching layer
- Dockerized deployment
- CI/CD pipeline
- Centralized monitoring/logging
- Better accessibility support

---

Built as part of the BookLeaf Full Stack Assignment.