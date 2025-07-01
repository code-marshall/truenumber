import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StatusBar,
  Dimensions,
} from 'react-native';
import { mockApi, SubmitVerificationRequest } from '../services/mockApi';

interface VerificationData {
  mobileNumber: string;
  verificationId: string;
}

type VerificationState = 'initial' | 'loading' | 'success' | 'error';

export default function TrueNumberApp() {
  const [verificationData, setVerificationData] = useState<VerificationData | null>(null);
  const [verificationState, setVerificationState] = useState<VerificationState>('initial');
  const [resultMessage, setResultMessage] = useState<string>('');
  const [appUserId] = useState<string>(mockApi.generateAppUserId());

  // Simulate receiving deep link data on app start
  useEffect(() => {
    // Simulate a slight delay as if the app was opened via deep link
    const timer = setTimeout(() => {
      const deepLinkData = mockApi.simulateDeepLink();
      setVerificationData(deepLinkData);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleVerifyNumber = async () => {
    if (!verificationData) return;

    setVerificationState('loading');

    try {
      const request: SubmitVerificationRequest = {
        verificationId: verificationData.verificationId,
        userConfirmedNumber: verificationData.mobileNumber,
        appUserId: appUserId,
      };

      const response = await mockApi.submitVerification(request);

      if (response.status === 'success') {
        setVerificationState('success');
        setResultMessage(response.message);
      } else {
        setVerificationState('error');
        setResultMessage(response.message);
      }
    } catch (error) {
      setVerificationState('error');
      setResultMessage('Network error occurred. Please try again.');
    }
  };

  const handleNewVerification = () => {
    setVerificationState('initial');
    setResultMessage('');
    const deepLinkData = mockApi.simulateDeepLink();
    setVerificationData(deepLinkData);
  };

  const formatPhoneNumber = (number: string) => {
    // Simple formatting for display
    if (number.startsWith('+1')) {
      const digits = number.slice(2);
      return `+1 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    }
    return number;
  };

  const renderInitialState = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.logo}>TrueNumber</Text>
        <Text style={styles.subtitle}>Secure Mobile Verification</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.instruction}>
          Please verify that this is your mobile number:
        </Text>
        
        <View style={styles.numberContainer}>
          <Text style={styles.phoneNumber}>
            {verificationData ? formatPhoneNumber(verificationData.mobileNumber) : ''}
          </Text>
        </View>

        <Text style={styles.verificationId}>
          Verification ID: {verificationData?.verificationId}
        </Text>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerifyNumber}
          disabled={!verificationData}
        >
          <Text style={styles.verifyButtonText}>Verify This Number</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.simulateButton}
          onPress={handleNewVerification}
        >
          <Text style={styles.simulateButtonText}>Simulate New Deep Link</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          This verification was requested by a trusted company to confirm your mobile number.
        </Text>
      </View>
    </>
  );

  const renderLoadingState = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.logo}>TrueNumber</Text>
        <Text style={styles.subtitle}>Verifying...</Text>
      </View>

      <View style={styles.card}>
        <ActivityIndicator size="large" color="#007AFF" style={styles.loader} />
        <Text style={styles.loadingText}>Verifying your mobile number</Text>
        <Text style={styles.loadingSubtext}>Please wait a moment...</Text>
      </View>
    </>
  );

  const renderResultState = () => {
    const isSuccess = verificationState === 'success';
    
    return (
      <>
        <View style={styles.header}>
          <Text style={styles.logo}>TrueNumber</Text>
          <Text style={[styles.subtitle, { color: isSuccess ? '#34C759' : '#FF3B30' }]}>
            {isSuccess ? 'Verification Complete' : 'Verification Failed'}
          </Text>
        </View>

        <View style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: isSuccess ? '#E8F5E8' : '#FFE8E8' }]}>
            <Text style={[styles.icon, { color: isSuccess ? '#34C759' : '#FF3B30' }]}>
              {isSuccess ? '✓' : '✗'}
            </Text>
          </View>

          <Text style={styles.resultMessage}>{resultMessage}</Text>

          {isSuccess && verificationData && (
            <Text style={styles.verifiedNumber}>
              {formatPhoneNumber(verificationData.mobileNumber)}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.verifyButton, { backgroundColor: '#6C7B7F' }]}
            onPress={handleNewVerification}
          >
            <Text style={styles.verifyButtonText}>Try Another Verification</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderContent = () => {
    switch (verificationState) {
      case 'loading':
        return renderLoadingState();
      case 'success':
      case 'error':
        return renderResultState();
      default:
        return renderInitialState();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      {renderContent()}
    </SafeAreaView>
  );
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6C7B7F',
    fontWeight: '500',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  instruction: {
    fontSize: 18,
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '600',
  },
  numberContainer: {
    backgroundColor: '#F0F4F8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
  },
  phoneNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    letterSpacing: 1,
  },
  verificationId: {
    fontSize: 12,
    color: '#6C7B7F',
    textAlign: 'center',
    marginBottom: 32,
    fontFamily: 'monospace',
  },
  verifyButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  simulateButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  simulateButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    marginTop: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#6C7B7F',
    textAlign: 'center',
    lineHeight: 20,
  },
  loader: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 18,
    color: '#1A1A1A',
    textAlign: 'center',
    fontWeight: '600',
    marginBottom: 8,
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#6C7B7F',
    textAlign: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  resultMessage: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  verifiedNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007AFF',
    textAlign: 'center',
    marginBottom: 24,
    letterSpacing: 1,
  },
});
