import React from "react";
import { View, Text } from "react-native";
import { styles } from "./WelcomeHeader.styles";

export default function WelcomeHeader() {
  return (
    <View style={styles.headerTextContainer}>
      <Text style={styles.headerTitle}>
        Welcome to{"\n"}
        <Text style={styles.highlightText}>PocketSmart!</Text>
      </Text>
      <Text style={styles.headerDescription}>
        Spend smarter, reach your goals faster.
      </Text>
    </View>
  );
}
