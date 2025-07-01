import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { VerificationRequest } from '@/types/navigation';

interface VerificationState {
  requests: VerificationRequest[];
  pendingRequests: VerificationRequest[];
  history: VerificationRequest[];
  isLoading: boolean;
  error: string | null;
}

const initialState: VerificationState = {
  requests: [],
  pendingRequests: [],
  history: [],
  isLoading: false,
  error: null,
};

const verificationSlice = createSlice({
  name: 'verification',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    addVerificationRequest: (state, action: PayloadAction<VerificationRequest>) => {
      state.requests.push(action.payload);
      if (action.payload.status === 'pending') {
        state.pendingRequests.push(action.payload);
      }
    },
    updateVerificationRequest: (state, action: PayloadAction<{ requestId: string; updates: Partial<VerificationRequest> }>) => {
      const { requestId, updates } = action.payload;
      
      // Update in requests array
      const requestIndex = state.requests.findIndex(req => req.requestId === requestId);
      if (requestIndex !== -1) {
        state.requests[requestIndex] = { ...state.requests[requestIndex], ...updates };
      }
      
      // Update in pending requests
      const pendingIndex = state.pendingRequests.findIndex(req => req.requestId === requestId);
      if (pendingIndex !== -1) {
        if (updates.status && updates.status !== 'pending') {
          // Move to history and remove from pending
          state.history.push({ ...state.pendingRequests[pendingIndex], ...updates });
          state.pendingRequests.splice(pendingIndex, 1);
        } else {
          state.pendingRequests[pendingIndex] = { ...state.pendingRequests[pendingIndex], ...updates };
        }
      }
    },
    removeVerificationRequest: (state, action: PayloadAction<string>) => {
      const requestId = action.payload;
      state.requests = state.requests.filter(req => req.requestId !== requestId);
      state.pendingRequests = state.pendingRequests.filter(req => req.requestId !== requestId);
    },
    clearPendingRequests: (state) => {
      state.pendingRequests = [];
    },
    clearHistory: (state) => {
      state.history = [];
    },
    loadHistory: (state, action: PayloadAction<VerificationRequest[]>) => {
      state.history = action.payload;
    },
  },
});

export const {
  setLoading,
  setError,
  addVerificationRequest,
  updateVerificationRequest,
  removeVerificationRequest,
  clearPendingRequests,
  clearHistory,
  loadHistory,
} = verificationSlice.actions;

export default verificationSlice.reducer;