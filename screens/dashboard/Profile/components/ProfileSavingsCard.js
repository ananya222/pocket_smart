import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getStyles } from "./ProfileSavingsCard.styles";

export default function ProfileSavingsCard({ goalsCount, goalsTotalSaved, goalsTotalTarget, darkModeEnabled, isSmallDevice }) {
  const styles = getStyles(isSmallDevice, darkModeEnabled);

  return (
    <>
      <Text style={styles.sectionTitle}>Savings & Goals</Text>
      <View style={styles.detailCard}>
        <View style={styles.detailItem}>
          <View style={styles.detailLabelContainer}>
            <Feather name="target" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Active Targets</Text>
          </View>
          <Text style={styles.detailValue}>{goalsCount} goals</Text>
        </View>

        <View style={styles.detailItemLast}>
          <View style={styles.detailLabelContainer}>
            <Feather name="award" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Saved Progress</Text>
          </View>
          <Text style={styles.detailValue}>₹{goalsTotalSaved.toLocaleString("en-IN")} of ₹{goalsTotalTarget.toLocaleString("en-IN")}</Text>
        </View>
      </View>
    </>
  );
}
