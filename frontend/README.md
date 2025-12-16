# Frontend

React + TypeScript + Tailwind CSS frontend for GeoInsight.

## Overview

This is a modern React application built with Vite, featuring a clean and responsive UI using Tailwind CSS. The frontend communicates with the backend API for authentication and geolocation services.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Maps**: Leaflet & React Leaflet
- **Database Client**: Supabase JS

## Dependencies

### Production Dependencies

- **react** (^18.2.0) - React UI library
- **react-dom** (^18.2.0) - React DOM renderer
- **react-router-dom** (^7.10.1) - Client-side routing
- **@supabase/supabase-js** (^2.39.0) - Supabase client for database operations
- **leaflet** (^1.9.4) - Interactive maps library
- **react-leaflet** (^4.2.1) - React components for Leaflet maps

### Development Dependencies

- **vite** (^5.0.8) - Build tool and dev server
- **typescript** (^5.2.2) - TypeScript compiler
- **@vitejs/plugin-react** (^4.2.1) - Vite plugin for React
- **tailwindcss** (^3.3.6) - Utility-first CSS framework
- **autoprefixer** (^10.4.16) - CSS vendor prefixer
- **postcss** (^8.4.32) - CSS post-processor
- **eslint** (^8.55.0) - JavaScript/TypeScript linter
- **@types/react** (^18.2.43) - TypeScript types for React
- **@types/react-dom** (^18.2.17) - TypeScript types for React DOM

## Project Structure

```
frontend/
├── src/
│   ├── App.tsx              # Main app component
│   ├── main.tsx             # Application entry point
│   ├── index.css            # Global styles (Tailwind)
│   ├── vite-env.d.ts        # Vite environment types
│   └── lib/
│       └── supabase.ts      # Supabase client configuration
├── index.html               # HTML template
├── package.json
├── tsconfig.json
├── vite.config.ts           # Vite configuration
├── tailwind.config.js       # Tailwind CSS configuration
└── postcss.config.js        # PostCSS configuration
```

## Setup

### 1. Install Dependencies

All dependencies are managed via npm and defined in `package.json`. Install them with:

```bash
npm install
```

This will install all production and development dependencies listed above.

> **Note**: All npm packages are installed automatically when you run `npm install`. No additional manual installation is required.

### 2. External Services Setup

#### Supabase (Database)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project (or use the same project as the backend)
3. Go to Project Settings → API
4. Copy your **Project URL** and **Anon Key**
5. These will be used in your `.env` file (see Environment Variables section)

### 3. Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:8000
VITE_IPINFO_API_URL=https://ipinfo.io
```

### 4. Start Development Server

```bash
npm run dev
```

The application will start on `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start Vite development server with HMR
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint

## Development

### Features

- **Hot Module Replacement (HMR)** - Instant updates during development
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **API Proxy** - Vite proxy configured to forward `/api/*` requests to backend

### API Proxy

The Vite configuration includes a proxy that forwards all `/api/*` requests to `http://localhost:8000`. This allows you to make API calls without CORS issues during development.

### Environment Variables

All environment variables must be prefixed with `VITE_` to be accessible in the frontend code. Access them using `import.meta.env.VITE_VARIABLE_NAME`.

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

## Styling

The project uses Tailwind CSS for styling. Configuration is in `tailwind.config.js`. Global styles and Tailwind directives are in `src/index.css`.

## TypeScript

TypeScript is configured with strict mode enabled. Type definitions for Vite environment variables are in `src/vite-env.d.ts`.

