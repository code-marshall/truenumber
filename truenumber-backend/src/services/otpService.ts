import { OTPModel, OTPCode } from '../models/OTP';
import dotenv from 'dotenv';

dotenv.config();

const OTP_LENGTH = parseInt(process.env.OTP_LENGTH || '6');
const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');

export class OTPService {
  /**
   * Generate a random OTP code
   */
  static generateOTP(): string {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < OTP_LENGTH; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
  }

  /**
   * Send OTP to mobile number (mocked implementation)
   */
  static async sendOTP(mobile_number: string, country_code: string): Promise<{ success: boolean; message: string; otp?: string }> {
    try {
      // First invalidate any existing OTPs for this mobile number
      await OTPModel.invalidateExistingOTPs(mobile_number, country_code);

      // Generate new OTP
      const otp_code = this.generateOTP();
      const expires_at = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      // Store OTP in database
      const otpRecord = await OTPModel.create({
        mobile_number,
        country_code,
        otp_code,
        expires_at
      });

      // Mock SMS sending - in production, integrate with SMS service like Twilio
      console.log(`[MOCK SMS] Sending OTP ${otp_code} to ${country_code}${mobile_number}`);
      
      return {
        success: true,
        message: 'OTP sent successfully',
        otp: process.env.NODE_ENV === 'development' ? otp_code : undefined // Only return OTP in dev mode
      };
    } catch (error) {
      console.error('Error sending OTP:', error);
      return {
        success: false,
        message: 'Failed to send OTP'
      };
    }
  }

  /**
   * Verify OTP code
   */
  static async verifyOTP(mobile_number: string, country_code: string, otp_code: string): Promise<{ 
    success: boolean; 
    message: string; 
    isExpired?: boolean;
    attemptsExceeded?: boolean;
  }> {
    try {
      // Find the OTP record
      const otpRecord = await OTPModel.findByMobileAndCode(mobile_number, country_code, otp_code);

      if (!otpRecord) {
        return {
          success: false,
          message: 'Invalid OTP code'
        };
      }

      // Check if already verified
      if (otpRecord.is_verified) {
        return {
          success: false,
          message: 'OTP has already been used'
        };
      }

      // Check if expired
      if (new Date() > new Date(otpRecord.expires_at)) {
        return {
          success: false,
          message: 'OTP has expired',
          isExpired: true
        };
      }

      // Check attempts
      if (otpRecord.attempts >= otpRecord.max_attempts) {
        return {
          success: false,
          message: 'Maximum verification attempts exceeded',
          attemptsExceeded: true
        };
      }

      // Increment attempts
      await OTPModel.incrementAttempts(otpRecord.id);

      // Mark as verified
      await OTPModel.markAsVerified(otpRecord.id);

      return {
        success: true,
        message: 'OTP verified successfully'
      };

    } catch (error) {
      console.error('Error verifying OTP:', error);
      return {
        success: false,
        message: 'Failed to verify OTP'
      };
    }
  }

  /**
   * Clean up expired OTPs (should be called periodically)
   */
  static async cleanupExpiredOTPs(): Promise<number> {
    try {
      const deletedCount = await OTPModel.cleanupExpired();
      console.log(`Cleaned up ${deletedCount} expired OTP records`);
      return deletedCount;
    } catch (error) {
      console.error('Error cleaning up expired OTPs:', error);
      return 0;
    }
  }

  /**
   * Check if mobile number has pending OTP
   */
  static async hasPendingOTP(mobile_number: string, country_code: string): Promise<boolean> {
    try {
      const latestOTP = await OTPModel.findLatestByMobile(mobile_number, country_code);
      return latestOTP !== null && !latestOTP.is_verified;
    } catch (error) {
      console.error('Error checking pending OTP:', error);
      return false;
    }
  }
}