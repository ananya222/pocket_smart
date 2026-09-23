import React, { useRef, useState } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { auth, firestore } from "../../../config";
import { signInWithGoogle } from "../../../services/googleLogin";
import { colors } from "../../../theme/theme";
import { styles } from "./SignupScreen.styles";

const Input = ({ label, value, onChangeText, placeholder, keyboardType, secureTextEntry, autoCapitalize = "sentences" }) => (
  <View style={styles.fieldGroup}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      accessibilityLabel={label}
      autoCapitalize={autoCapitalize}
      autoComplete={label === "Email" ? "email" : label.includes("Password") ? "password" : "off"}
      keyboardType={keyboardType}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#8A8177"
      secureTextEntry={secureTextEntry}
      style={styles.input}
      value={value}
    />
  </View>
);

export default function SignupScreen({ navigation }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const inProgress = useRef(false);

  const handleSignup = async () => {
    if (inProgress.current) return;
    if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Create account", "Complete each field to continue.");
      return;
    }
    if (password !== confirmPassword) return Alert.alert("Create account", "Your passwords do not match.");
    if (password.length < 6) return Alert.alert("Create account", "Your password must have at least 6 characters.");
    inProgress.current = true;
    setLoading(true);
    try {
      const credential = await auth().createUserWithEmailAndPassword(email.trim(), password);
      const profile = {
        fullName: fullName.trim(),
        email: email.trim(),
        phoneNumber: "",
        phoneVerified: false,
        onboardingCompleted: false,
        onboarding: null,
        createdAt: firestore.FieldValue.serverTimestamp(),
      };
      await firestore().collection("users").doc(credential.user.uid).set(profile, { merge: true });
      const user = {
        id: credential.user.uid,
        fullName: profile.fullName,
        email: profile.email,
        phoneNumber: "",
        onboardingCompleted: false,
        onboarding: null,
      };
      await AsyncStorage.setItem("userSession", JSON.stringify(user));
      navigation.reset({ index: 0, routes: [{ name: "Welcome", params: { user } }] });
    } catch (error) {
      const messages = {
        "auth/email-already-in-use": "An account with this email already exists. Please log in.",
        "auth/invalid-email": "Enter a valid email address.",
        "auth/weak-password": "Use a password with at least 6 characters.",
        "auth/network-request-failed": "Check your internet connection and try again.",
      };
      Alert.alert("Create account", messages[error?.code] || "Your account could not be created. Please try again.");
    } finally {
      inProgress.current = false;
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (inProgress.current) return;
    inProgress.current = true;
    setGoogleLoading(true);
    try {
      const user = await signInWithGoogle();
      if (!user) return;
      await AsyncStorage.setItem("userSession", JSON.stringify(user));
      navigation.reset({ index: 0, routes: [{ name: user.onboardingCompleted ? "Dashboard" : "Welcome", params: { user } }] });
    } catch (error) {
      Alert.alert("Google sign-in", error.message);
    } finally {
      inProgress.current = false;
      setGoogleLoading(false);
    }
  };

  const disabled = loading || googleLoading;
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.intro}>
            <Text style={styles.eyebrow}>POCKETSMART</Text>
            <Text style={styles.title}>Create your{`\n`}account.</Text>
            <Text style={styles.subtitle}>A few details and you can start your plan.</Text>
          </View>

          <View style={styles.form}>
            <Input label="Full name" value={fullName} onChangeText={setFullName} placeholder="Aarav Sharma" />
            <Input label="Email" value={email} onChangeText={setEmail} placeholder="aarav@example.com" keyboardType="email-address" autoCapitalize="none" />
            <Input label="Password" value={password} onChangeText={setPassword} placeholder="••••••••" secureTextEntry autoCapitalize="none" />
            <Input label="Confirm password" value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••" secureTextEntry autoCapitalize="none" />
            <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={handleSignup} style={[styles.primaryButton, disabled && styles.disabled]}>{loading ? <ActivityIndicator color="#F8F5EE" /> : <Text style={styles.primaryButtonText}>Continue</Text>}</TouchableOpacity>
            <View style={styles.divider}><View style={styles.dividerLine} /><Text style={styles.dividerText}>or</Text><View style={styles.dividerLine} /></View>
            <TouchableOpacity accessibilityLabel="Continue with Google" accessibilityRole="button" disabled={disabled} onPress={handleGoogleSignup} style={[styles.googleButton, disabled && styles.disabled]}>{googleLoading ? <ActivityIndicator color="#302C27" /> : <><Image source={require("../../../assets/images/google_logo_transparent.png")} style={styles.googleIcon} /><Text style={styles.googleText}>Continue with Google</Text></>}</TouchableOpacity>
          </View>
          <TouchableOpacity accessibilityRole="button" onPress={() => navigation.navigate("Login")} style={styles.loginLink}><Text style={styles.loginText}>Already have an account? <Text style={styles.loginTextStrong}>Log in</Text></Text></TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
