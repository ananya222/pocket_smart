import { auth, firestore } from "../../config";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import {
  AppText,
  ProgressBar,
  QuickAction,
  SectionHeader,
  TransactionRow,
} from "../../components/ui";
import { colors, formatMoney, parseMoney, spacing } from "../../theme/theme";
import { calculateBudgetSummary } from "../../utils/finance";
import { UI_PREVIEW_MODE } from "../../config/uiPreview";
import { styles } from "./v2Styles";

const valueFrom = (data, keys, fallback = "") => {
  for (const key of keys) {
    if (data?.[key] !== undefined && data?.[key] !== null && data?.[key] !== "") return data[key];
  }
  return fallback;
};

const toDate = (value) => {
  if (!value) return null;
  if (value.toDate) return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const normalizeOnboarding = (data = {}) => ({
  allowance: parseMoney(valueFrom(data, ["allowance_amount", "allowance"], 0)),
  frequency: valueFrom(data, ["allowance_frequency", "frequency"], "Monthly"),
  savingRatio: parseMoney(valueFrom(data, ["saving_ratio", "savingRatio"], 30)),
  currentBalance: parseMoney(valueFrom(data, ["current_balance", "currentBalance"], 0)),
  cycleLimit: parseMoney(valueFrom(data, ["cycle_limit", "cycleLimit", "allowance_amount", "allowance"], 0)),
});

const normalizeGoal = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    name: data.name || "Savings goal",
    target: parseMoney(data.target_amount),
    progressAmount: parseMoney(data.progress),
    priority: Number(data.priority) || 3,
    active: Number(data.is_active ?? 1) !== 0,
  };
};

const normalizeTransaction = (doc) => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title || data.merchant || "Expense",
    category: data.category || "Other",
    amount: Number(data.amount) || 0,
    date: data.date || "Recently",
    createdAt: toDate(data.created_at),
  };
};

const mergeTransactions = (dbTransactions, localTransactions = []) => {
  const result = [...dbTransactions];
  localTransactions.forEach((transaction) => {
    const exists = result.some((item) => item.title === transaction.title && Math.abs(Number(item.amount)) === Math.abs(Number(transaction.amount)) && item.date === transaction.date);
    if (!exists) result.push(transaction);
  });
  return result.sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0));
};

