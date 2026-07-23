import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./PocketMoneyFrequencyToggle.styles";

export default function PocketMoneyFrequencyToggle({ frequency, onFrequencyChange }) {
  return (
    <View style={styles.frequencyRow}>
      <Text style={styles.frequencyLabel}>Frequency:</Text>
      <View style={styles.pillContainer}>
        <TouchableOpacity
          onPress={() => onFrequencyChange("Weekly")}
          style={[
            styles.frequencyPill,
            frequency === "Weekly" && styles.activePillWeekly,
          ]}
        >
          <Text
            style={[
              styles.frequencyPillText,
              frequency === "Weekly" && styles.activePillText,
            ]}
          >
            Weekly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onFrequencyChange("Monthly")}
          style={[
            styles.frequencyPill,
            frequency === "Monthly" && styles.activePillMonthly,
          ]}
        >
          <Text
            style={[
              styles.frequencyPillText,
              frequency === "Monthly" && styles.activePillText,
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
