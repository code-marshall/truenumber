import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { store } from './src/store';
import RootNavigator from './src/navigation/RootNavigator';
import { registerForPushNotificationsAsync } from './src/services/notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

export default function App() {
  useEffect(() => {
    async function initialize() {
      try {
        // Register for push notifications
        await registerForPushNotificationsAsync();
        
        // Configure notification channels for Android
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('truenumber-verifications', {
            name: 'Verification Requests',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#1e40af',
          });
        }
        
        // Hide splash screen
        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('App initialization error:', error);
        await SplashScreen.hideAsync();
      }
    }

    initialize();
  }, []);

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </Provider>
  );
}