import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { getStyles } from "./ProfileActionButtons.styles";

export default function ProfileActionButtons({ setIsPasswordModalVisible, handleLogout, darkModeEnabled, isSmallDevice }) {
  const styles = getStyles(isSmallDevice, darkModeEnabled);

  return (
    <View style={styles.actionButtonsContainer}>
      <TouchableOpacity 
        style={styles.actionButton}
        activeOpacity={0.8}
        onPress={() => setIsPasswordModalVisible(true)}
      >
        <Feather name="lock" size={14} color={darkModeEnabled ? "#FFFFFF" : "#111210"} style={styles.actionButtonIcon} />
        <Text style={styles.actionButtonText}>Change Password</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.logoutButton}
        activeOpacity={0.8}
        onPress={handleLogout}
      >
        <Feather name="log-out" size={14} color="#FF6B6B" style={styles.actionButtonIcon} />
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
