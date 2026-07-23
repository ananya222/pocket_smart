import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './SignupButton.styles';

export default function SignupButton({ onPress }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={styles.buttonContainer}
    >
      <View style={styles.buttonSolid}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </View>
    </TouchableOpacity>
  );
}
