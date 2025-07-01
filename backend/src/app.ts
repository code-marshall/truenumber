import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { config } from './config/environment';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/errorHandler';
import { authenticateToken } from './middleware/auth';
import { validateApiKey } from './middleware/apiKey';

// Import routes
import authRoutes from './routes/auth';
import verificationRoutes from './routes/verification';
import companyRoutes from './routes/company';
import userRoutes from './routes/user';
import healthRoutes from './routes/health';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: config.cors.allowedOrigins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key', 'X-Device-ID']
}));

// General middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// API Key rate limiting for company endpoints
const companyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50, // limit each API key to 50 requests per minute
  keyGenerator: (req) => req.headers['x-api-key'] as string || req.ip,
  message: {
    error: 'API rate limit exceeded, please try again later.',
    code: 'API_RATE_LIMIT_EXCEEDED'
  }
});

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/verification', authenticateToken, verificationRoutes);
app.use('/api/user', authenticateToken, userRoutes);
app.use('/api/company', validateApiKey, companyLimiter, companyRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'TrueNumber API',
    version: '1.0.0',
    status: 'active',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    code: 'NOT_FOUND',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use(errorHandler);

// Start server
const PORT = config.port || 3000;

if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`🚀 TrueNumber API server running on port ${PORT}`);
    logger.info(`📖 Environment: ${config.nodeEnv}`);
    logger.info(`🔐 Security headers enabled`);
    logger.info(`⚡ Rate limiting active`);
  });
}

export default app;