import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, RefreshControl, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { mockApi, PendingValidation } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Home() {
  const router = useRouter();
  const { user, token, logout } = useAuth();
  const [pendingValidations, setPendingValidations] = useState<PendingValidation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());

  const fetchPendingValidations = async () => {
    if (!token) return;

    try {
      const response = await mockApi.getPendingValidations(token);
      if (response.success && response.validations) {
        setPendingValidations(response.validations);
        setLastChecked(new Date());
      }
    } catch (error) {
      console.error('Failed to fetch pending validations:', error);
    }
  };

  useEffect(() => {
    fetchPendingValidations();

    // Check for pending validations every 10 seconds
    const interval = setInterval(fetchPendingValidations, 10000);
    return () => clearInterval(interval);
  }, [token]);

  const handleRefresh = async () => {
    setIsLoading(true);
    await fetchPendingValidations();
    setIsLoading(false);
  };

  const handleVerification = (validation: PendingValidation) => {
    router.push({
      pathname: "/verify",
      params: {
        validationId: validation.id,
        companyName: validation.companyName,
        options: JSON.stringify(validation.options),
        correctOption: validation.correctOption.toString(),
      },
    });
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => {
            logout();
            router.replace("/");
          }
        },
      ]
    );
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>User not found</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <Text style={styles.greeting}>Hello, {user.name}!</Text>
          <Text style={styles.phoneNumber}>
            {user.countryCode} {user.phoneNumber}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statusCard}>
        <Text style={styles.statusTitle}>Verification Status</Text>
        <Text style={styles.statusText}>✅ Your number is verified and ready</Text>
        <Text style={styles.lastCheckedText}>
          Last checked: {lastChecked.toLocaleTimeString()}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Verifications</Text>
        
        {pendingValidations.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📱</Text>
            <Text style={styles.emptyTitle}>No pending verifications</Text>
            <Text style={styles.emptyText}>
              When companies request verification, they'll appear here.
            </Text>
          </View>
        ) : (
          pendingValidations.map((validation) => (
            <TouchableOpacity
              key={validation.id}
              style={styles.validationCard}
              onPress={() => handleVerification(validation)}
            >
              <View style={styles.validationHeader}>
                <Text style={styles.companyName}>{validation.companyName}</Text>
                <Text style={styles.pendingBadge}>Pending</Text>
              </View>
              <Text style={styles.validationText}>
                Tap to verify your identity with {validation.companyName}
              </Text>
              <Text style={styles.verifyButton}>Verify Now →</Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.infoTitle}>How it works</Text>
        <Text style={styles.infoText}>
          1. Companies request verification through TrueNumber
        </Text>
        <Text style={styles.infoText}>
          2. You'll see the request here and select the correct number
        </Text>
        <Text style={styles.infoText}>
          3. Your identity is verified without sharing your actual number
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  phoneNumber: {
    fontSize: 16,
    color: '#7f8c8d',
    marginTop: 4,
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#e74c3c',
    fontWeight: '600',
  },
  statusCard: {
    backgroundColor: 'white',
    margin: 20,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 16,
    color: '#27ae60',
    marginBottom: 10,
  },
  lastCheckedText: {
    fontSize: 14,
    color: '#7f8c8d',
  },
  section: {
    margin: 20,
    marginTop: 0,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 15,
    alignItems: 'center',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 22,
  },
  validationCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  validationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  pendingBadge: {
    backgroundColor: '#f39c12',
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  validationText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  verifyButton: {
    fontSize: 16,
    color: '#3498db',
    fontWeight: '600',
  },
  infoSection: {
    margin: 20,
    marginTop: 0,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 15,
  },
  infoText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
    lineHeight: 22,
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    textAlign: 'center',
    marginTop: 100,
  },
});