import { auth, firestore } from "../../../../config";
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
import { getStyles } from "./ExpenseReflectionScreen.styles";
import BackgroundGrid from "../../../../components/BackgroundGrid/BackgroundGrid";
import ExpenseReflectionHeader from "./components/ExpenseReflectionHeader";
import ExpenseReflectionImpactSummary from "./components/ExpenseReflectionImpactSummary";
import ExpenseReflectionAvoidablePrompt from "./components/ExpenseReflectionAvoidablePrompt";
import ExpenseReflectionReasonSelector from "./components/ExpenseReflectionReasonSelector";
// Force Metro Cache Invalidation to reload stylesheets: 2026-06-25T10:35:57


const CATEGORIES = [
  { name: "Food & Drinks", icon: "coffee" },
  { name: "Shopping", icon: "shopping-bag" },
  { name: "Transport", icon: "map-pin" },
  { name: "Bills & Utilities", icon: "file-text" },
  { name: "Entertainment", icon: "film" },
  { name: "Misc", icon: "grid" }
];

const AVOIDABLE_REASONS = {
  "Food & Drinks": [
    "Ordered takeout / delivery",
    "Impulse coffee / cafe run",
    "Ate out instead of cooking",
    "Bought expensive snacks / sodas"
  ],
  "Shopping": [
    "Bought on impulse / sale trap",
    "Fast fashion / clothes I don't need",
    "Upgraded working gadget too early",
    "Aesthetic decor / lifestyle item"
  ],
  "Transport": [
    "Took cab instead of public transit",
    "Premium ride upgrade (Uber XL/Comfort)",
    "Late, so had to rush in a cab",
    "Could have walked / cycled"
  ],
  "Bills & Utilities": [
    "Forgot to cancel unused trial/sub",
    "Late fee for delayed payment",
    "Exceeded mobile data / talktime limit",
    "Paid premium price for priority delivery"
  ],
  "Entertainment": [
    "Impulse movie/gig ticket purchase",
    "In-game purchase / digital cosmetics",
    "Cover charge / drinks at venue",
    "Paid for subscription I barely use"
  ],
  "Misc": [
    "Gave in to peer pressure spend",
    "Convenience charge / last minute fee",
    "Forgot to bring my own bag/bottle",
    "Vague purchase I didn't plan for"
  ]
};

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
      const userUid = user.id || user.userId || route.params?.user?.id || auth().currentUser?.uid;
      if (!userUid) return;
      
      const goalsSnap = await firestore()
        .collection("users")
        .doc(userUid)
        .collection("goals")
        .get();
        
      const goalsList = [];
      goalsSnap.forEach((doc) => {
        const g = doc.data();
        const targetNum = parseFloat(String(g.target_amount).replace(/,/g, "")) || 1000;
        const progressAmount = parseFloat(String(g.progress).replace(/,/g, "")) || 0;
        
        goalsList.push({
          ...g,
          id: doc.id,
          progress_amount: progressAmount,
          target_amount: targetNum,
          is_active: g.is_active
        });
      });

      const active = goalsList.filter(g => {
        const targetNum = parseFloat(String(g.target_amount).replace(/,/g, "")) || 1000;
        const isGoalActive = g.is_active === 1;
        const progressPercent = Math.round((g.progress_amount / targetNum) * 100);
        return progressPercent < 100 && isGoalActive;
      });
      
      const sortedActive = active.sort((a, b) => {
        const pA = a.priority !== undefined && a.priority !== null ? parseInt(String(a.priority), 10) : 3;
        const pB = b.priority !== undefined && b.priority !== null ? parseInt(String(b.priority), 10) : 3;
        if (pA !== pB) {
          return pA - pB;
        }
        const tA = parseFloat(String(a.target_amount).replace(/,/g, "")) || 1000;
        const tB = parseFloat(String(b.target_amount).replace(/,/g, "")) || 1000;
        if (tA !== tB) {
          return tB - tA;
        }
        return a.name.localeCompare(b.name);
      });
      setActiveGoals(sortedActive);
      setHasLoadedGoals(true);
    } catch (e) {
      console.error("Error fetching goals in reflection:", e);
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

  const cycleDays = frequency === "Weekly" ? 7 : 30;
  const savingsPerCycle = activeGoalTarget / (timeToReach || 6);
  const delayDays = Math.max(1, Math.round((expenseAmount / savingsPerCycle) * cycleDays));
  const impactPercent = Math.min(100, Math.round((expenseAmount / activeGoalTarget) * 100 * 10) / 10);
  const options = AVOIDABLE_REASONS[category] || AVOIDABLE_REASONS["Misc"];

  // Future value compound interest calculation (10% over 10 years)
  const futureValueNum = Math.round(expenseAmount * Math.pow(1.10, 10));
  const formattedFutureValue = futureValueNum.toLocaleString("en-IN");
  const formattedExpenseAmount = expenseAmount.toLocaleString("en-IN");

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
      const userUid = user.id || user.userId || route.params?.user?.id || auth().currentUser?.uid;
      if (userUid) {
        // Update user's wallet balance
        await firestore().collection("users").doc(userUid).update({
          "onboarding.current_balance": newBalance.toString()
        });

        // Add transaction document
        await firestore()
          .collection("users")
          .doc(userUid)
          .collection("transactions")
          .add({
            title: merchant,
            category: category,
            amount: -expenseAmount,
            date: formattedDate,
            icon: activeCategory.icon,
            monthLabel: monthLabel,
            avoidable: avoidable,
            reason: reflectionReason.trim(),
            created_at: firestore.FieldValue.serverTimestamp()
          });
      }
    } catch (error) {
      console.error("Error saving transaction reflection:", error);
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
          <ExpenseReflectionHeader isSmallDevice={isSmallDevice} navigation={navigation} />

          <ExpenseReflectionImpactSummary 
            isSmallDevice={isSmallDevice}
            showImpact={showImpact}
            delayDays={delayDays}
            activeGoalName={activeGoalName}
            formattedExpenseAmount={formattedExpenseAmount}
            formattedFutureValue={formattedFutureValue}
            merchant={merchant}
            category={category}
          />

          <ExpenseReflectionAvoidablePrompt 
            isSmallDevice={isSmallDevice}
            isAvoidable={isAvoidable}
            onSelectAvoidable={handleSelectAvoidable}
          />

          <ExpenseReflectionReasonSelector 
            isSmallDevice={isSmallDevice}
            isAvoidable={isAvoidable}
            fadeAnim={fadeAnim}
            slideAnim={slideAnim}
            options={options}
            reason={reason}
            setReason={setReason}
            handleFinalize={handleFinalize}
            isFinalizing={isFinalizing}
          />

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
