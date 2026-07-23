import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './SignupHeader.styles';

export default function SignupHeader({ onBackPress }) {
  return (
    <>
      {/* Header Row with Back Button */}
      <View style={styles.headerRow}>
        <TouchableOpacity 
          onPress={onBackPress} 
          style={styles.backButtonContainer}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Header text */}
      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>Create Account</Text>
        <Text style={styles.headerDescription}>Join PocketSmart and start saving today.</Text>
      </View>
    </>
  );
}
