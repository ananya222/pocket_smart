import React from "react";
import { View, Text } from "react-native";
import { styles } from "./LoginHeader.styles";

export default function LoginHeader({ title, description }) {
  return (
    <View style={styles.headerTextContainer}>
      <Text style={styles.headerTitle}>{title ? title.split('\\n').join('\n') : ""}</Text>
      {description ? <Text style={styles.headerDescription}>{description}</Text> : null}
    </View>
  );
}
