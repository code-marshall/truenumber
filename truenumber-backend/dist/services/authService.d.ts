import { User } from '../models/User';
export interface TokenPayload {
    uid: string;
    mobile_number: string;
    country_code: string;
    name: string;
}
export declare class AuthService {
    static generateToken(user: User): string;
    static verifyToken(token: string): TokenPayload | null;
    static extractTokenFromHeader(authHeader: string | undefined): string | null;
    static generateRefreshToken(userId: string): string;
    static verifyRefreshToken(token: string): {
        uid: string;
    } | null;
}
//# sourceMappingURL=authService.d.ts.map