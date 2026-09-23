import React, { useMemo, useState } from "react";
import { Pressable, StatusBar, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, ProgressBar, Screen } from "../../../components/ui";
import { formatMoney } from "../../../theme/theme";
import NubankBottomNav from "./NubankBottomNav";
import { nubankColors as colors, nubankStyles as styles } from "./nubankStyles";

const goalPercent = (goal) => {
  const target = Number(goal?.target) || 0;
  const progress = Number(goal?.progressAmount) || 0;
  return target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
};

const firstNameFrom = (name = "there") => String(name).trim().split(/\s+/)[0] || "there";

function GoalRow({ goal, completed }) {
  const percent = goalPercent(goal);
  const remaining = Math.max(0, (Number(goal.target) || 0) - (Number(goal.progressAmount) || 0));
  return (
    <View style={styles.openGoalRow}>
      <View style={styles.goalRowHeader}><View style={{ flex: 1, minWidth: 0 }}><AppText style={styles.goalRowName} numberOfLines={2}>{goal.name || "Savings goal"}</AppText><AppText style={styles.goalRowAmount}>₹{formatMoney(goal.progressAmount)}</AppText><AppText style={styles.goalRowTarget}>of ₹{formatMoney(goal.target)}</AppText></View><View><AppText style={[styles.goalRowPercent, completed && styles.goalRowPercentCompleted]}>{completed ? "Done" : `${percent}%`}</AppText></View></View>
      <ProgressBar progress={percent} style={[styles.progressTrack, styles.goalRowProgress]} color={completed ? colors.green : colors.purple} trackColor="#EEEAF2" />
      <View style={styles.goalRowFooter}><AppText style={styles.goalRowFooterText}>{completed ? "Completed" : `${percent}% saved`}</AppText><AppText style={styles.goalRowFooterText}>{completed ? "Target reached" : `₹${formatMoney(remaining)} left`}</AppText></View>
    </View>
  );
}

export default function NubankGoalsScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  const previewData = route?.params?.previewData || {};
  const goals = previewData.goals || [];
  const [selectedTab, setSelectedTab] = useState("Active");
  const activeGoals = goals.filter((goal) => goal.active && goal.progressAmount < goal.target);
  const completedGoals = goals.filter((goal) => goal.progressAmount >= goal.target && goal.target > 0);
  const shownGoals = selectedTab === "Active" ? activeGoals : completedGoals;
  const totalSaved = useMemo(() => goals.reduce((sum, goal) => sum + (Number(goal.progressAmount) || 0), 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((sum, goal) => sum + (Number(goal.target) || 0), 0), [goals]);
  const overallPercent = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
  const firstName = firstNameFrom(user.fullName);
  const open = (target) => navigation?.navigate?.(target === "Home" ? "Dashboard" : target, { user, previewData });

  return (
    <Screen scroll style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.surface} />
      <View style={styles.goalsHeader}><View style={styles.goalsHeaderLeft}><Pressable style={styles.headerBack} onPress={() => open("Home")} accessibilityLabel="Back to dashboard"><Feather name="arrow-left" size={21} color={colors.ink} /></Pressable><View style={{ flex: 1, minWidth: 0 }}><AppText style={styles.goalsTitle}>Goals</AppText><AppText style={styles.goalsHeaderMeta} numberOfLines={1}>A little progress, {firstName}</AppText></View></View><Pressable style={styles.addButton} onPress={() => open("SavingsGoal")} accessibilityLabel="Create a new goal"><Feather name="plus" size={21} color={colors.surface} /></Pressable></View>
      <View style={styles.totalSection}><AppText style={styles.totalLabel}>Total saved</AppText><AppText style={styles.totalAmount}>₹{formatMoney(totalSaved)}</AppText><AppText style={styles.totalMeta}>Across {goals.length} {goals.length === 1 ? "goal" : "goals"}</AppText><ProgressBar progress={overallPercent} style={[styles.progressTrack, styles.totalProgress]} color={colors.purple} trackColor="#EEEAF2" /></View>
      <View style={styles.tabRow}>{["Active", "Completed"].map((tab) => { const count = tab === "Active" ? activeGoals.length : completedGoals.length; const selected = selectedTab === tab; return <Pressable key={tab} style={[styles.tabButton, selected && styles.tabButtonActive]} onPress={() => setSelectedTab(tab)} accessibilityRole="tab" accessibilityState={{ selected }}><AppText style={[styles.tabText, selected && styles.tabTextActive]}>{tab} <AppText style={[styles.tabText, selected && styles.tabTextActive]}>({count})</AppText></AppText></Pressable>; })}</View>
      <View style={styles.goalSection}><View style={styles.listHeadingRow}><AppText style={styles.listHeading}>{selectedTab === "Active" ? "Active goals" : "Completed goals"}</AppText><AppText style={styles.listCount}>{shownGoals.length} {shownGoals.length === 1 ? "goal" : "goals"}</AppText></View>{shownGoals.length ? shownGoals.map((goal) => <GoalRow key={goal.id} goal={goal} completed={selectedTab === "Completed"} />) : <View style={styles.emptyGoals}><AppText style={styles.emptyGoalsTitle}>{selectedTab === "Active" ? "No goals yet" : "No completed goals"}</AppText><AppText style={styles.emptyGoalsDescription}>{selectedTab === "Active" ? "Create a savings goal to give your next milestone a place to live." : "Completed goals will appear here once you reach a target."}</AppText>{selectedTab === "Active" ? <Pressable style={styles.emptyGoalsButton} onPress={() => open("SavingsGoal")}><AppText style={styles.emptyGoalsButtonText}>Create a goal</AppText></Pressable> : null}</View>}</View>
      <NubankBottomNav active="Goals" onNavigate={open} />
    </Screen>
  );
}
