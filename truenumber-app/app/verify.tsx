import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { mockApi } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

export default function Verify() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { token } = useAuth();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validationId = params.validationId as string;
  const companyName = params.companyName as string;
  const options = JSON.parse(params.options as string) as number[];
  const correctOption = parseInt(params.correctOption as string);

  const handleOptionSelect = (option: number) => {
    setSelectedOption(option);
  };

  const handleVerify = async () => {
    if (selectedOption === null) {
      Alert.alert("Error", "Please select a number to verify");
      return;
    }

    if (!token) {
      Alert.alert("Error", "Authentication error. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await mockApi.verifySelection(token, validationId, selectedOption);
      if (response.success) {
        Alert.alert(
          response.correct ? "Verification Successful!" : "Verification Failed",
          response.message,
          [
            {
              text: "OK",
              onPress: () => router.replace("/home"),
            },
          ]
        );
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to verify. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Cancel Verification",
      "Are you sure you want to cancel this verification?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes",
          style: "destructive",
          onPress: () => router.replace("/home"),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Verify with {companyName}</Text>
        <Text style={styles.subtitle}>
          Select the correct number that was circled for you
        </Text>
      </View>

      <View style={styles.instructionCard}>
        <Text style={styles.instructionTitle}>Instructions:</Text>
        <Text style={styles.instructionText}>
          • {companyName} has shown you 3 numbers
        </Text>
        <Text style={styles.instructionText}>
          • One of them should be circled or highlighted
        </Text>
        <Text style={styles.instructionText}>
          • Select that number below to complete verification
        </Text>
      </View>

      <View style={styles.optionsContainer}>
        <Text style={styles.optionsTitle}>Select the circled number:</Text>
        {options.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.optionCard,
              selectedOption === option && styles.optionCardSelected,
            ]}
            onPress={() => handleOptionSelect(option)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option && styles.optionTextSelected,
              ]}
            >
              {option.toLocaleString()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.verifyButton,
            (selectedOption === null || isLoading) && styles.verifyButtonDisabled,
          ]}
          onPress={handleVerify}
          disabled={selectedOption === null || isLoading}
        >
          <Text style={styles.verifyButtonText}>
            {isLoading ? "Verifying..." : "Verify"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.securityNote}>
        <Text style={styles.securityText}>
          🔒 Your actual phone number is never shared with {companyName}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    lineHeight: 22,
  },
  instructionCard: {
    backgroundColor: '#e8f4fd',
    padding: 20,
    borderRadius: 15,
    marginBottom: 30,
  },
  instructionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2980b9',
    marginBottom: 12,
  },
  instructionText: {
    fontSize: 16,
    color: '#2980b9',
    marginBottom: 8,
    lineHeight: 22,
  },
  optionsContainer: {
    flex: 1,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 20,
  },
  optionCard: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  optionCardSelected: {
    borderColor: '#3498db',
    backgroundColor: '#e8f4fd',
  },
  optionText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  optionTextSelected: {
    color: '#2980b9',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 15,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    paddingVertical: 15,
    borderRadius: 10,
  },
  cancelButtonText: {
    color: '#2c3e50',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  verifyButton: {
    flex: 1,
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 10,
  },
  verifyButtonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  securityNote: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#d5f4e6',
    borderRadius: 10,
  },
  securityText: {
    fontSize: 14,
    color: '#27ae60',
    textAlign: 'center',
    fontWeight: '500',
  },
});