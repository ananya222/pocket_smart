import { auth, firestore } from "../../../../config";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
  Animated,
  ScrollView,
  ActivityIndicator,
  Modal
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundGrid from "../../../../components/BackgroundGrid/BackgroundGrid";
import { styles } from "./AllocationScreen.styles";
import AllocationOptionCard from "./components/AllocationOptionCard";
import AllocationGoalSelector from "./components/AllocationGoalSelector";
import AllocationConfirmButton from "./components/AllocationConfirmButton";
import AllocationSuccessModal from "./components/AllocationSuccessModal";
import AllocationNoActiveGoalsCard from "./components/AllocationNoActiveGoalsCard";

export default function AllocationScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  // Extract navigation parameters
  const { user, savedAmount, newAllowance, newFrequency, goals: rawGoals } = route.params || {};
  const onboarding = user?.onboarding || {};

  // Normalize goal properties to handle both backend and frontend keys
  const goals = (rawGoals || []).map(g => {
    const idVal = g.id !== undefined ? String(g.id) : (g.goal_id !== undefined ? String(g.goal_id) : "");
    const progressVal = g.progressAmount !== undefined ? g.progressAmount : (g.progress !== undefined ? g.progress : 0);
    const targetVal = parseFloat(String(g.target !== undefined ? g.target : (g.targetAmount !== undefined ? g.targetAmount : (g.target_amount || 0))).replace(/,/g, "")) || 1000;
    return {
      ...g,
      id: idVal,
      progressAmount: progressVal,
      target: targetVal
    };
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [allocationMode, setAllocationMode] = useState("equal"); // "equal" or "single"
  const [selectedGoalId, setSelectedGoalId] = useState(null); // id of goal to allocate to ("1", "2", or "3")
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [tempUpdatedUser, setTempUpdatedUser] = useState(null);

  // Animated scale values for buttons
  const confirmScale = useRef(new Animated.Value(1)).current;

  const buttonScaleStyle = (scaleVar) => ({
    transform: [{ scale: scaleVar }]
  });

  const handlePressIn = (scaleVar) => {
    Animated.spring(scaleVar, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = (scaleVar) => {
    Animated.spring(scaleVar, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  // Filter active goals (goals that are not yet achieved)
  const activeAllocationGoals = (goals || []).filter(g => g.progressAmount < g.target);
  const activeCount = activeAllocationGoals.length;

  const handleConfirm = async () => {
    if (!user || !user.id) {
      Alert.alert("Session Error", "User session not found. Please log in again.");
      return;
    }

    if (activeAllocationGoals.length > 0 && allocationMode === "single" && !selectedGoalId) {
      Alert.alert("Selection Required", "Please select a goal to allocate your savings towards.");
      return;
    }

    setIsUpdating(true);

    const cleanTarget1 = parseFloat(String(onboarding.targetAmount || "").replace(/,/g, "")) || 8000;
    const currentSavingsProgress1 = parseInt(String(onboarding.savingsProgressAmount || 0).replace(/[^0-9]/g, ""), 10) || 0;
    const currentSavingsProgress2 = parseInt(String(onboarding.savingsProgress2 !== undefined && onboarding.savingsProgress2 !== null ? onboarding.savingsProgress2 : 2200).replace(/[^0-9]/g, ""), 10) || 2200;
    const currentSavingsProgress3 = parseInt(String(onboarding.savingsProgress3 !== undefined && onboarding.savingsProgress3 !== null ? onboarding.savingsProgress3 : 3000).replace(/[^0-9]/g, ""), 10) || 3000;

    let added1 = 0;
    let added2 = 0;
    let added3 = 0;

    const unfinishedGoals = [];
    if (currentSavingsProgress1 < cleanTarget1) unfinishedGoals.push("1");
    if (currentSavingsProgress2 < 5499) unfinishedGoals.push("2");
    if (currentSavingsProgress3 < 15000) unfinishedGoals.push("3");

    if (activeAllocationGoals.length > 0) {
      if (allocationMode === "equal") {
        const splitCount = unfinishedGoals.length || 1;
        const splitAmount = Math.round(savedAmount / splitCount);
        
        if (unfinishedGoals.includes("1")) added1 = splitAmount;
        if (unfinishedGoals.includes("2")) added2 = splitAmount;
        if (unfinishedGoals.includes("3")) added3 = splitAmount;
      } else if (allocationMode === "single") {
        if (selectedGoalId === "1") {
          added1 = savedAmount;
        } else if (selectedGoalId === "2") {
          added2 = savedAmount;
        } else if (selectedGoalId === "3") {
          added3 = savedAmount;
        }
      }
    }

    const newSavingsProgress1 = currentSavingsProgress1 + added1;
    const newSavingsProgress2 = currentSavingsProgress2 + added2;
    const newSavingsProgress3 = currentSavingsProgress3 + added3;

    // Construct dynamic goals progress update list
    const goalsProgress = [];
    if (activeAllocationGoals.length > 0) {
      if (allocationMode === "equal") {
        const splitCount = activeAllocationGoals.length || 1;
        const splitAmount = Math.round(savedAmount / splitCount);
        activeAllocationGoals.forEach(g => {
          goalsProgress.push({
            id: g.id,
            progress: (g.progressAmount || 0) + splitAmount
          });
        });
      } else if (allocationMode === "single") {
        const targetGoal = goals.find(g => g.id === selectedGoalId);
        if (targetGoal) {
          goalsProgress.push({
            id: selectedGoalId,
            progress: (targetGoal.progressAmount || 0) + savedAmount
          });
        }
      }
    }

    // If no active allocation goals exist, add savedAmount directly to the new allowance balance
    const finalBalance = activeAllocationGoals.length === 0 ? newAllowance + savedAmount : newAllowance;

    try {
      const userUid = user.id || user.userId || route.params?.user?.id || auth().currentUser?.uid;
      if (userUid) {
        // 1. Update user's current balance, allowance, frequency, and cycle limit
        await firestore().collection("users").doc(userUid).update({
          "onboarding.current_balance": String(finalBalance),
          "onboarding.allowance_amount": String(newAllowance),
          "onboarding.allowance_frequency": newFrequency || onboarding.frequency,
          "onboarding.cycle_limit": String(finalBalance),
          "onboarding.last_refreshed": firestore.FieldValue.serverTimestamp()
        });

        // 2. Update progress for each goal
        const goalsRef = firestore().collection("users").doc(userUid).collection("goals");
        for (const gp of goalsProgress) {
          await goalsRef.doc(String(gp.id)).update({
            progress: gp.progress
          });
        }

        const updatedUser = {
          ...user,
          onboarding: {
            ...onboarding,
            currentBalance: finalBalance,
            allowance: newAllowance.toLocaleString("en-IN"),
            frequency: newFrequency || onboarding.frequency,
            savingsProgressAmount: newSavingsProgress1,
            savingsProgress2: newSavingsProgress2,
            savingsProgress3: newSavingsProgress3,
            cycleLimit: finalBalance
          },
        };

        // Check if any goal is completed JUST NOW (transitioned from incomplete to complete)
        let completedGoal = null;
        let overflowVal = 0;

        if (activeAllocationGoals.length > 0 && goals && goals.length > 0) {
          for (let g of goals) {
            const currentProgress = g.progressAmount || 0;
            const target = g.target || 0;
            
            let added = 0;
            if (allocationMode === "equal") {
              const splitCount = activeAllocationGoals.length || 1;
              added = Math.round(savedAmount / splitCount);
            } else if (allocationMode === "single" && selectedGoalId === g.id) {
              added = savedAmount;
            }

            const newProgress = currentProgress + added;
            const wasAchieved = currentProgress >= target;
            const isAchievedNow = newProgress >= target;

            if (!wasAchieved && isAchievedNow) {
              completedGoal = {
                id: g.id,
                name: g.name,
                target: target,
                newProgress: newProgress
              };
              overflowVal = newProgress - target;
              break;
            }
          }
        }

        if (completedGoal) {
          navigation.navigate("GoalAchieved", {
            user: updatedUser,
            achievedGoal: completedGoal,
            overflowAmount: overflowVal,
            newAllowance: finalBalance,
            newSavingsProgress1: newSavingsProgress1,
            newSavingsProgress2: newSavingsProgress2,
            newSavingsProgress3: newSavingsProgress3,
            goals: goals,
            allocationMode: allocationMode,
            selectedGoalId: selectedGoalId
          });
        } else {
          setTempUpdatedUser(updatedUser);
          setIsSuccessModalVisible(true);
        }
      } else {
        Alert.alert("Allocation Failed", "No authenticated user session found.");
      }
    } catch (error) {
      
      const updatedUser = {
        ...user,
        onboarding: {
          ...onboarding,
          currentBalance: finalBalance,
          allowance: newAllowance.toLocaleString("en-IN"),
          frequency: newFrequency || onboarding.frequency,
          savingsProgressAmount: newSavingsProgress1,
          savingsProgress2: newSavingsProgress2,
          savingsProgress3: newSavingsProgress3,
          cycleLimit: finalBalance
        },
      };

      let completedGoal = null;
      let overflowVal = 0;

      if (activeAllocationGoals.length > 0 && goals && goals.length > 0) {
        for (let g of goals) {
          const currentProgress = g.progressAmount || 0;
          const target = g.target || 0;
          
          let added = 0;
          if (allocationMode === "equal") {
            const splitCount = activeAllocationGoals.length || 1;
            added = Math.round(savedAmount / splitCount);
          } else if (allocationMode === "single" && selectedGoalId === g.id) {
            added = savedAmount;
          }

          const newProgress = currentProgress + added;
          const wasAchieved = currentProgress >= target;
          const isAchievedNow = newProgress >= target;

          if (!wasAchieved && isAchievedNow) {
            completedGoal = {
              id: g.id,
              name: g.name,
              target: target,
              newProgress: newProgress
            };
            overflowVal = newProgress - target;
            break;
          }
        }
      }

      if (completedGoal) {
        navigation.navigate("GoalAchieved", {
          user: updatedUser,
          achievedGoal: completedGoal,
          overflowAmount: overflowVal,
          newAllowance: finalBalance,
          newSavingsProgress1: newSavingsProgress1,
          newSavingsProgress2: newSavingsProgress2,
          newSavingsProgress3: newSavingsProgress3,
          goals: goals,
          allocationMode: allocationMode,
          selectedGoalId: selectedGoalId
        });
      } else {
        setTempUpdatedUser(updatedUser);
        setIsSuccessModalVisible(true);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDismissSuccess = () => {
    setIsSuccessModalVisible(false);
    if (tempUpdatedUser) {
      navigation.navigate("Dashboard", { user: tempUpdatedUser });
    }
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <BackgroundGrid type="onboarding_complete" />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContainer,
          { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Allowance Refreshed</Text>
        <Text style={styles.subtitle}>
          You saved ₹{savedAmount?.toLocaleString("en-IN")} this {newFrequency === "Weekly" ? "week" : "month"}! How would you like to allocate it?
        </Text>

        {/* Mode Selector Option Cards */}
        {activeAllocationGoals.length === 0 ? (
          <>
            <AllocationNoActiveGoalsCard />

            {/* Bottom CTA Action Button */}
            <AllocationConfirmButton
              onPress={handleConfirm}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isUpdating}
              isUpdating={isUpdating}
              title="Continue"
              buttonScaleStyle={buttonScaleStyle}
              confirmScale={confirmScale}
              containerStyle={{ marginTop: 24 }}
            />
          </>
        ) : (
          <>
            {/* Mode 1: Equal Split */}
            <AllocationOptionCard
              title="Divide Equally"
              description={activeCount === 1 
                ? `Puts the entire ₹${savedAmount?.toLocaleString("en-IN")} amount into the 1 remaining active goal.`
                : `Splits ₹${savedAmount?.toLocaleString("en-IN")} evenly across the ${activeCount} remaining active goals (₹${Math.round(savedAmount / activeCount).toLocaleString("en-IN")} each).`}
              iconType="material"
              iconName="arrow-split-vertical"
              isSelected={allocationMode === "equal"}
              onPress={() => {
                setAllocationMode("equal");
                setSelectedGoalId(null);
              }}
            />

            {/* Mode 2: Single Target */}
            <AllocationOptionCard
              title="Allocate to One Goal"
              description={`Puts the entire ₹${savedAmount?.toLocaleString("en-IN")} amount towards one specific target goal of your choice.`}
              iconType="feather"
              iconName="target"
              isSelected={allocationMode === "single"}
              onPress={() => setAllocationMode("single")}
              containerStyle={{ marginBottom: 16 }}
            />

            {/* Goal Selector (displays if Single target is chosen) */}
            {allocationMode === "single" && (
              <AllocationGoalSelector
                activeAllocationGoals={activeAllocationGoals}
                selectedGoalId={selectedGoalId}
                onSelectGoal={setSelectedGoalId}
              />
            )}

            {/* Bottom CTA Action Button */}
            <AllocationConfirmButton
              onPress={handleConfirm}
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              disabled={isUpdating}
              isUpdating={isUpdating}
              title="Save & Apply Allocation"
              buttonScaleStyle={buttonScaleStyle}
              confirmScale={confirmScale}
            />
          </>
        )}
      </ScrollView>

      {/* Success Modal */}
      <AllocationSuccessModal
        visible={isSuccessModalVisible}
        onDismiss={handleDismissSuccess}
        message={activeAllocationGoals.length === 0 
          ? `₹${savedAmount?.toLocaleString("en-IN")} allocated to next allowance.` 
          : (allocationMode === "single" 
              ? `₹${savedAmount?.toLocaleString("en-IN")} committed to ${goals?.find(g => g.id === selectedGoalId)?.name || "goal"}.` 
              : `₹${savedAmount?.toLocaleString("en-IN")} committed to goals.`)}
      />
    </View>
  );
}


