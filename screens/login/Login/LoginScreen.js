// LoginScreen.js
import React, { useState, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  Keyboard,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { styles } from "./LoginScreen.styles";
import BackgroundGrid from "../../../components/BackgroundGrid/BackgroundGrid";
import PremiumInput from "../../../components/PremiumInput/PremiumInput";

import LoginHeader from "./components/LoginHeader/LoginHeader";
import LoginRememberMeRow from "./components/LoginRememberMeRow/LoginRememberMeRow";
import LoginButton from "./components/LoginButton/LoginButton";
import LoginSocialRow from "./components/LoginSocialRow/LoginSocialRow";
import LoginFooterActions from "./components/LoginFooterActions/LoginFooterActions";
import LoginTrustBadge from "./components/LoginTrustBadge/LoginTrustBadge";

import { auth, firestore } from "../../../config";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [loading, setLoading] = useState(false);

  // Animated button scale spring values
  const loginScale = useRef(new Animated.Value(1)).current;
  const googleScale = useRef(new Animated.Value(1)).current;
  const appleScale = useRef(new Animated.Value(1)).current;

  // Memoized styles
  const loginScaleStyle = React.useMemo(() => ({
    transform: [{ scale: loginScale }],
  }), [loginScale]);

  const googleScaleStyle = React.useMemo(() => ({
    transform: [{ scale: googleScale }],
  }), [googleScale]);

  const appleScaleStyle = React.useMemo(() => ({
    transform: [{ scale: appleScale }],
  }), [appleScale]);

  // Haptic spring scale animation helpers
  const handlePressIn = (scaleVar) => {
    Animated.spring(scaleVar, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (scaleVar) => {
    Animated.spring(scaleVar, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handleDevBypass = async () => {
    const mockUser = {
      id: "dev-bypass-999",
      fullName: "Aarav Sharma",
      email: "aarav@pocketsmart.com",
      phoneNumber: "9876543210",
      onboardingCompleted: true,
      onboarding: {
        allowance: "5,000",
        frequency: "Monthly",
        goalName: "Sony Headphones",
        targetAmount: "8,000",
        timeToReach: 6,
      },
    };
    if (keepLoggedIn) {
      await AsyncStorage.setItem("userSession", JSON.stringify(mockUser));
    } else {
      await AsyncStorage.removeItem("userSession");
    }
    navigation.navigate("Dashboard", { user: mockUser });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter your details");
      return;
    }

    setLoading(true);
    try {
      // Sign in with Firebase Authentication
      const userCredential = await auth().signInWithEmailAndPassword(
        email.trim(),
        password.trim()
      );

      const firebaseUser = userCredential.user;

      // Fetch user profile from Firestore
      const userDoc = await firestore()
        .collection("users")
        .doc(firebaseUser.uid)
        .get();

      let userProfile = {};
      if (userDoc.exists) {
        userProfile = userDoc.data();
      }

      const user = {
        id: firebaseUser.uid,
        fullName: userProfile.fullName || firebaseUser.displayName || "",
        email: firebaseUser.email,
        phoneNumber: userProfile.phoneNumber || "",
        onboardingCompleted: userProfile.onboardingCompleted || false,
        onboarding: userProfile.onboarding || null,
      };

      if (keepLoggedIn) {
        await AsyncStorage.setItem("userSession", JSON.stringify(user));
      } else {
        await AsyncStorage.removeItem("userSession");
      }

      if (user.onboardingCompleted) {
        navigation.navigate("Dashboard", { user });
      } else {
        navigation.navigate("Welcome", { user });
      }
    } catch (error) {
      let message = "An unexpected error occurred. Please try again.";

      switch (error.code) {
        case "auth/user-not-found":
        case "auth/wrong-password":
        case "auth/invalid-credential":
          message = "Incorrect email or password.";
          break;
        case "auth/invalid-email":
          message = "Please enter a valid email address.";
          break;
        case "auth/user-disabled":
          message = "This account has been disabled.";
          break;
        case "auth/too-many-requests":
          message = "Too many failed attempts. Please try again later.";
          break;
        case "auth/network-request-failed":
          message = "No internet connection. Please check your network.";
          break;
      }

      Alert.alert("Login Failed", message, [
        { text: "OK" },
        ...(error.code === "auth/network-request-failed"
          ? [{ text: "Enter Offline Mode", onPress: handleDevBypass }]
          : []),
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Safe area / notch calculation for immersive status bar
  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Background Scattered Themed Icons */}
      <BackgroundGrid type="login" />

      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "transparent" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top safety spacer to push the card away from the notification bar */}
          <View style={{ height: STATUS_BAR_HEIGHT + 16 }} />

          <BlurView intensity={100} tint="dark" style={styles.card}>

            {/* Header Row inside the Card */}
            <LoginHeader title="Welcome to\nPocketSmart" description="Your complete financial dashboard." />

            {/* Email or Username Field */}
            <Text style={styles.inputLabel}>Email</Text>
            <PremiumInput
              icon="user"
              placeholder="sarah.connor@email.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password Field */}
            <Text style={styles.inputLabel}>Password</Text>
            <PremiumInput
              icon="lock"
              placeholder="••••••••••••"
              value={password}
              onChangeText={setPassword}
              isPassword={true}
            />

            {/* Remember Me & Forgot Password Row */}
            <LoginRememberMeRow
              keepLoggedIn={keepLoggedIn}
              setKeepLoggedIn={setKeepLoggedIn}
              onForgotPassword={() => {}}
            />

            {/* Login Button */}
            <LoginButton
              onPress={handleLogin}
              handlePressIn={handlePressIn}
              handlePressOut={handlePressOut}
              loginScale={loginScale}
              loginScaleStyle={loginScaleStyle}
              loading={loading}
            />

            {/* Social Login Row */}
            <LoginSocialRow
              handlePressIn={handlePressIn}
              handlePressOut={handlePressOut}
              googleScale={googleScale}
              googleScaleStyle={googleScaleStyle}
              appleScale={appleScale}
              appleScaleStyle={appleScaleStyle}
            />

          </BlurView>

          {/* Sign Up & Dev Bypass - Outside card */}
          <LoginFooterActions
            navigation={navigation}
            onDevBypass={handleDevBypass}
          />

          {/* Security Trust Badge */}
          <LoginTrustBadge />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
