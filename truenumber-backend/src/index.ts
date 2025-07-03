import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import companyRoutes from './routes/companies';
import verificationRoutes from './routes/verification';

// Import services for cleanup tasks
import { OTPService } from './services/otpService';
import { VerificationRequestModel } from './models/VerificationRequest';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'TrueNumber Backend API is running',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/verification', verificationRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Cleanup tasks - run periodically
const runCleanupTasks = async () => {
  try {
    console.log('Running cleanup tasks...');
    
    // Clean up expired OTPs
    const expiredOTPs = await OTPService.cleanupExpiredOTPs();
    console.log(`Cleaned up ${expiredOTPs} expired OTP records`);
    
    // Mark expired verification requests
    const expiredRequests = await VerificationRequestModel.markExpired();
    console.log(`Marked ${expiredRequests} verification requests as expired`);
    
  } catch (error) {
    console.error('Error running cleanup tasks:', error);
  }
};

// Run cleanup tasks every 30 minutes
const CLEANUP_INTERVAL = 30 * 60 * 1000; // 30 minutes
setInterval(runCleanupTasks, CLEANUP_INTERVAL);

// Run initial cleanup
runCleanupTasks();

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Received SIGINT. Graceful shutdown...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Received SIGTERM. Graceful shutdown...');
  process.exit(0);
});

// Start server
app.listen(PORT, () => {
  console.log(`TrueNumber Backend API server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

export default app;