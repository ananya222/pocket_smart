import { API_BASE_URL, saveToken } from "../../../config";
import React, { useState, useRef, useEffect } from "react";
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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);

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
      id: 999,
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
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.access_token) {
          await saveToken(data.access_token);
        }
        if (keepLoggedIn) {
          await AsyncStorage.setItem("userSession", JSON.stringify(data.user));
        } else {
          await AsyncStorage.removeItem("userSession");
        }
        if (data.user && data.user.onboardingCompleted) {
          navigation.navigate("Dashboard", { user: data.user });
        } else {
          navigation.navigate("Welcome", { user: data.user });
        }
      } else {
        Alert.alert("Login Failed", data.error || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert(
        "Connection Error",
        "Could not connect to the backend server. Would you like to enter Offline Dev Mode instead?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Enter Offline Mode", onPress: handleDevBypass },
        ]
      );
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
            <Text style={styles.inputLabel}>Email or Username</Text>
            <PremiumInput
              icon="user"
              placeholder="sarah.connor@email.com"
              value={email}
              onChangeText={setEmail}
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
