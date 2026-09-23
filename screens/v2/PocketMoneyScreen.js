import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, StatusBar, View } from "react-native";
import { AppText, BackButton, Field, PrimaryButton, Screen, SegmentedControl } from "../../components/ui";
import { colors, formatMoney, parseMoney } from "../../theme/theme";
import { styles } from "./v2Styles";

export default function PocketMoneyScreenV2({ navigation, route }) {
  const [allowance, setAllowance] = useState("5,000");
  const [frequency, setFrequency] = useState("Weekly");
  const [savingRatio, setSavingRatio] = useState(30);
  const [splitTrackWidth, setSplitTrackWidth] = useState(0);
  const handleAllowanceChange = (value) => {
    const digits = value.replace(/[^0-9]/g, "");
    setAllowance(digits ? Number(digits).toLocaleString("en-IN") : "");
  };
  const updateSavingRatio = (event) => {
    if (!splitTrackWidth) return;
    const ratio = Math.round(event.nativeEvent.locationX / splitTrackWidth * 100);
    setSavingRatio(Math.max(10, Math.min(80, ratio)));
  };
  const allowanceAmount = parseMoney(allowance);
  const savingAmount = Math.round(allowanceAmount * savingRatio / 100);
  const spendingAmount = Math.max(0, allowanceAmount - savingAmount);

  return (
    <Screen scroll contentContainerStyle={styles.pocketMoneyContent}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.onboardingIntro}>
        <AppText style={styles.onboardingStep}>STEP 1 OF 2</AppText>
        <AppText style={styles.screenTitle}>Set your pocket money</AppText>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.pocketMoneyForm}>
        <Field label="How much do you receive?" value={allowance} onChangeText={handleAllowanceChange} placeholder="0" keyboardType="numeric" />
        <AppText style={styles.pocketMoneyLabel}>How often?</AppText>
        <SegmentedControl options={["Weekly", "Monthly"]} value={frequency} onChange={setFrequency} />
        <View style={styles.pocketMoneySplit}>
          <View style={styles.splitHeadingRow}><AppText style={styles.splitTitle}>Your split</AppText><AppText muted style={styles.splitRatio}>{savingRatio}% to savings</AppText></View>
          <View style={styles.splitSummary}>
            <View><AppText muted style={styles.smallLabel}>Save</AppText><AppText style={[styles.splitAmount, styles.pocketSavingAmount]}>₹{formatMoney(savingAmount)}</AppText><AppText style={styles.percentText}>{savingRatio}%</AppText></View>
            <View style={styles.splitDivider} />
            <View style={styles.splitRight}><AppText muted style={styles.smallLabel}>Spend</AppText><AppText style={[styles.splitAmount, styles.pocketSpendingAmount]}>₹{formatMoney(spendingAmount)}</AppText><AppText style={[styles.percentText, styles.pocketSpendPercent]}>{100 - savingRatio}%</AppText></View>
          </View>
          <View
            style={styles.sliderTouchArea}
            onLayout={(event) => setSplitTrackWidth(event.nativeEvent.layout.width)}
            onStartShouldSetResponder={() => true}
            onMoveShouldSetResponder={() => true}
            onResponderGrant={updateSavingRatio}
            onResponderMove={updateSavingRatio}
            accessibilityRole="adjustable"
            accessibilityLabel="Savings split"
            accessibilityValue={{ min: 10, max: 80, now: savingRatio, text: `${savingRatio}% to savings` }}
          >
            <View style={styles.sliderTrack}><View style={[styles.sliderFill, { width: `${savingRatio}%` }]} /><View style={[styles.sliderThumb, { left: `${savingRatio}%` }]} /></View>
          </View>
        </View>
      </KeyboardAvoidingView>
      <PrimaryButton onPress={() => navigation.navigate("SavingsGoal", { user: route?.params?.user, allowance, frequency, savingRatio })} style={styles.onboardingBottomAction}>Continue</PrimaryButton>
    </Screen>
  );
}
