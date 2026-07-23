import React from "react";
import { Text } from "react-native";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { styles } from "./GoalsEmptyState.styles";

export default function GoalsEmptyState({ type }) {
  const isOngoing = type === "ongoing";
  
  return (
    <BlurView intensity={100} tint="dark" style={styles.emptyCard}>
      <Feather 
        name={isOngoing ? "target" : "award"} 
        size={24} 
        color="#8A90A8" 
        style={styles.icon} 
      />
      <Text style={styles.title}>
        {isOngoing ? "No ongoing goals" : "No completed goals yet"}
      </Text>
      <Text style={styles.subtitle}>
        {isOngoing 
          ? "You have completed all active goals! Add a new one below." 
          : "Keep saving allowance to complete your active goals!"}
      </Text>
    </BlurView>
  );
}
