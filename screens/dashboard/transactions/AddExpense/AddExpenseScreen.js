// AddExpenseScreen.js
import { auth, firestore } from "../../../../config";
import React, { useState } from "react";
import {
  View,
  ScrollView,
  StatusBar,
  Platform,
  SafeAreaView,
  Alert,
  useWindowDimensions,
} from "react-native";
import { getStyles } from "./AddExpenseScreen.styles";
import BackgroundGrid from "../../../../components/BackgroundGrid/BackgroundGrid";

import AddExpenseHeader from "./components/AddExpenseHeader/AddExpenseHeader";
import AddExpenseAmountInput from "./components/AddExpenseAmountInput/AddExpenseAmountInput";
import AddExpenseMerchantInput from "./components/AddExpenseMerchantInput/AddExpenseMerchantInput";
import AddExpenseCategorySelector from "./components/AddExpenseCategorySelector/AddExpenseCategorySelector";
import AddExpenseBalancePreview from "./components/AddExpenseBalancePreview/AddExpenseBalancePreview";
import AddExpenseSubmitButton from "./components/AddExpenseSubmitButton/AddExpenseSubmitButton";

// Force Metro Cache Invalidation to reload stylesheets: 2026-06-25T10:35:57

export default function AddExpenseScreen({ navigation, route }) {
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 700;
  const styles = getStyles(isSmallDevice);

  const user = route.params?.user || {};
  const onboarding = user.onboarding || {};
  const accentColor = "#9D4EDD";

  // Form States
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const [liveOnboarding, setLiveOnboarding] = useState(null);

  React.useEffect(() => {
    const userUid = user.id || user.userId || route.params?.user?.id || auth().currentUser?.uid;
    if (!userUid) return;

    const unsubscribe = firestore()
      .collection("users")
      .doc(userUid)
      .onSnapshot((docSnap) => {
        if (docSnap.exists) {
          const data = docSnap.data();
          if (data && data.onboarding) {
            setLiveOnboarding(data.onboarding);
          }
        }
      }, (err) => console.error("Error listening to user balance in AddExpenseScreen:", err));

    return unsubscribe;
  }, [user.id]);

  const onboardingData = {
    allowance: liveOnboarding?.allowance_amount || onboarding.allowance || "5,000",
    frequency: liveOnboarding?.allowance_frequency || onboarding.frequency || "Monthly",
    currentBalance: liveOnboarding?.current_balance !== undefined 
      ? parseFloat(liveOnboarding.current_balance) 
      : (onboarding.currentBalance !== undefined ? parseFloat(String(onboarding.currentBalance).replace(/,/g, "")) : 5000),
  };

  const currentBalance = onboardingData.currentBalance;
  const allowanceStr = typeof onboardingData.allowance === "string" 
    ? onboardingData.allowance 
    : String(onboardingData.allowance || "5000");
  const parsedAllowance = parseFloat(allowanceStr.replace(/,/g, ""));
  const cleanAllowance = !isNaN(parsedAllowance) ? parsedAllowance : 5000;
  const dynamicAllowanceLimit = Math.max(cleanAllowance, currentBalance);

  const expenseAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const newBalance = Math.max(0, currentBalance - expenseAmount);

  const handleAddExpense = () => {
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than 0.");
      return;
    }

    if (!merchant.trim()) {
      Alert.alert("Missing Name", "Please enter a merchant or expense name.");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Select Category", "Please select a spending category.");
      return;
    }

    if (expenseAmount > currentBalance) {
      Alert.alert(
        "Insufficient Balance",
        `This expense (₹${expenseAmount.toLocaleString("en-IN")}) exceeds your available balance (₹${currentBalance.toLocaleString("en-IN")}). Proceed anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Proceed", onPress: () => executeExpenseUpdate(expenseAmount, currentBalance) }
        ]
      );
    } else {
      executeExpenseUpdate(expenseAmount, currentBalance);
    }
  };
  const executeExpenseUpdate = (expenseAmount, currentBalance) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("Impact", {
        user: {
          ...user,
          onboarding: {
            ...user.onboarding,
            currentBalance: currentBalance,
            allowance: cleanAllowance.toLocaleString("en-IN"),
          }
        },
        expenseAmount,
        merchant: merchant.trim(),
        category: selectedCategory,
        currentBalance,
        newBalance,
        cleanAllowance,
      });
    }, 450);
  };
  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <BackgroundGrid />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContainer, { paddingTop: STATUS_BAR_HEIGHT + 10 }]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <AddExpenseHeader 
            onBack={() => navigation.goBack()} 
            isSmallDevice={isSmallDevice} 
          />

          <AddExpenseAmountInput 
            amount={amount} 
            setAmount={setAmount} 
            isSmallDevice={isSmallDevice} 
          />

          <AddExpenseMerchantInput 
            merchant={merchant} 
            setMerchant={setMerchant} 
            isSmallDevice={isSmallDevice} 
          />

          <AddExpenseCategorySelector 
            selectedCategory={selectedCategory} 
            setSelectedCategory={setSelectedCategory} 
            isSmallDevice={isSmallDevice} 
          />

          <AddExpenseBalancePreview 
            currentBalance={currentBalance} 
            newBalance={newBalance} 
            expenseAmount={expenseAmount} 
            dynamicAllowanceLimit={dynamicAllowanceLimit} 
            isSmallDevice={isSmallDevice} 
          />

          <AddExpenseSubmitButton 
            isLoading={isLoading} 
            onPress={handleAddExpense} 
            isSmallDevice={isSmallDevice} 
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
