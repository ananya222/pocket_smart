import React from "react";
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "../../../components/ui";
import { copilotColors as colors, copilotStyles as styles } from "./copilotStyles";

const ITEMS = [
  { key: "Home", label: "Home", icon: "home" },
  { key: "Goals", label: "Goals", icon: "target" },
  { key: "Insights", label: "Insights", icon: "bar-chart-2" },
  { key: "Profile", label: "Profile", icon: "user" },
];

export default function CopilotBottomNav({ active = "Home", onNavigate }) {
  return <View style={styles.bottomNav}>{ITEMS.map((item) => { const selected = item.key === active; return <Pressable key={item.key} style={styles.bottomNavItem} onPress={() => onNavigate(item.key)} accessibilityRole="button" accessibilityLabel={`Open ${item.label}`}><Feather name={item.icon} size={17} color={selected ? colors.blue : colors.textSubtle} /><AppText style={[styles.bottomNavLabel, selected && styles.bottomNavLabelActive]}>{item.label}</AppText></Pressable>; })}</View>;
}
