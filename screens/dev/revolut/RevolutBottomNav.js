import React from "react";
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "../../../components/ui";
import { revolutColors, revolutStyles as styles } from "./revolutStyles";

const ITEMS = [
  { key: "Home", label: "Home", icon: "home" },
  { key: "Goals", label: "Goals", icon: "target" },
  { key: "Insights", label: "Insights", icon: "bar-chart-2" },
  { key: "Profile", label: "Profile", icon: "user" },
];

export default function RevolutBottomNav({ active, onNavigate }) {
  return (
    <View style={styles.bottomNav}>
      {ITEMS.map((item) => {
        const isActive = active === item.key;
        return (
          <Pressable key={item.key} style={styles.bottomNavItem} onPress={() => onNavigate(item.key)} accessibilityRole="button" accessibilityLabel={`Open ${item.label}`}>
            <Feather name={item.icon} size={17} color={isActive ? revolutColors.purple : revolutColors.mutedText} />
            <AppText style={[styles.bottomNavLabel, isActive && styles.bottomNavLabelActive]}>{item.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
