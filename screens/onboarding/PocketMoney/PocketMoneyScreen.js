// PocketMoneyScreen.js

import React, { useState } from "react";
import { View, Text, ScrollView, StatusBar, useWindowDimensions } from "react-native";
import BackgroundGrid from "../../../components/BackgroundGrid/BackgroundGrid";
import { styles } from "./PocketMoneyScreen.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import PocketMoneyHeader from "./components/PocketMoneyHeader";
import PocketMoneyAllowanceInput from "./components/PocketMoneyAllowanceInput";
import PocketMoneyFrequencyToggle from "./components/PocketMoneyFrequencyToggle";
import PocketMoneyRatioSlider from "./components/PocketMoneyRatioSlider";
import PocketMoneyPieChart from "./components/PocketMoneyPieChart";
import PocketMoneyChartLabels from "./components/PocketMoneyChartLabels";
import PocketMoneyActionButtons from "./components/PocketMoneyActionButtons";

export default function PocketMoneyScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // ── State ──────────────────────────────────
  const [allowance, setAllowance] = useState("5,000");
  const [frequency, setFrequency] = useState("Weekly");
  const [savingRatio, setSavingRatio] = useState(30);

  // Format allowance with Indian commas
  const handleAllowanceChange = (val) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean) {
      setAllowance("");
      return;
    }
    setAllowance(parseInt(clean, 10).toLocaleString("en-IN"));
  };

  // ── Derived values ─────────────────────────
  const numericAllowance = parseInt(allowance.replace(/[^0-9]/g, ""), 10) || 0;
  const spendingPercent = 100 - savingRatio;
  const savingAmount = Math.round(numericAllowance * (savingRatio / 100));
  const spendingAmount = Math.round(numericAllowance * (spendingPercent / 100));

  // ── Render ─────────────────────────────────
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <BackgroundGrid type="pocket_money" />

      <PocketMoneyHeader onBack={() => navigation.navigate("Welcome")} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Allowance Input ─────────────────── */}
        <PocketMoneyAllowanceInput allowance={allowance} onChange={handleAllowanceChange} />

        {/* ── Frequency Toggle ────────────────── */}
        <PocketMoneyFrequencyToggle frequency={frequency} onFrequencyChange={setFrequency} />

        {/* ── Ratio Section ───────────────────── */}
        <Text style={styles.sectionTitle}>Set Spending vs. Saving Ratio</Text>

        <View style={styles.ratioContainer}>
          {/* Left: Vertical Slider */}
          <PocketMoneyRatioSlider savingRatio={savingRatio} onRatioChange={setSavingRatio} />

          {/* Right: Pie Chart + Labels */}
          <View style={styles.chartColumn}>
            <PocketMoneyPieChart savingRatio={savingRatio} />
            <PocketMoneyChartLabels
              spendingPercent={spendingPercent}
              spendingAmount={spendingAmount}
              savingRatio={savingRatio}
              savingAmount={savingAmount}
            />
          </View>
        </View>

        {/* ── Back / Next Buttons ─────────────── */}
        <PocketMoneyActionButtons
          onBack={() => navigation.navigate("Welcome")}
          onNext={() =>
            navigation.navigate("SavingsGoal", {
              user: route.params?.user,
              allowance,
              frequency,
              savingRatio,
            })
          }
        />
      </ScrollView>
    </View>
  );
}