import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { styles } from './SignupButton.styles';

export default function SignupButton({ onPress, loading = false, disabled = false }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.85}
      accessibilityRole="button"
      accessibilityLabel="Sign up"
      accessibilityState={{ disabled, busy: loading }}
      style={[styles.buttonContainer, disabled && { opacity: 0.65 }]}
    >
      <View style={styles.buttonSolid}>
        {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Sign Up</Text>}
      </View>
    </TouchableOpacity>
  );
}
