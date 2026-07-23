import React from 'react';
import { View, Text } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { getStyles } from './AddExpenseBalancePreview.styles';

export default function AddExpenseBalancePreview({ currentBalance, newBalance, expenseAmount, dynamicAllowanceLimit, isSmallDevice }) {
  const styles = getStyles(isSmallDevice);

  return (
    <View style={styles.previewSection}>
      <Text style={styles.sectionLabel}>Balance Impact</Text>
      <BlurView intensity={100} tint="dark" style={styles.previewCard}>
        <View style={styles.previewRow}>
          <View style={styles.previewCol}>
            <Text style={styles.previewColLabel}>Available</Text>
            <Text style={styles.previewColAmount}>₹{currentBalance.toLocaleString("en-IN")}</Text>
          </View>
          <Feather name="arrow-right" size={14} color="rgba(255, 255, 255, 0.25)" style={{ marginHorizontal: 8 }} />
          <View style={styles.previewCol}>
            <Text style={styles.previewColLabel}>Remaining</Text>
            <Text style={[
              styles.previewColAmount,
              expenseAmount > currentBalance && { color: "#FF6B6B" }
            ]}>
              ₹{newBalance.toLocaleString("en-IN")}
            </Text>
          </View>
        </View>
        {/* Progress bar preview */}
        <View style={styles.previewBarContainer}>
          <View style={styles.previewBarBg}>
            <View 
              style={[
                styles.previewBarFill, 
                { 
                  width: `${Math.min(100, Math.max(0, ((dynamicAllowanceLimit - newBalance) / (dynamicAllowanceLimit || 1)) * 100))}%`,
                  backgroundColor: expenseAmount > currentBalance ? "#FF6B6B" : "#9D4EDD"
                }
              ]} 
            />
          </View>
          <Text style={styles.previewBarLabel}>
            {expenseAmount > currentBalance 
              ? `Overdraft by ₹${(expenseAmount - currentBalance).toLocaleString("en-IN")}` 
              : `${Math.round((newBalance / (dynamicAllowanceLimit || 1)) * 100)}% of allowance left`
            }
          </Text>
        </View>
      </BlurView>
    </View>
  );
}
