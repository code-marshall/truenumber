export interface OTPCode {
    id: string;
    mobile_number: string;
    country_code: string;
    otp_code: string;
    created_at?: Date;
    expires_at: Date;
    is_verified: boolean;
    attempts: number;
    max_attempts: number;
}
export declare class OTPModel {
    static create(otpData: Omit<OTPCode, 'id' | 'created_at' | 'is_verified' | 'attempts' | 'max_attempts'>): Promise<OTPCode>;
    static findByMobileAndCode(mobile_number: string, country_code: string, otp_code: string): Promise<OTPCode | null>;
    static findLatestByMobile(mobile_number: string, country_code: string): Promise<OTPCode | null>;
    static incrementAttempts(id: string): Promise<OTPCode | null>;
    static markAsVerified(id: string): Promise<OTPCode | null>;
    static cleanupExpired(): Promise<number>;
    static invalidateExistingOTPs(mobile_number: string, country_code: string): Promise<number>;
}
//# sourceMappingURL=OTP.d.ts.map