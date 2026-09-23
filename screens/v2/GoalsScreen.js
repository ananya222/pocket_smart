import { auth, firestore } from "../../config";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, StyleSheet, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { AppText, PrimaryButton, ProgressBar, SecondaryButton } from "../../components/ui";
import { colors, formatMoney, parseMoney, spacing } from "../../theme/theme";
import { UI_PREVIEW_MODE } from "../../config/uiPreview";
import { styles } from "./v2Styles";

export default function GoalsScreenV2({ navigation, route }) {
  const user = route?.params?.user || {};
  const [gridWidth, setGridWidth] = useState(0);
  const { fontScale } = useWindowDimensions();
  const cardWidth = Math.max(0, (gridWidth - spacing.md) / 2);
  const previewData = route?.params?.previewData;
  const userId = UI_PREVIEW_MODE ? null : user.id || user.userId || auth().currentUser?.uid;
  const [goals, setGoals] = useState(() => previewData?.goals || []);
  const firstName = (user.fullName || "there").trim().split(" ")[0];

  useEffect(() => {
    if (!userId) return undefined;
    return firestore().collection("users").doc(userId).collection("goals").onSnapshot((snapshot) => {
      const next = snapshot.docs.map((doc) => {
        const data = doc.data();
        return { id: doc.id, name: data.name || "Savings goal", target: parseMoney(data.target_amount), progressAmount: parseMoney(data.progress), timeToReach: Number(data.time_to_reach) || 0, active: Number(data.is_active ?? 1) !== 0, priority: Number(data.priority) || 3 };
      });
      setGoals(next.sort((a, b) => a.priority - b.priority));
    }, (error) => console.error("V2 goals listener:", error));
  }, [userId]);

  const activeGoals = goals.filter((goal) => goal.active && (goal.target <= 0 || goal.progressAmount < goal.target));
  const completedGoals = goals.filter((goal) => goal.progressAmount >= goal.target && goal.target > 0);
  const visibleGoals = [...activeGoals, ...completedGoals];
  const goalRows = [];
  for (let index = 0; index < visibleGoals.length; index += 2) {
    goalRows.push(visibleGoals.slice(index, index + 2));
  }
  const isEmpty = goals.length === 0;
  const onboarding = user.onboarding || {};
  const newGoalParams = { user, allowance: onboarding.allowance_amount || onboarding.allowance || "5,000", frequency: onboarding.allowance_frequency || onboarding.frequency || "Monthly", savingRatio: Number(onboarding.saving_ratio || 30), fromDashboard: true };

  const openGoal = (goal) => navigation.navigate(goal.progressAmount >= goal.target && goal.target > 0 ? "GoalAchieved" : "ConfirmGoal", goal.progressAmount >= goal.target && goal.target > 0 ? { user, achievedGoal: goal, goals } : { user, goal, goals });
  const renderGoal = (goal) => {
    const percent = goal.target > 0 ? Math.min(100, goal.progressAmount / goal.target * 100) : 0;
    return (
      <Pressable key={goal.id} onPress={() => openGoal(goal)} style={[styles.dashboardGoalPreview, layout.card, { width: cardWidth, minHeight: Math.max(cardWidth, 32 + 142 * fontScale) }]} accessibilityRole="button" accessibilityLabel={`View ${goal.name}`}>
        <View style={styles.dashboardGoalHeading}>
          <AppText numberOfLines={1} ellipsizeMode="tail" style={[styles.dashboardGoalName, styles.flex]}>{goal.name}</AppText>
          <Feather name="chevron-right" size={18} color={colors.background} />
        </View>
        <View style={layout.amount}>
          <AppText numberOfLines={1} adjustsFontSizeToFit style={[styles.dashboardGoalName, layout.saved]}>₹{formatMoney(goal.progressAmount)}</AppText>
          <AppText numberOfLines={1} adjustsFontSizeToFit style={styles.dashboardGoalMeta}>of ₹{formatMoney(goal.target)}</AppText>
        </View>
        <ProgressBar progress={percent} color="#D6BF98" trackColor="rgba(255,255,255,0.14)" style={styles.dashboardGoalProgress} />
        <View style={layout.footer}>
          <AppText style={styles.dashboardGoalFooterText}>{percent >= 100 ? "Completed" : `${Math.round(percent)}% saved`}</AppText>
          <AppText numberOfLines={1} adjustsFontSizeToFit style={styles.dashboardGoalFooterText}>₹{formatMoney(Math.max(0, goal.target - goal.progressAmount))} to go</AppText>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.dashboardShell}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.referenceBackground} />
      <View style={styles.dashboardFixedHeader}><AppText style={styles.goalsTitle}>Your goals</AppText><Pressable style={styles.avatar} onPress={() => navigation.navigate("Profile", { user })} accessibilityLabel="Open profile"><AppText style={styles.avatarText}>{firstName[0]?.toUpperCase() || "P"}</AppText></Pressable></View>
      <ScrollView style={styles.flex} contentContainerStyle={layout.content} showsVerticalScrollIndicator={false}>
        {isEmpty ? <View style={styles.goalsEmptyMock}><View style={styles.goalsEmptyIcon}><Feather name="layers" size={19} color={colors.accent} /></View><AppText style={styles.goalsEmptyTitle}>Start with one thing.</AppText><AppText muted style={styles.goalsEmptyCopy}>Give your next goal a place to grow.</AppText><PrimaryButton onPress={() => navigation.navigate("SavingsGoal", newGoalParams)} style={styles.goalsEmptyButton}>Create a goal</PrimaryButton></View> : <View style={layout.grid} onLayout={({ nativeEvent }) => setGridWidth(nativeEvent.layout.width)}>{gridWidth > 0 ? goalRows.map((row) => <View key={row[0].id} style={layout.row}>{row.map(renderGoal)}</View>) : null}</View>}
      </ScrollView>
      {!isEmpty ? <View style={layout.actions}><SecondaryButton onPress={() => navigation.navigate("SavingsGoal", newGoalParams)} style={styles.fullWidthButton}>Create a new goal</SecondaryButton></View> : null}
    </SafeAreaView>
  );
}

const layout = StyleSheet.create({
  content: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.lg },
  grid: { gap: spacing.md },
  row: { flexDirection: "row", gap: spacing.md },
  card: { marginTop: 0, marginBottom: 0, padding: spacing.md, alignSelf: "auto", flexShrink: 1 },
  amount: { flex: 1, justifyContent: "center", paddingVertical: spacing.sm },
  saved: { fontSize: 20, lineHeight: 26, fontFamily: "Inter-Regular" },
  footer: { marginTop: spacing.sm, gap: 2 },
  actions: { paddingHorizontal: spacing.xl, paddingVertical: spacing.lg },
});
