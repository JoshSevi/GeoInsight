# GeoInsight

A modern web application for IP geolocation tracking and management, built with React, Node.js, and Supabase.

## 🚀 Overview

GeoInsight is a full-stack application that allows users to:
- Authenticate securely with email and password
- View their current IP address and geolocation information
- Search for geolocation data of any IP address
- Track and manage search history

## 📋 Features

- **User Authentication** - Secure login with JWT tokens
- **IP Geolocation** - Real-time geolocation data using IPInfo API
- **Search History** - Track and manage IP search history
- **Responsive Design** - Modern UI built with Tailwind CSS
- **Type-Safe** - Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - Runtime
- **Express** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **bcryptjs** - Password hashing

### Database & Services
- **Supabase** - PostgreSQL database
- **IPInfo API** - Geolocation services

## 📁 Project Structure

```
GeoInsight/
├── frontend/          # React frontend application
│   ├── src/           # Source code
│   ├── package.json   # Frontend dependencies
│   └── README.md      # Frontend documentation
├── backend/           # Node.js backend API
│   ├── src/           # Source code
│   ├── package.json   # Backend dependencies
│   └── README.md      # Backend documentation
└── package.json       # Root workspace configuration
```

## 🚦 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Supabase account
- IPInfo API token (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GeoInsight
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables**

   Create `.env` files in both `frontend/` and `backend/` directories. See the respective README files for details:
   - [Frontend Environment Variables](./frontend/README.md#environment-variables)
   - [Backend Environment Variables](./backend/README.md#environment-variables)

4. **Set up database**
   - Go to your Supabase project dashboard
   - Run the SQL schema from `backend/src/database/schema.sql`
   - Seed test users: `npm run seed --workspace=backend`

5. **Start development servers**
   ```bash
   npm run dev
   ```

   This starts:
   - Frontend on `http://localhost:5173`
   - Backend on `http://localhost:8000`

## 📚 Documentation

- [Frontend Documentation](./frontend/README.md) - Frontend setup and development guide
- [Backend Documentation](./backend/README.md) - Backend API documentation

## 🔧 Available Scripts

### Root Level
- `npm run install:all` - Install all dependencies
- `npm run dev` - Start both frontend and backend
- `npm run build` - Build both for production

### Frontend
- `npm run dev --workspace=frontend` - Start frontend dev server
- `npm run build --workspace=frontend` - Build frontend
- `npm run preview --workspace=frontend` - Preview production build

### Backend
- `npm run dev --workspace=backend` - Start backend dev server
- `npm run build --workspace=backend` - Build backend
- `npm run start --workspace=backend` - Run production build
- `npm run seed --workspace=backend` - Seed test users

## 🌐 API Endpoints

- `POST /api/login` - User authentication
- `POST /api/signup` - User registration
- `GET /api/geo` - Get IP geolocation information (current user or specified IP)
- `GET /api/history` - Get user's search history (requires authentication)
- `POST /api/history` - Save IP to search history (requires authentication)
- `DELETE /api/history` - Delete search history items (requires authentication)
- `GET /api/health` - Health check

See [Backend README](./backend/README.md#api-endpoints) for detailed API documentation.

## 🔐 Test Credentials

After running the seeder:
- **Email**: `admin@admin.com` | **Password**: `admin123`

## 📝 Development Notes

- Frontend uses Vite for fast HMR (Hot Module Replacement)
- Backend uses `tsx` for TypeScript execution without compilation
- API proxy is configured in `vite.config.ts` to forward `/api/*` requests
- TypeScript strict mode is enabled for both frontend and backend

## 🚢 Deployment

This project is designed to be deployed on **Vercel**.

- **Recommended setup**:
  - Deploy `frontend/` as a Vercel React/Vite app
  - Deploy `backend/` as a separate Node/Express API (or other hosting you prefer)
- **Environment variables** must be configured in Vercel for both frontend and backend (see the README in each folder).

When deployed, update this section with your actual URLs:

- **Frontend (React app)**: `https://your-frontend.vercel.app`
- **Backend (API)**: `https://your-backend.vercel.app`

Locally, the app runs on:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

