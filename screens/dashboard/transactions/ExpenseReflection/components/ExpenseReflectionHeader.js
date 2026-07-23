import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getStyles } from './ExpenseReflectionHeader.styles';

export default function ExpenseReflectionHeader({ isSmallDevice, navigation }) {
  const styles = getStyles(isSmallDevice);
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
        <Feather name="arrow-left" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Impact</Text>
      <View style={styles.placeholderButton} />
    </View>
  );
}
