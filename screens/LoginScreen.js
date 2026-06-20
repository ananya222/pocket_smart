// LoginScreen.js

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { styles } from "../styles/LoginScreen.styles";
import BackgroundGrid from "../components/BackgroundGrid";

// Premium local-state input component to prevent page-level re-render focus loops
function PremiumInput({ icon, placeholder, value, onChangeText, secureTextEntry, isPassword, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
      <Feather name={icon} size={18} color={isFocused ? "#9D4EDD" : "#8A90A8"} style={styles.icon} />
      <TextInput
        key="stable-text-input"
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

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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

  const handleDevBypass = () => {
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
    navigation.navigate("Dashboard", { user: mockUser });
  };

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter your details");
      return;
    }
    try {
      const response = await fetch("http://192.168.1.4:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        if (data.user && data.user.onboardingCompleted) {
          navigation.navigate("Dashboard", { user: data.user });
        } else {
          navigation.navigate("Welcome", { user: data.user });
        }
      } else {
        Alert.alert("Login Failed", data.error || "Invalid credentials");
      }
    } catch (error) {
      console.log(error);
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
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>
                Welcome to{"\n"}PocketSmart
              </Text>
              <Text style={styles.headerDescription}>
                Your complete financial dashboard.
              </Text>
            </View>

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

            {/* Forgot Password Link */}
            <TouchableOpacity style={styles.forgotPasswordContainer} activeOpacity={0.7}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              onPressIn={() => handlePressIn(loginScale)}
              onPressOut={() => handlePressOut(loginScale)}
              activeOpacity={1}
              style={styles.loginButtonContainer}
            >
              <Animated.View style={[styles.buttonScaleWrapper, loginScaleStyle]}>
                <LinearGradient
                  colors={["#9D4EDD", "#7B2CBF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButtonGradient}
                >
                  <Text style={styles.loginButtonText}>Log In</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Row */}
            <View style={styles.socialRow}>
              <View style={styles.socialButtonWrapper}>
                <TouchableOpacity
                  onPressIn={() => handlePressIn(googleScale)}
                  onPressOut={() => handlePressOut(googleScale)}
                  activeOpacity={1}
                  style={styles.socialCircle}
                >
                  <Animated.View style={[styles.socialCircleScaleWrapper, googleScaleStyle]}>
                    <Image source={require("../assets/images/google_logo_transparent.png")} style={styles.socialIcon} />
                  </Animated.View>
                </TouchableOpacity>
                <Text style={styles.socialText}>Google</Text>
              </View>

              <View style={styles.socialButtonWrapper}>
                <TouchableOpacity
                  onPressIn={() => handlePressIn(appleScale)}
                  onPressOut={() => handlePressOut(appleScale)}
                  activeOpacity={1}
                  style={styles.socialCircle}
                >
                  <Animated.View style={[styles.socialCircleScaleWrapper, appleScaleStyle]}>
                    <FontAwesome name="apple" size={20} color="#FFFFFF" />
                  </Animated.View>
                </TouchableOpacity>
                <Text style={styles.socialText}>Apple</Text>
              </View>
            </View>

          </BlurView>

          {/* Sign Up Navigation Redirect - Outside card */}
          <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.signupContainer}>
            <Text style={styles.signupTextSub}>
              Don't have an account? <Text style={styles.signupTextHighlight}>Sign Up</Text>
            </Text>
          </TouchableOpacity>

          {/* Offline Dev Bypass - Outside card */}
          <TouchableOpacity
            onPress={handleDevBypass}
            style={{
              alignSelf: "center",
              marginTop: 4,
              marginBottom: 16,
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 8,
              backgroundColor: "#1C1D24",
              borderWidth: 1,
              borderColor: "#2C2D35",
            }}
          >
            <Text style={{ fontSize: 12, color: "#9D4EDD", fontFamily: "DMSerifDisplay-Regular" }}>
              Test Offline (Dev Mode)
            </Text>
          </TouchableOpacity>

          {/* Security Trust Badge */}
          <View style={styles.trustBadgeContainer}>
            <Feather name="shield" size={15} color="#8A90A8" style={styles.trustIcon} />
            <Text style={styles.trustBadgeText}>Your data is safe and secure with us.</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}