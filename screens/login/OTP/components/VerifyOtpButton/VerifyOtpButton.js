import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { styles } from "./VerifyOtpButton.styles";

export default function VerifyOtpButton({ onPress }) {
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
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.buttonContainer}
    >
      <Animated.View style={[styles.buttonScaleWrapper, verifyScaleStyle]}>
        <View style={styles.buttonSolid}>
          <Text style={styles.buttonText}>Verify OTP</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
