import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from './GoalAchievedAllocationOptions.styles';

export default function GoalAchievedAllocationOptions({ allocationMode, setAllocationMode, setSelectedGoalId }) {
  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setAllocationMode("equal");
          setSelectedGoalId(null);
        }}
        activeOpacity={0.9}
        style={[
          styles.optionCard,
          allocationMode === "equal" && styles.optionCardSelected,
          { marginBottom: 12 }
        ]}
      >
        <View style={styles.optionHeader}>
          <Text style={[styles.optionTitle, allocationMode === "equal" && styles.optionTitleActive]}>
            Divide Equally
          </Text>
          <View style={[styles.radio, allocationMode === "equal" && styles.radioActive]}>
            {allocationMode === "equal" && <View style={styles.radioDot} />}
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => setAllocationMode("single")}
        activeOpacity={0.9}
        style={[
          styles.optionCard,
          allocationMode === "single" && styles.optionCardSelected,
          { marginBottom: 16 }
        ]}
      >
        <View style={styles.optionHeader}>
          <Text style={[styles.optionTitle, allocationMode === "single" && styles.optionTitleActive]}>
            Allocate to One Goal
          </Text>
          <View style={[styles.radio, allocationMode === "single" && styles.radioActive]}>
            {allocationMode === "single" && <View style={styles.radioDot} />}
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
