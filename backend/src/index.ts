import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import 'express-async-errors';

import { config } from '@/config/environment';
import { logger } from '@/utils/logger';
import { errorHandler } from '@/middleware/errorHandler';
import { authMiddleware } from '@/middleware/auth';

// Routes
import authRoutes from '@/routes/auth';
import verificationRoutes from '@/routes/verification';
import userRoutes from '@/routes/user';
import companyRoutes from '@/routes/company';
import webhookRoutes from '@/routes/webhook';

// Services
import { DatabaseService } from '@/services/DatabaseService';
import { RedisService } from '@/services/RedisService';
import { PushNotificationService } from '@/services/PushNotificationService';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3001",
  credentials: true
}));
app.use(compression());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));
app.use(limiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV,
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/verification', authMiddleware, verificationRoutes);
app.use('/api/user', authMiddleware, userRoutes);
app.use('/api/company', authMiddleware, companyRoutes);
app.use('/api/webhook', webhookRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

// Error handling middleware
app.use(errorHandler);

// Socket.IO for real-time communication
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);

  socket.on('join_user_room', (userId: string) => {
    socket.join(`user_${userId}`);
    logger.info(`User ${userId} joined their room`);
  });

  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Store io instance globally for use in other modules
app.set('io', io);

// Initialize services
async function initializeServices() {
  try {
    // Initialize database
    await DatabaseService.initialize();
    logger.info('Database connected successfully');

    // Initialize Redis
    await RedisService.initialize();
    logger.info('Redis connected successfully');

    // Initialize Push Notification Service
    await PushNotificationService.initialize();
    logger.info('Push notification service initialized');

  } catch (error) {
    logger.error('Failed to initialize services:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });

  await DatabaseService.disconnect();
  await RedisService.disconnect();
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  
  server.close(() => {
    logger.info('HTTP server closed');
  });

  await DatabaseService.disconnect();
  await RedisService.disconnect();
  
  process.exit(0);
});

// Start server
async function startServer() {
  try {
    await initializeServices();
    
    const PORT = config.port || 3000;
    
    server.listen(PORT, () => {
      logger.info(`🚀 TrueNumber API server running on port ${PORT}`);
      logger.info(`📱 Environment: ${process.env.NODE_ENV || 'development'}`);
      logger.info(`🔗 Health check: http://localhost:${PORT}/health`);
      
      if (process.env.NODE_ENV === 'development') {
        logger.info(`📖 API Documentation: http://localhost:${PORT}/api-docs`);
      }
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

startServer();