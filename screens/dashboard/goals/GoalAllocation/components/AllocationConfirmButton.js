import React from 'react';
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { styles } from './AllocationConfirmButton.styles';

export default function AllocationConfirmButton({ 
  onPress, 
  onPressIn, 
  onPressOut, 
  disabled, 
  isUpdating, 
  title, 
  buttonScaleStyle, 
  confirmScale,
  containerStyle
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={() => onPressIn(confirmScale)}
      onPressOut={() => onPressOut(confirmScale)}
      disabled={disabled}
      activeOpacity={1}
      style={[styles.confirmButtonContainer, containerStyle]}
    >
      <Animated.View style={[styles.buttonScaleWrapper, buttonScaleStyle(confirmScale)]}>
        <View style={styles.confirmButtonSolid}>
          {isUpdating ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.confirmButtonText}>{title}</Text>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
