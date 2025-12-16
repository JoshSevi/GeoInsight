# Backend Architecture Documentation

## Overview

This document describes the enterprise-level architecture of the GeoInsight backend API. The codebase follows industry best practices with clear separation of concerns, type safety, and maintainable structure.

## Architecture Layers

### 1. Controllers Layer (`src/controllers/`)

**Purpose**: Handle HTTP requests and responses, delegate business logic to services.

**Responsibilities**:
- Extract data from HTTP requests
- Validate request structure
- Call appropriate service methods
- Format and send HTTP responses
- Handle errors by passing to error middleware

**Example**:
```typescript
export class AuthController {
  async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentials = req.body as LoginRequest;
      const result = await authService.login(credentials);
      sendSuccess(res, { token: result.token, user: result.user }, "Login successful");
    } catch (error) {
      next(error);
    }
  }
}
```

### 2. Services Layer (`src/services/`)

**Purpose**: Contain business logic and orchestrate data operations.

**Responsibilities**:
- Implement business rules
- Coordinate between multiple data sources
- Transform data as needed
- Throw appropriate custom errors
- Log business operations

**Example**:
```typescript
export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResult> {
    // Validation
    if (!isValidEmail(credentials.email)) {
      throw new ValidationError("Invalid email format");
    }

    // Business logic
    const user = await this.findUser(credentials.email);
    // ... authentication logic
  }
}
```

### 3. Database Layer (`src/database/`)

**Purpose**: Manage database connections and provide data access.

**Responsibilities**:
- Singleton pattern for database client
- Connection management
- Health checks
- Database initialization

**Key Features**:
- Lazy initialization
- Connection reuse
- Error handling for connection failures

### 4. Middleware Layer (`src/middleware/`)

**Purpose**: Process requests before they reach controllers.

**Types**:
- **Authentication**: JWT token verification
- **Error Handling**: Centralized error processing
- **Request Logging**: Request/response logging (optional)

### 5. Utilities Layer (`src/utils/`)

**Purpose**: Reusable utility functions.

**Components**:
- **Logger**: Structured logging with levels
- **Errors**: Custom error classes
- **Response**: Standardized API responses
- **Validation**: Input validation helpers
- **IP Validator**: IP address validation

### 6. Configuration Layer (`src/config/`)

**Purpose**: Centralized configuration management.

**Features**:
- Environment variable validation
- Type-safe configuration
- Default values
- Startup validation

## Data Flow

```
HTTP Request
    ↓
Middleware (Auth, Logging)
    ↓
Route Handler
    ↓
Controller
    ↓
Service (Business Logic)
    ↓
Database Client
    ↓
Supabase/PostgreSQL
    ↓
Response flows back up
    ↓
Error Handler (if error)
    ↓
HTTP Response
```

## Error Handling Strategy

### Custom Error Classes

All errors extend `AppError` with specific status codes:

```typescript
ValidationError (400)      → Client input errors
AuthenticationError (401)   → Authentication failures
AuthorizationError (403)    → Permission denied
NotFoundError (404)         → Resource not found
ConflictError (409)         → Resource conflicts
ExternalServiceError (502)  → External API failures
```

### Error Flow

1. Service throws custom error
2. Controller catches and passes to `next()`
3. Error handler middleware processes
4. Logs error appropriately
5. Returns standardized error response

## Logging Strategy

### Log Levels

- **DEBUG**: Development-only detailed information
- **INFO**: General informational messages
- **WARN**: Warning messages (operational errors)
- **ERROR**: Error messages with stack traces

### Logging Best Practices

- Log at service layer for business events
- Log errors with context
- Use structured logging (objects, not strings)
- Different log levels for different environments

## Type Safety

### Shared Types (`src/types/`)

All shared interfaces and types are centralized:
- `AuthRequest`: Extended Express Request with user info
- `User`: User data structure
- `SearchHistory`: History entry structure
- Request/Response body types

### TypeScript Configuration

- Strict mode enabled
- Full type checking
- No implicit any
- Declaration files generated

## Configuration Management

### Environment Variables

All configuration is centralized in `src/config/index.ts`:
- Validates required variables on startup
- Provides type-safe access
- Sets sensible defaults
- Groups related config

### Required Variables

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET`

### Optional Variables

- `PORT` (default: 8000)
- `NODE_ENV` (default: development)
- `JWT_EXPIRES_IN` (default: 7d)
- `IPINFO_TOKEN`
- `CORS_ORIGIN` (default: *)

## API Response Format

### Success Response

```json
{
  "success": true,
  "message": "Optional message",
  "data": { ... }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "details": { ... }  // Optional
}
```

## Testing Considerations

The architecture supports testing through:

1. **Dependency Injection**: Services can be mocked
2. **Separation of Concerns**: Each layer can be tested independently
3. **Error Classes**: Predictable error handling
4. **Type Safety**: Compile-time error detection

## Scalability Considerations

1. **Stateless Design**: JWT-based authentication
2. **Database Connection Pooling**: Singleton client
3. **Service Layer**: Easy to add caching
4. **Error Handling**: Consistent error responses
5. **Logging**: Structured logs for monitoring

## Security Considerations

1. **Password Hashing**: bcrypt with 10 salt rounds
2. **JWT Tokens**: Secure token-based authentication
3. **Input Validation**: All inputs validated
4. **Error Messages**: Sanitized in production
5. **Environment Variables**: Validated on startup
6. **CORS**: Configurable CORS settings

## Future Enhancements

Potential improvements:
- Request validation middleware (e.g., using Zod)
- Rate limiting middleware
- Caching layer (Redis)
- Database query optimization
- API versioning
- OpenAPI/Swagger documentation
- Unit and integration tests
- CI/CD pipeline configuration
