import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { useRouter } from "expo-router";
import { mockApi } from "../services/api";

// Mock country data
const countries = [
  { code: "+1", name: "United States", flag: "🇺🇸" },
  { code: "+44", name: "United Kingdom", flag: "🇬🇧" },
  { code: "+91", name: "India", flag: "🇮🇳" },
  { code: "+86", name: "China", flag: "🇨🇳" },
  { code: "+49", name: "Germany", flag: "🇩🇪" },
  { code: "+33", name: "France", flag: "🇫🇷" },
  { code: "+81", name: "Japan", flag: "🇯🇵" },
  { code: "+55", name: "Brazil", flag: "🇧🇷" },
];

export default function Register() {
  const router = useRouter();
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSendOTP = async () => {
    if (!phoneNumber.trim()) {
      Alert.alert("Error", "Please enter your phone number");
      return;
    }

    if (phoneNumber.length < 8) {
      Alert.alert("Error", "Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    try {
      const response = await mockApi.sendOTP(selectedCountry.code, phoneNumber);
      if (response.success) {
        router.push({
          pathname: "/otp",
          params: {
            countryCode: selectedCountry.code,
            phoneNumber: phoneNumber,
          },
        });
      } else {
        Alert.alert("Error", response.message);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Enter your phone number</Text>
        <Text style={styles.subtitle}>
          We'll send you a verification code to confirm your number
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.label}>Country</Text>
        <TouchableOpacity
          style={styles.countrySelector}
          onPress={() => setShowCountryPicker(!showCountryPicker)}
        >
          <Text style={styles.countryText}>
            {selectedCountry.flag} {selectedCountry.name} ({selectedCountry.code})
          </Text>
          <Text style={styles.arrow}>{showCountryPicker ? "▲" : "▼"}</Text>
        </TouchableOpacity>

        {showCountryPicker && (
          <ScrollView style={styles.countryList} nestedScrollEnabled>
            {countries.map((country) => (
              <TouchableOpacity
                key={country.code}
                style={styles.countryItem}
                onPress={() => {
                  setSelectedCountry(country);
                  setShowCountryPicker(false);
                }}
              >
                <Text style={styles.countryItemText}>
                  {country.flag} {country.name} ({country.code})
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        <Text style={styles.label}>Phone Number</Text>
        <View style={styles.phoneInputContainer}>
          <Text style={styles.countryCodeText}>{selectedCountry.code}</Text>
          <TextInput
            style={styles.phoneInput}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
            maxLength={15}
          />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleSendOTP}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? "Sending..." : "Send OTP"}
        </Text>
      </TouchableOpacity>
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
    marginBottom: 40,
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
  form: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 8,
    marginTop: 20,
  },
  countrySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  countryText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  arrow: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  countryList: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    maxHeight: 200,
    marginTop: 5,
  },
  countryItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  countryItemText: {
    fontSize: 16,
    color: '#2c3e50',
  },
  phoneInputContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
  },
  countryCodeText: {
    padding: 15,
    backgroundColor: '#ecf0f1',
    fontSize: 16,
    color: '#2c3e50',
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    padding: 15,
    fontSize: 16,
    color: '#2c3e50',
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 30,
  },
  buttonDisabled: {
    backgroundColor: '#bdc3c7',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
});