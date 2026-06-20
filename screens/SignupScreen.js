// SignupScreen.js

import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, Alert, ScrollView,
  Image, KeyboardAvoidingView, Platform, StatusBar, useWindowDimensions
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { styles } from "../styles/SignupScreen.styles";
import BackgroundGrid from "../components/BackgroundGrid";

export default function SignupScreen({ navigation }) {
  const { width, height } = useWindowDimensions();
  
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignup = async () => {
    if (!fullName || !phoneNumber || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }
    try {
      const response = await fetch("http://192.168.1.4:5000/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phoneNumber, email, password }),
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
  const headerHeight = Math.max(height * 0.30, 200);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={{ flex: 1, backgroundColor: "#FFFFFF" }}
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: Platform.OS === "ios" ? 40 : 80 }]}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Header Section */}
          <LinearGradient
            colors={["#9D4EDD", "#7B2CBF"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[styles.headerWrapper, { height: headerHeight }]}
          >
            <BackgroundGrid type="auth" />
            <TouchableOpacity
              onPress={() => navigation.navigate("Login")}
              style={[styles.backButtonContainer, { top: STATUS_BAR_HEIGHT + 10 }]}
            >
              <Feather name="arrow-left" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={[styles.headerTextContainer, { paddingTop: STATUS_BAR_HEIGHT + 60 }]}>
              <Text style={styles.headerTitle} adjustsFontSizeToFit numberOfLines={2}>
                Create Account
              </Text>
              <Text style={styles.headerDescription}>
                Join PocketSmart and start saving.
              </Text>
            </View>
          </LinearGradient>

          {/* Form Card Section */}
          <View style={styles.card}>
            {/* Full Name */}
            <View style={styles.inputContainer}>
              <Feather name="user" size={18} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Full Name"
                value={fullName}
                onChangeText={setFullName}
                style={styles.inputFlex}
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Phone Number */}
            <View style={styles.inputContainer}>
              <Feather name="phone" size={18} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Phone Number"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                style={styles.inputFlex}
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />
            </View>

            {/* Email */}
            <View style={styles.inputContainer}>
              <Feather name="mail" size={18} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Email Address"
                value={email}
                onChangeText={setEmail}
                style={styles.inputFlex}
                placeholderTextColor="#9CA3AF"
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>

            {/* Password */}
            <View style={styles.inputContainer}>
              <Feather name="lock" size={18} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.inputFlex}
                secureTextEntry={!showPassword}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Confirm Password */}
            <View style={styles.inputContainer}>
              <Feather name="lock" size={18} color="#9CA3AF" style={styles.icon} />
              <TextInput
                placeholder="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.inputFlex}
                secureTextEntry={!showConfirmPassword}
                placeholderTextColor="#9CA3AF"
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={18} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            {/* Primary Sign Up Button */}
            <TouchableOpacity style={styles.button} onPress={handleSignup} activeOpacity={0.85}>
              <Text style={styles.buttonText}>Sign Up</Text>
            </TouchableOpacity>

            {/* Login redirect */}
            <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginContainer}>
              <Text style={styles.loginTextSub}>
                Already have an account? <Text style={styles.loginTextHighlight}>Log In   </Text>
              </Text>
            </TouchableOpacity>

            {/* Trust Badge */}
            <View style={styles.trustBadgeContainer}>
              <Feather name="shield" size={15} color="#7B2CBF" style={styles.trustIcon} />
              <Text style={styles.trustBadgeText}>Your data is safe and secure with us.   </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}