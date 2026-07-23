// OtpScreen.js

import React, { useState } from "react";
import {
  View, Alert, ScrollView,
  KeyboardAvoidingView, Platform, StatusBar, useWindowDimensions
} from "react-native";
import { BlurView } from "expo-blur";
import BackgroundGrid from "../../../components/BackgroundGrid/BackgroundGrid";
import { styles } from "./OtpScreen.styles";

import OtpHeader from "./components/OtpHeader/OtpHeader";
import OtpField from "./components/OtpField/OtpField";
import VerifyOtpButton from "./components/VerifyOtpButton/VerifyOtpButton";
import ResendOtpLink from "./components/ResendOtpLink/ResendOtpLink";

export default function OtpScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  const [otp, setOtp] = useState("");

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

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
          <OtpHeader onBackPress={() => navigation.navigate("Signup")} />

          {/* Form Card Section */}
          <BlurView intensity={100} tint="dark" style={styles.card}>
            <OtpField otp={otp} setOtp={setOtp} />
            <VerifyOtpButton onPress={verifyOtp} />
            <ResendOtpLink onPress={handleResend} />
          </BlurView>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}