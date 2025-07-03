import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

/**
 * @route POST /api/auth/send-otp
 * @desc Send OTP to mobile number
 * @access Public
 */
router.post('/send-otp', AuthController.sendOTP);

/**
 * @route POST /api/auth/verify-otp
 * @desc Verify OTP and register/login user
 * @access Public
 */
router.post('/verify-otp', AuthController.verifyOTP);

/**
 * @route GET /api/auth/profile
 * @desc Get current user profile
 * @access Private
 */
router.get('/profile', authenticateToken, AuthController.getProfile);

export default router;