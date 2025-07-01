import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from './slices/authSlice';
import { verificationSlice } from './slices/verificationSlice';
import { appSlice } from './slices/appSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    verification: verificationSlice.reducer,
    app: appSlice.reducer,
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