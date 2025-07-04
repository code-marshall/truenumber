# TrueNumber Backend API

Backend API for the TrueNumber mobile verification system. This API provides endpoints for user registration via OTP, company registration, and verification request management.

## Features

- **User Authentication**: OTP-based registration and login
- **Company Management**: Company registration and profile management
- **Verification Requests**: Create and manage verification requests between companies and users
- **JWT Authentication**: Secure API access with JSON Web Tokens
- **PostgreSQL Database**: Robust data storage with migrations
- **Comprehensive Testing**: Full test coverage for all endpoints

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Migration Tool**: dbmate
- **Authentication**: JWT tokens
- **Testing**: Jest with Supertest
- **ORM**: Raw SQL queries with pg library

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   cd truenumber-backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials and other settings
   ```

4. **Setup PostgreSQL database**:
   ```bash
   # Create database
   createdb truenumber_db
   
   # Or if you have psql access:
   psql -c "CREATE DATABASE truenumber_db;"
   ```

5. **Run database migrations**:
   ```bash
   npm run db:migrate
   ```

6. **Build the project**:
   ```bash
   npm run build
   ```

## Usage

### Development

```bash
npm run dev
```

The server will start on `http://localhost:3000` with hot reloading.

### Production

```bash
npm start
```

### Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Database Operations

```bash
# Create a new migration
npm run db:new migration_name

# Run pending migrations
npm run db:migrate

# Rollback last migration
npm run db:rollback

# Check migration status
npm run db:status
```

## API Endpoints

### Authentication

#### Send OTP
```
POST /api/auth/send-otp
Content-Type: application/json

{
  "mobile_number": "9876543210",
  "country_code": "+91"
}
```

#### Verify OTP
```
POST /api/auth/verify-otp
Content-Type: application/json

{
  "mobile_number": "9876543210",
  "country_code": "+91",
  "otp_code": "123456",
  "name": "John Doe" // Required for new users
}
```

#### Get User Profile
```
GET /api/auth/profile
Authorization: Bearer <jwt_token>
```

### Companies

#### Register Company
```
POST /api/companies/register
Content-Type: application/json

{
  "company_name": "Example Corp",
  "domain": "example.com",
  "intent": "Verify user identity for secure transactions",
  "services_offered": ["payment", "authentication"]
}
```

#### Get Company
```
GET /api/companies/:id
GET /api/companies/domain/:domain
```

#### List Companies
```
GET /api/companies?page=1&limit=50
```

### Verification Requests

#### Create Verification Request
```
POST /api/verification/request
Content-Type: application/json

{
  "user_mobile_number": "9876543210",
  "user_country_code": "+91",
  "company_id": "company-uuid",
  "request_type": "otp",
  "expiry_hours": 24
}
```

#### Get Pending Requests (for authenticated user)
```
GET /api/verification/pending
Authorization: Bearer <jwt_token>
```

#### Update Request Status
```
PUT /api/verification/:id/status
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "status": "user_rejected" // or "request_opened", "completed"
}
```

#### Get Company Requests
```
GET /api/verification/company/:company_id?page=1&limit=50
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `3000` |
| `DATABASE_URL` | PostgreSQL connection string | - |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `5432` |
| `DB_NAME` | Database name | `truenumber_db` |
| `DB_USER` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `password` |
| `JWT_SECRET` | JWT signing secret | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |
| `OTP_EXPIRY_MINUTES` | OTP expiration time | `10` |
| `OTP_LENGTH` | OTP length | `6` |
| `SLACK_WEBHOOK_URL` | Slack notification webhook | - |

## Database Schema

### Tables

- **users**: User information and mobile numbers
- **companies**: Company profiles and registration data
- **verification_requests**: Verification requests between companies and users
- **otp_codes**: Temporary OTP storage for verification

### Migrations

All database migrations are located in `db/migrations/` and can be managed using dbmate commands.

## Testing

The project includes comprehensive tests for:
- Authentication endpoints
- Company management
- Verification request lifecycle
- Error handling and edge cases

Test files are located in the `tests/` directory.

## Development Notes

- **OTP Implementation**: Currently mocked for development. In production, integrate with SMS service (Twilio, AWS SNS, etc.)
- **Database Cleanup**: Automatic cleanup of expired OTPs and verification requests runs every 30 minutes
- **Security**: All sensitive routes require JWT authentication
- **Logging**: Request logging is enabled for debugging

## Deployment

1. Set up PostgreSQL database
2. Configure environment variables
3. Run migrations: `npm run db:migrate`
4. Build the project: `npm run build`
5. Start the server: `npm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run tests: `npm test`
6. Submit a pull request

## License

ISC