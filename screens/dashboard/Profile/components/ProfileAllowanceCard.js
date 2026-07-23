import React from "react";
import { View, Text } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getStyles } from "./ProfileAllowanceCard.styles";

export default function ProfileAllowanceCard({ allowance, frequency, balance, darkModeEnabled, isSmallDevice }) {
  const styles = getStyles(isSmallDevice, darkModeEnabled);

  return (
    <>
      <Text style={styles.sectionTitle}>Budget & Allowance</Text>
      <View style={styles.detailCard}>
        <View style={styles.detailItem}>
          <View style={styles.detailLabelContainer}>
            <Feather name="sliders" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Baseline Allowance</Text>
          </View>
          <Text style={styles.detailValue}>₹{allowance}</Text>
        </View>

        <View style={styles.detailItem}>
          <View style={styles.detailLabelContainer}>
            <Feather name="repeat" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Frequency</Text>
          </View>
          <Text style={styles.detailValue}>{frequency}</Text>
        </View>

        <View style={styles.detailItemLast}>
          <View style={styles.detailLabelContainer}>
            <Feather name="credit-card" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} style={styles.detailIcon} />
            <Text style={styles.detailLabel}>Available Balance</Text>
          </View>
          <Text style={styles.detailValue}>₹{balance}</Text>
        </View>
      </View>
    </>
  );
}
