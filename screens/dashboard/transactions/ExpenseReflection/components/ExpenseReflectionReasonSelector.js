import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated } from 'react-native';
import { getStyles } from './ExpenseReflectionReasonSelector.styles';

export default function ExpenseReflectionReasonSelector({
  isSmallDevice,
  isAvoidable,
  fadeAnim,
  slideAnim,
  options,
  reason,
  setReason,
  handleFinalize,
  isFinalizing
}) {
  const styles = getStyles(isSmallDevice);

  if (isAvoidable !== true) return null;

  return (
    <Animated.View style={[
      styles.reasonContainer,
      { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
    ]}>
      <Text style={styles.instructionsText}>
        Select the most relevant reason:
      </Text>
      
      <View style={styles.optionsList}>
        {options.map((opt, idx) => {
          const isSelected = reason === opt;
          return (
            <TouchableOpacity
              key={idx}
              onPress={() => setReason(opt)}
              activeOpacity={0.8}
              style={[
                styles.optionItem,
                isSelected && styles.optionItemActive
              ]}
            >
              <Text style={[
                styles.optionText,
                isSelected && styles.optionTextActive
              ]}>
                {opt}
              </Text>
              <View style={[
                styles.radioCircle,
                isSelected && styles.radioCircleActive
              ]}>
                {isSelected && <View style={styles.radioInnerCircle} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      <TouchableOpacity
        onPress={() => handleFinalize(true, reason)}
        activeOpacity={0.8}
        style={[
          styles.submitButton,
          !reason && { opacity: 0.5 }
        ]}
        disabled={isFinalizing || !reason}
      >
        {isFinalizing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Confirm</Text>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
}
