import React from "react";
import { View, Text } from "react-native";
import { styles } from "./WelcomePoints.styles";

export default function WelcomePoints() {
  return (
    <View style={styles.pointsCard}>
      <View style={styles.minimalRow}>
        <View style={styles.minimalDot} />
        <Text style={styles.bulletText}>Budget Smart</Text>
      </View>
      <View style={styles.minimalRow}>
        <View style={styles.minimalDot} />
        <Text style={styles.bulletText}>Spend Wisely</Text>
      </View>
      <View style={styles.minimalRow}>
        <View style={styles.minimalDot} />
        <Text style={styles.bulletText}>Save Better</Text>
      </View>
      <View style={styles.minimalRow}>
        <View style={styles.minimalDot} />
        <Text style={styles.bulletText}>Reach Goals</Text>
      </View>
    </View>
  );
}
