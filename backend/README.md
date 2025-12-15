# Backend API

Node.js + Express + TypeScript backend for GeoInsight.

## Overview

This backend provides RESTful API endpoints for user authentication and geolocation services. It uses Supabase as the database and JWT tokens for authentication.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## Project Structure

```
backend/
├── src/
│   ├── index.ts              # Main server file
│   ├── routes/
│   │   ├── auth.ts          # Authentication routes
│   │   └── geo.ts           # Geolocation routes
│   ├── utils/
│   │   └── ipValidator.ts   # IP address validation utility
│   ├── database/
│   │   └── schema.sql       # Database schema
│   └── scripts/
│       └── seedUsers.ts     # User seeder script
├── package.json
├── tsconfig.json
└── .env                      # Environment variables
```

## Dependencies

### Production Dependencies

- **@supabase/supabase-js** (^2.39.0) - Supabase client for database operations
- **bcryptjs** (^3.0.3) - Password hashing library
- **cors** (^2.8.5) - Cross-Origin Resource Sharing middleware
- **dotenv** (^16.3.1) - Environment variable loader
- **express** (^4.18.2) - Web framework for Node.js
- **jsonwebtoken** (^9.0.3) - JWT token generation and verification

### Development Dependencies

- **@types/bcryptjs** (^2.4.6) - TypeScript types for bcryptjs
- **@types/cors** (^2.8.17) - TypeScript types for cors
- **@types/express** (^4.17.21) - TypeScript types for express
- **@types/jsonwebtoken** (^9.0.10) - TypeScript types for jsonwebtoken
- **@types/node** (^20.10.5) - TypeScript types for Node.js
- **tsx** (^4.7.0) - TypeScript execution for development
- **typescript** (^5.3.3) - TypeScript compiler

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=8000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
JWT_SECRET=your_jwt_secret_key
IPINFO_TOKEN=your_ipinfo_token
```

### 3. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL from `src/database/schema.sql` to create the users table

### 4. Seed Test Users

```bash
npm run seed
```

This will create a test user:
- **Email**: `admin@admin.com` | **Password**: `admin123`

### 5. Start Development Server

```bash
npm run dev
```

The server will start on `http://localhost:8000`

## API Endpoints

### POST /api/login

Login endpoint for user authentication.

**Request Body:**
```json
{
  "email": "admin@admin.com",
  "password": "admin123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user-uuid",
    "email": "admin@admin.com"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Missing email or password
- **401 Unauthorized** - Invalid credentials
- **500 Internal Server Error** - Server error

### GET /api/geo

Get geolocation information for an IP address or the current user's IP.

**Query Parameters:**
- `ip` (optional): IP address to lookup. If not provided, returns current user's IP geolocation

**Examples:**

Get current user's IP geolocation:
```
GET /api/geo
```

Get geolocation for specific IP:
```
GET /api/geo?ip=8.8.8.8
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "ip": "8.8.8.8",
    "city": "Mountain View",
    "region": "California",
    "country": "US",
    "loc": "37.4056,-122.0775",
    "postal": "94043",
    "timezone": "America/Los_Angeles"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Invalid IP address format
- **500 Internal Server Error** - Server error or IPInfo API error

### GET /api/health

Health check endpoint to verify the API is running.

**Response:**
```json
{
  "status": "ok",
  "message": "GeoInsight API is running"
}
```

## Available Scripts

- `npm run dev` - Start development server with hot reload (tsx watch)
- `npm run build` - Compile TypeScript to JavaScript
- `npm run start` - Run production build
- `npm run seed` - Seed test users into database

## Development

The backend uses:
- **tsx** for running TypeScript directly without compilation in development
- **Express** with CORS enabled for cross-origin requests
- **JWT** tokens with 7-day expiration for authentication
- **bcryptjs** with 10 salt rounds for password hashing

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for stateless authentication
- Service role key is required for database operations
- Row Level Security (RLS) is enabled on the users table
