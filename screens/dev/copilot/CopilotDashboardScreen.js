import React, { useMemo } from "react";
import { Pressable, StatusBar, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, ProgressBar, Screen, getCategoryMeta } from "../../../components/ui";
import { calculateBudgetSummary, calculateSafeToSpend, getCycleDays, getRemainingDays } from "../../../utils/finance";
import { formatMoney, parseMoney } from "../../../theme/theme";
import CopilotBottomNav from "./CopilotBottomNav";
import { copilotColors as colors, copilotStyles as styles } from "./copilotStyles";

const valueFrom = (data, keys, fallback = "") => {
  for (const key of keys) if (data?.[key] !== undefined && data?.[key] !== null && data?.[key] !== "") return data[key];
  return fallback;
};

const normalizeOnboarding = (data = {}) => ({
  allowance: parseMoney(valueFrom(data, ["allowance_amount", "allowance"], 0)),
  frequency: valueFrom(data, ["allowance_frequency", "frequency"], "Monthly"),
  balance: parseMoney(valueFrom(data, ["current_balance", "currentBalance"], 0)),
  cycleLimit: parseMoney(valueFrom(data, ["cycle_limit", "cycleLimit", "allowance_amount", "allowance"], 0)),
});

const firstNameFrom = (name = "there") => String(name).trim().split(/\s+/)[0] || "there";

const categoryAccent = (category = "") => {
  const normalized = category.toLowerCase();
  if (normalized.includes("transport")) return colors.blue;
  if (normalized.includes("education")) return colors.green;
  if (normalized.includes("entertainment")) return colors.purple;
  if (normalized.includes("shopping")) return colors.amber;
  return colors.blue;
};

const transactionDate = (transaction) => {
  if (transaction?.createdAt) {
    const date = new Date(transaction.createdAt);
    if (!Number.isNaN(date.getTime())) return date;
  }
  const date = new Date(`${transaction?.date || ""} ${new Date().getFullYear()}`);
  return Number.isNaN(date.getTime()) ? null : date;
};

const goalPercent = (goal) => {
  const target = Number(goal?.target) || 0;
  const progress = Number(goal?.progressAmount) || 0;
  return target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
};

const buildPaceData = ({ allowance, frequency, transactions }) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekly = String(frequency).toLowerCase() === "weekly";
  const cycleDays = getCycleDays(frequency, today);
  const cycleStart = weekly ? new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7)) : new Date(today.getFullYear(), today.getMonth(), 1);
  const dayOfCycle = Math.max(1, Math.floor((today - cycleStart) / 86400000) + 1);
  const firstDay = Math.max(1, dayOfCycle - 6);
  const points = Array.from({ length: Math.min(7, dayOfCycle) }, (_, index) => {
    const dayIndex = firstDay + index;
    const date = new Date(cycleStart);
    date.setDate(cycleStart.getDate() + dayIndex - 1);
    const actual = transactions.reduce((sum, transaction) => {
      const transactionDay = transactionDate(transaction);
      if (!transactionDay || transactionDay < cycleStart || transactionDay > date) return sum;
      return sum + Math.abs(Number(transaction.amount) || 0);
    }, 0);
    return { label: date.toLocaleDateString("en-IN", { weekday: "short" }).slice(0, 1), actual, expected: allowance > 0 ? (allowance / cycleDays) * dayIndex : 0 };
  });
  const max = Math.max(1, ...points.flatMap((point) => [point.actual, point.expected]));
  return points.map((point) => ({ ...point, actualHeight: Math.max(point.actual ? 8 : 2, (point.actual / max) * 100), expectedHeight: Math.max(point.expected ? 8 : 2, (point.expected / max) * 100) }));
};

