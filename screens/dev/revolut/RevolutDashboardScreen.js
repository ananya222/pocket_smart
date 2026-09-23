import React, { useMemo } from "react";
import { Pressable, StatusBar, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, ProgressBar, Screen, getCategoryMeta, getGoalIconName } from "../../../components/ui";
import { calculateBudgetSummary, calculateSafeToSpend, getRemainingDays } from "../../../utils/finance";
import { formatMoney, parseMoney } from "../../../theme/theme";
import RevolutBottomNav from "./RevolutBottomNav";
import { revolutColors as colors, revolutStyles as styles } from "./revolutStyles";

const valueFrom = (data, keys, fallback = "") => {
  for (const key of keys) {
    if (data?.[key] !== undefined && data?.[key] !== null && data?.[key] !== "") return data[key];
  }
  return fallback;
};

const normalizePreviewOnboarding = (data = {}) => ({
  allowance: parseMoney(valueFrom(data, ["allowance_amount", "allowance"], 0)),
  frequency: valueFrom(data, ["allowance_frequency", "frequency"], "Monthly"),
  currentBalance: parseMoney(valueFrom(data, ["current_balance", "currentBalance"], 0)),
  cycleLimit: parseMoney(valueFrom(data, ["cycle_limit", "cycleLimit", "allowance_amount", "allowance"], 0)),
});

const categoryColor = (category = "") => {
  const normalized = category.toLowerCase();
  if (normalized.includes("transport")) return colors.blue;
  if (normalized.includes("education")) return colors.positive;
  if (normalized.includes("entertainment")) return colors.purple;
  if (normalized.includes("shopping")) return colors.deepViolet;
  if (normalized.includes("food")) return colors.coral;
  return colors.secondaryText;
};

const categorySoftColor = (category = "") => {
  const normalized = category.toLowerCase();
  if (normalized.includes("transport")) return colors.blueSoft;
  if (normalized.includes("education")) return colors.positiveSoft;
  if (normalized.includes("entertainment")) return colors.softPurple;
  if (normalized.includes("shopping")) return "#EDEBFF";
  if (normalized.includes("food")) return colors.coralSoft;
  return colors.secondarySurface;
};

const goalColor = (name = "") => {
  const normalized = name.toLowerCase();
  if (normalized.includes("trip") || normalized.includes("travel")) return colors.blue;
  if (normalized.includes("emergency")) return colors.positive;
  if (normalized.includes("laptop")) return colors.deepViolet;
  return colors.purple;
};

const goalPercent = (goal) => {
  const target = Number(goal.target) || 0;
  const progress = Number(goal.progressAmount) || 0;
  return target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
};

const transactionDate = (transaction) => {
  if (transaction?.createdAt) {
    const date = new Date(transaction.createdAt);
    if (!Number.isNaN(date.getTime())) return date;
  }
  const date = new Date(`${transaction?.date || ""} ${new Date().getFullYear()}`);
  return Number.isNaN(date.getTime()) ? null : date;
};

