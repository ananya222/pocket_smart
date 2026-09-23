import { auth, firestore } from "../../config";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText, EmptyState, SectionHeader, TransactionRow } from "../../components/ui";
import { colors, formatMoney, spacing } from "../../theme/theme";
import { UI_PREVIEW_MODE } from "../../config/uiPreview";
import { styles } from "./v2Styles";

const toDate = (value) => value?.toDate ? value.toDate() : value ? new Date(value) : null;
const transactionDate = (transaction) => {
  if (transaction.createdAt && !Number.isNaN(transaction.createdAt.getTime())) return transaction.createdAt;
  const parsed = new Date(`${transaction.date || ""} ${new Date().getFullYear()}`);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

export default function InsightsScreenV2({ navigation, route }) {
  const user = route?.params?.user || {};
  const previewData = route?.params?.previewData;
  const userId = UI_PREVIEW_MODE ? null : user.id || user.userId || auth().currentUser?.uid;
  const [transactions, setTransactions] = useState(() => previewData?.transactions || []);
  const firstName = (user.fullName || "there").trim().split(" ")[0];

  useEffect(() => {
    if (!userId) return undefined;
    const transactionsUnsubscribe = firestore().collection("users").doc(userId).collection("transactions").onSnapshot((snapshot) => {
      setTransactions(snapshot.docs.map((doc) => { const data = doc.data(); return { id: doc.id, title: data.title || data.merchant || "Expense", category: data.category || "Other", amount: Number(data.amount) || 0, date: data.date || "Recently", createdAt: toDate(data.created_at) }; }).sort((a, b) => (b.createdAt?.getTime?.() || 0) - (a.createdAt?.getTime?.() || 0)));
    }, (error) => console.error("V2 insights transactions listener:", error));
    return transactionsUnsubscribe;
  }, [userId]);

  const spendingTransactions = useMemo(() => transactions.filter((transaction) => Number(transaction.amount) < 0), [transactions]);
  const monthTransactions = useMemo(() => {
    const now = new Date();
    const currentMonth = spendingTransactions.filter((transaction) => { const date = transactionDate(transaction); return date && date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear(); });
    return currentMonth.length || !previewData ? currentMonth : spendingTransactions;
  }, [spendingTransactions, previewData]);
  const totalSpent = useMemo(() => monthTransactions.reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0), [monthTransactions]);
  const categoryTotals = useMemo(() => {
    const totals = new Map();
    monthTransactions.forEach((transaction) => totals.set(transaction.category, (totals.get(transaction.category) || 0) + Math.abs(transaction.amount)));
    return Array.from(totals.entries()).sort((a, b) => b[1] - a[1]);
  }, [monthTransactions]);
  const weeklySpending = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const start = new Date(today);
    start.setDate(today.getDate() - 6);
    const days = Array.from({ length: 7 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); return { date, label: date.toLocaleDateString("en-IN", { weekday: "narrow" }), total: 0 }; });
    spendingTransactions.forEach((transaction) => {
      const value = transactionDate(transaction);
      if (!value) return;
      const date = new Date(value);
      date.setHours(0, 0, 0, 0);
      const index = Math.round((date - start) / 86400000);
      if (index >= 0 && index < days.length) days[index].total += Math.abs(transaction.amount);
    });
    return days;
  }, [spendingTransactions]);
  const weeklySummary = useMemo(() => weeklySpending.reduce((summary, day) => ({ max: Math.max(summary.max, day.total), total: summary.total + day.total }), { max: 1, total: 0 }), [weeklySpending]);
  const weeklyMax = weeklySummary.max;
  const weeklyTotal = weeklySummary.total;
  const displayTransactions = useMemo(() => transactions.slice(0, 8).map((transaction) => ({ ...transaction, category: transaction.category === "Food & Drinks" ? "Food & drinks" : transaction.category })), [transactions]);

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.dashboardShell}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.referenceBackground} />
      <View style={styles.dashboardFixedHeader}><AppText style={styles.goalsTitle}>Insights</AppText><Pressable style={styles.avatar} onPress={() => navigation.navigate("Profile", { user })} accessibilityLabel="Open profile"><AppText style={styles.avatarText}>{firstName[0]?.toUpperCase() || "P"}</AppText></Pressable></View>
      <ScrollView contentContainerStyle={styles.insightsContent} showsVerticalScrollIndicator={false}>
        <View style={styles.weeklyCard}><AppText style={styles.weeklyEyebrow}>Spent this week</AppText><AppText style={styles.weeklyAmount}>₹{formatMoney(weeklyTotal)}</AppText><View style={styles.weeklyChart}>{weeklySpending.map((day, index) => <View key={day.date.toISOString()} style={styles.weeklyDay}><View style={styles.weeklyBarArea}>{day.total ? <View style={[styles.weeklyBar, { height: `${Math.max(10, day.total / weeklyMax * 100)}%`, backgroundColor: index === 6 ? colors.primary : "#C7B69F" }]} /> : null}</View><AppText style={styles.weeklyLabel}>{day.label}</AppText></View>)}</View></View>
        <View style={styles.insightsSectionHeader}><SectionHeader title="Where it went this month" /></View>
        {categoryTotals.length ? <View style={styles.insightsList}>{categoryTotals.map(([category, value], index) => { const share = totalSpent ? value / totalSpent * 100 : 0; const displayCategory = category === "Food & Drinks" ? "Food & drinks" : category; return <View key={category} style={[styles.insightsCategoryRow, index === categoryTotals.length - 1 && styles.insightsCategoryLast]}><View style={styles.flex}><View style={styles.insightsCategoryHead}><AppText style={styles.categoryName}>{displayCategory}</AppText><AppText style={styles.categoryAmount}>₹{formatMoney(value)}</AppText></View><View style={styles.categoryBarTrack}><View style={[styles.categoryBarFill, { width: `${share}%`, backgroundColor: colors.accent }]} /></View></View></View>; })}</View> : <EmptyState title="No spending data yet" description="Your spending breakdown will appear here." />}
        <View style={styles.pageSection}><SectionHeader title="Transactions" /></View>
        {transactions.length ? <View style={styles.insightsActivityList}>{displayTransactions.map((transaction, index) => <TransactionRow key={transaction.id || `${transaction.title}-${index}`} transaction={transaction} last={index === displayTransactions.length - 1} />)}</View> : <EmptyState title="No transactions yet" description="Add an expense to start seeing patterns." />}
      </ScrollView>
    </SafeAreaView>
  );
}
