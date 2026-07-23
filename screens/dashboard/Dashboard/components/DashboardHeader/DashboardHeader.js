import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getStyles } from "../../DashboardScreen.styles";

export default function DashboardHeader({ firstName, onMenuPress, darkModeEnabled, isSmallDevice }) {
  const styles = getStyles(isSmallDevice, darkModeEnabled);

  return (
    <View style={styles.headerRow}>
      <View style={styles.headerTextContainer}>
        <Text style={styles.welcomeText}>Hey, {firstName}</Text>
        <Text style={styles.subtitleText}>Let's keep building your future</Text>
      </View>
      <TouchableOpacity 
        style={styles.notificationButton} 
        activeOpacity={0.8}
        onPress={onMenuPress}
      >
        <Feather name="menu" size={20} color={darkModeEnabled ? "#FFFFFF" : "#111210"} />
      </TouchableOpacity>
    </View>
  );
}
