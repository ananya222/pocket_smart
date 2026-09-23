import React, { useMemo } from "react";
import { Pressable, StatusBar, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, ProgressBar, Screen, getCategoryMeta } from "../../../components/ui";
import { calculateBudgetSummary, calculateSafeToSpend, getRemainingDays } from "../../../utils/finance";
import { formatMoney, parseMoney } from "../../../theme/theme";
import NubankBottomNav from "./NubankBottomNav";
import { nubankColors as colors, nubankStyles as styles } from "./nubankStyles";

const valueFrom = (data, keys, fallback = "") => {
  for (const key of keys) {
    if (data?.[key] !== undefined && data?.[key] !== null && data?.[key] !== "") return data[key];
  }
  return fallback;
};

const normalizeOnboarding = (data = {}) => ({
  allowance: parseMoney(valueFrom(data, ["allowance_amount", "allowance"], 0)),
  frequency: valueFrom(data, ["allowance_frequency", "frequency"], "Monthly"),
  balance: parseMoney(valueFrom(data, ["current_balance", "currentBalance"], 0)),
  cycleLimit: parseMoney(valueFrom(data, ["cycle_limit", "cycleLimit", "allowance_amount", "allowance"], 0)),
});

const goalPercent = (goal) => {
  const target = Number(goal?.target) || 0;
  const progress = Number(goal?.progressAmount) || 0;
  return target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
};

const firstNameFrom = (name = "there") => String(name).trim().split(/\s+/)[0] || "there";

