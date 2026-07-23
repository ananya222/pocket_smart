import React from "react";
import { View, Text, TouchableOpacity, Animated, ActivityIndicator } from "react-native";
import { styles } from "./SavingsGoalCreateButton.styles";

export default function SavingsGoalCreateButton({
  handleCreateGoal,
  isLoading,
  isFromDashboard,
  createGoalScale,
  createGoalScaleStyle,
  handlePressIn,
  handlePressOut,
}) {
  return (
    <TouchableOpacity
      onPress={handleCreateGoal}
      onPressIn={() => handlePressIn(createGoalScale)}
      onPressOut={() => handlePressOut(createGoalScale)}
      activeOpacity={1}
      disabled={isLoading}
      style={styles.buttonContainer}
    >
      <Animated.View style={[styles.buttonScaleWrapper, createGoalScaleStyle]}>
        <View style={styles.buttonSolid}>
          {isLoading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.buttonText}>
              {isFromDashboard ? "Add Goal" : "Create Goal"}
            </Text>
          )}
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}
