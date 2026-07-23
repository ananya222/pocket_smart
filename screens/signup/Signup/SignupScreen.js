import { API_BASE_URL, saveToken } from "../../../config";
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
import { styles } from "./SignupScreen.styles";
import BackgroundGrid from "../../../components/BackgroundGrid/BackgroundGrid";
import PremiumInput from "../../../components/PremiumInput/PremiumInput";
import SignupHeader from "./components/SignupHeader/SignupHeader";
import SignupButton from "./components/SignupButton/SignupButton";
import SignupLoginRedirect from "./components/SignupLoginRedirect/SignupLoginRedirect";
import SignupTrustBadge from "./components/SignupTrustBadge/SignupTrustBadge";

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
        if (data.access_token) {
          await saveToken(data.access_token);
        }
        Alert.alert("Success", "Account created! Verify your OTP.", [
          { text: "OK", onPress: () => navigation.navigate("Otp") }
        ]);
      } else {
        Alert.alert("Signup Failed", data.error || "Could not create account.");
      }
    } catch (error) {
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
          <SignupHeader onBackPress={() => navigation.navigate("Login")} />

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
            <SignupButton onPress={handleSignup} />

            {/* Login redirect */}
            <SignupLoginRedirect onLoginPress={() => navigation.navigate("Login")} />

            {/* Trust Badge */}
            <SignupTrustBadge />

          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
