"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
class AuthService {
    static generateToken(user) {
        const payload = {
            uid: user.uid,
            mobile_number: user.mobile_number,
            country_code: user.country_code,
            name: user.name
        };
        return jsonwebtoken_1.default.sign(payload, JWT_SECRET, {
            expiresIn: JWT_EXPIRES_IN,
            issuer: 'truenumber-api',
            subject: user.uid
        });
    }
    static verifyToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            return {
                uid: decoded.uid,
                mobile_number: decoded.mobile_number,
                country_code: decoded.country_code,
                name: decoded.name
            };
        }
        catch (error) {
            console.error('Token verification failed:', error);
            return null;
        }
    }
    static extractTokenFromHeader(authHeader) {
        if (!authHeader)
            return null;
        const parts = authHeader.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return null;
        }
        return parts[1];
    }
    static generateRefreshToken(userId) {
        return jsonwebtoken_1.default.sign({ uid: userId, type: 'refresh' }, JWT_SECRET, { expiresIn: '30d' });
    }
    static verifyRefreshToken(token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
            if (decoded.type !== 'refresh') {
                return null;
            }
            return { uid: decoded.uid };
        }
        catch (error) {
            console.error('Refresh token verification failed:', error);
            return null;
        }
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=authService.js.map