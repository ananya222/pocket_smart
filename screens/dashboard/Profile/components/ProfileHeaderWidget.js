import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getStyles } from "./ProfileHeaderWidget.styles";

export default function ProfileHeaderWidget({ navigation, darkModeEnabled, isSmallDevice }) {
  const styles = getStyles(isSmallDevice, darkModeEnabled);

  return (
    <View style={styles.headerRow}>
      <TouchableOpacity 
        style={styles.backButton} 
        activeOpacity={0.7}
        onPress={() => navigation.goBack()}
      >
        <Feather name="arrow-left" size={18} color={darkModeEnabled ? "#FFFFFF" : "#111210"} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>My Profile</Text>
      <View style={styles.placeholderButton} />
    </View>
  );
}