export default function CopilotDashboardScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  const previewData = route?.params?.previewData || {};
  const onboarding = normalizeOnboarding(previewData.user?.onboarding || user.onboarding);
  const allowance = Math.max(onboarding.allowance, onboarding.cycleLimit, onboarding.balance);
  const calculatedSummary = calculateBudgetSummary({ allowance, balance: onboarding.balance });
  const summary = previewData.overspent ? { ...calculatedSummary, spent: previewData.previewSpent || calculatedSummary.spent, usedPercent: 100 } : calculatedSummary;
  const transactions = previewData.transactions || [];
  const safeToSpend = calculateSafeToSpend({ balance: summary.balance, remainingDays: getRemainingDays(onboarding.frequency, new Date()) });
  const activeGoal = (previewData.goals || []).find((goal) => goal.active && goal.progressAmount < goal.target);
  const firstName = firstNameFrom(user.fullName);
  const isOverspent = summary.spent > summary.allowance && summary.allowance > 0;
  const isApproaching = !isOverspent && summary.usedPercent >= 80;
  const paceData = useMemo(() => buildPaceData({ allowance: summary.allowance, frequency: onboarding.frequency, transactions }), [allowance, onboarding.frequency, transactions, summary.allowance]);
  const totals = useMemo(() => transactions.reduce((result, transaction) => { const category = transaction.category || "Other"; result[category] = (result[category] || 0) + Math.abs(Number(transaction.amount) || 0); return result; }, {}), [transactions]);
  const categoryBreakdown = Object.entries(totals).sort(([, a], [, b]) => b - a).slice(0, 4);
  const totalCategorySpend = categoryBreakdown.reduce((sum, [, amount]) => sum + amount, 0);
  const paceStatus = isOverspent ? "Over expected pace" : isApproaching ? "Near expected pace" : allowance <= 0 ? "Waiting for your first budget" : "Under expected pace";
  const paceStatusStyle = isOverspent ? styles.heroStatusDanger : isApproaching ? styles.heroStatusWarning : allowance <= 0 ? styles.heroStatusNeutral : null;
  const paceDeltaStyle = isOverspent ? styles.paceDeltaDanger : isApproaching ? styles.paceDeltaWarning : null;
  const open = (target) => navigation?.navigate?.(target === "Home" ? "Dashboard" : target, { user, previewData });

  return (
    <Screen scroll style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />
      <View style={styles.header}><View style={styles.headerCopy}><AppText style={styles.brand}>PocketSmart</AppText><AppText style={styles.headerMeta}>Good morning, {firstName} · Financial overview</AppText></View><View style={styles.headerIcons}><Pressable style={styles.headerIcon} accessibilityLabel="View activity"><Feather name="activity" size={18} color={colors.blue} /></Pressable><Pressable style={styles.avatar} onPress={() => open("Profile")} accessibilityLabel="Open profile"><AppText style={styles.avatarText}>{firstName[0]?.toUpperCase() || "P"}</AppText></Pressable></View></View>

      <View style={styles.hero}><View style={styles.heroTop}><AppText style={styles.eyebrow}>Safe to spend today</AppText><Feather name="more-horizontal" size={18} color={colors.textSubtle} /></View><AppText style={styles.heroAmount}>₹{formatMoney(safeToSpend)}</AppText><AppText style={styles.heroMeta}>₹{formatMoney(summary.balance)} left this month</AppText><AppText style={[styles.heroStatus, paceStatusStyle]}>{paceStatus}</AppText><View style={styles.paceHeader}><AppText style={styles.paceTitle}>Spending pace</AppText><AppText style={[styles.paceDelta, paceDeltaStyle]}>{summary.usedPercent}% of budget used</AppText></View><View style={styles.paceChart}>{paceData.map((point, index) => <View key={`${point.label}-${index}`} style={styles.paceColumn}><View style={styles.pacePlot}><View style={[styles.paceExpectedBar, { height: `${point.expectedHeight}%` }]} /><View style={[styles.paceActualBar, isOverspent && styles.paceActualBarDanger, !isOverspent && !isApproaching && styles.paceActualBarPositive, { height: `${point.actualHeight}%` }]} /></View><AppText style={styles.paceLabel}>{point.label}</AppText></View>)}</View><View style={styles.legend}><View style={styles.legendItem}><View style={[styles.legendSwatch, { backgroundColor: colors.blue }]} /><AppText style={styles.legendText}>Logged spending</AppText></View><View style={styles.legendItem}><View style={[styles.legendSwatch, { backgroundColor: colors.border }]} /><AppText style={styles.legendText}>Expected pace</AppText></View></View></View>

      <View style={styles.surface}><View style={styles.sectionHeader}><AppText style={styles.sectionTitle}>This month</AppText><Pressable onPress={() => open("Insights")}><AppText style={styles.sectionLink}>Details</AppText></Pressable></View><View style={styles.moneyRow}><View style={styles.stat}><AppText style={styles.statLabel}>Spent</AppText><AppText style={styles.statValue}>₹{formatMoney(summary.spent)}</AppText><AppText style={styles.statMeta}>{summary.usedPercent}% of budget</AppText></View><View style={[styles.stat, styles.statRight]}><AppText style={styles.statLabel}>Remaining</AppText><AppText style={styles.statValue}>₹{formatMoney(summary.balance)}</AppText><AppText style={styles.statMeta}>of ₹{formatMoney(summary.allowance)}</AppText></View></View><ProgressBar progress={summary.usedPercent} style={styles.progressTrack} color={isOverspent ? colors.red : colors.blue} trackColor={colors.border} /><View style={styles.moduleFooter}><AppText style={styles.footerText}>{onboarding.frequency} cycle</AppText><AppText style={[styles.footerText, styles.footerAccent]}>₹{formatMoney(Math.max(0, summary.allowance - summary.spent))} available</AppText></View></View>

      <View style={styles.surface}><View style={styles.sectionHeader}><AppText style={styles.sectionTitle}>Spending mix</AppText><AppText style={styles.statMeta}>From recent activity</AppText></View>{categoryBreakdown.length ? <View style={styles.categoryGrid}>{categoryBreakdown.map(([category, amount]) => { const meta = getCategoryMeta(category); const share = totalCategorySpend ? Math.round((amount / totalCategorySpend) * 100) : 0; const accent = categoryAccent(category); return <View key={category} style={styles.categoryTile}><View style={styles.categoryTileTop}><View style={[styles.categoryDot, { backgroundColor: accent }]} /><AppText style={styles.categoryTileName} numberOfLines={1}>{category.replace(" & Drinks", "")}</AppText></View><AppText style={styles.categoryTileAmount}>₹{formatMoney(amount)}</AppText><AppText style={styles.categoryTileMeta}>{share}% of logged</AppText><View style={styles.categoryBar}><View style={[styles.categoryBarFill, { width: `${share}%`, backgroundColor: accent }]} /></View></View>; })}</View> : <AppText style={styles.emptyCopy}>Category data will appear as you log expenses.</AppText>}</View>

      <View style={styles.surface}><View style={styles.sectionHeader}><AppText style={styles.sectionTitle}>Recent activity</AppText><Pressable onPress={() => open("Insights")}><AppText style={styles.sectionLink}>See all</AppText></Pressable></View>{transactions.length ? transactions.slice(0, 5).map((transaction, index) => { const meta = getCategoryMeta(transaction.category); const accent = categoryAccent(transaction.category); return <View key={transaction.id || `${transaction.title}-${index}`} style={[styles.recentRow, index === Math.min(4, transactions.length - 1) && styles.recentRowLast]}><View style={[styles.recentIcon, { backgroundColor: colors.secondaryBackground }]}><Feather name={meta.icon} size={14} color={accent} /></View><View style={styles.recentCopy}><AppText style={styles.recentTitle} numberOfLines={1}>{transaction.title || "Expense"}</AppText><AppText style={styles.recentMeta}>{transaction.category || "Other"} · {transaction.date || "Recently"}</AppText></View><AppText style={styles.recentAmount}>-₹{formatMoney(Math.abs(Number(transaction.amount) || 0))}</AppText></View>; }) : <AppText style={styles.emptyCopy}>No spending logged yet.</AppText>}</View>

      <View style={styles.surface}><View style={styles.sectionHeader}><AppText style={styles.sectionTitle}>Savings goal</AppText><Pressable onPress={() => open("Goals")}><AppText style={styles.sectionLink}>Open goals</AppText></Pressable></View>{activeGoal ? <View style={styles.goalRow}><View style={styles.goalTop}><View style={styles.goalCopy}><AppText style={styles.goalName} numberOfLines={1}>{activeGoal.name}</AppText><AppText style={styles.goalAmount}>₹{formatMoney(activeGoal.progressAmount)}</AppText><AppText style={styles.goalTarget}>of ₹{formatMoney(activeGoal.target)}</AppText></View><View><AppText style={styles.goalPercent}>{goalPercent(activeGoal)}%</AppText><AppText style={styles.goalPercentLabel}>saved</AppText></View></View><View style={styles.goalProgress}><View style={[styles.goalProgressFill, { width: `${goalPercent(activeGoal)}%`, backgroundColor: colors.purple }]} /></View><View style={styles.goalFooter}><AppText style={styles.goalFooterText}>Current progress</AppText><AppText style={styles.goalFooterText}>₹{formatMoney(Math.max(0, activeGoal.target - activeGoal.progressAmount))} remaining</AppText></View></View> : <AppText style={styles.emptyCopy}>Create a savings goal to keep a target visible.</AppText>}</View>
      <CopilotBottomNav active="Home" onNavigate={open} />
    </Screen>
  );
}
