// ExpenseReflectionScreen.js

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  SafeAreaView,
  ActivityIndicator,
  useWindowDimensions,
  Animated,
  Keyboard,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather } from "@expo/vector-icons";
import { getStyles } from "../styles/ExpenseReflectionScreen.styles";
import BackgroundGrid from "../components/BackgroundGrid";

const CATEGORIES = [
  { name: "Food & Drinks", icon: "coffee" },
  { name: "Shopping", icon: "shopping-bag" },
  { name: "Transport", icon: "map-pin" },
  { name: "Bills & Utilities", icon: "file-text" },
  { name: "Entertainment", icon: "film" },
  { name: "Misc", icon: "grid" }
];

export default function ExpenseReflectionScreen({ navigation, route }) {
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 700;
  const styles = getStyles(isSmallDevice);

  // Retrieve params passed from AddExpenseScreen
  const routeParams = route?.params || {};
  const {
    user = {},
    expenseAmount = 0,
    merchant = "",
    category = "Misc",
    currentBalance = 0,
    newBalance = 0,
    cleanAllowance = 5000,
  } = routeParams;

  const onboarding = user?.onboarding || {};
  const frequency = onboarding.frequency || "Weekly";
  const goalName = onboarding.goalName || "Savings Goal";
  const targetAmount = onboarding.targetAmount || "8,000";
  const targetAmountNum = parseFloat(String(targetAmount).replace(/,/g, "")) || 8000;
  const timeToReach = onboarding.timeToReach || 6;

  // States
  const [activeGoals, setActiveGoals] = useState([]);
  const [hasLoadedGoals, setHasLoadedGoals] = useState(false);
  const [isAvoidable, setIsAvoidable] = useState(null);
  const [reason, setReason] = useState("");
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Animation values for conditional input fade-in
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(15)).current;

  const fetchGoals = async () => {
    try {
      const userId = user.id || user.userId;
      if (!userId) return;
      const response = await fetch(`http://192.168.1.4:5000/get_goals?userId=${userId}`);
      const data = await response.json();
      if (response.ok && data.goals) {
        const active = data.goals.filter(g => {
          const targetNum = parseFloat(String(g.target_amount).replace(/,/g, "")) || 1000;
          const isGoalActive = g.is_active === 1;
          const progressPercent = Math.round((g.progress_amount / targetNum) * 100);
          return progressPercent < 100 && isGoalActive;
        });
        setActiveGoals(active);
        setHasLoadedGoals(true);
      }
    } catch (err) {
      console.log("Fetch goals in reflection failed:", err);
    }
  };

  React.useEffect(() => {
    fetchGoals();
  }, []);

  // Calculate Savings Rate & Goal Impact dynamically
  const savingsProgressVal = parseInt(String(onboarding.savingsProgressAmount || 0).replace(/[^0-9]/g, ""), 10) || 0;
  const isPrimaryGoalActive = savingsProgressVal < targetAmountNum;

  const showImpact = hasLoadedGoals ? activeGoals.length > 0 : isPrimaryGoalActive;
  const activeGoalName = hasLoadedGoals && activeGoals.length > 0 ? activeGoals[0].name : goalName;
  const activeGoalTarget = hasLoadedGoals && activeGoals.length > 0 
    ? parseFloat(String(activeGoals[0].target_amount).replace(/,/g, "")) || 8000
    : targetAmountNum;

  const cycleUnit = frequency === "Weekly" ? "week" : "month";
  const savingsPerCycle = activeGoalTarget / (timeToReach || 6);
  const cyclesEquivalent = Math.max(0.1, parseFloat((expenseAmount / savingsPerCycle).toFixed(1)));
  const impactPercent = Math.min(100, Math.round((expenseAmount / activeGoalTarget) * 100 * 10) / 10);

  const handleSelectAvoidable = (avoidable) => {
    setIsAvoidable(avoidable);
    if (avoidable) {
      // Trigger smooth fade-in and slide-up for the reason form
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        })
      ]).start();
    } else {
      // If marked as NOT avoidable, immediately finalize with no reason
      Keyboard.dismiss();
      handleFinalize(false, "");
    }
  };

  const handleFinalize = async (avoidable, reflectionReason) => {
    setIsFinalizing(true);
    Keyboard.dismiss();

    // Automatically determine transaction details
    const now = new Date();
    const day = now.getDate();
    const monthsAbbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthAbbr = monthsAbbr[now.getMonth()];
    const formattedDate = `${day} ${monthAbbr}`; // e.g. "17 Jun"

    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const monthName = monthNames[now.getMonth()];
    const monthLabel = `${monthName} 2026`; // Sync with dashboard timelines

    const activeCategory = CATEGORIES.find(c => c.name === category) || { icon: "grid" };

    const newTransaction = {
      id: String(Date.now()),
      title: merchant,
      category: category,
      amount: -expenseAmount,
      date: formattedDate,
      icon: activeCategory.icon,
      monthLabel: monthLabel,
      avoidable: avoidable,
      reason: reflectionReason.trim()
    };

    const updatedUser = {
      ...user,
      onboarding: {
        ...onboarding,
        currentBalance: newBalance.toString()
      },
      customTransactions: [newTransaction, ...(user.customTransactions || [])]
    };

    try {
      // 1. Call backend to persist updated balance
      const balanceResponse = await fetch("http://192.168.1.4:5000/update_allowance_savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id || user.userId,
          savingsProgressAmount: onboarding.savingsProgressAmount || 0,
          currentBalance: newBalance.toString(),
          savingsProgress2: onboarding.savingsProgress2 || 2200,
          savingsProgress3: onboarding.savingsProgress3 || 3000,
        })
      });

      if (!balanceResponse.ok) {
        console.log("Database balance sync failed");
      }

      // 2. Call backend to save transaction details
      const txResponse = await fetch("http://192.168.1.4:5000/add_transaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id || user.userId,
          title: merchant,
          category: category,
          amount: -expenseAmount,
          date: formattedDate,
          icon: activeCategory.icon,
          monthLabel: monthLabel,
          avoidable: avoidable,
          reason: reflectionReason.trim()
        })
      });

      if (!txResponse.ok) {
        console.log("Database transaction save failed");
      }
    } catch (err) {
      console.log("Database sync network failure:", err);
    } finally {
      setIsFinalizing(false);
      // Navigate to Dashboard with updated user state
      navigation.navigate("Dashboard", { user: updatedUser });
    }
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
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Mindful Reflection</Text>
            <View style={styles.placeholderButton} />
          </View>

          {/* Minimalist Impact / Expense Summary Card */}
          {showImpact ? (
            <BlurView intensity={100} tint="dark" style={styles.impactCard}>
              <Text style={styles.impactValue}>-{impactPercent}%</Text>
              <Text style={styles.impactSublabel}>Impact on {activeGoalName}</Text>
              <Text style={styles.impactDetail}>
                ₹{expenseAmount.toLocaleString("en-IN")} expense • {cyclesEquivalent} {cycleUnit}{cyclesEquivalent === 1 ? "" : "s"} of savings
              </Text>
            </BlurView>
          ) : (
            <BlurView intensity={100} tint="dark" style={styles.impactCard}>
              <Text style={styles.impactValue}>₹{expenseAmount.toLocaleString("en-IN")}</Text>
              <Text style={styles.impactSublabel}>spent at {merchant}</Text>
              <Text style={styles.impactDetail}>
                Category: {category} • allowance adjusted
              </Text>
            </BlurView>
          )}

          {/* Was it Avoidable question */}
          <View style={styles.questionContainer}>
            <Text style={styles.questionText}>Was this purchase avoidable?</Text>
            <View style={styles.choiceRow}>
              <TouchableOpacity
                onPress={() => handleSelectAvoidable(true)}
                activeOpacity={0.8}
                style={[styles.choiceButton, isAvoidable === true && styles.choiceButtonActive]}
              >
                <Text style={[styles.choiceButtonText, isAvoidable === true && styles.choiceButtonTextActive]}>
                  Yes
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleSelectAvoidable(false)}
                activeOpacity={0.8}
                style={[styles.choiceButton, isAvoidable === false && styles.choiceButtonActive]}
              >
                <Text style={[styles.choiceButtonText, isAvoidable === false && styles.choiceButtonTextActive]}>
                  No
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Conditional Minimalist Reason Input Section */}
          {isAvoidable === true && (
            <Animated.View style={[
              styles.reasonContainer,
              { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
            ]}>
              <View style={styles.reasonInputContainer}>
                <TextInput
                  style={styles.reasonInput}
                  placeholder="Why did you buy it?"
                  placeholderTextColor="rgba(255, 255, 255, 0.25)"
                  multiline={true}
                  numberOfLines={2}
                  value={reason}
                  onChangeText={setReason}
                />
              </View>
              {/* Single Full-width Confirm Button */}
              <TouchableOpacity
                onPress={() => handleFinalize(true, reason)}
                activeOpacity={0.8}
                style={styles.submitButton}
                disabled={isFinalizing}
              >
                {isFinalizing ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>Confirm</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          )}

          {isFinalizing && isAvoidable === false && (
            <View style={{ marginTop: 24, alignItems: "center" }}>
              <ActivityIndicator size="small" color="#9D4EDD" />
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
