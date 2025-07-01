import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  // Server configuration
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  
  // Database configuration
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    name: process.env.DB_NAME || 'truenumber',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'password',
    ssl: process.env.DB_SSL === 'true',
    poolMin: parseInt(process.env.DB_POOL_MIN || '2', 10),
    poolMax: parseInt(process.env.DB_POOL_MAX || '10', 10),
  },
  
  // Redis configuration
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
    ttl: parseInt(process.env.REDIS_TTL || '3600', 10), // 1 hour default
  },
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET || 'truenumber-secret-key-change-in-production',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'truenumber-refresh-secret-change-in-production',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    issuer: process.env.JWT_ISSUER || 'truenumber-api',
    audience: process.env.JWT_AUDIENCE || 'truenumber-app',
  },
  
  // Encryption configuration
  encryption: {
    algorithm: 'aes-256-gcm',
    keyLength: 32,
    ivLength: 16,
    tagLength: 16,
    secretKey: process.env.ENCRYPTION_KEY || 'change-this-encryption-key-in-production',
  },
  
  // CORS configuration
  cors: {
    allowedOrigins: process.env.CORS_ORIGINS 
      ? process.env.CORS_ORIGINS.split(',') 
      : ['http://localhost:3000', 'http://localhost:19006'],
  },
  
  // Rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '900000', 10), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX || '100', 10),
    companyWindowMs: parseInt(process.env.COMPANY_RATE_LIMIT_WINDOW || '60000', 10), // 1 minute
    companyMax: parseInt(process.env.COMPANY_RATE_LIMIT_MAX || '50', 10),
  },
  
  // SMS Service (Twilio)
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID,
    authToken: process.env.TWILIO_AUTH_TOKEN,
    phoneNumber: process.env.TWILIO_PHONE_NUMBER,
    serviceSid: process.env.TWILIO_VERIFY_SERVICE_SID,
  },
  
  // Firebase Cloud Messaging
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKeyId: process.env.FIREBASE_PRIVATE_KEY_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    clientId: process.env.FIREBASE_CLIENT_ID,
    authUri: process.env.FIREBASE_AUTH_URI || 'https://accounts.google.com/o/oauth2/auth',
    tokenUri: process.env.FIREBASE_TOKEN_URI || 'https://oauth2.googleapis.com/token',
    serverKey: process.env.FCM_SERVER_KEY,
  },
  
  // Security settings
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
    otpLength: parseInt(process.env.OTP_LENGTH || '6', 10),
    otpExpiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
    maxOtpAttempts: parseInt(process.env.MAX_OTP_ATTEMPTS || '3', 10),
    verificationExpiryMinutes: parseInt(process.env.VERIFICATION_EXPIRY_MINUTES || '2', 10),
    deviceFingerprintSecret: process.env.DEVICE_FINGERPRINT_SECRET || 'device-fingerprint-secret',
  },
  
  // Webhook configuration
  webhooks: {
    retryAttempts: parseInt(process.env.WEBHOOK_RETRY_ATTEMPTS || '3', 10),
    timeoutMs: parseInt(process.env.WEBHOOK_TIMEOUT_MS || '5000', 10),
    retryDelayMs: parseInt(process.env.WEBHOOK_RETRY_DELAY_MS || '1000', 10),
  },
  
  // Logging configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'json',
    filename: process.env.LOG_FILE || 'truenumber.log',
    maxSize: process.env.LOG_MAX_SIZE || '20m',
    maxFiles: parseInt(process.env.LOG_MAX_FILES || '14', 10),
  },
  
  // API documentation
  swagger: {
    title: 'TrueNumber API',
    version: '1.0.0',
    description: 'Secure Mobile Number Verification Service API',
    basePath: '/api',
    host: process.env.SWAGGER_HOST || 'localhost:3000',
  },
  
  // Feature flags
  features: {
    enableSwagger: process.env.ENABLE_SWAGGER === 'true',
    enableAnalytics: process.env.ENABLE_ANALYTICS === 'true',
    enableWebhooks: process.env.ENABLE_WEBHOOKS !== 'false', // default true
    enableBiometrics: process.env.ENABLE_BIOMETRICS !== 'false', // default true
  },
  
  // Health check configuration
  health: {
    checkIntervalMs: parseInt(process.env.HEALTH_CHECK_INTERVAL || '30000', 10), // 30 seconds
    dbTimeoutMs: parseInt(process.env.DB_HEALTH_TIMEOUT || '5000', 10),
    redisTimeoutMs: parseInt(process.env.REDIS_HEALTH_TIMEOUT || '3000', 10),
  },
};

// Validate required environment variables in production
if (config.nodeEnv === 'production') {
  const requiredEnvVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'ENCRYPTION_KEY',
    'DB_HOST',
    'DB_NAME',
    'DB_USER',
    'DB_PASSWORD',
    'REDIS_HOST',
    'TWILIO_ACCOUNT_SID',
    'TWILIO_AUTH_TOKEN',
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
  ];
  
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
  }
}

export default config;