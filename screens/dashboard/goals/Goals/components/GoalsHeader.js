import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./GoalsHeader.styles";

export default function GoalsHeader({ onBackPress, onAddPress }) {
  const backScale = useRef(new Animated.Value(1)).current;

  const buttonScaleStyle = (scaleVar) => ({
    transform: [{ scale: scaleVar }],
  });

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
    <View style={styles.headerRow}>
      <TouchableOpacity
        onPress={onBackPress}
        onPressIn={() => handlePressIn(backScale)}
        onPressOut={() => handlePressOut(backScale)}
        activeOpacity={1}
        style={styles.backButton}
      >
        <Animated.View style={buttonScaleStyle(backScale)}>
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
        </Animated.View>
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Savings Goals</Text>
      <TouchableOpacity
        onPress={onAddPress}
        activeOpacity={0.8}
        style={styles.backButton}
      >
        <Feather name="plus" size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
