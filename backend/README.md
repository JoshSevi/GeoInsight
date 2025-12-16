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

Enterprise-level architecture with separation of concerns:

```
backend/
├── src/
│   ├── index.ts                    # Main server file with app initialization
│   ├── config/
│   │   └── index.ts                # Centralized configuration management
│   ├── constants/
│   │   └── index.ts                # Application constants
│   ├── controllers/
│   │   ├── auth.controller.ts     # Authentication controller
│   │   ├── geo.controller.ts      # Geolocation controller
│   │   └── history.controller.ts   # History controller
│   ├── services/
│   │   ├── auth.service.ts        # Authentication business logic
│   │   ├── geo.service.ts         # Geolocation business logic
│   │   └── history.service.ts      # History business logic
│   ├── routes/
│   │   ├── auth.ts                # Authentication routes
│   │   ├── geo.ts                 # Geolocation routes
│   │   └── history.ts             # Search history routes
│   ├── middleware/
│   │   ├── auth.ts                # JWT authentication middleware
│   │   ├── errorHandler.ts        # Centralized error handling
│   │   └── requestLogger.ts       # Request logging middleware
│   ├── database/
│   │   ├── client.ts              # Database client singleton
│   │   └── schema.sql             # Database schema
│   ├── types/
│   │   └── index.ts               # TypeScript type definitions
│   ├── utils/
│   │   ├── errors.ts              # Custom error classes
│   │   ├── logger.ts              # Centralized logging utility
│   │   ├── response.ts            # API response utilities
│   │   ├── validation.ts          # Input validation utilities
│   │   └── ipValidator.ts         # IP address validation
│   └── scripts/
│       └── seedUsers.ts           # User seeder script
├── package.json
├── tsconfig.json
└── .env.example                   # Environment variables template
```

### Architecture Layers

1. **Controllers**: Handle HTTP requests/responses, delegate to services
2. **Services**: Contain business logic and orchestrate data operations
3. **Database Client**: Singleton pattern for database connections
4. **Middleware**: Request processing, authentication, error handling
5. **Utils**: Reusable utilities (logging, validation, errors)
6. **Config**: Centralized configuration with validation
7. **Types**: Shared TypeScript interfaces and types

## Dependencies

### Production Dependencies

- **@supabase/supabase-js** (^2.39.0) - Supabase client for database operations
- **bcryptjs** (^3.0.3) - Password hashing library
- **cors** (^2.8.5) - Cross-Origin Resource Sharing middleware
- **dotenv** (^16.3.1) - Environment variable loader
- **express** (^4.18.2) - Web framework for Node.js
- **express-rate-limit** - Rate limiting middleware to prevent API abuse
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

All dependencies are managed via npm and defined in `package.json`. Install them with:

```bash
npm install
```

This will install all production and development dependencies listed above.

### 2. External Services Setup

#### Supabase (Database)

1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Project Settings → API
4. Copy your **Project URL** and **Service Role Key**
5. These will be used in your `.env` file (see Environment Variables section)

#### IPInfo API (Optional - for enhanced geolocation)

1. Sign up at [ipinfo.io](https://ipinfo.io)
2. Get your API token from the dashboard
3. Add it to your `.env` file (optional - the API works without a token but with rate limits)

### 2. Environment Variables

Create a `.env` file in the `backend/` directory (see `.env.example` for template):

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# IPInfo API Configuration (optional)
IPINFO_TOKEN=your_ipinfo_token
IPINFO_BASE_URL=https://ipinfo.io

# CORS Configuration
CORS_ORIGIN=*
```

**Required variables**: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `JWT_SECRET`

> **Note**: All npm packages are installed automatically when you run `npm install`. No additional manual installation is required for the dependencies listed above.

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
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user-uuid",
      "email": "admin@admin.com"
    }
  }
}
```

**Error Responses:**

- **400 Bad Request** - Missing email or password
- **401 Unauthorized** - Invalid credentials
- **500 Internal Server Error** - Server error

### POST /api/signup

Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Signup successful",
  "data": {
    "token": "jwt_token_here",
    "user": {
      "id": "user-uuid",
      "email": "user@example.com"
    }
  }
}
```

**Error Responses:**

- **400 Bad Request** - Missing email or password, invalid email format, or email already registered
- **500 Internal Server Error** - Server error

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

### GET /api/history

Get user's search history. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": ["8.8.8.8", "1.1.1.1", "192.168.1.1"]
}
```

### POST /api/history

Save an IP address to user's search history. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "ip": "8.8.8.8"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Search history saved"
}
```

### DELETE /api/history

Delete search history items. Requires authentication.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "ips": ["8.8.8.8", "1.1.1.1"]
}
```

To delete all history, send empty array:
```json
{
  "ips": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Search history deleted"
}
```

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
- **JWT** tokens with configurable expiration for authentication
- **bcryptjs** with 10 salt rounds for password hashing

## Architecture Features

### Enterprise-Level Patterns

- **Separation of Concerns**: Controllers → Services → Database
- **Error Handling**: Centralized error handling with custom error classes
- **Logging**: Structured logging with different log levels
- **Configuration Management**: Type-safe configuration with validation
- **Type Safety**: Full TypeScript coverage with shared types
- **Singleton Pattern**: Database client singleton for connection management
- **Response Standardization**: Consistent API response format

### Error Handling

The application uses custom error classes:
- `ValidationError` (400) - Input validation failures
- `AuthenticationError` (401) - Authentication failures
- `AuthorizationError` (403) - Authorization failures
- `NotFoundError` (404) - Resource not found
- `ConflictError` (409) - Resource conflicts
- `ExternalServiceError` (502) - External API failures

All errors are caught by centralized error handling middleware and returned in a consistent format.

### Logging

Structured logging with different levels:
- **DEBUG**: Development-only detailed information
- **INFO**: General informational messages
- **WARN**: Warning messages (operational errors)
- **ERROR**: Error messages with stack traces

## Security Notes

- Passwords are hashed using bcrypt before storage
- JWT tokens are used for stateless authentication
- Service role key is required for database operations
- Row Level Security (RLS) is enabled on the users table
- Environment variables are validated on startup
- Error messages are sanitized in production mode
- **Rate limiting** is implemented to prevent API abuse:
  - Authentication endpoints (login/signup): 5 requests per 1 minute per IP (strict protection against brute force)
  - Geolocation endpoints: 30 requests per 5 minutes per IP
  - General API endpoints: 100 requests per 5 minutes per IP
  - All rate limit violations are logged for security monitoring
