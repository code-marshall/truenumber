import { User } from '@/types/navigation';
import { ApiService } from './ApiService';
import { SecureStorageService } from './SecureStorageService';

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface VerifyPhoneRequest {
  phoneNumber: string;
  countryCode: string;
  otp: string;
}

export interface VerificationResponse {
  requestId: string;
  approved: boolean;
  timestamp: string;
}

export class AuthService {
  private static readonly TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';

  static async sendOTP(phoneNumber: string, countryCode: string): Promise<{ requestId: string }> {
    try {
      const response = await ApiService.post('/auth/send-otp', {
        phoneNumber,
        countryCode,
      });
      return response.data;
    } catch (error) {
      console.error('Send OTP error:', error);
      throw error;
    }
  }

  static async verifyOTP(request: VerifyPhoneRequest): Promise<LoginResponse> {
    try {
      const response = await ApiService.post('/auth/verify-otp', request);
      const { user, accessToken, refreshToken } = response.data;

      // Store tokens securely
      await SecureStorageService.setAccessToken(accessToken);
      await SecureStorageService.setRefreshToken(refreshToken);

      return { user, accessToken, refreshToken };
    } catch (error) {
      console.error('Verify OTP error:', error);
      throw error;
    }
  }

  static async validateToken(token: string | null): Promise<boolean> {
    if (!token) return false;

    try {
      const response = await ApiService.get('/auth/validate', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.status === 200;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  static async refreshTokens(): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const refreshToken = await SecureStorageService.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      const response = await ApiService.post('/auth/refresh', {
        refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      // Store new tokens
      await SecureStorageService.setAccessToken(accessToken);
      await SecureStorageService.setRefreshToken(newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      console.error('Token refresh error:', error);
      // Clear invalid tokens
      await this.logout();
      throw error;
    }
  }

  static async logout(): Promise<void> {
    try {
      const accessToken = await SecureStorageService.getAccessToken();
      
      if (accessToken) {
        // Notify server about logout
        await ApiService.post('/auth/logout', {}, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of server response
      await SecureStorageService.clearAll();
    }
  }

  static async getCurrentUser(): Promise<User | null> {
    try {
      const accessToken = await SecureStorageService.getAccessToken();
      if (!accessToken) return null;

      const response = await ApiService.get('/auth/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      return response.data.user;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  }

  static async respondToVerification(requestId: string, approved: boolean): Promise<void> {
    try {
      const accessToken = await SecureStorageService.getAccessToken();
      if (!accessToken) {
        throw new Error('No access token available');
      }

      const response: VerificationResponse = {
        requestId,
        approved,
        timestamp: new Date().toISOString(),
      };

      await ApiService.post('/verification/respond', response, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Verification response error:', error);
      throw error;
    }
  }

  static async updateFCMToken(fcmToken: string): Promise<void> {
    try {
      const accessToken = await SecureStorageService.getAccessToken();
      if (!accessToken) return;

      await ApiService.post('/auth/update-fcm-token', {
        fcmToken,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Update FCM token error:', error);
    }
  }
}