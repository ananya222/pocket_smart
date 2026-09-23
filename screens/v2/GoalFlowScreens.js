import { auth, firestore } from "../../config";
import React, { useState } from "react";
import { Alert, Pressable, StatusBar, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, DestructiveButton, Field, PrimaryButton, ProgressBar, Screen, SecondaryButton } from "../../components/ui";
import { colors, formatMoney, parseMoney, sanitizeMoneyInput } from "../../theme/theme";
import { UI_PREVIEW_MODE } from "../../config/uiPreview";
import { styles } from "./v2Styles";

export const GoalFlowHeader = ({ navigation, user = {}, title, eyebrow, showAvatar = true, back = true }) => {
  const firstName = (user.fullName || "there").trim().split(" ")[0];
  return (
    <View style={styles.flowHeader}>
      {showAvatar ? <Pressable style={styles.flowAvatar} onPress={() => navigation.navigate("Dashboard", { user, screen: "Profile" })} accessibilityLabel="Open profile"><AppText style={styles.avatarText}>{firstName[0]?.toUpperCase() || "P"}</AppText></Pressable> : null}
      {eyebrow?.startsWith("STEP ") ? <AppText style={styles.flowEyebrow}>{eyebrow}</AppText> : null}
      <AppText style={[styles.flowTitle, showAvatar && { paddingRight: 56, minHeight: 44 }]}>{title}</AppText>
    </View>
  );
};

const FlowEmpty = ({ title, description, onCreate }) => (
  <View style={styles.flowEmpty}>
    <View style={styles.flowEmptyIcon}><Feather name="layers" size={19} color={colors.accent} /></View>
    <AppText style={styles.flowEmptyTitle}>{title}</AppText>
    <AppText muted style={styles.flowEmptyCopy}>{description}</AppText>
    <PrimaryButton onPress={onCreate} style={styles.flowEmptyButton}>Create a goal</PrimaryButton>
  </View>
);

export function ConfirmGoalScreenV2({ navigation, route }) {
  const params = route?.params || {};
  const user = params.user || {};
  const goal = params.goal || { name: params.goalName || "Savings goal", target: parseMoney(params.targetAmount), progressAmount: parseMoney(params.progressAmount), timeToReach: Number(params.timeToReach) || 0, priority: Number(params.priority) || 3 };
  const percent = goal.target > 0 ? Math.min(100, goal.progressAmount / goal.target * 100) : 0;
  const remaining = Math.max(0, goal.target - goal.progressAmount);
  const [isDeleting, setIsDeleting] = useState(false);
  const deleteGoal = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      const userId = user.id || user.userId || auth().currentUser?.uid;
      if (!UI_PREVIEW_MODE) {
        if (!userId || !goal.id) throw new Error("Goal session unavailable");
        await firestore().collection("users").doc(userId).collection("goals").doc(String(goal.id)).delete();
      }
      navigation.goBack();
    } catch (_) {
      setIsDeleting(false);
      Alert.alert("Could not delete goal", "Please check your connection and try again.");
    }
  };
  const confirmDelete = () => Alert.alert("Delete this goal?", `This will permanently remove “${goal.name || "this goal"}” and its goal data.`, [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: deleteGoal },
  ]);
  return (
    <Screen scroll contentContainerStyle={styles.flowContent}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <GoalFlowHeader navigation={navigation} user={user} title={goal.name || "Savings goal"} />
      <View style={styles.goalDetailsCard}>
        <AppText style={styles.goalDetailsLabel}>Progress</AppText>
        <View style={styles.goalDetailsAmountRow}>
          <AppText style={styles.goalDetailsAmount}>₹{formatMoney(goal.progressAmount)}</AppText>
          <AppText style={styles.goalDetailsTarget}>of ₹{formatMoney(goal.target)}</AppText>
        </View>
        <ProgressBar progress={percent} color="#D6BF98" trackColor="rgba(255,255,255,0.14)" style={styles.goalDetailsProgress} />
        <View style={styles.goalDetailsFooter}>
          <AppText style={styles.goalDetailsFooterText}>{Math.round(percent)}% saved</AppText>
          <AppText style={styles.goalDetailsFooterText}>₹{formatMoney(remaining)} to go</AppText>
        </View>
      </View>
      <AppText style={styles.goalDetailsSectionTitle}>Goal details</AppText>
      <View style={styles.goalDetailsContainer}>
        <View style={[styles.goalDetailsRow, styles.goalDetailsRowDivider]}><AppText muted>Estimated time</AppText><AppText style={styles.goalDetailsValue}>{goal.timeToReach || params.timeToReach ? `${goal.timeToReach || params.timeToReach} months` : "—"}</AppText></View>
        <View style={styles.goalDetailsRow}><AppText muted>Priority</AppText><AppText style={styles.goalDetailsValue}>{Number(goal.priority) === 1 ? "Important" : "Nice to have"}</AppText></View>
      </View>
      <View style={[styles.flowActions, styles.goalDetailsActions]}><DestructiveButton onPress={confirmDelete} loading={isDeleting} style={styles.goalDetailsDeleteButton}>Delete goal</DestructiveButton><SecondaryButton onPress={() => navigation.goBack()} disabled={isDeleting} style={styles.goalDetailsBackButton}>Back to goals</SecondaryButton></View>
    </Screen>
  );
}

