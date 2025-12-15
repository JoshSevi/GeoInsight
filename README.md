# GeoInsight

A clean and simple project setup with React, Tailwind CSS, TypeScript, Node.js backend, and Supabase.

## Project Structure

```
GeoInsight/
├── frontend/              # React + TypeScript + Tailwind
│   ├── src/
│   │   ├── App.tsx        # Main app component
│   │   ├── main.tsx       # Entry point
│   │   ├── lib/
│   │   │   └── supabase.ts # Supabase client
│   │   └── index.css      # Tailwind styles
│   ├── package.json
│   └── vite.config.ts     # Vite configuration
├── backend/               # Node.js + TypeScript + Express
│   ├── src/
│   │   └── index.ts       # Express server
│   ├── package.json
│   └── tsconfig.json
└── package.json           # Root workspace configuration
```

## Setup

### 1. Install Dependencies

```bash
npm run install:all
```

This installs dependencies for the root workspace, frontend, and backend.

### 2. Environment Variables

Create `.env` files in both `frontend/` and `backend/` directories:

**frontend/.env:**
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
VITE_IPINFO_API_URL=https://ipinfo.io
```

**backend/.env:**
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PORT=8000
IPINFO_TOKEN=your_ipinfo_token
```

### 3. Run Development Servers

```bash
npm run dev
```

This starts both servers concurrently:
- **Frontend**: `http://localhost:5173`
- **Backend**: `http://localhost:8000` (API endpoints at `/api/*`)

## Available Scripts

### Root Level
- `npm run install:all` - Install all dependencies
- `npm run dev` - Start both frontend and backend in development mode
- `npm run build` - Build both frontend and backend for production

### Frontend
- `npm run dev --workspace=frontend` - Start Vite dev server
- `npm run build --workspace=frontend` - Build for production
- `npm run preview --workspace=frontend` - Preview production build

### Backend
- `npm run dev --workspace=backend` - Start backend with hot reload (tsx watch)
- `npm run build --workspace=backend` - Compile TypeScript
- `npm run start --workspace=backend` - Run production build

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/example` - Example API route

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, TypeScript
- **Database**: Supabase
- **Package Manager**: npm workspaces

## Development Notes

- Frontend uses Vite for fast HMR (Hot Module Replacement)
- Backend uses `tsx` for TypeScript execution without compilation
- API proxy is configured in `vite.config.ts` to forward `/api/*` requests to backend
- TypeScript strict mode is enabled for both frontend and backend

