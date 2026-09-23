import React, { useMemo, useState } from "react";
import { Pressable, StatusBar, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, ProgressBar, Screen, getGoalIconName } from "../../../components/ui";
import { formatMoney } from "../../../theme/theme";
import RevolutBottomNav from "./RevolutBottomNav";
import { revolutColors as colors, revolutStyles as styles } from "./revolutStyles";

const goalColor = (name = "") => {
  const normalized = name.toLowerCase();
  if (normalized.includes("trip") || normalized.includes("travel")) return colors.blue;
  if (normalized.includes("emergency")) return colors.positive;
  if (normalized.includes("laptop")) return colors.deepViolet;
  return colors.purple;
};

const goalVisualPalette = (name = "", completed = false) => {
  if (completed) return { background: "#2E8F67", shape: "#50B789", shapeSmall: "#14784C", iconBackground: "#176E4B", label: "COMPLETED" };
  const normalized = name.toLowerCase();
  if (normalized.includes("trip") || normalized.includes("travel")) return { background: colors.blue, shape: "#63A8FF", shapeSmall: "#1D5FD8", iconBackground: "#174CB7", label: "TRAVEL" };
  if (normalized.includes("laptop")) return { background: "#3D4EBD", shape: "#5F73EA", shapeSmall: "#223276", iconBackground: "#273A95", label: "TECHNOLOGY" };
  if (normalized.includes("emergency")) return { background: colors.positive, shape: "#50C58C", shapeSmall: "#14784C", iconBackground: "#176E4B", label: "SAFETY" };
  return { background: "#5143C7", shape: colors.brightPurple, shapeSmall: "#33269B", iconBackground: "#2F238F", label: "HEADPHONES" };
};

const goalPercent = (goal) => {
  const target = Number(goal.target) || 0;
  const progress = Number(goal.progressAmount) || 0;
  return target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
};

