# TrueNumber - Secure Mobile Verification Service

TrueNumber is an innovative mobile verification service that provides a secure, seamless alternative to traditional phone number verification methods. The service uses a two-phase verification process: initial device-number registration and subsequent push notification-based verifications.

## 🏗️ Architecture Overview

The TrueNumber system consists of:

- **Frontend**: React Native mobile application (iOS/Android)
- **Backend**: Node.js/Express API with TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Cache**: Redis for session management and caching
- **Push Notifications**: Firebase Cloud Messaging (FCM)
- **SMS**: Twilio or AWS SNS for OTP delivery

## 📋 Prerequisites

Before running the application, ensure you have the following installed:

### System Requirements
- **Node.js**: v16 or higher
- **npm** or **yarn**: Package manager
- **PostgreSQL**: v13 or higher
- **Redis**: v6 or higher
- **React Native CLI**: For mobile development
- **Android Studio**: For Android development
- **Xcode**: For iOS development (macOS only)

### Additional Requirements
- Firebase project with FCM enabled
- Twilio account (for SMS OTP)
- AWS account (optional, for SMS via SNS)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd truenumber
```

### 2. Environment Setup

Copy the environment file and configure your settings:

```bash
cp .env.example .env
```

Edit the `.env` file with your actual configuration values:

```bash
# Required: Update these values
DATABASE_URL=postgresql://username:password@localhost:5432/truenumber
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="your-firebase-private-key"
FIREBASE_CLIENT_EMAIL=your-firebase-client-email
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

### 3. Database Setup

Start PostgreSQL and Redis services:

```bash
# On macOS with Homebrew
brew services start postgresql
brew services start redis

# On Ubuntu/Debian
sudo systemctl start postgresql
sudo systemctl start redis-server

# Create the database
createdb truenumber
```

### 4. Backend Setup

Navigate to the backend directory and install dependencies:

```bash
cd backend
npm install

# Generate Prisma client and run migrations
npx prisma generate
npx prisma migrate dev

# Optional: Seed the database with sample data
npm run seed

# Start the development server
npm run dev
```

The backend API will be available at `http://localhost:3000`

### 5. Frontend Setup

In a new terminal, navigate to the frontend directory:

```bash
cd frontend
npm install

# For iOS (macOS only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start
```

### 6. Run the Mobile App

In separate terminals:

```bash
# For Android
npm run android

# For iOS (macOS only)
npm run ios
```

## 📱 Mobile App Features

### Initial Onboarding Flow
1. **Welcome Screen**: App introduction and value proposition
2. **Phone Number Input**: Enter phone number with country selection
3. **OTP Verification**: SMS/Call verification with auto-focus inputs
4. **Device Registration**: Secure token generation and device binding
5. **Biometric Setup**: Optional biometric authentication setup
6. **Push Notification Permission**: Request notification permissions
7. **Onboarding Complete**: Success confirmation

### Core Verification Flow
1. **Push Notification Received**: Company requests verification
2. **App Opens Automatically**: Deep linking to verification screen
3. **Verification Prompt**: Display company info and phone number
4. **User Confirmation**: Single tap to verify or decline
5. **Secure Response**: Encrypted response sent to backend
6. **Company Notification**: Real-time result delivery

### User Settings & Privacy
- **Verification History**: Complete log of all requests
- **Company Management**: Whitelist/blacklist companies
- **Auto-Verify Settings**: Trusted companies for automatic approval
- **Security Settings**: Biometric requirements, PIN setup
- **Privacy Controls**: Data sharing preferences

## 🔧 Backend API Endpoints

### Authentication
- `POST /api/auth/send-otp` - Send OTP for phone verification
- `POST /api/auth/verify-otp` - Verify OTP and register user
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

### Verification
- `POST /api/verification/request` - Company requests verification
- `POST /api/verification/respond` - User responds to verification
- `GET /api/verification/history` - Get user's verification history
- `GET /api/verification/pending` - Get pending verifications

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile
- `POST /api/user/update-fcm-token` - Update FCM token
- `GET /api/user/settings` - Get user settings
- `PUT /api/user/settings` - Update user settings

### Company Management
- `POST /api/company/register` - Register new company
- `GET /api/company/profile` - Get company profile
- `PUT /api/company/profile` - Update company profile
- `POST /api/company/trusted` - Add trusted company
- `DELETE /api/company/trusted/:id` - Remove trusted company

