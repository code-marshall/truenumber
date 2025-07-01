import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User, ApiResponse } from '../../types';
import { apiService } from '../../services/api';

// Initial state
const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  refreshToken: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const loginWithOTP = createAsyncThunk(
  'auth/loginWithOTP',
  async ({ phoneNumber, otpCode }: { phoneNumber: string; otpCode: string }) => {
    const response = await apiService.post<ApiResponse<{
      user: User;
      token: string;
      refreshToken: string;
    }>>('/auth/verify-otp', { phoneNumber, otpCode });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'OTP verification failed');
    }
    
    return response.data.data!;
  }
);

export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async (phoneNumber: string) => {
    const response = await apiService.post<ApiResponse>('/auth/send-otp', { phoneNumber });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to send OTP');
    }
    
    return phoneNumber;
  }
);

export const refreshAccessToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    const refreshToken = state.auth.refreshToken;
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await apiService.post<ApiResponse<{
      token: string;
      refreshToken: string;
    }>>('/auth/refresh', { refreshToken });
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Token refresh failed');
    }
    
    return response.data.data!;
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState }) => {
    const state = getState() as { auth: AuthState };
    const token = state.auth.token;
    
    if (token) {
      try {
        await apiService.post('/auth/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        // Continue with logout even if API call fails
        console.warn('Logout API call failed:', error);
      }
    }
  }
);

// Auth slice
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setTokens: (state, action: PayloadAction<{ token: string; refreshToken: string }>) => {
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send OTP';
      })
      
      // Login with OTP
      .addCase(loginWithOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(loginWithOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      
      // Refresh token
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        // Clear auth on refresh failure
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
      })
      
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        state.error = null;
      });
  },
});

export const { clearError, setUser, updateUser, setTokens, clearAuth } = authSlice.actions;
export default authSlice.reducer;