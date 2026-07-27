// SignupScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { styles } from "./SignupScreen.styles";
import BackgroundGrid from "../../../components/BackgroundGrid/BackgroundGrid";
import PremiumInput from "../../../components/PremiumInput/PremiumInput";
import SignupHeader from "./components/SignupHeader/SignupHeader";
import SignupButton from "./components/SignupButton/SignupButton";
import SignupLoginRedirect from "./components/SignupLoginRedirect/SignupLoginRedirect";
import SignupTrustBadge from "./components/SignupTrustBadge/SignupTrustBadge";

import { auth, firestore } from "../../../config";

export default function SignupScreen({ navigation }) {
  const { height } = useWindowDimensions();

  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (!fullName.trim() || !phoneNumber.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      // Create user with Firebase Authentication
      const userCredential = await auth().createUserWithEmailAndPassword(
        email.trim(),
        password.trim()
      );

      const firebaseUser = userCredential.user;

      // Save additional profile data to Firestore
      await firestore()
        .collection("users")
        .doc(firebaseUser.uid)
        .set({
          fullName: fullName.trim(),
          phoneNumber: phoneNumber.trim(),
          email: email.trim(),
          onboardingCompleted: false,
          onboarding: null,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });

      const user = {
        id: firebaseUser.uid,
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        onboardingCompleted: false,
        onboarding: null,
      };

      // Navigate directly to onboarding — OTP is handled by Firebase email verification (future sprint)
      navigation.navigate("Welcome", { user });

    } catch (error) {
      let message = "Could not create account. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          message = "An account with this email already exists.";
          break;
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/weak-password":
          message = "Password is too weak. Use at least 6 characters.";
          break;
        case "auth/network-request-failed":
          message = "No internet connection. Please check your network.";
          break;
        case "auth/operation-not-allowed":
          message = "Email/password sign-up is not enabled. Contact support.";
          break;
      }

      Alert.alert("Signup Failed", message);
    } finally {
      setLoading(false);
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
              autoCapitalize="none"
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
            <SignupButton onPress={handleSignup} loading={loading} />

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
