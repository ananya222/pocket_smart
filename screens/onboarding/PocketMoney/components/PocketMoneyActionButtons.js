import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { styles } from "./PocketMoneyActionButtons.styles";

export default function PocketMoneyActionButtons({ onBack, onNext }) {
  const backScale = useRef(new Animated.Value(1)).current;
  const nextScale = useRef(new Animated.Value(1)).current;

  const handlePressIn = (scaleVar) => {
    Animated.spring(scaleVar, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (scaleVar) => {
    Animated.spring(scaleVar, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  return (
    <View style={styles.buttonRow}>
      <TouchableOpacity
        onPress={onBack}
        onPressIn={() => handlePressIn(backScale)}
        onPressOut={() => handlePressOut(backScale)}
        activeOpacity={0.8}
        style={styles.backButton}
      >
        <Animated.View style={{ transform: [{ scale: backScale }] }}>
          <Text style={styles.backButtonText}>Back</Text>
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onNext}
        onPressIn={() => handlePressIn(nextScale)}
        onPressOut={() => handlePressOut(nextScale)}
        activeOpacity={1}
        style={styles.nextButton}
      >
        <Animated.View style={{ transform: [{ scale: nextScale }], flex: 1 }}>
          <View style={styles.nextButtonSolid}>
            <Text style={styles.nextButtonText}>Next</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
}
