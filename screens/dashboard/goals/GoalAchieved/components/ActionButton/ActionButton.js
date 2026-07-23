import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { styles } from './ActionButton.styles';

export default function ActionButton({ 
  onPress, 
  disabled, 
  isUpdating 
}) {
  const confirmScale = useRef(new Animated.Value(1)).current;

  const buttonScaleStyle = (scaleVar) => ({
    transform: [{ scale: scaleVar }]
  });

  const handlePressIn = () => {
    Animated.spring(confirmScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(confirmScale, {
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
      disabled={disabled}
      activeOpacity={1}
      style={styles.confirmButtonContainer}
    >
      <Animated.View style={[styles.buttonScaleWrapper, buttonScaleStyle(confirmScale)]}>
        <View style={styles.confirmButtonSolid}>
          {isUpdating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>Continue</Text>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
