import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

export interface TokenPayload {
  uid: string;
  mobile_number: string;
  country_code: string;
  name: string;
}

export class AuthService {
  /**
   * Generate JWT token for user
   */
  static generateToken(user: User): string {
    const payload: TokenPayload = {
      uid: user.uid,
      mobile_number: user.mobile_number,
      country_code: user.country_code,
      name: user.name
    };

    return jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
      issuer: 'truenumber-api',
      subject: user.uid
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token and return payload
   */
  static verifyToken(token: string): TokenPayload | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as TokenPayload & jwt.JwtPayload;
      return {
        uid: decoded.uid,
        mobile_number: decoded.mobile_number,
        country_code: decoded.country_code,
        name: decoded.name
      };
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }

  /**
   * Extract token from Authorization header
   */
  static extractTokenFromHeader(authHeader: string | undefined): string | null {
    if (!authHeader) return null;
    
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return null;
    }
    
    return parts[1];
  }

  /**
   * Generate refresh token (for future implementation)
   */
  static generateRefreshToken(userId: string): string {
    return jwt.sign(
      { uid: userId, type: 'refresh' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );
  }

  /**
   * Verify refresh token
   */
  static verifyRefreshToken(token: string): { uid: string } | null {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.type !== 'refresh') {
        return null;
      }
      return { uid: decoded.uid };
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      return null;
    }
  }
}