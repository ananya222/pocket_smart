import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import { styles } from "./VerifyOtpButton.styles";

export default function VerifyOtpButton({ onPress, loading = false, disabled = false }) {
  const verifyScale = useRef(new Animated.Value(1)).current;

  const verifyScaleStyle = React.useMemo(() => ({
    transform: [{ scale: verifyScale }]
  }), [verifyScale]);

  const handlePressIn = () => {
    Animated.spring(verifyScale, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(verifyScale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      accessibilityRole="button"
      accessibilityLabel="Verify code"
      accessibilityState={{ disabled, busy: loading }}
      style={[styles.buttonContainer, disabled && { opacity: 0.65 }]}
    >
      <Animated.View style={[styles.buttonScaleWrapper, verifyScaleStyle]}>
        <View style={styles.buttonSolid}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Verify OTP</Text>}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
