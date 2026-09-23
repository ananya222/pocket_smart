import React, { useState } from "react";
import { View, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./OtpField.styles";

export default function OtpField({ otp, setOtp }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
      <Feather name="shield" size={18} color={isFocused ? "#9D4EDD" : "#8A90A8"} style={styles.icon} />
      <TextInput
        placeholder="000000"
        placeholderTextColor="#6C6F8F"
        keyboardType="number-pad"
        autoComplete="sms-otp"
        textContentType="oneTimeCode"
        maxLength={6}
        value={otp}
        onChangeText={(value) => setOtp(value.replace(/\D/g, "").slice(0, 6))}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.inputFlex}
      />
    </View>
  );
}