export function AllocationScreenV2({ navigation, route }) {
  const params = route?.params || {};
  const user = params.user || {};
  const availableGoals = (params.goals || []).map((goal) => ({ ...goal, target: parseMoney(goal.target ?? goal.targetAmount ?? goal.target_amount), progressAmount: parseMoney(goal.progressAmount ?? goal.progress) })).filter((goal) => goal.target > goal.progressAmount);
  const [amount, setAmount] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [selectedId, setSelectedId] = useState(params.selectedGoalId || availableGoals[0]?.id || "");
  const selectedGoal = availableGoals.find((goal) => String(goal.id) === String(selectedId));
  const allocationValue = parseMoney(amount);
  const saveAllocation = async () => {
    if (isSaving) return;
    if (allocationValue <= 0) return Alert.alert("Amount required", "Enter an amount greater than zero.");
    if (!selectedGoal) return Alert.alert("Choose a goal", "Select a goal for this allocation.");
    setIsSaving(true);
    try {
      const userId = user.id || user.userId || auth().currentUser?.uid;
      if (!UI_PREVIEW_MODE && !userId) throw new Error("No session");
      let committedProgress = selectedGoal.progressAmount + allocationValue;
      if (!UI_PREVIEW_MODE) {
        const goalRef = firestore().collection("users").doc(userId).collection("goals").doc(String(selectedGoal.id));
        await firestore().runTransaction(async (dbTransaction) => {
          const goalSnapshot = await dbTransaction.get(goalRef);
          const currentProgress = parseMoney(goalSnapshot.data()?.progress ?? selectedGoal.progressAmount);
          committedProgress = currentProgress + allocationValue;
          dbTransaction.update(goalRef, { progress: committedProgress });
        });
      }
      navigation.navigate("AllocationSuccess", { user, goal: { ...selectedGoal, progressAmount: committedProgress }, amount: allocationValue });
    } catch (_) { Alert.alert("Could not save allocation", "Please check your connection and try again."); }
    finally { setIsSaving(false); }
  };
  if (!availableGoals.length) return <AllocationEmptyScreen navigation={navigation} route={route} />;
  return (
    <Screen scroll contentContainerStyle={styles.flowContent}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <GoalFlowHeader navigation={navigation} user={user} title="Put money to work." eyebrow="ALLOCATE" />
      <Field label="Amount" value={amount} onChangeText={(value) => setAmount(sanitizeMoneyInput(value))} placeholder="₹ 0.00" keyboardType="decimal-pad" />
      <View style={styles.flowField}><AppText style={styles.flowFieldLabel}>Goal</AppText><Pressable style={styles.flowSelect} onPress={() => setSelectedId(availableGoals[(availableGoals.findIndex((goal) => goal.id === selectedId) + 1) % availableGoals.length]?.id)}><View style={styles.flowSelectCopy}><AppText>{selectedGoal?.name}</AppText></View><Feather name="chevron-right" size={18} color={colors.textSubtle} /></Pressable></View>
      <AppText style={styles.flowAvailable}>₹{formatMoney(params.availableAmount ?? user.onboarding?.currentBalance ?? user.onboarding?.current_balance ?? 0)} available</AppText>
      <View style={styles.flowActions}><PrimaryButton onPress={saveAllocation} loading={isSaving}>Allocate{allocationValue ? ` ₹${formatMoney(allocationValue)}` : ""}</PrimaryButton></View>
    </Screen>
  );
}

