import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import verificationSlice from './slices/verificationSlice';
import settingsSlice from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    verification: verificationSlice,
    settings: settingsSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;