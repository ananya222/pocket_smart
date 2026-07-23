import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./OnboardingProceedButton.styles";

export default function OnboardingProceedButton({ onPress }) {
  const buttonScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={[styles.buttonContainer, { marginBottom: Platform.OS === "ios" ? 10 : 0 }]}
    >
      <Animated.View style={{ transform: [{ scale: buttonScale }], flex: 1 }}>
        <View style={styles.buttonSolid}>
          <View style={styles.proceedButtonWrapper}>
            <Text style={styles.buttonText}>Proceed to Dashboard</Text>
            <Feather name="arrow-right" size={16} color="#FFFFFF" style={styles.proceedArrowIcon} />
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
