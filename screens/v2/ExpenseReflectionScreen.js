import { auth, firestore } from "../../config";
import React, { useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StatusBar, View } from "react-native";
import { AppText, Field, PrimaryButton, Screen } from "../../components/ui";
import { colors, formatMoney, parseMoney } from "../../theme/theme";
import { UI_PREVIEW_MODE } from "../../config/uiPreview";
import { GoalFlowHeader } from "./GoalFlowScreens";
import { styles } from "./v2Styles";

export default function ExpenseReflectionScreenV2({ navigation, route }) {
  const params = route?.params || {};
  const user = params.user || {};
  const expenseAmount = parseMoney(params.expenseAmount);
  const newBalance = parseMoney(params.newBalance);
  const category = params.category || "Food & Drinks";
  const merchant = params.merchant || "Expense";
  const userId = UI_PREVIEW_MODE ? null : user.id || user.userId || auth().currentUser?.uid;
  const [avoidable, setAvoidable] = useState("No");
  const [note, setNote] = useState("");
  const [isFinalizing, setIsFinalizing] = useState(false);
  const categoryLabel = category.replace("Food & Drinks", "Food & drinks");

  const finalize = async () => {
    if (isFinalizing) return;
    setIsFinalizing(true);
    const now = new Date();
    const transaction = {
      title: merchant,
      category,
      amount: -expenseAmount,
      date: `${now.getDate()} ${now.toLocaleDateString("en-IN", { month: "short" })}`,
      monthLabel: now.toLocaleDateString("en-IN", { month: "long", year: "numeric" }),
      avoidable: avoidable === "Yes",
      reason: note.trim(),
    };
    let committedBalance = newBalance;
    try {
      if (UI_PREVIEW_MODE) {
        committedBalance = newBalance;
      } else {
        if (!userId) throw new Error("No session");
        const profileRef = firestore().collection("users").doc(userId);
        const transactionRef = profileRef.collection("transactions").doc();
        await firestore().runTransaction(async (dbTransaction) => {
          const profileSnapshot = await dbTransaction.get(profileRef);
          const persistedBalance = parseMoney(profileSnapshot.data()?.onboarding?.current_balance ?? profileSnapshot.data()?.onboarding?.currentBalance ?? params.currentBalance ?? 0);
          if (expenseAmount > persistedBalance) throw new Error("INSUFFICIENT_BALANCE");
          committedBalance = persistedBalance - expenseAmount;
          dbTransaction.update(profileRef, { "onboarding.current_balance": String(committedBalance) });
          dbTransaction.set(transactionRef, { ...transaction, created_at: firestore.FieldValue.serverTimestamp() });
        });
      }
      const updatedUser = {
        ...user,
        onboarding: { ...user.onboarding, currentBalance: String(committedBalance), current_balance: String(committedBalance) },
        customTransactions: [{ ...transaction, id: String(Date.now()), createdAt: new Date() }, ...(user.customTransactions || [])],
      };
      navigation.navigate("Dashboard", { user: updatedUser });
    } catch (error) {
      Alert.alert(error?.message === "INSUFFICIENT_BALANCE" ? "Insufficient balance" : "Could not save expense", error?.message === "INSUFFICIENT_BALANCE" ? "Your available balance changed. Add money or enter a smaller expense." : "Please check your connection and try again.");
    } finally {
      setIsFinalizing(false);
    }
  };

  return (
    <Screen scroll contentContainerStyle={styles.reflectionContent}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <GoalFlowHeader navigation={navigation} user={user} title="How did that spend feel?" eyebrow="ONE QUICK CHECK" />
      <View style={styles.reflectionSpendCard}>
        <AppText style={styles.reflectionMerchant}>{merchant}</AppText>
        <AppText style={styles.reflectionAmount}>-₹{formatMoney(expenseAmount)}</AppText>
        <AppText muted style={styles.reflectionMeta}>{categoryLabel} · Balance after: ₹{formatMoney(newBalance)}</AppText>
      </View>
      <AppText style={styles.reflectionQuestion}>Was it avoidable?</AppText>
      <View style={styles.reflectionChoiceRow}>
        {["No", "Yes"].map((value) => <Pressable key={value} onPress={() => setAvoidable(value)} style={[styles.reflectionChoice, avoidable === value && styles.reflectionChoiceSelected]} accessibilityRole="radio" accessibilityState={{ selected: avoidable === value }}><AppText style={[styles.reflectionChoiceText, avoidable === value && styles.reflectionChoiceTextSelected]}>{value}</AppText></Pressable>)}
      </View>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <AppText style={styles.reflectionQuestion}>Anything else? <AppText muted style={styles.reflectionOptional}>(optional)</AppText></AppText>
        <Field value={note} onChangeText={setNote} placeholder="Add a note" style={styles.reflectionField} />
        <PrimaryButton onPress={finalize} loading={isFinalizing} style={styles.reflectionSaveButton}>Save expense</PrimaryButton>
      </KeyboardAvoidingView>
    </Screen>
  );
}