export function AllocationEmptyScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  const onboarding = user.onboarding || {};
  return <Screen scroll contentContainerStyle={styles.flowContent}><StatusBar barStyle="dark-content" backgroundColor={colors.background} /><GoalFlowHeader navigation={navigation} user={user} title="Put money to work." eyebrow="ALLOCATE" /><FlowEmpty title="Nothing to allocate yet." description="Create a goal to start saving." onCreate={() => navigation.navigate("SavingsGoal", { user, allowance: onboarding.allowance || onboarding.allowance_amount, frequency: onboarding.frequency || onboarding.allowance_frequency, fromDashboard: true })} /></Screen>;
}

export function AllocationSuccessScreenV2({ navigation, route }) {
  const params = route?.params || {};
  const goal = params.goal || {};
  const amount = parseMoney(params.amount);
  return <Screen scroll contentContainerStyle={[styles.flowContent, styles.flowCenterContent]}><StatusBar barStyle="dark-content" backgroundColor={colors.background} /><GoalFlowHeader navigation={navigation} user={params.user} title="Money moved with purpose." eyebrow="ALLOCATION COMPLETE" back={false} /><View style={styles.successMark}><Feather name="check" size={22} color={colors.accent} /></View><AppText style={styles.successAmount}>₹{formatMoney(amount)} allocated</AppText><AppText muted style={styles.successCopy}>{goal.name || "Your goal"} is now at ₹{formatMoney(goal.progressAmount)} of ₹{formatMoney(goal.target)}.</AppText><View style={styles.flowActions}><PrimaryButton onPress={() => navigation.navigate("Dashboard", { user: params.user })}>Back to dashboard</PrimaryButton><SecondaryButton onPress={() => navigation.navigate("Goals", { user: params.user })}>View goals</SecondaryButton></View></Screen>;
}

export function GoalAchievedScreenV2({ navigation, route }) {
  const params = route?.params || {};
  const user = params.user || {};
  const goal = params.achievedGoal || params.goal || {};
  const hasBalanceUpdate = params.newAllowance !== undefined || params.overflowAmount !== undefined;
  const finalBalance = parseMoney(params.newAllowance) + parseMoney(params.overflowAmount);
  const [isCompleting, setIsCompleting] = useState(false);
  const complete = async () => {
    if (isCompleting) return;
    setIsCompleting(true);
    try {
      const userId = user.id || user.userId || auth().currentUser?.uid;
      if (!UI_PREVIEW_MODE && !userId) throw new Error("No session");
      if (!UI_PREVIEW_MODE) {
        const userRef = firestore().collection("users").doc(userId);
        await firestore().runTransaction(async (dbTransaction) => {
          if (goal.id) dbTransaction.update(userRef.collection("goals").doc(String(goal.id)), { progress: goal.target, is_active: 0 });
          if (hasBalanceUpdate) dbTransaction.set(userRef, { "onboarding.current_balance": String(finalBalance) }, { merge: true });
        });
      }
      navigation.navigate("Dashboard", { user: hasBalanceUpdate ? { ...user, onboarding: { ...user.onboarding, currentBalance: finalBalance } } : user });
    } catch (_) { Alert.alert("Could not finish goal", "Please check your connection and try again."); }
    finally { setIsCompleting(false); }
  };
  return <Screen scroll contentContainerStyle={styles.flowContent}><StatusBar barStyle="dark-content" backgroundColor={colors.background} /><GoalFlowHeader navigation={navigation} user={user} title="You made it happen." eyebrow="GOAL COMPLETE" /><View style={styles.achievedRing}><Feather name="check" size={24} color={colors.accent} /></View><AppText style={styles.achievedName}>{goal.name || "Your goal"}</AppText><AppText muted style={styles.achievedCopy}>₹{formatMoney(goal.target)} saved.</AppText><View style={styles.flowSummary}><View style={styles.flowSummaryRow}><AppText muted>Completed</AppText><AppText style={styles.flowSummaryValue}>Today</AppText></View></View><View style={styles.flowActions}><PrimaryButton onPress={complete} loading={isCompleting}>Keep money here</PrimaryButton><SecondaryButton onPress={() => { if (!isCompleting) navigation.navigate("Allocation", { user, goals: params.goals || [] }); }}>Move to everyday balance</SecondaryButton></View></Screen>;
}
