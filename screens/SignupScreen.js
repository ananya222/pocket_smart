import { API_BASE_URL } from "../config";
// SignupScreen.js

import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useWindowDimensions,
  SafeAreaView
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { styles } from "../styles/SignupScreen.styles";
import BackgroundGrid from "../components/BackgroundGrid";

// Custom Input Component to handle focus borders and prevent main screen input re-render lags
function PremiumInput({ icon, placeholder, value, onChangeText, secureTextEntry, isPassword, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
      <Feather name={icon} size={18} color={isFocused ? "#9D4EDD" : "#8A90A8"} style={styles.icon} />
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.inputFlex}
        secureTextEntry={isPassword ? !showPassword : secureTextEntry}
        placeholderTextColor="#6C6F8F"
        autoCapitalize="none"
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#8A90A8" />
        </TouchableOpacity>
      )}
    </View>
  );
}

export default function SignupScreen({ navigation }) {
  const { height } = useWindowDimensions();
  
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    if (!fullName.trim() || !phoneNumber.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim(),
          password: password.trim(),
        }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert("Success", "Account created! Verify your OTP.", [
          { text: "OK", onPress: () => navigation.navigate("Otp") }
        ]);
      } else {
        Alert.alert("Signup Failed", data.error || "Could not create account.");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Connection Error", "Could not connect to the server.");
    }
  };

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <BackgroundGrid type="signup" />

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "transparent" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          contentContainerStyle={[styles.scrollContainer, { paddingTop: STATUS_BAR_HEIGHT + 16 }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row with Back Button */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", height: 40 }}>
            <TouchableOpacity 
              onPress={() => navigation.navigate("Login")} 
              style={styles.backButtonContainer}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Header text */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Create Account</Text>
            <Text style={styles.headerDescription}>Join PocketSmart and start saving today.</Text>
          </View>

          {/* Signup Form Card */}
          <BlurView intensity={100} tint="dark" style={styles.card}>
            
            <Text style={styles.inputLabel}>Full Name</Text>
            <PremiumInput
              icon="user"
              placeholder="Aarav Sharma"
              value={fullName}
              onChangeText={setFullName}
            />

            <Text style={styles.inputLabel}>Phone Number</Text>
            <PremiumInput
              icon="phone"
              placeholder="9876543210"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
            />

            <Text style={styles.inputLabel}>Email Address</Text>
            <PremiumInput
              icon="mail"
              placeholder="aarav@pocketsmart.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />

            <Text style={styles.inputLabel}>Password</Text>
            <PremiumInput
              icon="lock"
              placeholder="••••••••••••"
              value={password}
              onChangeText={setPassword}
              isPassword={true}
            />

            <Text style={styles.inputLabel}>Confirm Password</Text>
            <PremiumInput
              icon="lock"
              placeholder="••••••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              isPassword={true}
            />

            {/* Signup Button */}
             <TouchableOpacity
              onPress={handleSignup}
              activeOpacity={0.85}
              style={styles.buttonContainer}
            >
              <View style={styles.buttonSolid}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </View>
            </TouchableOpacity>

            {/* Login redirect */}
            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginContainer}>
              <Text style={styles.loginTextSub}>
                Already have an account? <Text style={styles.loginTextHighlight}>Log In</Text>
              </Text>
            </TouchableOpacity>

            {/* Trust Badge */}
            <View style={styles.trustBadgeContainer}>
              <Feather name="shield" size={15} color="#8A90A8" style={styles.trustIcon} />
              <Text style={styles.trustBadgeText}>Your data is safe and secure with us.</Text>
            </View>

          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}