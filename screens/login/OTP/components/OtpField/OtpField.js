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
  );
}
