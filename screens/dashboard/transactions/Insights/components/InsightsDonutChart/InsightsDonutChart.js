import React from "react";
import { View, Text } from "react-native";
import Svg, { Circle, G } from "react-native-svg";
import { getStyles } from "./InsightsDonutChart.styles";

export default function InsightsDonutChart({ data, totalSpent, isSmallDevice }) {
  const styles = getStyles(isSmallDevice);
  const radius = 55;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  return (
    <View style={styles.container}>
      <Svg width={160} height={160} viewBox="0 0 160 160">
        <G rotation="-90" origin="80, 80">
          <Circle
            cx={80}
            cy={80}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={strokeWidth}
          />
          {totalSpent > 0 && data.map((item, idx) => {
            const percent = (item.value / totalSpent) * 100;
            if (isNaN(percent) || percent <= 0) return null;

            const strokeDashoffset = circumference - (circumference * percent) / 100;
            const strokeDasharray = `${circumference} ${circumference}`;
            const rotationAngle = (accumulatedPercent * 360) / 100;
            accumulatedPercent += percent;

            return (
              <Circle
                key={idx}
                cx={80}
                cy={80}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${rotationAngle} 80 80)`}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>

      <View style={styles.centralValueContainer}>
        <Text style={styles.centralValueLabel}>
          TOTAL SPENT
        </Text>
        <Text style={styles.centralValueText}>
          ₹{totalSpent.toLocaleString("en-IN")}
        </Text>
      </View>
    </View>
  );
}