export default function RevolutDashboardScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  const previewData = route?.params?.previewData || {};
  const onboarding = normalizePreviewOnboarding(previewData.user?.onboarding || user.onboarding);
  const allowance = Math.max(onboarding.allowance, onboarding.cycleLimit, onboarding.currentBalance);
  const calculatedSummary = calculateBudgetSummary({ allowance, balance: onboarding.currentBalance });
  const summary = previewData.overspent
    ? { ...calculatedSummary, spent: previewData.previewSpent || calculatedSummary.spent, usedPercent: 100 }
    : calculatedSummary;
  const safeToSpend = calculateSafeToSpend({ balance: summary.balance, remainingDays: getRemainingDays(onboarding.frequency, new Date()) });
  const isOverspent = summary.spent > summary.allowance && summary.allowance > 0;
  const isApproaching = !isOverspent && summary.usedPercent >= 80;
  const budgetTone = isOverspent ? colors.negative : isApproaching ? colors.warning : colors.positive;
  const budgetStatus = allowance <= 0 ? "Start with a simple budget" : isOverspent ? `Over budget by ₹${formatMoney(summary.spent - summary.allowance)}` : isApproaching ? "Keep an eye on your pace" : "On track";
  const firstName = (user.fullName || "there").trim().split(" ")[0];
  const transactions = previewData.transactions || user.customTransactions || [];
  const activeGoal = (previewData.goals || []).find((goal) => goal.active && (goal.target <= 0 || goal.progressAmount < goal.target));
  const categoryBreakdown = useMemo(() => {
    const totals = transactions.reduce((result, transaction) => {
      const category = transaction.category || "Other";
      result[category] = (result[category] || 0) + Math.abs(Number(transaction.amount) || 0);
      return result;
    }, {});
    const total = Object.values(totals).reduce((sum, value) => sum + value, 0);
    return Object.entries(totals).sort(([, a], [, b]) => b - a).slice(0, 4).map(([category, amount]) => ({ category, amount, percent: total ? Math.round((amount / total) * 100) : 0 }));
  }, [transactions]);
  const weeklySpending = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() - (6 - index));
      return { date, label: date.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 1), amount: 0 };
    });
    transactions.forEach((transaction) => {
      const date = transactionDate(transaction);
      if (!date) return;
      const match = days.find((day) => day.date.getFullYear() === date.getFullYear() && day.date.getMonth() === date.getMonth() && day.date.getDate() === date.getDate());
      if (match) match.amount += Math.abs(Number(transaction.amount) || 0);
    });
    return days;
  }, [transactions]);
  const maxDailySpend = Math.max(1, ...weeklySpending.map((day) => day.amount));

  const open = (target) => navigation.navigate(target, { user, previewData });
  const navigateBottom = (target) => open(target === "Home" ? "Dashboard" : target);

  return (
    <Screen scroll style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.header}>
        <View style={styles.headerCopy}><AppText style={styles.brand}>PocketSmart</AppText><AppText style={styles.headerMeta}>Good morning, {firstName} · {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</AppText></View>
        <Pressable style={styles.avatar} onPress={() => open("Profile")} accessibilityLabel="Open profile"><AppText style={styles.avatarText}>{firstName[0]?.toUpperCase() || "P"}</AppText></Pressable>
      </View>

      <View style={styles.accountSummary}>
        <View style={styles.summaryTop}><AppText style={styles.eyebrow}>Available this month</AppText><AppText style={styles.summaryPercent}>{summary.usedPercent}% used</AppText></View>
        <AppText style={styles.accountAmount}>₹{formatMoney(summary.balance)}</AppText>
        <AppText style={styles.accountMeta}>of ₹{formatMoney(summary.allowance)} monthly budget</AppText>
        <View style={styles.summaryRule} />
        <View style={styles.summaryFooter}><AppText style={styles.summaryFooterLabel}>Spent so far</AppText><AppText style={styles.summaryFooterValue}>₹{formatMoney(summary.spent)}</AppText></View>
      </View>

      <View style={styles.quickActions}>
        <Pressable style={[styles.quickAction, styles.quickActionPrimary]} onPress={() => {}} accessibilityRole="button"><Feather name="plus-circle" size={15} color={colors.surface} /><AppText style={[styles.quickActionText, styles.quickActionTextOnPrimary]}>Add money</AppText></Pressable>
        <Pressable style={[styles.quickAction, styles.quickActionSecondary]} onPress={() => open("AddExpense")} accessibilityRole="button"><Feather name="plus" size={15} color={colors.purple} /><AppText style={styles.quickActionText}>Expense</AppText></Pressable>
        <Pressable style={[styles.quickAction, styles.quickActionTertiary]} onPress={() => open("SavingsGoal")} accessibilityRole="button"><Feather name="target" size={15} color={colors.blue} /><AppText style={styles.quickActionText}>New goal</AppText></Pressable>
      </View>

      <View style={styles.safeSpendCard}>
        <View style={styles.safeSpendCopy}><View style={styles.safeSpendIcon}><Feather name="shield" size={15} color={colors.purple} /></View><AppText style={styles.moduleEyebrow}>Safe to spend today</AppText><AppText style={styles.safeSpendAmount}>₹{formatMoney(safeToSpend)}</AppText><AppText style={[styles.safeSpendStatus, isOverspent && styles.safeSpendStatusDanger, isApproaching && styles.safeSpendStatusWarning, allowance <= 0 && styles.safeSpendStatusNeutral]}>{budgetStatus}</AppText></View>
        <View style={styles.safeSpendAside}><AppText style={styles.safeSpendAsideLabel}>Remaining</AppText><AppText style={styles.safeSpendAsideValue}>₹{formatMoney(summary.balance)}</AppText></View>
      </View>

      <View style={styles.module}>
        <View style={styles.moduleHeader}><AppText style={styles.moduleTitle}>This month</AppText><Pressable onPress={() => open("Insights")}><AppText style={styles.moduleAction}>View details</AppText></Pressable></View>
        <View style={styles.analyticsSummary}><View><AppText style={styles.moduleEyebrow}>Spent</AppText><AppText style={styles.analyticsValue}>₹{formatMoney(summary.spent)}</AppText></View><View style={{ alignItems: "flex-end" }}><AppText style={styles.moduleEyebrow}>Budget</AppText><AppText style={styles.analyticsValue}>₹{formatMoney(summary.allowance)}</AppText></View></View>
        <ProgressBar progress={summary.usedPercent} style={styles.analyticsProgress} color={budgetTone} trackColor={colors.secondarySurface} />
        <View style={styles.analyticsFooter}><AppText style={styles.analyticsFooterText}>{summary.usedPercent}% used</AppText><AppText style={styles.analyticsFooterText}>₹{formatMoney(Math.max(0, summary.allowance - summary.spent))} available</AppText></View>
        <View style={styles.analyticsChartHeader}><AppText style={styles.analyticsChartTitle}>Weekly activity</AppText><AppText style={styles.analyticsChartPeriod}>Last 7 days</AppText></View>
        <View style={styles.analyticsChart}>{weeklySpending.map((day) => <View key={day.date.toISOString()} style={styles.chartColumn}><View style={styles.chartTrack}><View style={[styles.chartBar, { height: `${day.amount ? Math.max(8, (day.amount / maxDailySpend) * 100) : 2}%` }]} /></View><AppText style={styles.chartDay}>{day.label}</AppText></View>)}</View>
        <AppText style={styles.categoryHeader}>Top categories</AppText>
        {categoryBreakdown.length ? categoryBreakdown.map((item, index) => {
          const accent = categoryColor(item.category);
          const meta = getCategoryMeta(item.category);
          return <View key={item.category} style={[styles.categoryRow, index === categoryBreakdown.length - 1 && styles.categoryRowLast]}><View style={[styles.categoryIcon, { backgroundColor: categorySoftColor(item.category) }]}><Feather name={meta.icon} size={14} color={accent} /></View><View style={styles.categoryCopy}><AppText style={styles.categoryName}>{item.category}</AppText><View style={styles.categoryBar}><View style={[styles.categoryBarFill, { width: `${item.percent}%`, backgroundColor: accent }]} /></View></View><AppText style={styles.categoryAmount}>₹{formatMoney(item.amount)}</AppText></View>;
        }) : <AppText style={styles.emptyCopy}>Your category breakdown will appear as you track spending.</AppText>}
      </View>

      <View style={styles.compactSectionHeader}><AppText style={styles.compactSectionTitle}>Savings goals</AppText><Pressable onPress={() => open("Goals")}><AppText style={styles.moduleAction}>See all</AppText></Pressable></View>
      {activeGoal ? <View style={styles.goalsModule}><View style={styles.goalPreview}><View style={[styles.goalPreviewIcon, { backgroundColor: colors.softPurple }]}><Feather name={getGoalIconName(activeGoal.name)} size={18} color={goalColor(activeGoal.name)} /></View><View style={styles.goalPreviewCopy}><AppText style={styles.goalPreviewName} numberOfLines={1}>{activeGoal.name}</AppText><AppText style={styles.goalPreviewMeta}>₹{formatMoney(activeGoal.progressAmount)} of ₹{formatMoney(activeGoal.target)}</AppText></View><AppText style={styles.goalPreviewPercent}>{goalPercent(activeGoal)}%</AppText></View><ProgressBar progress={goalPercent(activeGoal)} style={styles.goalPreviewProgress} color={goalColor(activeGoal.name)} trackColor={colors.secondarySurface} /><View style={styles.goalPreviewFooter}><AppText style={styles.goalPreviewFooterText}>Progress</AppText><AppText style={styles.goalPreviewFooterText}>₹{formatMoney(Math.max(0, activeGoal.target - activeGoal.progressAmount))} left</AppText></View></View> : <View style={styles.goalsModule}><AppText style={styles.emptyCopy}>Create a goal to keep a saving target visible here.</AppText><Pressable style={styles.emptyButton} onPress={() => open("SavingsGoal")}><AppText style={styles.emptyButtonText}>Create goal</AppText></Pressable></View>}

      <View style={styles.compactSectionHeader}><AppText style={styles.compactSectionTitle}>Recent transactions</AppText><Pressable onPress={() => open("Insights")}><AppText style={styles.moduleAction}>See all</AppText></Pressable></View>
      {transactions.length ? <View style={styles.transactionsModule}>{transactions.slice(0, 5).map((transaction, index) => { const accent = categoryColor(transaction.category); const meta = getCategoryMeta(transaction.category); return <View key={transaction.id || `${transaction.title}-${index}`} style={[styles.transactionRow, index === Math.min(4, transactions.length - 1) && styles.transactionRowLast]}><View style={[styles.transactionIcon, { backgroundColor: categorySoftColor(transaction.category) }]}><Feather name={meta.icon} size={14} color={accent} /></View><View style={styles.transactionCopy}><AppText style={styles.transactionTitle} numberOfLines={1}>{transaction.title || "Expense"}</AppText><AppText style={styles.transactionMeta}>{transaction.category || "Other"} · {transaction.date || "Recently"}</AppText></View><AppText style={styles.transactionAmount}>-₹{formatMoney(Math.abs(Number(transaction.amount) || 0))}</AppText></View>; })}</View> : <View style={styles.transactionsModule}><AppText style={styles.emptyCopy}>No transactions yet.</AppText></View>}

      <RevolutBottomNav active="Home" onNavigate={navigateBottom} />
    </Screen>
  );
}
