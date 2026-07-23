import { apiFetch } from "../../../../config";
import React, { useState } from "react";
import {
  View,
  Text,
  StatusBar,
  Alert,
  ScrollView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundGrid from "../../../../components/BackgroundGrid/BackgroundGrid";
import { styles } from "./GoalAchievedScreen.styles";

import OverflowCard from "./components/OverflowCard/OverflowCard";
import AllocationOptions from "./components/AllocationOptions/AllocationOptions";
import GoalsSelector from "./components/GoalsSelector/GoalsSelector";
import ActionButton from "./components/ActionButton/ActionButton";

export default function GoalAchievedScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  // Extract navigation parameters
  const {
    user,
    achievedGoal,
    overflowAmount,
    newAllowance,
    newSavingsProgress1,
    newSavingsProgress2,
    newSavingsProgress3,
    goals
  } = route.params || {};

  const onboarding = user?.onboarding || {};
  const [isUpdating, setIsUpdating] = useState(false);
  const [allocationMode, setAllocationMode] = useState("equal"); // "equal" or "single"
  const [selectedGoalId, setSelectedGoalId] = useState(null); // id of goal to allocate to ("1", "2", or "3")

  // Get remaining active goals dynamically (excluding the one just achieved)
  const remainingGoals = (goals || []).filter(
    g => g.id !== achievedGoal.id && (g.progressAmount || 0) < g.target
  );

  const handleConfirm = async () => {
    setIsUpdating(true);

    // Set achieved goal progress to exactly its target, and redistribute overflow
    let p1 = newSavingsProgress1;
    let p2 = newSavingsProgress2;
    let p3 = newSavingsProgress3;

    // First clamp the achieved goal to its target
    if (achievedGoal.name === onboarding.goalName) {
      p1 = achievedGoal.target;
    } else if (achievedGoal.id === "2" || achievedGoal.name === "PS5 Controller") {
      p2 = achievedGoal.target;
    } else if (achievedGoal.id === "3" || achievedGoal.name === "Mountain Bike") {
      p3 = achievedGoal.target;
    }

    const goalsProgress = [
      { id: parseInt(achievedGoal.id, 10), progress: achievedGoal.target }
    ];

    let finalBalance = newAllowance;

    if (overflowAmount > 0) {
      if (remainingGoals.length === 0) {
        // No other active goals found, allocate the overflow directly to the next allowance balance
        finalBalance = newAllowance + overflowAmount;
      } else {
        if (allocationMode === "equal") {
          const splitAmount = Math.round(overflowAmount / remainingGoals.length);
          remainingGoals.forEach(g => {
            const newProg = (g.progressAmount || 0) + splitAmount;
            goalsProgress.push({ id: parseInt(g.id, 10), progress: newProg });
            if (g.name === onboarding.goalName) {
              p1 = newProg;
            } else if (g.id === "2" || g.name === "PS5 Controller") {
              p2 = newProg;
            } else if (g.id === "3" || g.name === "Mountain Bike") {
              p3 = newProg;
            }
          });
        } else if (allocationMode === "single" && selectedGoalId) {
          remainingGoals.forEach(g => {
            const added = g.id === selectedGoalId ? overflowAmount : 0;
            const newProg = (g.progressAmount || 0) + added;
            goalsProgress.push({ id: parseInt(g.id, 10), progress: newProg });
            if (g.name === onboarding.goalName) {
              p1 = newProg;
            } else if (g.id === "2" || g.name === "PS5 Controller") {
              p2 = newProg;
            } else if (g.id === "3" || g.name === "Mountain Bike") {
              p3 = newProg;
            }
          });
        }
      }
    }

    try {
      const response = await apiFetch("/update_allowance_savings", {
        method: "POST",
        body: JSON.stringify({
          savingsProgressAmount: p1,
          currentBalance: finalBalance,
          savingsProgress2: p2,
          savingsProgress3: p3,
          goalsProgress: goalsProgress,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = {
          ...user,
          onboarding: {
            ...onboarding,
            currentBalance: finalBalance,
            savingsProgressAmount: p1,
            savingsProgress2: p2,
            savingsProgress3: p3,
          }
        };

        navigation.navigate("Dashboard", {
          user: updatedUser,
          showUpdateGoalAlert: false,
        });
      } else {
        Alert.alert("Error", data.error || "Failed to update savings.");
      }
    } catch (error) {
      Alert.alert("Connection Error", "Could not connect to the backend server.");
    } finally {
      setIsUpdating(false);
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
        <Feather name="award" size={54} color="#9D4EDD" style={{ marginBottom: 16 }} />
        <Text style={styles.heading}>{achievedGoal?.name} Completed!</Text>
        <Text style={styles.subtitle}>
          You have fully saved ₹{achievedGoal?.target?.toLocaleString("en-IN")} for this goal.
        </Text>

        {overflowAmount > 0 ? (
          <>
            <OverflowCard 
              overflowAmount={overflowAmount} 
              remainingGoalsCount={remainingGoals.length} 
            />

            {remainingGoals.length > 0 && (
              <>
                <AllocationOptions 
                  allocationMode={allocationMode}
                  setAllocationMode={setAllocationMode}
                  setSelectedGoalId={setSelectedGoalId}
                />

                {/* Selection list if allocate to one */}
                {allocationMode === "single" && (
                  <GoalsSelector 
                    remainingGoals={remainingGoals}
                    selectedGoalId={selectedGoalId}
                    setSelectedGoalId={setSelectedGoalId}
                  />
                )}
              </>
            )}
          </>
        ) : null}

        {/* Bottom CTA Action Button */}
        <ActionButton 
          onPress={handleConfirm}
          disabled={isUpdating || (overflowAmount > 0 && remainingGoals.length > 0 && allocationMode === "single" && !selectedGoalId)}
          isUpdating={isUpdating}
        />
      </ScrollView>
    </View>
  );
}