### Webhooks
- `POST /api/webhook/verification-result` - Receive verification results

## 🔐 Security Features

### Device-Level Security
- **Secure Enclave**: Biometric-protected key storage
- **Certificate Pinning**: Prevent man-in-the-middle attacks
- **Hardware Security Module**: Device binding and tamper detection
- **Encrypted Local Storage**: Secure credential storage

### API Security
- **JWT Authentication**: Short-lived access tokens with refresh
- **Rate Limiting**: Per-IP and per-user request limits
- **Request Signing**: Cryptographic request validation
- **Audit Logging**: Comprehensive security event logging

### Privacy Protection
- **GDPR/CCPA Compliance**: Data minimization and user rights
- **End-to-End Encryption**: Message-level encryption
- **Anonymization**: Privacy-preserving analytics
- **Data Retention**: Configurable data lifecycle policies

## 📊 Monitoring & Analytics

### Health Monitoring
```bash
# Check API health
curl http://localhost:3000/health

# View logs
tail -f logs/truenumber.log
```

### Performance Metrics
- **Response Time**: <200ms API response target
- **Verification Success Rate**: >95% success target
- **App Crash Rate**: <0.1% crash rate target
- **User Retention**: >80% 30-day retention target

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
npm run test:watch
npm run test:coverage
```

### Frontend Testing
```bash
cd frontend
npm test
npm run test:watch
npm run test:e2e
```

### Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Run load tests
artillery run tests/load/verification-flow.yml
```

## 🚢 Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d

# Scale services
docker-compose up -d --scale backend=3
```

### Production Checklist
- [ ] Update environment variables for production
- [ ] Configure SSL certificates
- [ ] Set up monitoring and alerting
- [ ] Configure database backups
- [ ] Set up CI/CD pipeline
- [ ] Configure log aggregation
- [ ] Set up error tracking (Sentry)
- [ ] Configure performance monitoring

## 🛠️ Development Tools

### Code Quality
```bash
# Lint code
npm run lint
npm run lint:fix

# Type checking
npm run type-check

# Format code
npm run format
```

### Database Management
```bash
# View database
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate migration
npx prisma migrate dev --name your-migration-name
```

## 🤝 Company Integration

### API Integration Example
```javascript
// Company-side integration example
const response = await fetch('https://api.truenumber.com/api/verification/request', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    phoneNumber: '+1234567890',
    requestId: 'unique-request-id',
    metadata: {
      transactionId: 'txn-123',
      amount: 100.00
    }
  })
});

const result = await response.json();
console.log('Verification result:', result);
```

### Webhook Implementation
```javascript
// Handle verification results
app.post('/webhook/truenumber', (req, res) => {
  const { requestId, approved, phoneNumber } = req.body;
  
  // Verify webhook signature
  const signature = req.headers['x-truenumber-signature'];
  if (!verifyWebhookSignature(signature, req.body)) {
    return res.status(401).send('Invalid signature');
  }
  
  // Process verification result
  if (approved) {
    // Complete user action
    console.log(`Phone ${phoneNumber} verified for request ${requestId}`);
  } else {
    // Handle declined verification
    console.log(`Verification declined for request ${requestId}`);
  }
  
  res.status(200).send('OK');
});
```

## 💰 Monetization Model

### Pricing Tiers
- **Basic**: $0.10 per verification (up to 1,000/month)
- **Professional**: $0.08 per verification (up to 10,000/month)
- **Enterprise**: $0.05 per verification (unlimited)

### Additional Services
- **Premium Analytics**: $99/month
- **Custom Branding**: $199/month
- **White-label Solution**: Custom pricing
- **Priority Support**: $299/month

## 📞 Support

### Technical Support
- **Documentation**: [docs.truenumber.com](https://docs.truenumber.com)
- **API Reference**: [api.truenumber.com](https://api.truenumber.com)
- **Support Email**: support@truenumber.com
- **Developer Slack**: [slack.truenumber.com](https://slack.truenumber.com)

### Issue Reporting
- **GitHub Issues**: For bug reports and feature requests
- **Security Issues**: security@truenumber.com (PGP key available)
- **Status Page**: [status.truenumber.com](https://status.truenumber.com)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details on how to get started.

---

**TrueNumber Team**  
Building the future of mobile verification 📱🔐
