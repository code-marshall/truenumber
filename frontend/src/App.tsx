import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import messaging from '@react-native-firebase/messaging';
import { AppState, AppStateStatus, Alert } from 'react-native';

import { store } from '@/store';
import { PushNotificationService } from '@/services/PushNotificationService';
import { AuthService } from '@/services/AuthService';
import { SecureStorageService } from '@/services/SecureStorageService';

// Screens
import SplashScreen from '@/screens/SplashScreen';
import OnboardingStack from '@/navigation/OnboardingStack';
import MainStack from '@/navigation/MainStack';
import VerificationModal from '@/screens/VerificationModal';

// Types
import { RootStackParamList } from '@/types/navigation';

const Stack = createStackNavigator<RootStackParamList>();

const App: React.FC = () => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = React.useState(appState.current);
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    initializeApp();
    setupPushNotifications();
    setupAppStateListener();

    return () => {
      AppState.removeEventListener('change', handleAppStateChange);
    };
  }, []);

  const initializeApp = async () => {
    try {
      // Check if user is already authenticated
      const token = await SecureStorageService.getAccessToken();
      const isValidToken = await AuthService.validateToken(token);
      
      setIsAuthenticated(isValidToken);
      setIsLoading(false);
    } catch (error) {
      console.error('App initialization error:', error);
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  };

  const setupPushNotifications = async () => {
    try {
      // Request permission
      await PushNotificationService.requestPermission();
      
      // Handle foreground messages
      messaging().onMessage(async remoteMessage => {
        console.log('Foreground message received:', remoteMessage);
        
        if (remoteMessage.data?.type === 'verification_request') {
          // Show verification modal
          handleVerificationRequest(remoteMessage.data);
        }
      });

      // Handle background/quit state messages
      messaging().setBackgroundMessageHandler(async remoteMessage => {
        console.log('Background message received:', remoteMessage);
      });

      // Handle notification opened from background/quit state
      messaging().onNotificationOpenedApp(remoteMessage => {
        console.log('Notification opened app:', remoteMessage);
        
        if (remoteMessage.data?.type === 'verification_request') {
          handleVerificationRequest(remoteMessage.data);
        }
      });

      // Check if app was opened from a notification when closed
      const initialNotification = await messaging().getInitialNotification();
      if (initialNotification) {
        console.log('App opened from notification:', initialNotification);
        
        if (initialNotification.data?.type === 'verification_request') {
          handleVerificationRequest(initialNotification.data);
        }
      }
    } catch (error) {
      console.error('Push notification setup error:', error);
    }
  };

  const setupAppStateListener = () => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  };

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground');
      // Refresh authentication status when app becomes active
      refreshAuthStatus();
    }

    appState.current = nextAppState;
    setAppStateVisible(appState.current);
  };

  const refreshAuthStatus = async () => {
    try {
      const token = await SecureStorageService.getAccessToken();
      const isValidToken = await AuthService.validateToken(token);
      setIsAuthenticated(isValidToken);
    } catch (error) {
      console.error('Auth refresh error:', error);
      setIsAuthenticated(false);
    }
  };

  const handleVerificationRequest = (data: any) => {
    try {
      const verificationData = {
        requestId: data.requestId,
        phoneNumber: data.phoneNumber,
        companyName: data.companyName,
        companyLogo: data.companyLogo,
        timestamp: data.timestamp,
      };

      // Navigate to verification modal or show in-app notification
      // This would be handled by navigation or modal state management
      console.log('Handling verification request:', verificationData);
      
      Alert.alert(
        'Verification Request',
        `${data.companyName} wants to verify your phone number: ${data.phoneNumber}`,
        [
          {
            text: 'Decline',
            style: 'cancel',
            onPress: () => handleVerificationResponse(data.requestId, false),
          },
          {
            text: 'Verify',
            onPress: () => handleVerificationResponse(data.requestId, true),
          },
        ]
      );
    } catch (error) {
      console.error('Error handling verification request:', error);
    }
  };

  const handleVerificationResponse = async (requestId: string, approved: boolean) => {
    try {
      await AuthService.respondToVerification(requestId, approved);
      console.log(`Verification ${approved ? 'approved' : 'declined'} for request ${requestId}`);
    } catch (error) {
      console.error('Error responding to verification:', error);
      Alert.alert('Error', 'Failed to send verification response. Please try again.');
    }
  };

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
            }}
          >
            {isAuthenticated ? (
              <Stack.Screen
                name="MainStack"
                component={MainStack}
                options={{
                  animationTypeForReplace: 'push',
                }}
              />
            ) : (
              <Stack.Screen
                name="OnboardingStack"
                component={OnboardingStack}
                options={{
                  animationTypeForReplace: 'pop',
                }}
              />
            )}
            <Stack.Screen
              name="VerificationModal"
              component={VerificationModal}
              options={{
                presentation: 'modal',
                gestureEnabled: false,
              }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
};

export default App;