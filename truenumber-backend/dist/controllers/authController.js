"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const User_1 = require("../models/User");
const otpService_1 = require("../services/otpService");
const authService_1 = require("../services/authService");
class AuthController {
    static async sendOTP(req, res) {
        try {
            const { mobile_number, country_code } = req.body;
            if (!mobile_number || !country_code) {
                res.status(400).json({
                    success: false,
                    message: 'Mobile number and country code are required'
                });
                return;
            }
            if (!/^\d{10,15}$/.test(mobile_number)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid mobile number format'
                });
                return;
            }
            if (!/^\+?\d{1,4}$/.test(country_code)) {
                res.status(400).json({
                    success: false,
                    message: 'Invalid country code format'
                });
                return;
            }
            const hasPendingOTP = await otpService_1.OTPService.hasPendingOTP(mobile_number, country_code);
            if (hasPendingOTP) {
                res.status(429).json({
                    success: false,
                    message: 'OTP already sent. Please wait before requesting a new one.'
                });
                return;
            }
            const otpResult = await otpService_1.OTPService.sendOTP(mobile_number, country_code);
            if (otpResult.success) {
                res.status(200).json({
                    success: true,
                    message: otpResult.message,
                    ...(process.env.NODE_ENV === 'development' && { otp: otpResult.otp })
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: otpResult.message
                });
            }
        }
        catch (error) {
            console.error('Error in sendOTP:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async verifyOTP(req, res) {
        try {
            const { mobile_number, country_code, otp_code, name } = req.body;
            if (!mobile_number || !country_code || !otp_code) {
                res.status(400).json({
                    success: false,
                    message: 'Mobile number, country code, and OTP code are required'
                });
                return;
            }
            const otpResult = await otpService_1.OTPService.verifyOTP(mobile_number, country_code, otp_code);
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
            let user = await User_1.UserModel.findByMobileAndCountry(mobile_number, country_code);
            if (!user) {
                if (!name || name.trim().length === 0) {
                    res.status(400).json({
                        success: false,
                        message: 'Name is required for new user registration'
                    });
                    return;
                }
                user = await User_1.UserModel.create({
                    mobile_number,
                    country_code,
                    name: name.trim()
                });
            }
            const token = authService_1.AuthService.generateToken(user);
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
        }
        catch (error) {
            console.error('Error in verifyOTP:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    static async getProfile(req, res) {
        try {
            const userId = req.user?.uid;
            if (!userId) {
                res.status(401).json({
                    success: false,
                    message: 'User not authenticated'
                });
                return;
            }
            const user = await User_1.UserModel.findById(userId);
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
        }
        catch (error) {
            console.error('Error in getProfile:', error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=authController.js.map