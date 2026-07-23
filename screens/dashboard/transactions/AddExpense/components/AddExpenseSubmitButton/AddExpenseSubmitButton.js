import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { getStyles } from './AddExpenseSubmitButton.styles';

export default function AddExpenseSubmitButton({ isLoading, onPress, isSmallDevice }) {
  const styles = getStyles(isSmallDevice);

  if (isLoading) {
    return (
      <View style={[styles.addButton, { opacity: 0.6 }]}>
        <ActivityIndicator size="small" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.8}
      style={styles.addButton}
    >
      <Text style={styles.addButtonText}>Add Expense</Text>
    </TouchableOpacity>
  );
}
