import { auth, firestore } from "../../config";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, StatusBar, View } from "react-native";
import { AppText, Field, PrimaryButton, Screen, SecondaryButton } from "../../components/ui";
import { colors, formatMoney, parseMoney, sanitizeMoneyInput } from "../../theme/theme";
import { UI_PREVIEW_MODE } from "../../config/uiPreview";
import { GoalFlowHeader } from "./GoalFlowScreens";
import { styles } from "./v2Styles";

export default function AddMoneyScreenV2({ navigation, route }) {
  const user = route?.params?.user || {};
  const onboarding = user.onboarding || {};
  const currentBalance = parseMoney(onboarding.currentBalance ?? onboarding.current_balance);
  const allowance = Math.max(parseMoney(onboarding.allowance ?? onboarding.allowance_amount), parseMoney(onboarding.cycleLimit ?? onboarding.cycle_limit), currentBalance);
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const amountValue = parseMoney(amount);
  const nextBalance = currentBalance + amountValue;

  const handleAddMoney = async () => {
    if (isLoading) return;
    if (amountValue <= 0) return Alert.alert("Amount required", "Enter an amount greater than zero.");
    const userId = user.id || user.userId || auth().currentUser?.uid;
    if (!UI_PREVIEW_MODE && !userId) return Alert.alert("Session unavailable", "Please sign in again and retry.");
    setIsLoading(true);
    const now = new Date();
    const transaction = {
      title: "Money added",
      category: "Income",
      amount: amountValue,
      date: `${now.getDate()} ${now.toLocaleDateString("en-IN", { month: "short" })}`,
      monthLabel: now.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      icon: "arrow-down-left",
      avoidable: false,
      reason: "",
    };
    const localTransaction = { ...transaction, id: String(Date.now()), createdAt: now };
    let committedBalance = nextBalance;
    let committedLimit = allowance + amountValue;
    try {
      if (UI_PREVIEW_MODE) {
        const updatedUser = {
          ...user,
          onboarding: { ...onboarding, currentBalance: nextBalance, cycleLimit: committedLimit, allowance: committedLimit },
          customTransactions: [localTransaction, ...(user.customTransactions || [])],
        };
        navigation.navigate("Dashboard", { user: updatedUser });
        return;
      }

      const profileRef = firestore().collection("users").doc(userId);
      const transactionRef = profileRef.collection("transactions").doc();
      await firestore().runTransaction(async (dbTransaction) => {
        const profileSnapshot = await dbTransaction.get(profileRef);
        const persistedOnboarding = profileSnapshot.data()?.onboarding || {};
        const persistedBalance = parseMoney(persistedOnboarding.current_balance ?? persistedOnboarding.currentBalance ?? currentBalance);
        const persistedAllowance = Math.max(
          parseMoney(persistedOnboarding.cycle_limit ?? persistedOnboarding.cycleLimit ?? persistedOnboarding.allowance_amount ?? persistedOnboarding.allowance),
          persistedBalance,
        );
        committedBalance = persistedBalance + amountValue;
        committedLimit = persistedAllowance + amountValue;
        dbTransaction.update(profileRef, {
          "onboarding.current_balance": String(committedBalance),
          "onboarding.cycle_limit": String(committedLimit),
          "onboarding.allowance_amount": String(committedLimit),
        });
        dbTransaction.set(transactionRef, { ...transaction, created_at: firestore.FieldValue.serverTimestamp() });
      });

      navigation.navigate("Dashboard", { user: { ...user, onboarding: { ...onboarding, currentBalance: committedBalance, cycleLimit: committedLimit, allowance: committedLimit }, customTransactions: [localTransaction, ...(user.customTransactions || [])] } });
    } catch (_) {
      Alert.alert("Could not add money", "Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.addMoneyKeyboard} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <Screen scroll contentContainerStyle={styles.flowContent}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <GoalFlowHeader navigation={navigation} user={user} title="Add money" eyebrow="BALANCE" />
        <Field label="Amount" value={amount} onChangeText={(value) => setAmount(sanitizeMoneyInput(value))} placeholder="0" keyboardType="decimal-pad" />
        <View style={styles.addMoneyBudget}><AppText style={styles.addMoneyBudgetLabel}>Available after adding money</AppText><AppText style={styles.addMoneyBudgetAmount}>₹{nextBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</AppText></View>
        <View style={[styles.flowActions, styles.addMoneyActions]}><PrimaryButton onPress={handleAddMoney} loading={isLoading}>Add money</PrimaryButton><SecondaryButton onPress={() => navigation.goBack()}>Cancel</SecondaryButton></View>
      </Screen>
    </KeyboardAvoidingView>
  );
}
