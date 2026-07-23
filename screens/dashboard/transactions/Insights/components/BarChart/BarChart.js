import React from "react";
import { View } from "react-native";
import Svg, { Rect, G, Text as SvgText } from "react-native-svg";
import { getStyles } from "./BarChart.styles";

export default function BarChart({ data, categoryColorMap, isSmallDevice }) {
  const styles = getStyles();
  const chartHeight = 90;
  const graphHeight = 150;
  const graphWidth = 320;
  const paddingLeft = 15;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 20;

  const maxSpent = Math.max(...data.map(d => d.totalSpent), 1000);
  const N = data.length;
  const containerWidth = graphWidth - paddingLeft - paddingRight;
  const spacing = 12;
  const barWidth = Math.max(16, (containerWidth - (N - 1) * spacing) / N);

  const formatAmount = (amt) => {
    if (amt === 0) return "₹0";
    if (amt >= 1000) return `₹${(amt / 1000).toFixed(1)}k`.replace(".0", "");
    return `₹${amt}`;
  };

  const categoriesList = ["Food & Drinks", "Entertainment", "Shopping", "Transport", "Misc", "Bills & Utilities"];

  return (
    <View style={styles.container}>
      <Svg width={graphWidth} height={graphHeight} viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
        <Rect
          x={paddingLeft}
          y={paddingTop + chartHeight}
          width={containerWidth}
          height={1}
          fill="rgba(255, 255, 255, 0.08)"
        />

        {data.map((item, idx) => {
          const x = paddingLeft + idx * (barWidth + spacing) + (containerWidth - (N * barWidth + (N - 1) * spacing)) / 2;
          
          const categorySpend = {};
          categoriesList.forEach(name => { categorySpend[name] = 0; });
          
          if (item.transactions) {
            item.transactions.forEach(tx => {
              const category = tx.category === "Others" ? "Misc" : tx.category;
              if (categorySpend[category] !== undefined) {
                categorySpend[category] += Math.abs(tx.amount);
              }
            });
          }

          let currentY = paddingTop + chartHeight;
          const segments = [];

          categoriesList.forEach((catName) => {
            const spentAmt = categorySpend[catName] || 0;
            if (spentAmt > 0) {
              const segmentHeight = (spentAmt / maxSpent) * chartHeight;
              const segY = currentY - segmentHeight;
              const color = (categoryColorMap && categoryColorMap[catName]) || "#9D4EDD";
              segments.push({
                y: segY,
                height: segmentHeight,
                color,
              });
              currentY -= segmentHeight;
            }
          });

          const topY = segments.length > 0 ? segments[segments.length - 1].y : (paddingTop + chartHeight);

          return (
            <G key={idx}>
              {segments.map((seg, sIdx) => {
                const isTop = sIdx === segments.length - 1;
                return (
                  <Rect
                    key={sIdx}
                    x={x}
                    y={seg.y}
                    width={barWidth}
                    height={seg.height}
                    fill={seg.color}
                    rx={isTop ? Math.min(barWidth / 2, 4) : 0}
                    ry={isTop ? Math.min(barWidth / 2, 4) : 0}
                  />
                );
              })}

              <SvgText
                x={x + barWidth / 2}
                y={topY - 6}
                fill="#FFFFFF"
                fontSize={8}
                fontFamily="Geist-Regular"
                textAnchor="middle"
              >
                {formatAmount(item.totalSpent)}
              </SvgText>

              <SvgText
                x={x + barWidth / 2}
                y={paddingTop + chartHeight + 16}
                fill="#8A90A8"
                fontSize={9}
                fontFamily="Geist-Regular"
                textAnchor="middle"
              >
                {item.shortLabel}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
