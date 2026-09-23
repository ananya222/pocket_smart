import { auth, firestore } from "../../config";
import React, { useState } from "react";
import { Alert, StatusBar, View } from "react-native";
import { AppText, PrimaryButton, Screen } from "../../components/ui";
import { colors, formatMoney, parseMoney } from "../../theme/theme";
import { UI_PREVIEW_MODE } from "../../config/uiPreview";
import { styles } from "./v2Styles";

export default function OnboardingCompleteScreenV2({ navigation, route }) {
  const params = route?.params || {};
  const allowance = params.allowance || "5,000";
  const frequency = params.frequency || "Weekly";
  const goalName = params.goalName || "Savings goal";
  const targetAmount = params.targetAmount || "8,000";
  const savingRatio = Number(params.savingRatio ?? 30);
  const spendingAmount = Math.round(parseMoney(allowance) * (100 - savingRatio) / 100);
  const savingAmount = Math.round(parseMoney(allowance) * savingRatio / 100);
  const [isLoading, setIsLoading] = useState(false);

  const handleProceed = async () => {
    if (isLoading) return;
    if (UI_PREVIEW_MODE) {
      navigation.navigate("Dashboard", { user: params.user, previewData: params.previewData });
      return;
    }
    const userId = params.user?.id || auth().currentUser?.uid;
    if (!userId) return Alert.alert("Session unavailable", "Please sign in again before finishing setup.");
    setIsLoading(true);
    try {
      const cleanAllowance = parseMoney(allowance) || 5000;
      const onboarding = {
        allowance_amount: String(allowance),
        allowance_frequency: String(frequency),
        spending_ratio: String(100 - savingRatio),
        saving_ratio: String(savingRatio),
        current_balance: String(cleanAllowance),
        cycle_limit: String(cleanAllowance),
        last_refreshed: firestore.FieldValue.serverTimestamp(),
      };
      const userRef = firestore().collection("users").doc(userId);
      // Merge so setup also repairs a missing profile document (for example,
      // when an account was created before profile creation completed).
      const goalRef = userRef.collection("goals").doc();
      const batch = firestore().batch();
      batch.set(userRef, {
        fullName: params.user?.fullName || auth().currentUser?.displayName || "",
        email: params.user?.email || auth().currentUser?.email || "",
        onboardingCompleted: true,
        onboarding,
      }, { merge: true });
      batch.set(goalRef, {
        name: goalName,
        target_amount: String(targetAmount),
        time_to_reach: parseInt(String(params.timeToReach), 10) || 6,
        progress: 0,
        priority: parseInt(String(params.priority || 3), 10) || 3,
        is_active: 1,
        created_at: firestore.FieldValue.serverTimestamp(),
      });
      await batch.commit();
      navigation.navigate("Dashboard", { user: { ...params.user, id: userId, onboardingCompleted: true, onboarding } });
    } catch (error) {
      console.error("Error saving V2 onboarding:", error);
      Alert.alert("Setup failed", "Could not save your setup details. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Screen scroll contentContainerStyle={styles.completeContent}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.completeIntro}>
        <View style={styles.successMark}><AppText style={styles.successMarkText}>✓</AppText></View>
        <AppText style={styles.onboardingStep}>YOUR PLAN</AppText>
        <AppText style={styles.completeTitle}>Ready for a calmer month.</AppText>
        <AppText muted style={styles.completeSubtitle}>You can adjust this anytime from your profile.</AppText>
      </View>

      <View style={styles.planSummary}>
        <View style={styles.planTotal}><AppText muted style={styles.smallLabel}>{frequency} allowance</AppText><AppText style={styles.planTotalAmount}>₹{formatMoney(parseMoney(allowance))}</AppText></View>
        <View style={styles.planSplit}><View style={styles.planSplitColumn}><AppText muted style={styles.smallLabel}>Save</AppText><AppText style={styles.planSplitAmount}>₹{formatMoney(savingAmount)}</AppText><AppText muted style={styles.planSplitMeta}>{savingRatio}% of your allowance</AppText></View><View style={styles.planSplitDivider} /><View style={[styles.planSplitColumn, styles.planSplitColumnRight]}><AppText muted style={styles.smallLabel}>Spend</AppText><AppText style={styles.planSplitAmount}>₹{formatMoney(spendingAmount)}</AppText><AppText muted style={styles.planSplitMeta}>{100 - savingRatio}% for everyday life</AppText></View></View>
      </View>

      <View style={styles.firstGoalLine}><AppText style={styles.firstGoalText} numberOfLines={1}>First goal: {goalName}</AppText></View>
      <View style={styles.completeActions}><PrimaryButton onPress={handleProceed} loading={isLoading} style={styles.fullWidthButton}>Go to dashboard</PrimaryButton></View>
    </Screen>
  );
}
