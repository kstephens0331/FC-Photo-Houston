# FC Photo Houston

## Overview

FC Photo Houston is a full-stack photography studio platform built for a professional Houston-based photography business. The application provides a modern client-facing experience with gallery browsing, customer registration, and service booking, backed by a robust Express API with PostgreSQL persistence. The platform is designed as a Progressive Web App (PWA) for seamless mobile and desktop access.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 (Create React App) |
| Styling | Tailwind CSS 3, Framer Motion |
| Authentication | Firebase Auth |
| Backend | Express 5, Node.js |
| Database | PostgreSQL, Prisma ORM |
| Image Processing | Sharp, Multer |
| Auth Tokens | JSON Web Tokens (JWT) |
| Cloud Services | Supabase SDK |

## Features

- **Client Gallery with Lightbox** -- Browse curated photo collections with a responsive lightbox viewer
- **Customer Registration** -- Secure sign-up and login flow powered by Firebase Auth
- **Admin Panel** -- Manage galleries, bookings, and customer data from a protected dashboard
- **Service Showcase** -- Highlight available photography packages and pricing
- **Trusted Partners Page** -- Feature collaborating vendors and partner businesses
- **PWA Support** -- Installable on mobile and desktop with offline-ready capabilities
- **Image Optimization** -- Server-side image resizing and format conversion via Sharp

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/kstephens0331/FC-Photo-Houston.git
cd FC-Photo-Houston

# Install backend dependencies
cd backend
npm install

# Configure environment variables
cp .env.example .env
# Edit .env with your database URL, Firebase config, and JWT secret

# Run Prisma migrations
npx prisma migrate deploy

# Start the backend server
npm start

# In a new terminal, install and start the frontend
cd ../client
npm install
npm start
```

The client runs on `http://localhost:3000` and the backend API on `http://localhost:5000` by default.

## Project Structure

```
FC-Photo-Houston/
├── client/                  # React 18 frontend (CRA)
│   ├── public/              # Static assets & PWA manifest
│   └── src/
│       ├── components/      # Reusable UI components
│       ├── pages/           # Route-level page components
│       ├── hooks/           # Custom React hooks
│       ├── context/         # Auth & app context providers
│       └── utils/           # Helper functions
├── backend/                 # Express 5 API server
│   ├── prisma/              # Prisma schema & migrations
│   ├── routes/              # API route handlers
│   ├── middleware/          # Auth, upload, & error middleware
│   ├── controllers/        # Business logic controllers
│   └── utils/              # Server utilities
├── package.json
└── README.md
```

## License

All rights reserved. This project is proprietary client work.

---

**Built by StephensCode LLC**
