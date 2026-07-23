import React from "react";
import { View, Text } from "react-native";
import { BlurView } from "expo-blur";
import { getStyles } from "./CategoryBreakdown.styles";

export default function CategoryBreakdown({ sortedCategories, totalSpent, isSmallDevice }) {
  const styles = getStyles(isSmallDevice);
  
  return (
    <BlurView intensity={90} tint="dark" style={styles.breakdownCard}>
      {sortedCategories.map((cat, idx) => {
        const isLast = idx === sortedCategories.length - 1;
        const percent = totalSpent > 0 ? Math.round((cat.value / totalSpent) * 100) : 0;
        return (
          <View key={idx} style={isLast ? styles.breakdownItemLast : styles.breakdownItem}>
            <View style={styles.categoryLeft}>
              <View style={[styles.colorIndicator, { backgroundColor: cat.color }]} />
              <Text style={styles.categoryName}>{cat.name}</Text>
            </View>
            <View style={styles.categoryRight}>
              <Text style={styles.categoryAmount}>₹{cat.value.toLocaleString("en-IN")}</Text>
              <Text style={styles.categoryPercent}>{percent}%</Text>
            </View>
          </View>
        );
      })}
    </BlurView>
  );
}