export default function NubankDashboardScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  const previewData = route?.params?.previewData || {};
  const onboarding = normalizeOnboarding(previewData.user?.onboarding || user.onboarding);
  const allowance = Math.max(onboarding.allowance, onboarding.cycleLimit, onboarding.balance);
  const calculatedSummary = calculateBudgetSummary({ allowance, balance: onboarding.balance });
  const summary = previewData.overspent
    ? { ...calculatedSummary, spent: previewData.previewSpent || calculatedSummary.spent, usedPercent: 100 }
    : calculatedSummary;
  const remainingDays = getRemainingDays(onboarding.frequency, new Date());
  const safeToSpend = calculateSafeToSpend({ balance: summary.balance, remainingDays });
  const isOverspent = summary.spent > summary.allowance && summary.allowance > 0;
  const isApproaching = !isOverspent && summary.usedPercent >= 80;
  const firstName = firstNameFrom(user.fullName);
  const transactions = previewData.transactions || [];
  const activeGoal = (previewData.goals || []).find((goal) => goal.active && goal.progressAmount < goal.target);
  const monthLabel = new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" });
  const status = allowance <= 0
    ? "Start with a simple budget"
    : isOverspent
      ? `Over budget by ₹${formatMoney(summary.spent - summary.allowance)}`
      : isApproaching
        ? "Keep an eye on your pace"
        : "You're on track";
  const statusStyle = isOverspent ? styles.safeStatusDanger : isApproaching ? styles.safeStatusWarning : allowance <= 0 ? styles.safeStatusNeutral : null;
  const open = (target) => navigation?.navigate?.(target === "Home" ? "Dashboard" : target, { user, previewData });

  const categoryTotals = useMemo(() => {
    const totals = transactions.reduce((result, transaction) => {
      const category = transaction.category || "Other";
      result[category] = (result[category] || 0) + Math.abs(Number(transaction.amount) || 0);
      return result;
    }, {});
    return Object.entries(totals).sort(([, a], [, b]) => b - a);
  }, [transactions]);

  return (
    <Screen scroll style={styles.screen} contentContainerStyle={styles.content}>
      <StatusBar barStyle="light-content" backgroundColor={colors.purple} />
      <View style={styles.purpleHeader}>
        <View style={styles.headerTop}>
          <Pressable style={styles.headerIdentity} onPress={() => open("Profile")} accessibilityLabel="Open profile">
            <View style={styles.avatar}><AppText style={styles.avatarText}>{firstName[0]?.toUpperCase() || "P"}</AppText></View>
            <View style={{ flex: 1, minWidth: 0 }}><AppText style={styles.headerBrand}>PocketSmart</AppText><AppText style={styles.headerMeta} numberOfLines={1}>Good morning, {firstName}</AppText></View>
          </Pressable>
          <View style={styles.headerIconRow}><Pressable style={styles.headerIcon} accessibilityLabel="View balance"><Feather name="eye" size={18} color={colors.surface} /></Pressable><Pressable style={styles.headerIcon} onPress={() => open("Profile")} accessibilityLabel="Open profile settings"><Feather name="user" size={18} color={colors.surface} /></Pressable></View>
        </View>
        <AppText style={styles.safeLabel}>Safe to spend today</AppText>
        <AppText style={styles.safeAmount}>₹{formatMoney(safeToSpend)}</AppText>
        <AppText style={[styles.safeStatus, statusStyle]}>{status}</AppText>
        <AppText style={styles.safeCopy}>₹{formatMoney(summary.balance)} available · {monthLabel}</AppText>
      </View>

      <View style={styles.main}>
        <View style={styles.quickSection}>
          <AppText style={styles.sectionEyebrow}>Quick actions</AppText>
          <View style={styles.actionRow}>
            <Pressable style={styles.action} onPress={() => open("AddExpense")} accessibilityRole="button"><View style={[styles.actionCircle, styles.actionCirclePrimary]}><Feather name="plus" size={21} color={colors.surface} /></View><AppText style={styles.actionLabel}>Add expense</AppText></Pressable>
            <Pressable style={styles.action} onPress={() => open("SavingsGoal")} accessibilityRole="button"><View style={styles.actionCircle}><Feather name="target" size={20} color={colors.purple} /></View><AppText style={styles.actionLabel}>New goal</AppText></Pressable>
            <Pressable style={styles.action} onPress={() => open("Insights")} accessibilityRole="button"><View style={styles.actionCircle}><Feather name="bar-chart-2" size={20} color={colors.purple} /></View><AppText style={styles.actionLabel}>View insights</AppText></Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><View><AppText style={styles.sectionTitle}>This month</AppText><AppText style={styles.statMeta}>{onboarding.frequency} budget</AppText></View><Pressable onPress={() => open("Insights")}><AppText style={styles.sectionLink}>Details</AppText></Pressable></View>
          <View style={styles.moneyRow}><View style={styles.stat}><AppText style={styles.statLabel}>Spent</AppText><AppText style={styles.statValue}>₹{formatMoney(summary.spent)}</AppText></View><View style={[styles.stat, styles.statRight]}><AppText style={styles.statLabel}>Budget</AppText><AppText style={styles.statValue}>₹{formatMoney(summary.allowance)}</AppText></View></View>
          <ProgressBar progress={summary.usedPercent} style={styles.progressTrack} color={isOverspent ? colors.red : colors.purple} trackColor="#EEEAF2" />
          <View style={styles.budgetFooter}><AppText style={styles.footerText}>{summary.usedPercent}% used</AppText><AppText style={[styles.footerText, styles.footerTextAccent]}>₹{formatMoney(Math.max(0, summary.allowance - summary.spent))} available</AppText></View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><AppText style={styles.sectionTitle}>Savings goal</AppText><Pressable onPress={() => open("Goals")}><AppText style={styles.sectionLink}>See all</AppText></Pressable></View>
          {activeGoal ? <View style={styles.goalRow}><View style={styles.goalTop}><View style={styles.goalCopy}><AppText style={styles.goalName} numberOfLines={1}>{activeGoal.name}</AppText><AppText style={styles.goalAmount}>₹{formatMoney(activeGoal.progressAmount)}</AppText><AppText style={styles.goalTarget}>of ₹{formatMoney(activeGoal.target)}</AppText></View><View><AppText style={styles.goalPercent}>{goalPercent(activeGoal)}%</AppText><AppText style={styles.goalPercentLabel}>saved</AppText></View></View><ProgressBar progress={goalPercent(activeGoal)} style={styles.progressTrack} color={colors.purple} trackColor="#EEEAF2" /><View style={styles.goalFooter}><AppText style={styles.goalFooterText}>Progress so far</AppText><AppText style={styles.goalFooterText}>₹{formatMoney(Math.max(0, activeGoal.target - activeGoal.progressAmount))} left</AppText></View></View> : <AppText style={styles.emptyCopy}>Create a savings goal and keep it visible here.</AppText>}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}><AppText style={styles.sectionTitle}>Recent spending</AppText><Pressable onPress={() => open("Insights")}><AppText style={styles.sectionLink}>See all</AppText></Pressable></View>
          {transactions.length ? <View style={styles.recentList}>{transactions.slice(0, 5).map((transaction, index) => { const meta = getCategoryMeta(transaction.category); return <View key={transaction.id || `${transaction.title}-${index}`} style={[styles.transactionRow, index === Math.min(4, transactions.length - 1) && styles.transactionRowLast]}><View style={[styles.transactionIcon, { backgroundColor: meta.soft }]}><Feather name={meta.icon} size={15} color={meta.color} /></View><View style={styles.transactionCopy}><AppText style={styles.transactionTitle} numberOfLines={1}>{transaction.title || "Expense"}</AppText><AppText style={styles.transactionMeta}>{transaction.category || "Other"} · {transaction.date || "Recently"}</AppText></View><AppText style={styles.transactionAmount}>-₹{formatMoney(Math.abs(Number(transaction.amount) || 0))}</AppText></View>; })}</View> : <AppText style={styles.emptyCopy}>Your recent spending will appear here as you track expenses.</AppText>}
          {categoryTotals.length > 1 ? <AppText style={[styles.statMeta, { marginTop: 13 }]}>Top category: {categoryTotals[0][0]} · ₹{formatMoney(categoryTotals[0][1])}</AppText> : null}
        </View>
      </View>
      <NubankBottomNav active="Home" onNavigate={open} />
    </Screen>
  );
}
