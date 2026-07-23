import React from 'react';
import { Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { styles } from './GoalAchievedOverflowCard.styles';

export default function GoalAchievedOverflowCard({ overflowAmount, remainingGoalsCount }) {
  if (remainingGoalsCount === 0) {
    return (
      <BlurView intensity={100} tint="dark" style={styles.overflowCard}>
        <Text style={styles.overflowLabel}>EXTRA SAVINGS</Text>
        <Text style={styles.overflowAmount}>₹{overflowAmount.toLocaleString("en-IN")}</Text>
        <Text style={[styles.overflowDesc, { marginTop: 4, lineHeight: 18, textAlign: "center" }]}>
          No active goals found. Extra savings allocated to next allowance.
        </Text>
      </BlurView>
    );
  }

  return (
    <BlurView intensity={100} tint="dark" style={styles.overflowCard}>
      <Text style={styles.overflowLabel}>EXTRA SAVINGS</Text>
      <Text style={styles.overflowAmount}>₹{overflowAmount.toLocaleString("en-IN")}</Text>
      <Text style={styles.overflowDesc}>Redistribute remaining extra savings:</Text>
    </BlurView>
  );
}
