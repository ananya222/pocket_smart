import React from "react";
import { View, Text } from "react-native";
import { styles } from "./SavingsGoalProgressHint.styles";

export default function SavingsGoalProgressHint({ timeToReach, freq, marginSpacing }) {
  if (timeToReach === null) return null;

  return (
    <View style={[styles.progressWrapper, { marginBottom: marginSpacing }]}>
      <Text style={styles.progressText}>
        At your saving rate you'll reach this goal in{" "}
        <Text style={styles.progressBold}>
          {timeToReach} {freq === "Weekly" ? "week" : "month"}
          {timeToReach !== 1 ? "s" : ""}
        </Text>
        .
      </Text>
    </View>
  );
}
