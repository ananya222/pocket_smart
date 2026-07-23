import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { getStyles } from "./ProfilePreferencesCard.styles";

export default function ProfilePreferencesCard({ notificationsEnabled, darkModeEnabled, handleToggleNotifications, handleToggleDarkMode, isSmallDevice }) {
  const styles = getStyles(isSmallDevice, darkModeEnabled);

  return (
    <>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.detailCard}>
        <View style={styles.prefItem}>
          <View style={styles.prefTextContainer}>
            <Text style={styles.prefTitle}>Daily Reminders</Text>
            <Text style={styles.prefSubtitle}>Get notified to log your spending daily</Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleToggleNotifications} 
            style={[styles.toggleContainer, notificationsEnabled && styles.toggleActive]}
          >
            <View style={[styles.toggleDot, notificationsEnabled && styles.toggleDotActive]} />
          </TouchableOpacity>
        </View>

        <View style={styles.prefItemLast}>
          <View style={styles.prefTextContainer}>
            <Text style={styles.prefTitle}>Dark Mode</Text>
            <Text style={styles.prefSubtitle}>Switch interface theme instantly</Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={handleToggleDarkMode} 
            style={[styles.toggleContainer, darkModeEnabled && styles.toggleActive]}
          >
            <View style={[styles.toggleDot, darkModeEnabled && styles.toggleDotActive]} />
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
