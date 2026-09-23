import { auth, firestore } from "../../config";
import React, { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, Pressable, StatusBar, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, Field, getCategoryMeta, PrimaryButton, Screen } from "../../components/ui";
import { colors, formatMoney, parseMoney, sanitizeMoneyInput } from "../../theme/theme";
import { UI_PREVIEW_MODE } from "../../config/uiPreview";
import { GoalFlowHeader } from "./GoalFlowScreens";
import { styles } from "./v2Styles";

const CATEGORIES = [
  { value: "Food & Drinks", label: "Food" },
  { value: "Transport", label: "Transport" },
  { value: "Shopping", label: "Shopping" },
  { value: "Entertainment", label: "Entertainment" },
  { value: "Bills & Utilities", label: "Bills" },
  { value: "Misc", label: "Other" },
];

export { CATEGORIES };

export default function AddExpenseScreenV2({ navigation, route }) {
  const params = route?.params || {};
  const user = params.user || {};
  const previewData = params.previewData;
  const previewOnboarding = previewData?.user?.onboarding || user.onboarding || {};
  const userId = UI_PREVIEW_MODE ? null : user.id || user.userId || auth().currentUser?.uid;
  const [amount, setAmount] = useState(params.amount || "");
  const [merchant, setMerchant] = useState(params.merchant || "");
  const [selectedCategory, setSelectedCategory] = useState(params.selectedCategory || "Food & Drinks");
  const [errors, setErrors] = useState({});
  const [currentBalance, setCurrentBalance] = useState(() => parseMoney(previewOnboarding.current_balance ?? previewOnboarding.currentBalance));
  const [allowance, setAllowance] = useState(() => parseMoney(previewOnboarding.cycle_limit ?? previewOnboarding.allowance_amount ?? previewOnboarding.allowance));
  const [frequency, setFrequency] = useState(() => previewOnboarding.allowance_frequency ?? previewOnboarding.frequency ?? "Monthly");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (params.selectedCategory) setSelectedCategory(params.selectedCategory);
    if (params.invalid) setErrors({ amount: "Enter an amount greater than ₹0.", merchant: "Add a merchant or short note." });
  }, [params.selectedCategory, params.invalid]);

  useEffect(() => {
    if (!userId) return undefined;
    return firestore().collection("users").doc(userId).onSnapshot((snapshot) => {
      const onboarding = snapshot.data()?.onboarding || {};
      setCurrentBalance(parseMoney(onboarding.current_balance ?? onboarding.currentBalance));
      setAllowance(parseMoney(onboarding.cycle_limit ?? onboarding.allowance_amount ?? onboarding.allowance));
      setFrequency(onboarding.allowance_frequency ?? onboarding.frequency ?? "Monthly");
    }, (error) => console.error("V2 add expense user listener:", error));
  }, [userId]);

  const numericAmount = parseMoney(amount);
  const newBalance = Math.max(0, currentBalance - numericAmount);
  const executeExpense = () => {
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("Impact", {
        user: { ...user, onboarding: { ...user.onboarding, currentBalance, current_balance: String(currentBalance), allowance: allowance.toLocaleString("en-IN"), allowance_amount: String(allowance), frequency, allowance_frequency: frequency } },
        expenseAmount: numericAmount,
        merchant: merchant.trim(),
        category: selectedCategory,
        currentBalance,
        newBalance,
        cleanAllowance: allowance,
      });
    }, 180);
  };
  const submit = () => {
    if (isLoading) return;
    const nextErrors = {};
    if (numericAmount <= 0) nextErrors.amount = "Enter an amount greater than ₹0.";
    if (!merchant.trim()) nextErrors.merchant = "Add a merchant or short note.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (numericAmount > currentBalance) return Alert.alert("Insufficient balance", `You have ₹${formatMoney(currentBalance)} available. Add money before recording this expense.`);
    executeExpense();
  };
  const categoryLabel = CATEGORIES.find((category) => category.value === selectedCategory)?.label || "Food";

  return (
    <Screen scroll contentContainerStyle={styles.expenseFormContent}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <GoalFlowHeader navigation={navigation} user={user} title="Add expense" eyebrow="NEW TRANSACTION" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.expenseForm}>
        <Field label="Amount" value={amount} onChangeText={(value) => { setAmount(sanitizeMoneyInput(value)); setErrors((current) => ({ ...current, amount: undefined })); }} placeholder="₹ 0.00" keyboardType="decimal-pad" error={errors.amount} />
        <Field label="What was it for?" value={merchant} onChangeText={(value) => { setMerchant(value); setErrors((current) => ({ ...current, merchant: undefined })); }} placeholder="e.g. Lunch" style={styles.expenseMerchantField} error={errors.merchant} />
        <View style={styles.expenseCategoryField}>
          <AppText style={styles.expenseCategoryLabel}>Category</AppText>
          <Pressable style={styles.expenseCategorySelect} onPress={() => navigation.navigate("ExpenseCategory", { user, previewData, amount, merchant, selectedCategory })} accessibilityRole="button" accessibilityLabel="Choose category">
            <View style={styles.expenseCategorySelectCopy}><Feather name={getCategoryMeta(selectedCategory).icon} size={18} color={colors.accent} /><AppText>{categoryLabel}</AppText></View>
            <Feather name="chevron-right" size={18} color={colors.textSubtle} />
          </Pressable>
        </View>
        <AppText style={styles.balanceHint}>₹{formatMoney(currentBalance)} available</AppText>
      </KeyboardAvoidingView>
      <PrimaryButton onPress={submit} loading={isLoading} style={styles.onboardingBottomAction}>Add expense</PrimaryButton>
    </Screen>
  );
}
