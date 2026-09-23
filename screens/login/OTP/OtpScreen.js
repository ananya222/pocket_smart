import React, { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, ScrollView, StatusBar, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { auth, firestore } from "../../../config";
import { toAppUser } from "../../../services/firebaseProfile";
import { createPhoneCredential, maskPhoneNumber, phoneAuthErrorMessage, requestPhoneVerification } from "../../../services/phoneOtp";
import { clearSignupDraft, getSignupDraft, updateSignupDraft } from "../../../services/signupDraft";
import { colors } from "../../../theme/theme";
import { styles } from "./OtpScreen.styles";

const RESEND_COOLDOWN_SECONDS = 45;
const signupErrorMessage = (error) => ({
  "auth/email-already-in-use": "An account with this email already exists. Please log in.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/weak-password": "Use a password with at least 6 characters.",
  "auth/network-request-failed": "Check your internet connection and try again.",
}[error?.code] || phoneAuthErrorMessage(error));

export default function OtpScreen({ navigation }) {
  const [draft, setDraft] = useState(() => getSignupDraft());
  const [otp, setOtp] = useState(() => getSignupDraft()?.autoCode || "");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(RESEND_COOLDOWN_SECONDS);
  const verificationInProgress = useRef(false);

  useEffect(() => {
    if (!draft) Alert.alert("Signup expired", "Enter your details again.", [{ text: "OK", onPress: () => navigation.navigate("Signup") }]);
  }, [draft, navigation]);
  useEffect(() => {
    if (!resendSeconds) return undefined;
    const timer = setInterval(() => setResendSeconds((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => clearInterval(timer);
  }, [resendSeconds]);

  const verifyOtp = async () => {
    const code = otp.replace(/\D/g, "");
    if (verificationInProgress.current) return;
    if (code.length !== 6) return Alert.alert("Verification code", "Enter the 6-digit code from the SMS.");
    if (!draft?.verificationId) return Alert.alert("Verification expired", "Request a new code from Sign up.");
    verificationInProgress.current = true;
    setLoading(true);
    let createdUser;
    try {
      const credential = await auth().createUserWithEmailAndPassword(draft.email, draft.password);
      createdUser = credential.user;
      const linked = await createdUser.linkWithCredential(createPhoneCredential(draft.verificationId, code));
      const profile = { fullName: draft.fullName, phoneNumber: draft.phoneNumber, phoneVerified: true, email: draft.email, onboardingCompleted: false, onboarding: null, createdAt: firestore.FieldValue.serverTimestamp() };
      await firestore().collection("users").doc(linked.user.uid).set(profile, { merge: true });
      const user = toAppUser(linked.user, profile);
      await AsyncStorage.setItem("userSession", JSON.stringify(user));
      clearSignupDraft();
      navigation.reset({ index: 0, routes: [{ name: "Welcome", params: { user } }] });
    } catch (error) {
      if (createdUser) {
        try { await createdUser.delete(); } catch (_) { await auth().signOut().catch(() => {}); }
      }
      Alert.alert("Create account", signupErrorMessage(error));
    } finally {
      verificationInProgress.current = false;
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendLoading || resendSeconds || !draft) return;
    setResendLoading(true);
    try {
      const verification = await requestPhoneVerification(draft.phoneNumber, true);
      const nextDraft = updateSignupDraft({ verificationId: verification.verificationId, autoCode: verification.autoCode });
      setDraft(nextDraft);
      setOtp(verification.autoCode || "");
      setResendSeconds(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      Alert.alert("Resend code", phoneAuthErrorMessage(error));
    } finally { setResendLoading(false); }
  };

  const disabled = loading || resendLoading;
  return (
    <SafeAreaView edges={["top", "bottom"]} style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.keyboard}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.intro}><Text style={styles.eyebrow}>VERIFY YOUR NUMBER</Text><Text style={styles.title}>Enter your{`\n`}verification code.</Text><Text style={styles.subtitle}>We sent a six-digit code to {draft?.phoneNumber ? maskPhoneNumber(draft.phoneNumber) : "your phone"}.</Text></View>
          <View style={styles.form}><Text style={styles.label}>Verification code</Text><TextInput accessibilityLabel="Six digit verification code" autoComplete="sms-otp" keyboardType="number-pad" maxLength={6} onChangeText={(value) => setOtp(value.replace(/\D/g, ""))} placeholder="000000" placeholderTextColor="#8A8177" style={styles.codeInput} value={otp} />
            <TouchableOpacity accessibilityRole="button" disabled={disabled} onPress={verifyOtp} style={[styles.primaryButton, disabled && styles.disabled]}>{loading ? <ActivityIndicator color="#F8F5EE" /> : <Text style={styles.primaryButtonText}>Verify and continue</Text>}</TouchableOpacity>
            <TouchableOpacity accessibilityRole="button" disabled={disabled || resendSeconds > 0 || !draft} onPress={handleResend} style={styles.resendLink}>{resendLoading ? <ActivityIndicator color="#8A6541" /> : <Text style={[styles.resendText, resendSeconds > 0 && styles.resendDisabled]}>{resendSeconds ? `Resend code in ${resendSeconds}s` : "Resend code"}</Text>}</TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
