import React, { useState } from "react";
import { View, TextInput, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./PremiumInput.styles";

export default function PremiumInput({ icon, placeholder, value, onChangeText, secureTextEntry, isPassword, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
      <Feather name={icon} size={18} color={isFocused ? "#9D4EDD" : "#8A90A8"} style={styles.icon} />
      <TextInput
        key="stable-text-input"
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={styles.inputFlex}
        secureTextEntry={isPassword ? !showPassword : secureTextEntry}
        placeholderTextColor="#6C6F8F"
        autoCapitalize="none"
        {...props}
      />
      {isPassword && (
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
          <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#8A90A8" />
        </TouchableOpacity>
      )}
    </View>
  );
}
