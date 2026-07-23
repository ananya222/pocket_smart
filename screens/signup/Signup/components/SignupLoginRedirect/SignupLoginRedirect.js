import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from './SignupLoginRedirect.styles';

export default function SignupLoginRedirect({ onLoginPress }) {
  return (
    <TouchableOpacity onPress={onLoginPress} style={styles.loginContainer}>
      <Text style={styles.loginTextSub}>
        Already have an account? <Text style={styles.loginTextHighlight}>Log In</Text>
      </Text>
    </TouchableOpacity>
  );
}
