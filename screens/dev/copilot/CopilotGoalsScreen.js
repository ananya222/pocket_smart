import React, { useMemo, useState } from "react";
import { Pressable, StatusBar, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, Screen } from "../../../components/ui";
import { formatMoney, parseMoney } from "../../../theme/theme";
import CopilotBottomNav from "./CopilotBottomNav";
import { copilotColors as colors, copilotStyles as styles } from "./copilotStyles";

const goalPercent = (goal) => {
  const target = Number(goal?.target) || 0;
  const progress = Number(goal?.progressAmount) || 0;
  return target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
};

const goalAccent = (name = "") => {
  const value = name.toLowerCase();
  if (value.includes("trip") || value.includes("travel")) return { color: colors.blue, style: styles.goalCardAccentBlue };
  if (value.includes("laptop") || value.includes("computer")) return { color: "#32B7AD", style: styles.goalCardAccentTeal };
  if (value.includes("emergency")) return { color: colors.green, style: styles.goalCardAccentGreen };
  return { color: colors.purple, style: styles.goalCardAccentPurple };
};

function CopilotGoalCard({ goal, completed }) {
  const percent = goalPercent(goal);
  const accent = completed ? colors.green : goalAccent(goal.name).color;
  const accentStyle = completed ? styles.goalCardAccentGreen : goalAccent(goal.name).style;
  return <View style={[styles.goalCard, accentStyle]}><View style={styles.goalTop}><View style={styles.goalCopy}><AppText style={styles.goalName} numberOfLines={2}>{goal.name || "Savings goal"}</AppText><AppText style={styles.goalAmount}>₹{formatMoney(goal.progressAmount)}</AppText><AppText style={styles.goalTarget}>of ₹{formatMoney(goal.target)}</AppText></View><View><AppText style={[styles.goalPercent, completed && { color: colors.green }]}>{completed ? "Done" : `${percent}%`}</AppText><AppText style={styles.goalPercentLabel}>{completed ? "reached" : "saved"}</AppText></View></View><View style={styles.goalProgress}><View style={[styles.goalProgressFill, { width: `${percent}%`, backgroundColor: accent }]} /></View><View style={styles.goalFooter}><AppText style={styles.goalFooterText}>{completed ? "Target reached" : `${percent}% saved`}</AppText><AppText style={styles.goalFooterText}>{completed ? "Completed" : `₹${formatMoney(Math.max(0, (Number(goal.target) || 0) - (Number(goal.progressAmount) || 0)))} remaining`}</AppText></View></View>;
}

export default function CopilotGoalsScreen({ navigation, route }) {
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
  const savingRatio = Number(user.onboarding?.saving_ratio || user.onboarding?.savingRatio || 0);
  const firstGoal = activeGoals[0];
  const monthlySaving = parseMoney(user.onboarding?.allowance_amount || user.onboarding?.allowance || 0) * savingRatio / 100;
  const cyclesToGoal = firstGoal && monthlySaving > 0 ? Math.max(1, Math.ceil(Math.max(0, Number(firstGoal.target) - Number(firstGoal.progressAmount)) / monthlySaving)) : 0;
  const open = (target) => navigation?.navigate?.(target === "Home" ? "Dashboard" : target, { user, previewData });

  return <Screen scroll style={styles.screen} contentContainerStyle={styles.content}><StatusBar barStyle="light-content" backgroundColor={colors.background} /><View style={styles.goalsHeader}><View style={styles.goalsHeaderLeft}><Pressable style={styles.backButton} onPress={() => open("Home")} accessibilityLabel="Back to dashboard"><Feather name="arrow-left" size={20} color={colors.text} /></Pressable><View style={{ flex: 1, minWidth: 0 }}><AppText style={styles.goalsTitle}>Goals</AppText><AppText style={styles.goalsHeaderMeta}>Plan, track, and keep moving forward</AppText></View></View><Pressable style={styles.addButton} onPress={() => open("SavingsGoal")} accessibilityLabel="Create a new goal"><Feather name="plus" size={20} color={colors.white} /></Pressable></View><View style={styles.summarySurface}><View style={styles.summaryTop}><View><AppText style={styles.eyebrow}>Total saved</AppText><AppText style={styles.summaryAmount}>₹{formatMoney(totalSaved)}</AppText><AppText style={styles.summaryMeta}>Across {goals.length} {goals.length === 1 ? "goal" : "goals"}</AppText></View><View><AppText style={styles.summaryPercent}>{overallPercent}%</AppText><AppText style={styles.summaryPercentLabel}>overall</AppText></View></View><View style={styles.progressTrack}><View style={[styles.progressFill, { width: `${overallPercent}%`, backgroundColor: colors.purple }]} /></View></View><View style={styles.tabRow}>{["Active", "Completed"].map((tab) => { const count = tab === "Active" ? activeGoals.length : completedGoals.length; const selected = selectedTab === tab; return <Pressable key={tab} style={[styles.tabButton, selected && styles.tabButtonActive]} onPress={() => setSelectedTab(tab)} accessibilityRole="tab" accessibilityState={{ selected }}><AppText style={[styles.tabText, selected && styles.tabTextActive]}>{tab} ({count})</AppText></Pressable>; })}</View><View style={styles.goalSection}><View style={styles.listHeadingRow}><AppText style={styles.listHeading}>{selectedTab === "Active" ? "Active goals" : "Completed goals"}</AppText><AppText style={styles.listCount}>{shownGoals.length} {shownGoals.length === 1 ? "goal" : "goals"}</AppText></View>{shownGoals.length ? shownGoals.map((goal) => <CopilotGoalCard key={goal.id} goal={goal} completed={selectedTab === "Completed"} />) : <View style={styles.emptyGoals}><AppText style={styles.emptyGoalsTitle}>{selectedTab === "Active" ? "No active goals" : "No completed goals"}</AppText><AppText style={styles.emptyGoalsDescription}>{selectedTab === "Active" ? "Give a target a name and start building momentum." : "Completed goals will appear here when you reach a target."}</AppText>{selectedTab === "Active" ? <Pressable style={styles.emptyGoalsButton} onPress={() => open("SavingsGoal")}><AppText style={styles.emptyGoalsButtonText}>Create a goal</AppText></Pressable> : null}</View>}</View>{cyclesToGoal ? <View style={styles.guidance}><AppText style={styles.guidanceLabel}>Planning signal</AppText><AppText style={styles.guidanceText}>At {savingRatio}% of your allowance directed to savings, {firstGoal.name} is about {cyclesToGoal} monthly {cyclesToGoal === 1 ? "cycle" : "cycles"} away.</AppText></View> : null}<CopilotBottomNav active="Goals" onNavigate={open} /></Screen>;
}
