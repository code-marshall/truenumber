export declare class OTPService {
    static generateOTP(): string;
    static sendOTP(mobile_number: string, country_code: string): Promise<{
        success: boolean;
        message: string;
        otp?: string;
    }>;
    static verifyOTP(mobile_number: string, country_code: string, otp_code: string): Promise<{
        success: boolean;
        message: string;
        isExpired?: boolean;
        attemptsExceeded?: boolean;
    }>;
    static cleanupExpiredOTPs(): Promise<number>;
    static hasPendingOTP(mobile_number: string, country_code: string): Promise<boolean>;
}
//# sourceMappingURL=otpService.d.ts.map