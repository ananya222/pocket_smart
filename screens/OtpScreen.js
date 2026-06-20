// OtpScreen.js

import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Alert, ScrollView,
  KeyboardAvoidingView, Platform, StatusBar, useWindowDimensions, Animated
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BackgroundGrid from "../components/BackgroundGrid";
import { styles } from "../styles/OtpScreen.styles";
import { Feather } from "@expo/vector-icons";

export default function OtpScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [otp, setOtp] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const verifyScale = useRef(new Animated.Value(1)).current;

  const verifyScaleStyle = React.useMemo(() => ({
    transform: [{ scale: verifyScale }]
  }), [verifyScale]);

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);
  const headerHeight = Math.max(height * 0.40, 240);

  const headerWrapperStyle = React.useMemo(() => [
    styles.headerWrapper, { height: headerHeight }
  ], [headerHeight]);

  const scrollContainerStyle = React.useMemo(() => [
    styles.scrollContainer, { paddingBottom: Platform.OS === "ios" ? 40 : 80 }
  ], []);

  const handlePressIn = (scaleVar) => {
    Animated.spring(scaleVar, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const handlePressOut = (scaleVar) => {
    Animated.spring(scaleVar, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const verifyOtp = () => {
    if (otp.length !== 4) {
      Alert.alert("Error", "Enter valid 4-digit OTP");
      return;
    }
    Alert.alert("Verified OTP", "Redirecting to login page...", [
      { text: "OK", onPress: () => navigation.navigate("Login") }
    ]);
  };

  const handleResend = () => {
    Alert.alert("Code Sent", "A new verification code has been sent to your email.");
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={styles.mainContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.mainContainer}
          contentContainerStyle={scrollContainerStyle}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Header Section */}
          <LinearGradient
            colors={["#9D4EDD", "#7B2CBF"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={headerWrapperStyle}
          >
            <BackgroundGrid type="auth" />
            <TouchableOpacity
              onPress={() => navigation.navigate("Signup")}
              style={[styles.backButtonContainer, { top: STATUS_BAR_HEIGHT + 10 }]}
            >
              <Feather name="arrow-left" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={[styles.headerTextContainer, { paddingTop: STATUS_BAR_HEIGHT + 80 }]}>
              <Text style={styles.headerTitle} adjustsFontSizeToFit numberOfLines={2}>
                Verification Code
              </Text>
              <Text style={styles.headerDescription}>
                We have sent a security verification code to your registered email address.
              </Text>
            </View>
          </LinearGradient>

          {/* Form Card Section */}
          <View style={styles.card}>
            <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
              <Feather name="shield" size={18} color="#7B2CBF" style={styles.icon} />
              <TextInput
                placeholder="0000"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                maxLength={4}
                value={otp}
                onChangeText={setOtp}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                style={styles.inputFlex}
              />
            </View>

            <TouchableOpacity
              onPress={verifyOtp}
              onPressIn={() => handlePressIn(verifyScale)}
              onPressOut={() => handlePressOut(verifyScale)}
              activeOpacity={1}
              style={styles.buttonContainer}
            >
              <Animated.View style={[styles.buttonScaleWrapper, verifyScaleStyle]}>
                <LinearGradient
                  colors={["#9D4EDD", "#7B2CBF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.buttonGradient}
                >
                  <Text style={styles.buttonText}>Verify OTP</Text>
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResend} style={styles.resendContainer}>
              <Text style={styles.resendTextSub}>
                Didn't receive the code? <Text style={styles.resendTextHighlight}>Resend Code   </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}