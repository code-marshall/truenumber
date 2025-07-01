// import * as Keychain from 'react-native-keychain';

export class SecureStorageService {
  private static readonly ACCESS_TOKEN_KEY = 'access_token';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private static readonly USER_DATA_KEY = 'user_data';

  static async setAccessToken(token: string): Promise<void> {
    try {
      // await Keychain.setInternetCredentials(
      //   this.ACCESS_TOKEN_KEY,
      //   'token',
      //   token
      // );
      // Fallback for development
      console.log('Setting access token:', token);
    } catch (error) {
      console.error('Error setting access token:', error);
      throw error;
    }
  }

  static async getAccessToken(): Promise<string | null> {
    try {
      // const credentials = await Keychain.getInternetCredentials(this.ACCESS_TOKEN_KEY);
      // if (credentials) {
      //   return credentials.password;
      // }
      // return null;
      
      // Fallback for development
      return 'mock_access_token';
    } catch (error) {
      console.error('Error getting access token:', error);
      return null;
    }
  }

  static async setRefreshToken(token: string): Promise<void> {
    try {
      // await Keychain.setInternetCredentials(
      //   this.REFRESH_TOKEN_KEY,
      //   'token',
      //   token
      // );
      // Fallback for development
      console.log('Setting refresh token:', token);
    } catch (error) {
      console.error('Error setting refresh token:', error);
      throw error;
    }
  }

  static async getRefreshToken(): Promise<string | null> {
    try {
      // const credentials = await Keychain.getInternetCredentials(this.REFRESH_TOKEN_KEY);
      // if (credentials) {
      //   return credentials.password;
      // }
      // return null;
      
      // Fallback for development
      return 'mock_refresh_token';
    } catch (error) {
      console.error('Error getting refresh token:', error);
      return null;
    }
  }

  static async clearAll(): Promise<void> {
    try {
      // await Keychain.resetInternetCredentials(this.ACCESS_TOKEN_KEY);
      // await Keychain.resetInternetCredentials(this.REFRESH_TOKEN_KEY);
      // await Keychain.resetInternetCredentials(this.USER_DATA_KEY);
      
      // Fallback for development
      console.log('Clearing all secure storage');
    } catch (error) {
      console.error('Error clearing secure storage:', error);
    }
  }

  static async setUserData(userData: string): Promise<void> {
    try {
      // await Keychain.setInternetCredentials(
      //   this.USER_DATA_KEY,
      //   'user',
      //   userData
      // );
      // Fallback for development
      console.log('Setting user data:', userData);
    } catch (error) {
      console.error('Error setting user data:', error);
      throw error;
    }
  }

  static async getUserData(): Promise<string | null> {
    try {
      // const credentials = await Keychain.getInternetCredentials(this.USER_DATA_KEY);
      // if (credentials) {
      //   return credentials.password;
      // }
      // return null;
      
      // Fallback for development
      return null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  }
}