import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./ResendOtpLink.styles";

export default function ResendOtpLink({ onPress, disabled = false, secondsRemaining = 0, loading = false }) {
  const label = loading
    ? "Sending..."
    : secondsRemaining > 0
      ? `Resend in ${secondsRemaining}s`
      : "Resend Code";

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[styles.resendContainer, disabled && { opacity: 0.65 }]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled, busy: loading }}
    >
      <Text style={styles.resendTextSub}>
        Didn't receive the code? <Text style={styles.resendTextHighlight}>{label}</Text>
      </Text>
    </TouchableOpacity>
  );
}
