import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getStyles } from './AddExpenseHeader.styles';

export default function AddExpenseHeader({ onBack, isSmallDevice }) {
  const styles = getStyles(isSmallDevice);
  
  return (
    <View style={styles.headerRow}>
      <TouchableOpacity onPress={onBack} activeOpacity={0.7} style={styles.backButton}>
        <Feather name="arrow-left" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Add Expense</Text>
      <View style={styles.placeholderButton} />
    </View>
  );
}
