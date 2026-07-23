import React from 'react';
import { View, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { getStyles } from './ExpenseReflectionImpactSummary.styles';

export default function ExpenseReflectionImpactSummary({
  isSmallDevice,
  showImpact,
  delayDays,
  activeGoalName,
  formattedExpenseAmount,
  formattedFutureValue,
  merchant,
  category
}) {
  const styles = getStyles(isSmallDevice);

  return (
    <View>
      {showImpact ? (
        <View>
          <BlurView intensity={100} tint="dark" style={styles.impactCard}>
            <Text style={styles.impactValue}>+{delayDays} {delayDays === 1 ? "day" : "days"}</Text>
            <Text style={styles.impactSublabel}>Delay on your goal: {activeGoalName}</Text>
            <Text style={styles.impactDetail}>
              This purchase will push your goal back by {delayDays} {delayDays === 1 ? "day" : "days"}.
            </Text>
          </BlurView>

          <BlurView intensity={100} tint="dark" style={styles.futureValueCard}>
            <Text style={styles.futureValueText}>₹{formattedFutureValue}</Text>
            <Text style={styles.impactSublabel}>Value of ₹{formattedExpenseAmount} in 10 years</Text>
            <Text style={styles.impactDetail}>
              At a 10% compound interest rate, this amount would grow to ₹{formattedFutureValue}.
            </Text>
          </BlurView>
        </View>
      ) : (
        <View>
          <BlurView intensity={100} tint="dark" style={styles.impactCard}>
            <Text style={styles.impactValue}>₹{formattedExpenseAmount}</Text>
            <Text style={styles.impactSublabel}>spent at {merchant}</Text>
            <Text style={styles.impactDetail}>
              Category: {category} • allowance adjusted
            </Text>
          </BlurView>

          <BlurView intensity={100} tint="dark" style={styles.futureValueCard}>
            <Text style={styles.futureValueText}>₹{formattedFutureValue}</Text>
            <Text style={styles.impactSublabel}>Value of ₹{formattedExpenseAmount} in 10 years</Text>
            <Text style={styles.impactDetail}>
              At a 10% compound interest rate, this amount would grow to ₹{formattedFutureValue}.
            </Text>
          </BlurView>
        </View>
      )}
    </View>
  );
}
