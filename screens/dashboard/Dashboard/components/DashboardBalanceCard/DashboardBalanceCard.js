import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { getStyles } from "../../DashboardScreen.styles";

export default function DashboardBalanceCard({
  formattedBalance,
  formattedAllowance,
  formattedSpent,
  usedPercent,
  darkModeEnabled,
  isSmallDevice,
  accentColor,
  onTopUpPress
}) {
  const styles = getStyles(isSmallDevice, darkModeEnabled);

  return (
    <BlurView intensity={100} tint={darkModeEnabled ? "dark" : "light"} style={styles.balanceCard}>
      <View style={styles.balanceHeader}>
        <Feather name="eye" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} />
        <Text style={styles.balanceHeaderText}>AVAILABLE BALANCE</Text>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
        <Text style={styles.balanceAmount}>₹{formattedBalance}</Text>
        <TouchableOpacity 
          style={styles.topUpButton} 
          activeOpacity={0.8}
          onPress={onTopUpPress}
        >
          <Feather name="plus" size={11} color={darkModeEnabled ? "#FFFFFF" : "#111210"} style={{ marginRight: 4 }} />
          <Text style={styles.topUpText}>Top Up</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.balanceSubtitle}>
        Left from ₹{formattedAllowance} allowance
      </Text>

      <View style={styles.progressBarBg}>
        <View style={[styles.progressBarFill, { width: `${usedPercent}%`, backgroundColor: accentColor }]} />
      </View>

      <View style={styles.balanceFooter}>
        <Text style={[styles.balanceFooterTextAccent, { color: accentColor }]}>{usedPercent}% used</Text>
        <Text style={styles.balanceFooterTextMuted}>₹{formattedSpent} spent</Text>
      </View>
    </BlurView>
  );
}
