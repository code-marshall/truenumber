"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OTPService = void 0;
const OTP_1 = require("../models/OTP");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const OTP_LENGTH = parseInt(process.env.OTP_LENGTH || '6');
const OTP_EXPIRY_MINUTES = parseInt(process.env.OTP_EXPIRY_MINUTES || '10');
class OTPService {
    static generateOTP() {
        const digits = '0123456789';
        let otp = '';
        for (let i = 0; i < OTP_LENGTH; i++) {
            otp += digits[Math.floor(Math.random() * 10)];
        }
        return otp;
    }
    static async sendOTP(mobile_number, country_code) {
        try {
            await OTP_1.OTPModel.invalidateExistingOTPs(mobile_number, country_code);
            const otp_code = this.generateOTP();
            const expires_at = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
            const otpRecord = await OTP_1.OTPModel.create({
                mobile_number,
                country_code,
                otp_code,
                expires_at
            });
            console.log(`[MOCK SMS] Sending OTP ${otp_code} to ${country_code}${mobile_number}`);
            return {
                success: true,
                message: 'OTP sent successfully',
                otp: process.env.NODE_ENV === 'development' ? otp_code : undefined
            };
        }
        catch (error) {
            console.error('Error sending OTP:', error);
            return {
                success: false,
                message: 'Failed to send OTP'
            };
        }
    }
    static async verifyOTP(mobile_number, country_code, otp_code) {
        try {
            const otpRecord = await OTP_1.OTPModel.findByMobileAndCode(mobile_number, country_code, otp_code);
            if (!otpRecord) {
                return {
                    success: false,
                    message: 'Invalid OTP code'
                };
            }
            if (otpRecord.is_verified) {
                return {
                    success: false,
                    message: 'OTP has already been used'
                };
            }
            if (new Date() > new Date(otpRecord.expires_at)) {
                return {
                    success: false,
                    message: 'OTP has expired',
                    isExpired: true
                };
            }
            if (otpRecord.attempts >= otpRecord.max_attempts) {
                return {
                    success: false,
                    message: 'Maximum verification attempts exceeded',
                    attemptsExceeded: true
                };
            }
            await OTP_1.OTPModel.incrementAttempts(otpRecord.id);
            await OTP_1.OTPModel.markAsVerified(otpRecord.id);
            return {
                success: true,
                message: 'OTP verified successfully'
            };
        }
        catch (error) {
            console.error('Error verifying OTP:', error);
            return {
                success: false,
                message: 'Failed to verify OTP'
            };
        }
    }
    static async cleanupExpiredOTPs() {
        try {
            const deletedCount = await OTP_1.OTPModel.cleanupExpired();
            console.log(`Cleaned up ${deletedCount} expired OTP records`);
            return deletedCount;
        }
        catch (error) {
            console.error('Error cleaning up expired OTPs:', error);
            return 0;
        }
    }
    static async hasPendingOTP(mobile_number, country_code) {
        try {
            const latestOTP = await OTP_1.OTPModel.findLatestByMobile(mobile_number, country_code);
            return latestOTP !== null && !latestOTP.is_verified;
        }
        catch (error) {
            console.error('Error checking pending OTP:', error);
            return false;
        }
    }
}
exports.OTPService = OTPService;
//# sourceMappingURL=otpService.js.map