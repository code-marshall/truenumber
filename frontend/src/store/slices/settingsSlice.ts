import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Company } from '@/types/navigation';

interface SettingsState {
  notifications: {
    enabled: boolean;
    sound: boolean;
    vibration: boolean;
    verificationRequests: boolean;
  };
  security: {
    biometricEnabled: boolean;
    pinRequired: boolean;
    autoLockTimeout: number; // in minutes
  };
  privacy: {
    dataSharing: boolean;
    analytics: boolean;
    crashReporting: boolean;
  };
  companies: {
    trusted: Company[];
    blocked: Company[];
    autoVerifyEnabled: boolean;
  };
  theme: 'light' | 'dark' | 'system';
  language: string;
}

const initialState: SettingsState = {
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    verificationRequests: true,
  },
  security: {
    biometricEnabled: false,
    pinRequired: false,
    autoLockTimeout: 5,
  },
  privacy: {
    dataSharing: false,
    analytics: true,
    crashReporting: true,
  },
  companies: {
    trusted: [],
    blocked: [],
    autoVerifyEnabled: false,
  },
  theme: 'system',
  language: 'en',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    updateNotificationSettings: (state, action: PayloadAction<Partial<SettingsState['notifications']>>) => {
      state.notifications = { ...state.notifications, ...action.payload };
    },
    updateSecuritySettings: (state, action: PayloadAction<Partial<SettingsState['security']>>) => {
      state.security = { ...state.security, ...action.payload };
    },
    updatePrivacySettings: (state, action: PayloadAction<Partial<SettingsState['privacy']>>) => {
      state.privacy = { ...state.privacy, ...action.payload };
    },
    addTrustedCompany: (state, action: PayloadAction<Company>) => {
      const company = action.payload;
      if (!state.companies.trusted.find(c => c.id === company.id)) {
        state.companies.trusted.push(company);
      }
      // Remove from blocked if it exists there
      state.companies.blocked = state.companies.blocked.filter(c => c.id !== company.id);
    },
    removeTrustedCompany: (state, action: PayloadAction<string>) => {
      const companyId = action.payload;
      state.companies.trusted = state.companies.trusted.filter(c => c.id !== companyId);
    },
    addBlockedCompany: (state, action: PayloadAction<Company>) => {
      const company = action.payload;
      if (!state.companies.blocked.find(c => c.id === company.id)) {
        state.companies.blocked.push(company);
      }
      // Remove from trusted if it exists there
      state.companies.trusted = state.companies.trusted.filter(c => c.id !== company.id);
    },
    removeBlockedCompany: (state, action: PayloadAction<string>) => {
      const companyId = action.payload;
      state.companies.blocked = state.companies.blocked.filter(c => c.id !== companyId);
    },
    toggleAutoVerify: (state) => {
      state.companies.autoVerifyEnabled = !state.companies.autoVerifyEnabled;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark' | 'system'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    resetSettings: () => initialState,
  },
});

export const {
  updateNotificationSettings,
  updateSecuritySettings,
  updatePrivacySettings,
  addTrustedCompany,
  removeTrustedCompany,
  addBlockedCompany,
  removeBlockedCompany,
  toggleAutoVerify,
  setTheme,
  setLanguage,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;