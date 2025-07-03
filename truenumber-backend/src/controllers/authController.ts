import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { OTPService } from '../services/otpService';
import { AuthService } from '../services/authService';

export class AuthController {
  /**
   * Send OTP to mobile number
   */
  static async sendOTP(req: Request, res: Response): Promise<void> {
    try {
      const { mobile_number, country_code } = req.body;

      // Validate input
      if (!mobile_number || !country_code) {
        res.status(400).json({
          success: false,
          message: 'Mobile number and country code are required'
        });
        return;
      }

      // Validate mobile number format (basic validation)
      if (!/^\d{10,15}$/.test(mobile_number)) {
        res.status(400).json({
          success: false,
          message: 'Invalid mobile number format'
        });
        return;
      }

      // Validate country code format
      if (!/^\+?\d{1,4}$/.test(country_code)) {
        res.status(400).json({
          success: false,
          message: 'Invalid country code format'
        });
        return;
      }

      // Check if user already has a pending OTP
      const hasPendingOTP = await OTPService.hasPendingOTP(mobile_number, country_code);
      if (hasPendingOTP) {
        res.status(429).json({
          success: false,
          message: 'OTP already sent. Please wait before requesting a new one.'
        });
        return;
      }

      // Send OTP
      const otpResult = await OTPService.sendOTP(mobile_number, country_code);

      if (otpResult.success) {
        res.status(200).json({
          success: true,
          message: otpResult.message,
          // Include OTP in development mode for testing
          ...(process.env.NODE_ENV === 'development' && { otp: otpResult.otp })
        });
      } else {
        res.status(500).json({
          success: false,
          message: otpResult.message
        });
      }

    } catch (error) {
      console.error('Error in sendOTP:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Verify OTP and register/login user
   */
  static async verifyOTP(req: Request, res: Response): Promise<void> {
    try {
      const { mobile_number, country_code, otp_code, name } = req.body;

      // Validate input
      if (!mobile_number || !country_code || !otp_code) {
        res.status(400).json({
          success: false,
          message: 'Mobile number, country code, and OTP code are required'
        });
        return;
      }

      // Verify OTP
      const otpResult = await OTPService.verifyOTP(mobile_number, country_code, otp_code);

      if (!otpResult.success) {
        const statusCode = otpResult.isExpired ? 410 : otpResult.attemptsExceeded ? 429 : 400;
        res.status(statusCode).json({
          success: false,
          message: otpResult.message,
          isExpired: otpResult.isExpired,
          attemptsExceeded: otpResult.attemptsExceeded
        });
        return;
      }

      // Check if user already exists
      let user = await UserModel.findByMobileAndCountry(mobile_number, country_code);

      if (!user) {
        // Create new user if doesn't exist
        if (!name || name.trim().length === 0) {
          res.status(400).json({
            success: false,
            message: 'Name is required for new user registration'
          });
          return;
        }

        user = await UserModel.create({
          mobile_number,
          country_code,
          name: name.trim()
        });
      }

      // Generate JWT token
      const token = AuthService.generateToken(user);

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully',
        user: {
          uid: user.uid,
          mobile_number: user.mobile_number,
          country_code: user.country_code,
          name: user.name
        },
        token
      });

    } catch (error) {
      console.error('Error in verifyOTP:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }

  /**
   * Get current user profile
   */
  static async getProfile(req: any, res: Response): Promise<void> {
    try {
      const userId = req.user?.uid;
      
      if (!userId) {
        res.status(401).json({
          success: false,
          message: 'User not authenticated'
        });
        return;
      }

      const user = await UserModel.findById(userId);
      
      if (!user) {
        res.status(404).json({
          success: false,
          message: 'User not found'
        });
        return;
      }

      res.status(200).json({
        success: true,
        user: {
          uid: user.uid,
          mobile_number: user.mobile_number,
          country_code: user.country_code,
          name: user.name,
          created_at: user.created_at
        }
      });

    } catch (error) {
      console.error('Error in getProfile:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
}