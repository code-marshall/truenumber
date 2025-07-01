// User related types
export interface User {
  id: string;
  phoneNumber: string;
  isVerified: boolean;
  deviceFingerprint: string;
  createdAt: string;
  updatedAt: string;
}

// Verification related types
export interface VerificationRequest {
  id: string;
  companyId: string;
  companyName: string;
  companyLogo?: string;
  phoneNumber: string;
  purpose: string;
  status: 'pending' | 'approved' | 'declined' | 'expired';
  createdAt: string;
  expiresAt: string;
  metadata?: Record<string, any>;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  domain: string;
  isVerified: boolean;
  isTrusted: boolean;
}

// App state types
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface VerificationState {
  pendingRequests: VerificationRequest[];
  completedRequests: VerificationRequest[];
  isProcessing: boolean;
  error: string | null;
}

export interface AppState {
  isOnboarded: boolean;
  biometricEnabled: boolean;
  notificationsEnabled: boolean;
  trustedCompanies: string[];
  settings: UserSettings;
}

export interface UserSettings {
  autoApproveEnabled: boolean;
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
  blockedCompanies: string[];
  requireBiometricForHighValue: boolean;
  dataRetentionDays: number;
}

// API related types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

// Notification types
export interface PushNotificationPayload {
  verificationRequestId: string;
  companyName: string;
  companyLogo?: string;
  phoneNumber: string;
  purpose: string;
  expiresAt: string;
}

// Security types
export interface DeviceInfo {
  deviceId: string;
  platform: 'ios' | 'android';
  osVersion: string;
  appVersion: string;
  isJailbroken: boolean;
  hasPasscode: boolean;
  biometricType: 'none' | 'fingerprint' | 'face' | 'iris';
}

export interface CryptoKeys {
  publicKey: string;
  privateKey: string;
  keyId: string;
  createdAt: string;
}

// Navigation types
export type RootStackParamList = {
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  Verification: { requestId: string };
};

export type MainTabParamList = {
  Dashboard: undefined;
  History: undefined;
  Settings: undefined;
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  PhoneInput: undefined;
  OTPVerification: { phoneNumber: string };
  Permissions: undefined;
  Complete: undefined;
};

// Form types
export interface PhoneInputForm {
  countryCode: string;
  phoneNumber: string;
  acceptTerms: boolean;
}

export interface OTPForm {
  code: string;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'succeeded' | 'failed';

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};