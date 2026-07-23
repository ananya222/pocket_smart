import React, { useRef } from "react";
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import { styles } from "./ConfirmGoalActionButtons.styles";

export default function ConfirmGoalActionButtons({ onCancel, onConfirm, isUpdating }) {
  const confirmScale = useRef(new Animated.Value(1)).current;
  const cancelScale = useRef(new Animated.Value(1)).current;

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
    <View style={styles.buttonRow}>
      <View style={styles.cancelButtonContainer}>
        <TouchableOpacity
          onPress={onCancel}
          onPressIn={() => handlePressIn(cancelScale)}
          onPressOut={() => handlePressOut(cancelScale)}
          activeOpacity={1}
          style={{ flex: 1 }}
        >
          <Animated.View style={[styles.buttonScaleWrapper, buttonScaleStyle(cancelScale)]}>
            <View style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Go Back</Text>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>

      <View style={styles.confirmButtonContainer}>
        <TouchableOpacity
          onPress={onConfirm}
          onPressIn={() => handlePressIn(confirmScale)}
          onPressOut={() => handlePressOut(confirmScale)}
          disabled={isUpdating}
          activeOpacity={1}
          style={{ flex: 1 }}
        >
          <Animated.View style={[styles.buttonScaleWrapper, buttonScaleStyle(confirmScale)]}>
            <View style={styles.confirmButtonSolid}>
              {isUpdating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm</Text>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
