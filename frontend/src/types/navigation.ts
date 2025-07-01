export type RootStackParamList = {
  OnboardingStack: undefined;
  MainStack: undefined;
  VerificationModal: {
    requestId: string;
    phoneNumber: string;
    companyName: string;
    companyLogo?: string;
    timestamp: string;
  };
};

export type OnboardingStackParamList = {
  Welcome: undefined;
  PhoneInput: undefined;
  OTPVerification: {
    phoneNumber: string;
    countryCode: string;
  };
  BiometricSetup: undefined;
  OnboardingComplete: undefined;
};

export type MainStackParamList = {
  Dashboard: undefined;
  Settings: undefined;
  VerificationHistory: undefined;
  CompanySettings: undefined;
  SecuritySettings: undefined;
  Profile: undefined;
};

export type VerificationRequest = {
  requestId: string;
  phoneNumber: string;
  companyName: string;
  companyLogo?: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'declined' | 'expired';
  expiresAt: string;
};

export type User = {
  id: string;
  phoneNumber: string;
  countryCode: string;
  deviceId: string;
  isVerified: boolean;
  biometricEnabled: boolean;
  fcmToken?: string;
  createdAt: string;
  updatedAt: string;
};

export type Company = {
  id: string;
  name: string;
  logo?: string;
  verified: boolean;
  trustLevel: 'low' | 'medium' | 'high';
  isBlocked: boolean;
  autoVerify: boolean;
};