import React from "react";
import { View, Text } from "react-native";
import { styles } from "./OnboardingProfileCard.styles";

export default function OnboardingProfileCard({ allowance, frequency, goalName, targetAmount, timeToReach }) {
  return (
    <View style={styles.profileCard}>
      {/* Row 1: Budget */}
      <View style={styles.profileRow}>
        <View style={styles.profileDetails}>
          <Text style={styles.profileLabel}>BUDGET LIMIT</Text>
          <Text style={styles.profileSubLabel}>Allowance configured</Text>
        </View>
        <View style={styles.profileRightAlign}>
          <Text style={styles.profileValue}>₹{allowance}</Text>
          <Text style={styles.profileValueSubtitle}>{frequency === "Weekly" ? "weekly" : "monthly"}</Text>
        </View>
      </View>

      {/* Row Divider */}
      <View style={styles.profileDivider} />

      {/* Row 2: Savings Goal */}
      <View style={styles.profileRow}>
        <View style={styles.profileDetails}>
          <Text style={styles.profileLabel}>SAVINGS GOAL</Text>
          <Text style={styles.profileSubLabel}>{goalName}</Text>
        </View>
        <View style={styles.profileRightAlign}>
          <Text style={styles.profileValue}>₹{targetAmount}</Text>
          <Text style={styles.profileValueSubtitle}>
            {timeToReach} {timeToReach === 1 ? (frequency === "Weekly" ? "week" : "month") : (frequency === "Weekly" ? "weeks" : "months")}
          </Text>
        </View>
      </View>

      {/* Row Divider */}
      <View style={styles.profileDivider} />

      {/* Row 3: Security & Access */}
      <View style={styles.profileRow}>
        <View style={styles.profileDetails}>
          <Text style={styles.profileLabel}>ACCOUNT STATUS</Text>
          <Text style={styles.profileSubLabel}>Dashboard encrypted</Text>
        </View>
        <View style={styles.statusBadge}>
          <Text style={styles.statusBadgeText}>ACTIVE</Text>
        </View>
      </View>
    </View>
  );
}
