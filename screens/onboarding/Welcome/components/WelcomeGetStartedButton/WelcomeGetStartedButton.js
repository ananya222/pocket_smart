import React, { useRef } from "react";
import { TouchableOpacity, View, Text, Animated } from "react-native";
import { styles } from "./WelcomeGetStartedButton.styles";

export default function WelcomeGetStartedButton({ onPress }) {
  const getStartedScale = useRef(new Animated.Value(1)).current;

  const getStartedScaleStyle = React.useMemo(() => ({
    transform: [{ scale: getStartedScale }]
  }), [getStartedScale]);

  const handlePressIn = () => {
    Animated.spring(getStartedScale, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const handlePressOut = () => {
    Animated.spring(getStartedScale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      style={styles.buttonContainer}
    >
      <Animated.View style={[styles.buttonScaleWrapper, getStartedScaleStyle]}>
        <View style={styles.buttonSolid}>
          <Text style={styles.buttonText}>
            Let's Get Started
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
