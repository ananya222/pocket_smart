// OtpScreen.js

import React, { useState, useRef } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Alert, ScrollView,
  KeyboardAvoidingView, Platform, StatusBar, useWindowDimensions, Animated
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import BackgroundGrid from "../components/BackgroundGrid";
import { styles } from "../styles/OtpScreen.styles";

export default function OtpScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [otp, setOtp] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const verifyScale = useRef(new Animated.Value(1)).current;

  const verifyScaleStyle = React.useMemo(() => ({
    transform: [{ scale: verifyScale }]
  }), [verifyScale]);

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

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
      <BackgroundGrid type="otp" />

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
              onPress={() => navigation.navigate("Signup")} 
              style={styles.backButtonContainer}
              activeOpacity={0.7}
            >
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Header text */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Verification Code</Text>
            <Text style={styles.headerDescription}>
              We have sent a security verification code to your registered email address.
            </Text>
          </View>

          {/* Form Card Section */}
          <BlurView intensity={100} tint="dark" style={styles.card}>
            <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
              <Feather name="shield" size={18} color={isFocused ? "#9D4EDD" : "#8A90A8"} style={styles.icon} />
              <TextInput
                placeholder="0000"
                placeholderTextColor="#6C6F8F"
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
                <View style={styles.buttonSolid}>
                  <Text style={styles.buttonText}>Verify OTP</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>

            <TouchableOpacity onPress={handleResend} style={styles.resendContainer}>
              <Text style={styles.resendTextSub}>
                Didn't receive the code? <Text style={styles.resendTextHighlight}>Resend Code</Text>
              </Text>
            </TouchableOpacity>
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}