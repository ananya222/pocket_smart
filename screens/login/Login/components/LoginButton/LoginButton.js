import React from "react";
import { TouchableOpacity, Animated, View, Text, ActivityIndicator } from "react-native";
import { styles } from "./LoginButton.styles";

export default function LoginButton({ onPress, handlePressIn, handlePressOut, loginScale, loginScaleStyle, loading = false, disabled = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      onPressIn={() => handlePressIn(loginScale)}
      onPressOut={() => handlePressOut(loginScale)}
      activeOpacity={1}
      style={styles.loginButtonContainer}
    >
      <Animated.View style={[styles.buttonScaleWrapper, loginScaleStyle]}>
        <View style={styles.loginButtonSolid}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.loginButtonText}>Log In</Text>}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
