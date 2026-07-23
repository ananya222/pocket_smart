import React from "react";
import { TouchableOpacity, Animated, View, Text } from "react-native";
import { styles } from "./LoginButton.styles";

export default function LoginButton({ onPress, handlePressIn, handlePressOut, loginScale, loginScaleStyle }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => handlePressIn(loginScale)}
      onPressOut={() => handlePressOut(loginScale)}
      activeOpacity={1}
      style={styles.loginButtonContainer}
    >
      <Animated.View style={[styles.buttonScaleWrapper, loginScaleStyle]}>
        <View style={styles.loginButtonSolid}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
