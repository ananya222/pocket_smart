import React from "react";
import { View, Text } from "react-native";
import { getStyles } from "./ProfileDetailsCard.styles";

export default function ProfileDetailsCard({ firstName, fullName, email, darkModeEnabled, isSmallDevice }) {
  const styles = getStyles(isSmallDevice, darkModeEnabled);

  return (
    <View style={styles.profileCard}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>{firstName[0]?.toUpperCase() || "A"}</Text>
      </View>
      <Text style={styles.userName}>{fullName}</Text>
      <Text style={styles.userEmail}>{email}</Text>
    </View>
  );
}
