import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { styles } from './AllocationGoalSelector.styles';

export default function AllocationGoalSelector({ 
  activeAllocationGoals, 
  selectedGoalId, 
  onSelectGoal 
}) {
  return (
    <View style={styles.goalsSelectorContainer}>
      <Text style={styles.goalsSelectorLabel}>CHOOSE TARGET GOAL:</Text>
      {activeAllocationGoals.map((g) => (
        <TouchableOpacity
          key={g.id}
          onPress={() => onSelectGoal(g.id)}
          activeOpacity={0.8}
          style={[
            styles.goalSelectRow,
            selectedGoalId === g.id && styles.goalSelectRowActive
          ]}
        >
          <View style={styles.goalSelectInfo}>
            <Text style={styles.goalSelectName}>{g.name}</Text>
            <Text style={styles.goalSelectPrice}>Target: ₹{g.target?.toLocaleString("en-IN")}</Text>
          </View>
          <View style={[styles.checkCircle, selectedGoalId === g.id && styles.checkCircleActive]}>
            {selectedGoalId === g.id && <Feather name="check" size={14} color="#FFFFFF" />}
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
