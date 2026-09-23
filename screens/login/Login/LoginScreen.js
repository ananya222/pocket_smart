import React, { useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth, firestore } from "../../../config";
import { signInWithGoogle } from "../../../services/googleLogin";
import { colors } from "../../../theme/theme";
import { styles } from "./LoginScreen.styles";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const loginInProgress = useRef(false);

  const finishLogin = async (firebaseUser) => {
    const userDoc = await firestore().collection("users").doc(firebaseUser.uid).get();
    const profile = userDoc.exists ? userDoc.data() : {};
    const user = {
      id: firebaseUser.uid,
      fullName: profile.fullName || firebaseUser.displayName || "",
      email: firebaseUser.email,
      phoneNumber: profile.phoneNumber || "",
      onboardingCompleted: profile.onboardingCompleted || false,
      onboarding: profile.onboarding || null,
    };
    await AsyncStorage.setItem("userSession", JSON.stringify(user));
    navigation.reset({
      index: 0,
      routes: [{ name: user.onboardingCompleted ? "Dashboard" : "Welcome", params: { user } }],
    });
  };

  const handleLogin = async () => {
    if (loginInProgress.current) return;
    if (!email.trim() || !password) {
      Alert.alert("Log in", "Enter your email and password to continue.");
      return;
    }
    loginInProgress.current = true;
    setLoading(true);
    try {
      const credential = await auth().signInWithEmailAndPassword(email.trim(), password);
      await finishLogin(credential.user);
    } catch (error) {
      const messages = {
        "auth/user-not-found": "Incorrect email or password.",
        "auth/wrong-password": "Incorrect email or password.",
        "auth/invalid-credential": "Incorrect email or password.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/too-many-requests": "Too many attempts. Please try again later.",
        "auth/network-request-failed": "Check your internet connection and try again.",
      };
      Alert.alert("Unable to log in", messages[error.code] || "Please try again.");
    } finally {
      loginInProgress.current = false;
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (loginInProgress.current) return;
    loginInProgress.current = true;
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      if (user) {
        navigation.reset({
          index: 0,
          routes: [{ name: user.onboardingCompleted ? "Dashboard" : "Welcome", params: { user } }],
        });
      }
    } catch (error) {
      Alert.alert("Google sign-in", error.message);
    } finally {
      loginInProgress.current = false;
      setGoogleLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      Alert.alert("Reset your password", "Enter your email first, then select Forgot password.");
      return;
    }
    try {
      await auth().sendPasswordResetEmail(email.trim());
      Alert.alert("Check your inbox", "We sent a password reset link to your email.");
    } catch (error) {
      Alert.alert("Password reset", error.code === "auth/invalid-email" ? "Enter a valid email address." : "We could not send the reset link. Please try again.");
    }
  };

  const disabled = loading || googleLoading;
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView style={styles.keyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>POCKETSMART</Text>
            <Text style={styles.title}>Welcome back.</Text>
            <Text style={styles.subtitle}>Log in to continue managing your money.</Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              accessibilityLabel="Email"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="alex@example.com"
              placeholderTextColor="#8A8177"
              style={styles.input}
              value={email}
            />

            <View style={styles.passwordLabelRow}>
              <Text style={styles.label}>Password</Text>
              <TouchableOpacity accessibilityRole="button" onPress={handleForgotPassword}>
                <Text style={styles.forgot}>Forgot password?</Text>
              </TouchableOpacity>
            </View>
            <TextInput
              accessibilityLabel="Password"
              autoComplete="current-password"
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#8A8177"
              secureTextEntry
              style={styles.input}
              value={password}
            />

            <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={handleLogin} style={[styles.primaryButton, disabled && styles.buttonDisabled]}>
              {loading ? <ActivityIndicator color="#F8F5EE" /> : <Text style={styles.primaryButtonText}>Log in</Text>}
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity accessibilityLabel="Continue with Google" accessibilityRole="button" disabled={disabled} onPress={handleGoogleLogin} style={[styles.googleButton, disabled && styles.buttonDisabled]}>
              {googleLoading ? <ActivityIndicator color="#302C27" /> : <><Image source={require("../../../assets/images/google_logo_transparent.png")} style={styles.googleIcon} /><Text style={styles.googleButtonText}>Continue with Google</Text></>}
            </TouchableOpacity>
          </View>

          <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate("Signup")} style={styles.signupLink}>
            <Text style={styles.signupText}>New to PocketSmart? <Text style={styles.signupTextStrong}>Create an account</Text></Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
