import React, { useMemo } from "react";
import { Pressable, StatusBar, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, Screen } from "../../../components/ui";
import { formatMoney } from "../../../theme/theme";
import CashAppBottomNav from "./CashAppBottomNav";
import { cashColors as colors, cashStyles as styles } from "./cashStyles";

const goalPercent = (goal) => {
  const target = Number(goal?.target) || 0;
  const progress = Number(goal?.progressAmount) || 0;
  return target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
};

function GoalRow({ goal }) {
  const percent = goalPercent(goal);
  const remaining = Math.max(0, (Number(goal.target) || 0) - (Number(goal.progressAmount) || 0));
  return <View style={styles.openGoalRow}><View style={styles.goalRowHeader}><View style={{ flex: 1, minWidth: 0 }}><AppText style={styles.goalRowName} numberOfLines={2}>{goal.name || "Savings goal"}</AppText><AppText style={styles.goalRowAmount}>₹{formatMoney(goal.progressAmount)} <AppText style={styles.goalRowTarget}>/ ₹{formatMoney(goal.target)}</AppText></AppText></View><AppText style={styles.goalRowPercent}>{percent}%</AppText></View><View style={styles.goalRowProgress}><View style={[styles.goalRowProgressFill, { width: `${percent}%` }]} /></View><View style={styles.goalRowFooter}><AppText style={styles.goalRowFooterText}>{percent}% saved</AppText><AppText style={styles.goalRowFooterText}>₹{formatMoney(remaining)} left</AppText></View></View>;
}

export default function CashAppGoalsScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  const previewData = route?.params?.previewData || {};
  const goals = previewData.goals || [];
  const activeGoals = goals.filter((goal) => goal.active && goal.progressAmount < goal.target);
  const completedGoals = goals.filter((goal) => goal.progressAmount >= goal.target && goal.target > 0);
  const totalSaved = useMemo(() => goals.reduce((sum, goal) => sum + (Number(goal.progressAmount) || 0), 0), [goals]);
  const open = (target) => navigation?.navigate?.(target === "Home" ? "Dashboard" : target, { user, previewData });

  return <Screen scroll style={styles.screen} contentContainerStyle={styles.content}><StatusBar barStyle="light-content" backgroundColor={colors.background} /><View style={styles.goalsHeader}><View><AppText style={styles.goalsTitle}>Goals</AppText><AppText style={styles.goalsHeaderMeta}>Small steps add up</AppText></View><Pressable style={styles.addButton} onPress={() => open("SavingsGoal")} accessibilityLabel="Create a new goal"><Feather name="plus" size={21} color={colors.text} /></Pressable></View><View style={styles.totalSection}><AppText style={styles.totalLabel}>Total saved</AppText><AppText style={styles.totalAmount}>₹{formatMoney(totalSaved)}</AppText><AppText style={styles.totalMeta}>Across {goals.length} {goals.length === 1 ? "goal" : "goals"}</AppText></View>{activeGoals.length ? <View><AppText style={styles.activeHeading}>Active</AppText>{activeGoals.map((goal) => <GoalRow key={goal.id} goal={goal} />)}</View> : <View style={styles.emptyGoals}><AppText style={styles.emptyGoalsTitle}>No goals yet</AppText><AppText style={styles.emptyGoalsDescription}>Create one simple target and start saving toward it.</AppText><Pressable style={styles.emptyGoalsButton} onPress={() => open("SavingsGoal")}><AppText style={styles.emptyGoalsButtonText}>Create a goal</AppText></Pressable></View>}{completedGoals.length ? <View><AppText style={styles.completedHeading}>Completed</AppText>{completedGoals.map((goal) => <View key={goal.id} style={styles.openGoalRow}><View style={styles.goalRowHeader}><View style={styles.completedNameRow}><View style={styles.completedDot} /><View style={{ flex: 1, minWidth: 0 }}><AppText style={styles.goalRowName} numberOfLines={2}>{goal.name}</AppText><AppText style={styles.goalRowAmount}>₹{formatMoney(goal.progressAmount)}</AppText></View></View><AppText style={styles.completedStatus}>Done</AppText></View></View>)}</View> : null}<CashAppBottomNav active="Goals" onNavigate={open} /></Screen>;
}
