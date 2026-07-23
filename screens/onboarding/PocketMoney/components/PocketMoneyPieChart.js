import React from "react";
import { View } from "react-native";
import { chartStyles } from "./PocketMoneyPieChart.styles";

// ─────────────────────────────────────────────
// Half-circle helper (purple left, transparent right)
// ─────────────────────────────────────────────
function PurpleHalfCircleLeft({ style }) {
  return (
    <View style={[chartStyles.halfCircleContainer, style]}>
      <View style={chartStyles.halfCirclePurpleLeft} />
    </View>
  );
}

// ─────────────────────────────────────────────
// Pie Chart
// ─────────────────────────────────────────────
export default function PocketMoneyPieChart({ savingRatio }) {
  const S = savingRatio;
  const deg = (S / 100) * 360;

  const rotateStyle = React.useMemo(
    () => ({ transform: [{ rotate: `${deg}deg` }] }),
    [deg]
  );

  const rotate180Style = React.useMemo(
    () => ({ transform: [{ rotate: "180deg" }] }),
    []
  );

  return (
    <View style={chartStyles.container}>
      {/* Base circle — spending colour */}
      <View style={chartStyles.circleBlue} collapsable={false}>
        {S > 0 && S <= 50 ? (
          // Savings ≤ 50%: show only the right-half rotated by deg
          <View style={chartStyles.rightHalfContainer} collapsable={false}>
            <PurpleHalfCircleLeft style={[chartStyles.rightHalfPurple, rotateStyle]} />
          </View>
        ) : S > 50 ? (
          // Savings > 50%: full right half + left half rotated
          <>
            <View style={chartStyles.rightHalfContainer} collapsable={false}>
              <PurpleHalfCircleLeft style={[chartStyles.rightHalfPurple, rotate180Style]} />
            </View>
            <View style={chartStyles.leftHalfContainer} collapsable={false}>
              <PurpleHalfCircleLeft style={[chartStyles.leftHalfPurple, rotateStyle]} />
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
}
