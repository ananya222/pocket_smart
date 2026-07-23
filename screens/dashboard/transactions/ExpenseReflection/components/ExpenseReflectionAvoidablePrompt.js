import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getStyles } from './ExpenseReflectionAvoidablePrompt.styles';

export default function ExpenseReflectionAvoidablePrompt({
  isSmallDevice,
  isAvoidable,
  onSelectAvoidable
}) {
  const styles = getStyles(isSmallDevice);

  return (
    <View style={styles.questionContainer}>
      <Text style={styles.questionText}>Was this purchase avoidable?</Text>
      <View style={styles.choiceRow}>
        <TouchableOpacity
          onPress={() => onSelectAvoidable(true)}
          activeOpacity={0.8}
          style={[styles.choiceButton, isAvoidable === true && styles.choiceButtonActive]}
        >
          <Text style={[styles.choiceButtonText, isAvoidable === true && styles.choiceButtonTextActive]}>
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onSelectAvoidable(false)}
          activeOpacity={0.8}
          style={[styles.choiceButton, isAvoidable === false && styles.choiceButtonActive]}
        >
          <Text style={[styles.choiceButtonText, isAvoidable === false && styles.choiceButtonTextActive]}>
            No
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