export default function RevolutGoalsScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  const previewData = route?.params?.previewData || {};
  const goals = previewData.goals || [];
  const [selectedTab, setSelectedTab] = useState("Active");
  const [containerWidth, setContainerWidth] = useState(360);
  const activeGoals = goals.filter((goal) => goal.active && goal.progressAmount < goal.target);
  const completedGoals = goals.filter((goal) => goal.progressAmount >= goal.target && goal.target > 0);
  const shownGoals = selectedTab === "Active" ? activeGoals : completedGoals;
  const totalSaved = useMemo(() => goals.reduce((sum, goal) => sum + (Number(goal.progressAmount) || 0), 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((sum, goal) => sum + (Number(goal.target) || 0), 0), [goals]);
  const overallPercent = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
  // The gallery's phone content is narrower than its selected outer frame by
  // the screen padding: 360px becomes about 320px, while 390px becomes about
  // 350px. Keep 360px single-column and let the larger previews tile cleanly.
  const twoColumns = containerWidth >= 330;
  const open = (target) => navigation.navigate(target === "Home" ? "Dashboard" : target, { user, previewData });

  return (
    <Screen scroll style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}><View style={styles.headerCopy}><AppText style={styles.brand}>Goals</AppText><AppText style={styles.headerMeta}>Make room for what matters</AppText></View><Pressable style={[styles.avatar, { backgroundColor: colors.purple }]} onPress={() => open("SavingsGoal")} accessibilityLabel="Create a new goal"><Feather name="plus" size={18} color={colors.surface} /></Pressable></View>

      <View style={styles.goalsSummaryWrap}>
        <View style={styles.goalsSummary}><View><AppText style={styles.moduleEyebrow}>Total saved</AppText><AppText style={styles.goalsSummaryAmount}>₹{formatMoney(totalSaved)}</AppText><AppText style={styles.goalsSummaryMeta}>Across {goals.length} {goals.length === 1 ? "goal" : "goals"}</AppText></View><View style={styles.goalsSummaryRight}><AppText style={styles.goalsSummaryRightValue}>{overallPercent}%</AppText><AppText style={styles.goalsSummaryRightLabel}>overall</AppText></View></View>
        <ProgressBar progress={overallPercent} style={styles.goalsSummaryProgress} color={colors.purple} trackColor={colors.secondarySurface} />
      </View>

      <View style={styles.segment}>{["Active", "Completed"].map((tab) => <Pressable key={tab} style={[styles.segmentButton, selectedTab === tab && styles.segmentButtonActive]} onPress={() => setSelectedTab(tab)} accessibilityRole="radio" accessibilityState={{ selected: selectedTab === tab }}><AppText style={[styles.segmentText, selectedTab === tab && styles.segmentTextActive]}>{tab} <AppText style={[styles.segmentText, selectedTab === tab && styles.segmentTextActive]}>({tab === "Active" ? activeGoals.length : completedGoals.length})</AppText></AppText></Pressable>)}</View>

      <View style={styles.compactSectionHeader}><AppText style={styles.compactSectionTitle}>{selectedTab === "Active" ? "Active goals" : "Completed goals"}</AppText><AppText style={styles.moduleAction}>{shownGoals.length} {shownGoals.length === 1 ? "goal" : "goals"}</AppText></View>
      <View style={styles.goalGrid} onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}>
        {shownGoals.length ? shownGoals.map((goal) => {
          const completed = selectedTab === "Completed";
          const accent = completed ? colors.positive : goalColor(goal.name);
          const percent = goalPercent(goal);
          const visual = goalVisualPalette(goal.name, completed);
          return <View key={goal.id} style={[styles.goalTile, { width: twoColumns ? "48.2%" : "100%" }]}><View style={[styles.goalVisual, { backgroundColor: visual.background }]}><View style={[styles.goalVisualShape, { backgroundColor: visual.shape }]} /><View style={[styles.goalVisualShapeSmall, { backgroundColor: visual.shapeSmall }]} /><View style={styles.goalVisualTop}><View style={[styles.goalVisualIcon, { backgroundColor: visual.iconBackground }]}><Feather name={getGoalIconName(goal.name)} size={17} color={colors.surface} /></View><View style={styles.goalVisualMenu}><Feather name="more-horizontal" size={17} color={colors.surface} /></View></View><AppText style={styles.goalVisualLabel}>{visual.label}</AppText></View><View style={styles.goalTileBody}><AppText style={styles.goalTileName} numberOfLines={2}>{goal.name || "Savings goal"}</AppText><AppText style={styles.goalTileAmount}>₹{formatMoney(goal.progressAmount)}</AppText><AppText style={styles.goalTileTarget}>of ₹{formatMoney(goal.target)}</AppText><ProgressBar progress={percent} style={styles.goalTileProgress} color={accent} trackColor={colors.secondarySurface} /><View style={styles.goalTileFooter}><AppText style={[styles.goalTilePercent, { color: accent }]}>{completed ? "Completed" : `${percent}%`}</AppText><AppText style={styles.goalTileLeft}>{completed ? "100% saved" : `₹${formatMoney(Math.max(0, goal.target - goal.progressAmount))} left`}</AppText></View></View></View>;
        }) : <View style={styles.goalsEmpty}><AppText style={styles.goalsEmptyTitle}>{selectedTab === "Active" ? "No goals yet" : "No completed goals"}</AppText><AppText style={styles.goalsEmptyDescription}>{selectedTab === "Active" ? "Create a savings goal to start tracking your progress." : "Completed goals will appear here."}</AppText>{selectedTab === "Active" ? <Pressable style={styles.emptyButton} onPress={() => open("SavingsGoal")}><AppText style={styles.emptyButtonText}>Create goal</AppText></Pressable> : null}</View>}
      </View>

      <RevolutBottomNav active="Goals" onNavigate={open} />
    </Screen>
  );
}
