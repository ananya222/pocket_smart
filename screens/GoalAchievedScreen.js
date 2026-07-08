// GoalAchievedScreen.js
import { API_BASE_URL } from "../config";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  Animated,
  ScrollView,
  useWindowDimensions,
  ActivityIndicator
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundGrid from "../components/BackgroundGrid";

export default function GoalAchievedScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmallDevice = height < 700;

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

  // Animated scale value for buttons
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
      const response = await fetch(`${API_BASE_URL}/update_allowance_savings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
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
      console.log("Overflow redistribution failed:", error);
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
          remainingGoals.length === 0 ? (
            <BlurView intensity={100} tint="dark" style={styles.overflowCard}>
              <Text style={styles.overflowLabel}>EXTRA SAVINGS</Text>
              <Text style={styles.overflowAmount}>₹{overflowAmount.toLocaleString("en-IN")}</Text>
              <Text style={[styles.overflowDesc, { marginTop: 4, lineHeight: 18, textAlign: "center" }]}>
                No active goals found. Extra savings allocated to next allowance.
              </Text>
            </BlurView>
          ) : (
            <>
              <BlurView intensity={100} tint="dark" style={styles.overflowCard}>
                <Text style={styles.overflowLabel}>EXTRA SAVINGS</Text>
                <Text style={styles.overflowAmount}>₹{overflowAmount.toLocaleString("en-IN")}</Text>
                <Text style={styles.overflowDesc}>Redistribute remaining extra savings:</Text>
              </BlurView>

              {/* Options */}
              <TouchableOpacity
                onPress={() => {
                  setAllocationMode("equal");
                  setSelectedGoalId(null);
                }}
                activeOpacity={0.9}
                style={[
                  styles.optionCard,
                  allocationMode === "equal" && styles.optionCardSelected,
                  { marginBottom: 12 }
                ]}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionTitle, allocationMode === "equal" && styles.optionTitleActive]}>
                    Divide Equally
                  </Text>
                  <View style={[styles.radio, allocationMode === "equal" && styles.radioActive]}>
                    {allocationMode === "equal" && <View style={styles.radioDot} />}
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setAllocationMode("single")}
                activeOpacity={0.9}
                style={[
                  styles.optionCard,
                  allocationMode === "single" && styles.optionCardSelected,
                  { marginBottom: 16 }
                ]}
              >
                <View style={styles.optionHeader}>
                  <Text style={[styles.optionTitle, allocationMode === "single" && styles.optionTitleActive]}>
                    Allocate to One Goal
                  </Text>
                  <View style={[styles.radio, allocationMode === "single" && styles.radioActive]}>
                    {allocationMode === "single" && <View style={styles.radioDot} />}
                  </View>
                </View>
              </TouchableOpacity>

              {/* Selection list if allocate to one */}
              {allocationMode === "single" && (
                <View style={styles.goalsSelectorContainer}>
                  <Text style={styles.goalsSelectorLabel}>CHOOSE TARGET GOAL:</Text>
                  {remainingGoals.map(g => (
                    <TouchableOpacity
                      key={g.id}
                      onPress={() => setSelectedGoalId(g.id)}
                      activeOpacity={0.8}
                      style={[styles.goalRow, selectedGoalId === g.id && styles.goalRowActive]}
                    >
                      <View style={styles.goalInfo}>
                        <Text style={styles.goalName}>{g.name}</Text>
                        <Text style={styles.goalPrice}>Target: ₹{g.target?.toLocaleString("en-IN")}</Text>
                      </View>
                      <View style={[styles.checkbox, selectedGoalId === g.id && styles.checkboxActive]}>
                        {selectedGoalId === g.id && <Feather name="check" size={10} color="#FFFFFF" />}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </>
          )
        ) : null}

        {/* Bottom CTA Action Button */}
        <TouchableOpacity
          onPress={handleConfirm}
          onPressIn={() => handlePressIn(confirmScale)}
          onPressOut={() => handlePressOut(confirmScale)}
          disabled={isUpdating || (overflowAmount > 0 && remainingGoals.length > 0 && allocationMode === "single" && !selectedGoalId)}
          activeOpacity={1}
          style={styles.confirmButtonContainer}
        >
          <Animated.View style={[styles.buttonScaleWrapper, buttonScaleStyle(confirmScale)]}>
            <View style={styles.confirmButtonSolid}>
              {isUpdating ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.confirmButtonText}>Continue</Text>
              )}
            </View>
          </Animated.View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#111210"
  },
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: "center"
  },
  heading: {
    fontSize: 22,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
    marginBottom: 8
  },
  subtitle: {
    fontSize: 13,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 18,
    paddingHorizontal: 10
  },
  overflowCard: {
    width: "100%",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 20
  },
  overflowLabel: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 1,
    marginBottom: 6
  },
  overflowAmount: {
    fontSize: 32,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
    marginBottom: 8
  },
  overflowDesc: {
    fontSize: 12,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular"
  },
  optionCard: {
    width: "100%",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    overflow: "hidden"
  },
  optionCardSelected: {
    borderColor: "rgba(106, 201, 122, 0.4)",
    backgroundColor: "rgba(106, 201, 122, 0.04)"
  },
  optionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  optionTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular"
  },
  optionTitleActive: {
    color: "#9D4EDD"
  },
  radio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#8A90A8",
    justifyContent: "center",
    alignItems: "center"
  },
  radioActive: {
    borderColor: "#9D4EDD"
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9D4EDD"
  },
  goalsSelectorContainer: {
    width: "100%",
    marginTop: 8,
    marginBottom: 16
  },
  goalsSelectorLabel: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4
  },
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8
  },
  goalRowActive: {
    borderColor: "rgba(106, 201, 122, 0.4)",
    backgroundColor: "rgba(106, 201, 122, 0.02)"
  },
  goalInfo: {
    flex: 1
  },
  goalName: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular"
  },
  goalPrice: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 2
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxActive: {
    borderColor: "#9D4EDD",
    backgroundColor: "#9D4EDD"
  },
  confirmButtonContainer: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 16
  },
  buttonScaleWrapper: {
    flex: 1
  },
  confirmButtonSolid: {
    flex: 1,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5
  }
});
