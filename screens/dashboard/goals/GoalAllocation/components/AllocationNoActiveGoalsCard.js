import React from 'react';
import { Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { Feather } from '@expo/vector-icons';
import { styles } from './AllocationNoActiveGoalsCard.styles';

export default function AllocationNoActiveGoalsCard() {
  return (
    <BlurView intensity={100} tint="dark" style={[styles.optionCard, { paddingVertical: 24, alignItems: "center" }]}>
      <Feather name="info" size={24} color="#8A90A8" style={{ marginBottom: 8 }} />
      <Text style={[styles.optionTitle, { textAlign: "center" }]}>NO ACTIVE GOALS</Text>
      <Text style={[styles.optionDescription, { marginTop: 6, fontSize: 13, lineHeight: 20, textAlign: "center" }]}>
        No active goals found. Extra savings allocated to next allowance.
      </Text>
    </BlurView>
  );
}
