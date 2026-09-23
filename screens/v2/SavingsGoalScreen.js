import { auth, firestore } from "../../config";
import React, { useState } from "react";
import { Alert, StatusBar, View, Pressable } from "react-native";
import { AppText, Field, PrimaryButton, Screen } from "../../components/ui";
import { colors, parseMoney } from "../../theme/theme";
import { UI_PREVIEW_MODE } from "../../config/uiPreview";
import { styles } from "./v2Styles";
import { GoalFlowHeader } from "./GoalFlowScreens";

export default function SavingsGoalScreenV2({ navigation, route }) {
  const params = route?.params || {};
  const allowance = params.allowance || "5,000";
  const frequency = params.frequency || "Weekly";
  const savingRatio = Number(params.savingRatio ?? 30);
  const [goalName, setGoalName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [priority, setPriority] = useState("Important");
  const [isLoading, setIsLoading] = useState(false);
  const savingPerCycle = Math.round(parseMoney(allowance) * savingRatio / 100);
  const timeToReach = savingPerCycle && parseMoney(targetAmount) ? Math.ceil(parseMoney(targetAmount) / savingPerCycle) : 0;

  const handleAmountChange = (value) => {
    const digits = value.replace(/[^0-9]/g, "");
    setTargetAmount(digits ? Number(digits).toLocaleString("en-IN") : "");
  };

  const handleContinue = async () => {
    if (isLoading) return;
    if (!goalName.trim()) return Alert.alert("Goal name", "Enter a name for your savings goal.");
    if (parseMoney(targetAmount) <= 0) return Alert.alert("Target amount", "Enter an amount greater than zero.");
    if (UI_PREVIEW_MODE) {
      return navigation.navigate(params.fromDashboard ? "Dashboard" : "OnboardingComplete", {
        user: params.user, previewData: params.previewData, allowance, frequency, goalName: goalName.trim(), targetAmount, timeToReach, savingRatio, priority: priority === "Important" ? 1 : 3,
      });
    }
    if (params.fromDashboard) {
      setIsLoading(true);
      try {
        const userId = params.user?.id || params.user?.userId || auth().currentUser?.uid;
        if (!userId) throw new Error("No authenticated user.");
        await firestore().collection("users").doc(userId).collection("goals").add({ name: goalName.trim(), target_amount: String(targetAmount), time_to_reach: timeToReach, progress: 0, priority: priority === "Important" ? 1 : 3, is_active: 1, created_at: firestore.FieldValue.serverTimestamp() });
        navigation.navigate("Dashboard", { user: params.user });
      } catch (error) {
        Alert.alert("Could not create goal", "Please check your connection and try again.");
      } finally {
        setIsLoading(false);
      }
      return;
    }
    navigation.navigate("OnboardingComplete", { user: params.user, allowance, frequency, goalName: goalName.trim(), targetAmount, timeToReach, savingRatio, priority: priority === "Important" ? 1 : 3 });
  };

  return (
    <Screen scroll contentContainerStyle={styles.flowContent}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <GoalFlowHeader navigation={navigation} user={params.user} showAvatar={Boolean(params.fromDashboard)} title={params.fromDashboard ? "Create a savings goal" : "What are you saving for?"} eyebrow={params.fromDashboard ? "YOUR NEW GOAL" : "STEP 2 OF 2"} />
      <Field label="Goal name" value={goalName} onChangeText={setGoalName} placeholder="e.g. New headphones" />
      <Field label="Target amount" value={targetAmount} onChangeText={handleAmountChange} placeholder="0" keyboardType="numeric" style={styles.goalAmountField} />
      {timeToReach ? <AppText style={styles.goalEstimate}>At this pace, you could reach it in about {timeToReach} {frequency === "Weekly" ? (timeToReach === 1 ? "week" : "weeks") : (timeToReach === 1 ? "month" : "months")}.</AppText> : null}
      <View style={styles.goalPrioritySection}><AppText style={styles.goalPriorityTitle}>Priority</AppText><View style={styles.goalPriorityRow}><Pressable onPress={() => setPriority("Important")} style={[styles.goalPriorityChoice, priority === "Important" && styles.goalPriorityActive]}><AppText style={[styles.goalPriorityText, priority === "Important" && styles.goalPriorityTextActive]}>Important</AppText></Pressable><Pressable onPress={() => setPriority("Nice to have")} style={[styles.goalPriorityChoice, priority === "Nice to have" && styles.goalPriorityActive]}><AppText style={[styles.goalPriorityText, priority === "Nice to have" && styles.goalPriorityTextActive]}>Nice to have</AppText></Pressable></View></View>
      <View style={styles.flowActions}><PrimaryButton onPress={handleContinue} loading={isLoading}>{params.fromDashboard ? "Create goal" : "Continue"}</PrimaryButton></View>
    </Screen>
  );
}