const greetingFor = (hour) => (hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening");

export default function DashboardScreenV2({ navigation, route }) {
  const user = route?.params?.user || {};
  const previewData = route?.params?.previewData;
  const userId = UI_PREVIEW_MODE ? null : user.id || user.userId || auth().currentUser?.uid;
  const [onboarding, setOnboarding] = useState(() => normalizeOnboarding(previewData?.user?.onboarding || user.onboarding));
  const [goals, setGoals] = useState(() => previewData?.goals || []);
  const [dbTransactions, setDbTransactions] = useState(() => previewData?.transactions || []);
  const [dashboardContentHeight, setDashboardContentHeight] = useState(0);
  const [activityOffset, setActivityOffset] = useState(0);
  const [transactionRowHeight, setTransactionRowHeight] = useState(0);

  useEffect(() => {
    if (!userId) return undefined;
    const userUnsubscribe = firestore().collection("users").doc(userId).onSnapshot((snapshot) => {
      if (snapshot.exists) setOnboarding(normalizeOnboarding(snapshot.data().onboarding));
    }, (error) => console.error("V2 dashboard user listener:", error));
    const goalsUnsubscribe = firestore().collection("users").doc(userId).collection("goals").onSnapshot((snapshot) => setGoals(snapshot.docs.map(normalizeGoal).sort((a, b) => a.priority - b.priority)), (error) => console.error("V2 dashboard goals listener:", error));
    const transactionsUnsubscribe = firestore().collection("users").doc(userId).collection("transactions").orderBy("created_at", "desc").onSnapshot((snapshot) => setDbTransactions(snapshot.docs.map(normalizeTransaction)), (error) => console.error("V2 dashboard transactions listener:", error));
    return () => { userUnsubscribe(); goalsUnsubscribe(); transactionsUnsubscribe(); };
  }, [userId]);

  const allowance = Math.max(onboarding.allowance, onboarding.cycleLimit, onboarding.currentBalance);
  const calculatedSummary = calculateBudgetSummary({ allowance, balance: onboarding.currentBalance });
  const summary = previewData?.overspent ? { ...calculatedSummary, spent: previewData.previewSpent || calculatedSummary.spent, usedPercent: 100 } : calculatedSummary;
  const today = new Date();
  const dashboardDate = `${today.toLocaleDateString("en-IN", { month: "long" })} · ${today.toLocaleDateString("en-IN", { weekday: "long", day: "numeric" })}`;
  const activeGoals = goals.filter((goal) => goal.active && (goal.target <= 0 || goal.progressAmount < goal.target));
  const primaryGoal = activeGoals[0];
  const balanceParts = summary.balance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).split(".");
  const firstName = (user.fullName || "there").trim().split(" ")[0];
  const allTransactions = useMemo(() => mergeTransactions(dbTransactions, user.customTransactions), [dbTransactions, user.customTransactions]);
  const isEmptyDashboard = allTransactions.length === 0;
  const availableRecentActivityHeight = Math.max(0, dashboardContentHeight - activityOffset - spacing.lg - spacing.md);
  const maxVisibleRows = transactionRowHeight > 0 ? Math.max(0, Math.floor(availableRecentActivityHeight / transactionRowHeight)) : 0;
  const visibleTransactions = allTransactions.slice(0, maxVisibleRows);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.dashboardShell}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.referenceBackground} />
      <View style={styles.dashboardFixedHeader}>
        <View><AppText style={styles.dashboardGreeting}>{greetingFor(today.getHours())}, {firstName}</AppText><AppText style={styles.dashboardMonth}>{dashboardDate}</AppText></View>
        <Pressable style={styles.avatar} onPress={() => navigation.navigate("Profile", { user })} accessibilityLabel="Open profile"><AppText style={styles.avatarText}>{firstName[0]?.toUpperCase() || "P"}</AppText></Pressable>
      </View>

      <View style={styles.dashboardContent} onLayout={({ nativeEvent }) => setDashboardContentHeight(nativeEvent.layout.height)}>

      <View style={styles.safeHeroCard}>
        <View pointerEvents="none" style={styles.balanceDecoration} />
        <View pointerEvents="none" style={styles.balanceDecorationOuterOne} />
        <View pointerEvents="none" style={styles.balanceDecorationOuterTwo} />
        <View style={styles.safeHeroHeader}><AppText style={styles.safeHeroLabel}>Available balance</AppText><Feather name="credit-card" size={18} color="#D5CBBC" /></View>
        <AppText style={styles.safeHeroAmount}>₹{balanceParts[0]}<AppText style={styles.balanceDecimals}>.{balanceParts[1]}</AppText></AppText>
        <View style={styles.balanceMetaRow}><AppText style={styles.balanceCaption}>{today.toLocaleDateString("en-IN", { month: "long" })}</AppText><AppText style={styles.balanceCaption}>{isEmptyDashboard ? "No spending yet" : `₹${formatMoney(summary.spent)} of ₹${formatMoney(summary.allowance)} spent`}</AppText></View>
        <ProgressBar progress={isEmptyDashboard ? 0 : summary.usedPercent} style={styles.balanceProgress} color="#D6BF98" trackColor="rgba(255,255,255,0.14)" />
      </View>

      <View style={[styles.dashboardQuickActions, !isEmptyDashboard && primaryGoal && styles.dashboardQuickActionsWithGoal]}>
        <QuickAction icon="plus" label="Add expense" onPress={() => navigation.navigate("AddExpense", { user })} />
        <QuickAction icon="plus" label="Add money" onPress={() => navigation.navigate("AddMoney", { user })} />
      </View>

      {primaryGoal ? <Pressable accessibilityRole="button" accessibilityLabel={`View ${primaryGoal.name}`} onPress={() => navigation.navigate("Goals", { user })} style={styles.dashboardGoalPreview}>
        <View style={styles.dashboardGoalHeading}>
          <AppText style={[styles.dashboardGoalName, styles.flex]}>{primaryGoal.name}</AppText>
          <Feather name="chevron-right" size={18} color={colors.background} />
        </View>
        <AppText style={styles.dashboardGoalMeta}>₹{formatMoney(primaryGoal.progressAmount)} of ₹{formatMoney(primaryGoal.target)}</AppText>
        <ProgressBar progress={primaryGoal.target > 0 ? primaryGoal.progressAmount / primaryGoal.target * 100 : 0} color="#D6BF98" trackColor="rgba(255,255,255,0.14)" style={styles.dashboardGoalProgress} />
        <View style={styles.dashboardGoalFooter}>
          <AppText style={styles.dashboardGoalFooterText}>{primaryGoal.target > 0 ? Math.min(100, Math.round(primaryGoal.progressAmount / primaryGoal.target * 100)) : 0}% saved</AppText>
          <AppText style={styles.dashboardGoalFooterText}>₹{formatMoney(Math.max(0, primaryGoal.target - primaryGoal.progressAmount))} to go</AppText>
        </View>
      </Pressable> : null}

      <View style={styles.dashboardActivitySection} onLayout={({ nativeEvent }) => setActivityOffset(nativeEvent.layout.y)}>
        <View style={styles.sectionGap} />
        <SectionHeader title="Recent activity" action={!isEmptyDashboard ? "See all ↗" : undefined} onAction={!isEmptyDashboard ? () => navigation.navigate("Insights", { user }) : undefined} />
        {isEmptyDashboard ? <View style={styles.dashboardEmptyActivity}><AppText style={styles.dashboardEmptyTitle}>No expenses yet</AppText><AppText muted style={styles.dashboardEmptyCopy}>Your spending will appear here.</AppText></View> : <View style={styles.activitySurface}>{visibleTransactions.map((transaction, index) => <View key={transaction.id || `${transaction.title}-${index}`} onLayout={index === 0 ? ({ nativeEvent }) => setTransactionRowHeight(nativeEvent.layout.height) : undefined}><TransactionRow transaction={transaction} minimal last={index === visibleTransactions.length - 1} /></View>)}</View>}
        {!isEmptyDashboard && !transactionRowHeight ? <View pointerEvents="none" onLayout={({ nativeEvent }) => setTransactionRowHeight(nativeEvent.layout.height)} style={styles.dashboardTransactionMeasurement}><TransactionRow transaction={allTransactions[0]} minimal /></View> : null}
      </View>
      </View>
    </SafeAreaView>
  );
}
