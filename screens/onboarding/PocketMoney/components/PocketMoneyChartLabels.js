import React from "react";
import { View, Text } from "react-native";
import { styles } from "./PocketMoneyChartLabels.styles";

export default function PocketMoneyChartLabels({ spendingPercent, spendingAmount, savingRatio, savingAmount }) {
  return (
    <View style={styles.chartLabelsContainer}>
      <View style={styles.chartLabelRow}>
        <View style={[styles.dot, styles.dotBlue]} />
        <Text style={styles.chartLabelText}>
          SPENDING ({spendingPercent}%):{" "}
          <Text style={styles.chartLabelBold}>
            ₹{spendingAmount.toLocaleString("en-IN")}
          </Text>
        </Text>
      </View>

      <View style={styles.chartLabelRow}>
        <View style={[styles.dot, styles.dotPurple]} />
        <Text style={styles.chartLabelText}>
          SAVING ({savingRatio}%):{" "}
          <Text style={styles.chartLabelBold}>
            ₹{savingAmount.toLocaleString("en-IN")}
          </Text>
        </Text>
      </View>
    </View>
  );
}
