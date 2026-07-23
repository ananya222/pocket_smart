import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './GoalAchievedGoalsSelector.styles';

export default function GoalAchievedGoalsSelector({ remainingGoals, selectedGoalId, setSelectedGoalId }) {
  return (
    <View style={styles.goalsSelectorContainer}>
      <Text style={styles.goalsSelectorLabel}>CHOOSE TARGET GOAL:</Text>
      {remainingGoals.map(g => (
        <TouchableOpacity
          key={g.id}
          onPress={() => setSelectedGoalId(g.id)}
          activeOpacity={0.8}
          style={[styles.goalRow, selectedGoalId === g.id && styles.goalRowActive]}
        >
          <View style={styles.goalInfo}>
            <Text style={styles.goalName}>{g.name}</Text>
            <Text style={styles.goalPrice}>Target: ₹{g.target?.toLocaleString("en-IN")}</Text>
          </View>
          <View style={[styles.checkbox, selectedGoalId === g.id && styles.checkboxActive]}>
            {selectedGoalId === g.id && <Feather name="check" size={10} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
