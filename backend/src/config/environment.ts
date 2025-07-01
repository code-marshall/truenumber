import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server Configuration
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  
  // Database Configuration
  database: {
    url: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/truenumber',
    maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || '20', 10),
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  
  // Redis Configuration
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    ttl: parseInt(process.env.REDIS_TTL || '3600', 10), // 1 hour default
  },
  
  // JWT Configuration
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || 'your-super-secret-access-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-key',
    accessTokenExpiry: process.env.JWT_ACCESS_EXPIRY || '15m',
    refreshTokenExpiry: process.env.JWT_REFRESH_EXPIRY || '7d',
  },
  
  // Firebase Configuration
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID || '',
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n') || '',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL || '',
    databaseURL: process.env.FIREBASE_DATABASE_URL || '',
  },
  
  // Twilio Configuration (for SMS)
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
  
  // AWS Configuration (for SMS via SNS)
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
  },
  
  // Security Configuration
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes
    rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3001',
  },
  
  // OTP Configuration
  otp: {
    length: parseInt(process.env.OTP_LENGTH || '6', 10),
    expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
    maxAttempts: parseInt(process.env.OTP_MAX_ATTEMPTS || '3', 10),
  },
  
  // Verification Configuration
  verification: {
    requestExpiryMinutes: parseInt(process.env.VERIFICATION_REQUEST_EXPIRY_MINUTES || '10', 10),
    maxPendingRequests: parseInt(process.env.MAX_PENDING_VERIFICATION_REQUESTS || '5', 10),
  },
  
  // Webhook Configuration
  webhook: {
    secret: process.env.WEBHOOK_SECRET || 'your-webhook-secret',
    timeout: parseInt(process.env.WEBHOOK_TIMEOUT || '30000', 10), // 30 seconds
  },
  
  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined',
    enableConsole: process.env.ENABLE_CONSOLE_LOGGING !== 'false',
    enableFile: process.env.ENABLE_FILE_LOGGING === 'true',
    filePath: process.env.LOG_FILE_PATH || './logs/truenumber.log',
  },
  
  // API Configuration
  api: {
    version: process.env.API_VERSION || 'v1',
    prefix: process.env.API_PREFIX || '/api',
    maxRequestSize: process.env.MAX_REQUEST_SIZE || '10mb',
  },
  
  // Pagination Configuration
  pagination: {
    defaultLimit: parseInt(process.env.DEFAULT_PAGINATION_LIMIT || '20', 10),
    maxLimit: parseInt(process.env.MAX_PAGINATION_LIMIT || '100', 10),
  },
};

// Validate required environment variables in production
if (config.nodeEnv === 'production') {
  const requiredVars = [
    'DATABASE_URL',
    'JWT_ACCESS_SECRET',
    'JWT_REFRESH_SECRET',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
  ];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

export default config;