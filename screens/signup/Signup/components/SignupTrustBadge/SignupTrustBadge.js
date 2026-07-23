import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './SignupTrustBadge.styles';

export default function SignupTrustBadge() {
  return (
    <View style={styles.trustBadgeContainer}>
      <Feather name="shield" size={15} color="#8A90A8" style={styles.trustIcon} />
      <Text style={styles.trustBadgeText}>Your data is safe and secure with us.</Text>
    </View>
  );
}
