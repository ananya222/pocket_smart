import React from "react";
import { Pressable, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText } from "../../../components/ui";
import { nubankColors as colors, nubankStyles as styles } from "./nubankStyles";

const ITEMS = [
  { key: "Home", label: "Home", icon: "home" },
  { key: "Goals", label: "Goals", icon: "target" },
  { key: "Insights", label: "Insights", icon: "bar-chart-2" },
  { key: "Profile", label: "Profile", icon: "user" },
];

export default function NubankBottomNav({ active = "Home", onNavigate }) {
  return (
    <View style={styles.bottomNav}>
      {ITEMS.map((item) => {
        const selected = item.key === active;
        return (
          <Pressable key={item.key} style={styles.bottomNavItem} onPress={() => onNavigate(item.key)} accessibilityRole="button" accessibilityLabel={`Open ${item.label}`}>
            <Feather name={item.icon} size={18} color={selected ? colors.purple : colors.subtle} />
            <AppText style={[styles.bottomNavLabel, selected && styles.bottomNavLabelActive]}>{item.label}</AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
