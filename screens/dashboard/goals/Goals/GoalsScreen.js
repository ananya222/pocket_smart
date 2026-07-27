import { auth, firestore } from "../../../../config";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Alert,
  Animated,
  ActivityIndicator,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundGrid from "../../../../components/BackgroundGrid/BackgroundGrid";
import { styles } from "./GoalsScreen.styles";

import Header from "./components/Header";
import GoalCard from "./components/GoalCard";
import EmptyState from "./components/EmptyState";

export default function GoalsScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bottomPadding = 16;
  const isSmallDevice = height < 700;

  const user = route.params?.user || {};
  const onboarding = user.onboarding || {};
  const currentGoalName = onboarding.goalName || "Savings Goal";
  const currentTargetAmount = onboarding.targetAmount || "8,000";
  const currentGoalImage = onboarding.goalImage || null;
  const cleanTarget = parseFloat(String(currentTargetAmount).replace(/,/g, "")) || 8000;

  // Extract budget/frequency context
  const allowance = onboarding.allowance || "5,000";
  const frequency = onboarding.frequency || "Monthly";
  const savingRatio = onboarding.savingRatio !== undefined ? onboarding.savingRatio : 30;

  // Calculate default savings contribution
  const cleanAllowance = parseFloat(String(allowance).replace(/,/g, "")) || 5000;
  const initialContribution = Math.round((cleanAllowance * savingRatio) / 100);

  // State variables
  const accentColor = "#9D4EDD";

  const [savingsProgressVal, setSavingsProgressVal] = useState(() => {
    const dbProgress = onboarding.savingsProgressAmount;
    return parseInt(String(dbProgress !== undefined && dbProgress !== null ? dbProgress : 0).replace(/[^0-9]/g, ""), 10) || 0;
  });
  const [savingsProgressVal2, setSavingsProgressVal2] = useState(() => {
    const dbVal = onboarding.savingsProgress2;
    return dbVal !== undefined && dbVal !== null ? parseFloat(String(dbVal).replace(/,/g, "")) : 2200;
  });
  const [savingsProgressVal3, setSavingsProgressVal3] = useState(() => {
    const dbVal = onboarding.savingsProgress3;
    return dbVal !== undefined && dbVal !== null ? parseFloat(String(dbVal).replace(/,/g, "")) : 3000;
  });

  const [selectedGoalName, setSelectedGoalName] = useState(currentGoalName);
  const [selectedTargetAmount, setSelectedTargetAmount] = useState(currentTargetAmount);
  const [selectedGoalImage, setSelectedGoalImage] = useState(currentGoalImage);
  const [savingsContribution, setSavingsContribution] = useState(initialContribution.toLocaleString("en-IN"));
  const [isUpdating, setIsUpdating] = useState(false);
  const [isNameFocused, setIsNameFocused] = useState(false);
  const [isPriceFocused, setIsPriceFocused] = useState(false);
  const [isContributionFocused, setIsContributionFocused] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeFetchingUrl, setActiveFetchingUrl] = useState("");

  const getGoalIconType = (name) => {
    if (!name) return "default";
    const q = name.toLowerCase();
    if (q.includes("headphones") || q.includes("sony") || q.includes("earphone") || q.includes("headset")) {
      return "headphones";
    }
    if (q.includes("controller") || q.includes("ps5") || q.includes("playstation") || q.includes("game") || q.includes("gamepad") || q.includes("xbox")) {
      return "gamepad";
    }
    if (q.includes("bicycle") || q.includes("bike") || q.includes("cycle")) {
      return "bicycle";
    }
    return "default";
  };

  const [dbGoals, setDbGoals] = useState(() => {
    const goalsList = [
      {
        id: "1",
        name: currentGoalName,
        target: cleanTarget,
        progressAmount: savingsProgressVal,
        progressPercent: Math.min(100, Math.round((savingsProgressVal / cleanTarget) * 100)),
        iconType: getGoalIconType(currentGoalName),
        image: selectedGoalImage,
        isActive: true
      }
    ];
    return goalsList;
  });

  React.useEffect(() => {
    const userUid = user.id || user.userId || route.params?.user?.id || auth().currentUser?.uid;
    if (!userUid) return;

    const unsubscribe = firestore()
      .collection("users")
      .doc(userUid)
      .collection("goals")
      .onSnapshot((goalsSnap) => {
        const mapped = [];
        goalsSnap.forEach((doc) => {
          const g = doc.data();
          const targetNum = parseFloat(String(g.target_amount).replace(/,/g, "")) || 1000;
          const progressAmount = parseFloat(String(g.progress || 0).replace(/,/g, "")) || 0;
          const progressPercent = Math.min(100, Math.round((progressAmount / targetNum) * 100));
          mapped.push({
            id: doc.id,
            name: g.name,
            target: targetNum,
            progressAmount: progressAmount,
            progressPercent: progressPercent,
            timeLeft: g.time_to_reach 
              ? `${g.time_to_reach} ${frequency === "Weekly" ? (g.time_to_reach === 1 ? "week" : "weeks") : (g.time_to_reach === 1 ? "month" : "months")} left`
              : "2 weeks left",
            iconType: getGoalIconType(g.name),
            image: g.image_url,
            isActive: g.is_active === 1
          });
        });
        setDbGoals(mapped);
      }, (err) => console.error("Error listening to goals changes:", err));

    return unsubscribe;
  }, [navigation, user.id]);

  const handleDeleteGoal = (goalId, goalName) => {
    Alert.alert(
      "Delete Goal",
      `Are you sure you want to delete "${goalName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          style: "destructive", 
          onPress: async () => {
            try {
              const userUid = user.id || user.userId || route.params?.user?.id || auth().currentUser?.uid;
              if (userUid) {
                await firestore()
                  .collection("users")
                  .doc(userUid)
                  .collection("goals")
                  .doc(goalId)
                  .delete();
              }
            } catch (err) {
              console.error(err);
              Alert.alert("Error", "Could not delete goal.");
            }
          }
        }
      ]
    );
  };

  const ongoingGoals = dbGoals.filter(g => g.progressAmount < g.target);
  const completedGoals = dbGoals.filter(g => g.progressAmount >= g.target);

  // Helper to check if text is a URL
  const isUrl = (text) => {
    const t = text.trim().toLowerCase();
    return t.startsWith("http://") || t.startsWith("https://") || t.startsWith("www.");
  };

  // Calculate time to reach
  const numericPrice = parseInt(String(selectedTargetAmount).replace(/[^0-9]/g, ""), 10) || 0;
  const numericContribution = parseInt(String(savingsContribution).replace(/[^0-9]/g, ""), 10) || 0;
  const timeToReach = numericContribution > 0 ? Math.ceil(numericPrice / numericContribution) : 0;


  // Helper to map keyword to premium Unsplash image URL
  const getCategoryImage = (name) => {
    if (!name) return "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=60";
    const q = name.toLowerCase().trim();
    if (q.includes("shoe") || q.includes("nike") || q.includes("adidas") || q.includes("sneaker") || q.includes("puma") || q.includes("jordan")) {
      return "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=60";
    }
    if (q.includes("football") || q.includes("soccer") || q.includes("ball") || q.includes("cricket") || q.includes("bat")) {
      if (q.includes("cricket")) {
        return "https://images.unsplash.com/photo-1531415080290-bc98545ab2ef?w=400&auto=format&fit=crop&q=60";
      }
      return "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=400&auto=format&fit=crop&q=60";
    }
    if (q.includes("headphones") || q.includes("sony") || q.includes("music") || q.includes("earphone") || q.includes("airpods") || q.includes("headset")) {
      return "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&auto=format&fit=crop&q=60";
    }
    if (q.includes("controller") || q.includes("gamepad") || q.includes("ps5") || q.includes("playstation") || q.includes("xbox") || q.includes("nintendo") || q.includes("gaming")) {
      return "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?w=400&auto=format&fit=crop&q=60";
    }
    if (q.includes("bike") || q.includes("bicycle") || q.includes("cycle")) {
      return "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=60";
    }
    if (q.includes("laptop") || q.includes("macbook") || q.includes("computer") || q.includes("pc")) {
      return "https://images.unsplash.com/photo-1496181130204-7552cc14ac1a?w=400&auto=format&fit=crop&q=60";
    }
    if (q.includes("watch") || q.includes("smartwatch") || q.includes("rolex")) {
      return "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&auto=format&fit=crop&q=60";
    }
    if (q.includes("book") || q.includes("novel") || q.includes("read")) {
      return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=60";
    }
    return "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=400&auto=format&fit=crop&q=60";
  };

  // Submit Goal Update navigation to confirmation screen
  const handleUpdateGoal = async () => {
    const finalGoalName = selectedGoalName.trim();
    const finalTargetAmount = selectedTargetAmount.trim();
    const finalGoalImage = selectedGoalImage || getCategoryImage(finalGoalName);
    const finalContribution = savingsContribution.trim();

    if (!finalGoalName) {
      Alert.alert("Input Required", "Please enter a name for your savings goal.");
      return;
    }
    if (!finalTargetAmount || finalTargetAmount === "0") {
      Alert.alert("Input Required", "Please enter a target price.");
      return;
    }
    if (!finalContribution || finalContribution === "0") {
      Alert.alert("Input Required", "Please enter a savings contribution.");
      return;
    }

    const finalNumericPrice = parseInt(finalTargetAmount.replace(/[^0-9]/g, ""), 10) || 0;
    const finalNumericContribution = parseInt(finalContribution.replace(/[^0-9]/g, ""), 10) || 0;
    const calculatedTimeToReach = Math.ceil(finalNumericPrice / finalNumericContribution);

    navigation.navigate("ConfirmGoal", {
      user,
      goalName: finalGoalName,
      targetAmount: finalTargetAmount,
      goalImage: finalGoalImage,
      timeToReach: calculatedTimeToReach,
    });
  };

  // Status Bar Height calculations
  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <BackgroundGrid type="goals" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContainer, { paddingTop: STATUS_BAR_HEIGHT + 20, paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row */}
          <Header
            onBackPress={() => navigation.goBack()}
            onAddPress={() => navigation.navigate("SavingsGoal", {
              user,
              allowance,
              frequency,
              savingRatio: onboarding.savingRatio || 30,
              fromDashboard: true
            })}
          />

          {/* Ongoing Goals Section */}
          <Text style={styles.sectionTitle}>ONGOING GOALS</Text>
          {ongoingGoals.length > 0 ? (
            ongoingGoals.map(g => (
              <GoalCard 
                key={g.id} 
                goal={g} 
                isCompleted={false}
                onDelete={handleDeleteGoal}
                timeToReach={timeToReach}
                frequency={frequency}
                accentColor={accentColor}
              />
            ))
          ) : (
            <EmptyState type="ongoing" />
          )}

          {/* Completed Goals Section */}
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>COMPLETED GOALS</Text>
          {completedGoals.length > 0 ? (
            completedGoals.map(g => (
              <GoalCard 
                key={g.id} 
                goal={g} 
                isCompleted={true}
                timeToReach={timeToReach}
                frequency={frequency}
                accentColor={accentColor}
              />
            ))
          ) : (
            <EmptyState type="completed" />
          )}


        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

