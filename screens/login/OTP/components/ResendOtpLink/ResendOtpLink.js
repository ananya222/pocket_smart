import React from "react";
import { Text, TouchableOpacity } from "react-native";
import { styles } from "./ResendOtpLink.styles";

export default function ResendOtpLink({ onPress }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.resendContainer}>
      <Text style={styles.resendTextSub}>
        Didn't receive the code? <Text style={styles.resendTextHighlight}>Resend Code</Text>
      </Text>
    </TouchableOpacity>
  );
}
