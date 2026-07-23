import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./SavingsGoalHeader.styles";

export default function SavingsGoalHeader({ onBackPress, title, statusBarHeight }) {
  return (
    <>
      <TouchableOpacity
        onPress={onBackPress}
        style={[styles.backButtonContainer, { top: statusBarHeight + 10 }]}
      >
        <Feather name="arrow-left" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={[styles.headerTextContainer, { paddingTop: statusBarHeight + 60 }]}>
        <Text style={styles.headerTitle}>{title}</Text>
      </View>
    </>
  );
}
