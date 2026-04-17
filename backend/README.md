# AI Command Center - Backend

A Node.js + Express server for handling user authentication with MongoDB.

## Tech Stack

- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **TypeScript** - Type safety
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.ts
│   ├── models/
│   │   └── User.ts
│   ├── controllers/
│   │   └── authController.ts
│   ├── services/
│   │   └── authService.ts
│   ├── routes/
│   │   └── authRoutes.ts
│   └── index.ts
├── tsconfig.json
├── package.json
├── .env.example
└── .gitignore
```

## Features

- **Register** - Create new user with email and password
- **Login** - Authenticate user and return JWT token
- **Forgot Password** - Generate password reset token
- **Reset Password** - Update password with valid token
- **Password Hashing** - Secure password storage with bcryptjs
- **JWT Authentication** - Token-based authentication

## Setup Instructions

### Prerequisites

- Node.js v16+
- npm or yarn
- MongoDB running locally or remote connection

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Update `.env` with your settings:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-command-center
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

### Development

```bash
npm run dev
```

Server will start at `http://localhost:5000`

### Build & Production

```bash
npm run build
npm start
```

## API Endpoints

### Register
```
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "John Doe"
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "...",
    "email": "user@example.com",
    "fullName": "John Doe"
  }
}
```

### Forgot Password
```
POST /auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Reset Password
```
POST /auth/reset-password
Content-Type: application/json

{
  "token": "reset_token_from_email",
  "newPassword": "newpassword123"
}
```

## Database Schema

### User Model

```typescript
{
  _id: ObjectId,
  fullName: String (required),
  email: String (required, unique, lowercase),
  password: String (required, hashed),
  createdAt: Date,
  updatedAt: Date
}
```

## Security Considerations

- Passwords are hashed using bcryptjs (10 salt rounds)
- JWT tokens expire after configured time
- Email is case-insensitive and unique
- CORS enabled for frontend communication
- Environment variables for sensitive data

## Testing

Use Postman or curl to test endpoints:

```bash
# Health check
curl http://localhost:5000/health

# Register
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123","fullName":"Test User"}'
```

## Notes

- MongoDB should be running before starting the server
- Default MongoDB connection: `mongodb://localhost:27017/auth-app`
- JWT_SECRET should be changed in production
- Error responses follow standard HTTP status codes
