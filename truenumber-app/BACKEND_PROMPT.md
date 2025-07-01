# TrueNumber Backend Implementation Prompt

## Objective

Develop a production-ready backend service for TrueNumber, a secure mobile number verification platform that provides companies with a trusted way to verify their users' mobile numbers.

## Project Requirements

### Technology Stack
- **Backend Framework:** Node.js with Express.js or FastAPI (Python) - your choice
- **Database:** PostgreSQL for production data storage
- **Cache:** Redis for session management and rate limiting
- **Authentication:** JWT-based API authentication
- **Environment:** Docker containerization for deployment

### Core Functionality

Implement the three main API endpoints as specified in the API documentation:

1. **POST /api/v1/verification/initiate**
   - Validate mobile number format (E.164)
   - Generate cryptographically secure verification ID
   - Store verification session in database
   - Implement rate limiting (100 requests/hour per company)
   - Return deep link URL for mobile app

2. **POST /api/v1/verification/submit**
   - Validate verification session exists and hasn't expired
   - Compare user-confirmed number with original
   - Update verification status in database
   - Implement rate limiting (10 requests/minute per session)
   - Trigger webhook notifications if configured

3. **GET /api/v1/verification/status/:verificationId**
   - Return current verification status
   - Implement rate limiting (1000 requests/hour per company)
   - Handle not found cases gracefully

### Database Schema

Design and implement the following tables:

#### `companies` table
```sql
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    api_key_hash VARCHAR(255) NOT NULL,
    webhook_url VARCHAR(255),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### `verification_sessions` table
```sql
CREATE TABLE verification_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    verification_id VARCHAR(255) UNIQUE NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    company_id VARCHAR(255) NOT NULL,
    request_id VARCHAR(255) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    app_user_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '10 minutes'),
    FOREIGN KEY (company_id) REFERENCES companies(company_id)
);
```

### Security Requirements

1. **API Authentication:**
   - Implement Bearer token authentication
   - Hash and securely store API keys
   - Validate API keys on every request

2. **Data Validation:**
   - Validate all input parameters
   - Sanitize mobile numbers to E.164 format
   - Implement request size limits

3. **Rate Limiting:**
   - Use Redis for distributed rate limiting
   - Implement sliding window rate limiting
   - Return appropriate HTTP status codes (429 for rate limit exceeded)

4. **Session Security:**
   - Generate cryptographically secure verification IDs
   - Implement session expiration (10 minutes)
   - Prevent session replay attacks

### Additional Features

1. **Webhook Support:**
   - Send POST requests to company webhook URLs on verification completion
   - Implement retry logic with exponential backoff
   - Include webhook signature for security

2. **Monitoring & Logging:**
   - Comprehensive request logging
   - Error tracking and alerting
   - Performance metrics (response times, success rates)

3. **Health Checks:**
   - Database connectivity check
   - Redis connectivity check
   - Overall service health endpoint

### Error Handling

Implement consistent error responses with:
- Appropriate HTTP status codes
- Structured error messages
- Error codes for programmatic handling
- Request ID for debugging

### Environment Configuration

Support the following environment variables:
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/truenumber
REDIS_URL=redis://localhost:6379
PORT=3000
JWT_SECRET=your-jwt-secret
API_BASE_URL=https://api.truenumber.com
WEBHOOK_TIMEOUT=30
LOG_LEVEL=info
```

### Testing Requirements

1. **Unit Tests:**
   - Test all API endpoints
   - Test database operations
   - Test validation functions
   - Achieve >90% code coverage

2. **Integration Tests:**
   - Test complete verification flow
   - Test rate limiting functionality
   - Test webhook delivery

3. **Load Tests:**
   - Test API performance under load
   - Verify rate limiting works correctly
   - Test database connection pooling

### API Documentation

Generate OpenAPI/Swagger documentation with:
- Complete endpoint documentation
- Request/response schemas
- Authentication requirements
- Error response examples

### Deployment

1. **Docker Setup:**
   - Create Dockerfile for the application
   - Include docker-compose.yml for local development
   - Include PostgreSQL and Redis containers

2. **Production Considerations:**
   - Environment-based configuration
   - Database migrations
   - Graceful shutdown handling
   - Health check endpoints

### Sample Implementation Structure

```
truenumber-backend/
├── src/
│   ├── controllers/
│   │   └── verification.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   ├── rateLimit.middleware.js
│   │   └── validation.middleware.js
│   ├── models/
│   │   ├── company.model.js
│   │   └── verification.model.js
│   ├── services/
│   │   ├── verification.service.js
│   │   └── webhook.service.js
│   ├── utils/
│   │   ├── crypto.utils.js
│   │   └── validation.utils.js
│   └── app.js
├── migrations/
├── tests/
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### Success Criteria

Your implementation should:
1. Pass all unit and integration tests
2. Handle 1000+ concurrent requests
3. Respond to API calls within 200ms average
4. Implement all security requirements
5. Include comprehensive documentation
6. Be ready for production deployment

Please implement this backend service following best practices for security, performance, and maintainability.