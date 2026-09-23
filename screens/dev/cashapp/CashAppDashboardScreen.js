import React from "react";
import { Pressable, StatusBar, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, Screen } from "../../../components/ui";
import { calculateBudgetSummary, calculateSafeToSpend, getRemainingDays } from "../../../utils/finance";
import { formatMoney, parseMoney } from "../../../theme/theme";
import CashAppBottomNav from "./CashAppBottomNav";
import { cashColors as colors, cashStyles as styles } from "./cashStyles";

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

const goalPercent = (goal) => {
  const target = Number(goal?.target) || 0;
  const progress = Number(goal?.progressAmount) || 0;
  return target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
};

export default function CashAppDashboardScreen({ navigation, route }) {
  const user = route?.params?.user || {};
  const previewData = route?.params?.previewData || {};
  const onboarding = normalizeOnboarding(previewData.user?.onboarding || user.onboarding);
  const allowance = Math.max(onboarding.allowance, onboarding.cycleLimit, onboarding.balance);
  const calculatedSummary = calculateBudgetSummary({ allowance, balance: onboarding.balance });
  const summary = previewData.overspent ? { ...calculatedSummary, spent: previewData.previewSpent || calculatedSummary.spent, usedPercent: 100 } : calculatedSummary;
  const safeToSpend = calculateSafeToSpend({ balance: summary.balance, remainingDays: getRemainingDays(onboarding.frequency, new Date()) });
  const transactions = previewData.transactions || [];
  const activeGoals = (previewData.goals || []).filter((goal) => goal.active && goal.progressAmount < goal.target);
  const activeGoal = activeGoals[0];
  const firstName = firstNameFrom(user.fullName);
  const isOverspent = summary.spent > summary.allowance && summary.allowance > 0;
  const isApproaching = !isOverspent && summary.usedPercent >= 80;
  const status = allowance <= 0 ? "Set a budget to get started" : isOverspent ? `Over by ₹${formatMoney(summary.spent - summary.allowance)}` : isApproaching ? "Slow down a little" : "You're on track";
  const statusStyle = isOverspent ? styles.statusDanger : isApproaching ? styles.statusWarning : allowance <= 0 ? styles.statusNeutral : null;
  const open = (target) => navigation?.navigate?.(target === "Home" ? "Dashboard" : target, { user, previewData });

  return <Screen scroll style={styles.screen} contentContainerStyle={styles.content}><StatusBar barStyle="light-content" backgroundColor={colors.background} /><View style={styles.header}><View style={styles.headerCopy}><AppText style={styles.brand}>PocketSmart</AppText><AppText style={styles.headerMeta}>Good morning, {firstName}</AppText></View><Pressable style={styles.avatar} onPress={() => open("Profile")} accessibilityLabel="Open profile"><AppText style={styles.avatarText}>{firstName[0]?.toUpperCase() || "P"}</AppText></Pressable></View><View style={styles.safeSection}><AppText style={styles.eyebrow}>Safe to spend</AppText><AppText style={styles.safeAmount}>₹{formatMoney(safeToSpend)}</AppText><AppText style={styles.safeToday}>today</AppText><AppText style={styles.safeMeta}>₹{formatMoney(summary.balance)} left this month</AppText><AppText style={[styles.status, statusStyle]}>{status}</AppText></View><Pressable style={styles.primaryAction} onPress={() => open("AddExpense")} accessibilityRole="button"><AppText style={styles.primaryActionText}>Add expense</AppText></Pressable><View style={styles.actionRow}><Pressable style={styles.action} onPress={() => {}} accessibilityRole="button"><View style={[styles.actionCircle, styles.actionCircleGreen]}><Feather name="plus-circle" size={16} color={colors.green} /></View><AppText style={styles.actionLabel}>Add money</AppText></Pressable><Pressable style={styles.action} onPress={() => open("SavingsGoal")} accessibilityRole="button"><View style={styles.actionCircle}><Feather name="target" size={16} color={colors.purple} /></View><AppText style={styles.actionLabel}>New goal</AppText></Pressable></View><View style={styles.section}><View style={styles.sectionHeader}><AppText style={styles.sectionTitle}>Savings</AppText><Pressable onPress={() => open("Goals")}><AppText style={styles.sectionLink}>See all</AppText></Pressable></View>{activeGoal ? <View style={styles.goalSurface}><View style={styles.goalTop}><View style={styles.goalCopy}><AppText style={styles.goalName} numberOfLines={1}>{activeGoal.name}</AppText><AppText style={styles.goalAmount}>₹{formatMoney(activeGoal.progressAmount)}</AppText><AppText style={styles.goalTarget}>of ₹{formatMoney(activeGoal.target)}</AppText></View><AppText style={styles.goalPercent}>{goalPercent(activeGoal)}%</AppText></View><View style={styles.goalProgress}><View style={[styles.goalProgressFill, { width: `${goalPercent(activeGoal)}%` }]} /></View><View style={styles.goalFooter}><AppText style={styles.goalFooterText}>saved</AppText><AppText style={styles.goalFooterText}>₹{formatMoney(Math.max(0, activeGoal.target - activeGoal.progressAmount))} left</AppText></View>{activeGoals.length > 1 ? <AppText style={styles.moreGoals}>+ {activeGoals.length - 1} more active {activeGoals.length - 1 === 1 ? "goal" : "goals"}</AppText> : null}</View> : <AppText style={styles.emptyCopy}>No savings goals yet.</AppText>}</View><View style={styles.section}><View style={styles.sectionHeader}><AppText style={styles.sectionTitle}>Recent</AppText><Pressable onPress={() => open("Insights")}><AppText style={styles.sectionLink}>See all</AppText></Pressable></View>{transactions.length ? transactions.slice(0, 5).map((transaction, index) => <View key={transaction.id || `${transaction.title}-${index}`} style={[styles.recentRow, index === Math.min(4, transactions.length - 1) && styles.recentRowLast]}><View style={styles.recentCopy}><AppText style={styles.recentTitle} numberOfLines={1}>{transaction.title || "Expense"}</AppText><AppText style={styles.recentMeta}>{transaction.category || "Other"}</AppText></View><AppText style={styles.recentAmount}>-₹{formatMoney(Math.abs(Number(transaction.amount) || 0))}</AppText></View>) : <AppText style={styles.emptyCopy}>No recent spending.</AppText>}</View><CashAppBottomNav active="Home" onNavigate={open} /></Screen>;
}
