// AllocationScreen.js
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
  ActivityIndicator,
  Modal
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundGrid from "../components/BackgroundGrid";

export default function AllocationScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmallDevice = height < 700;

  // Extract navigation parameters
  const { user, savedAmount, newAllowance, newFrequency, goals } = route.params || {};
  const onboarding = user?.onboarding || {};

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
            id: parseInt(g.id, 10),
            progress: (g.progressAmount || 0) + splitAmount
          });
        });
      } else if (allocationMode === "single") {
        const targetGoal = goals.find(g => g.id === selectedGoalId);
        if (targetGoal) {
          goalsProgress.push({
            id: parseInt(selectedGoalId, 10),
            progress: (targetGoal.progressAmount || 0) + savedAmount
          });
        }
      }
    }

    // If no active allocation goals exist, add savedAmount directly to the new allowance balance
    const finalBalance = activeAllocationGoals.length === 0 ? newAllowance + savedAmount : newAllowance;

    try {
      const response = await fetch("http://192.168.1.4:5000/update_allowance_savings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          savingsProgressAmount: newSavingsProgress1,
          currentBalance: finalBalance,
          savingsProgress2: newSavingsProgress2,
          savingsProgress3: newSavingsProgress3,
          goalsProgress: goalsProgress,
          allowance: finalBalance,
          frequency: newFrequency || onboarding.frequency
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Create updated onboarding details for the frontend session
        const updatedUser = {
          ...user,
          onboarding: {
            ...onboarding,
            currentBalance: finalBalance,
            allowance: finalBalance.toLocaleString("en-IN"),
            frequency: newFrequency || onboarding.frequency,
            savingsProgressAmount: newSavingsProgress1,
            savingsProgress2: newSavingsProgress2,
            savingsProgress3: newSavingsProgress3,
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
        Alert.alert("Allocation Failed", data.error || "Failed to update savings.");
      }
    } catch (error) {
      console.log("Savings allocation request failed (Mock Mode Fallback):", error);
      
      const updatedUser = {
        ...user,
        onboarding: {
          ...onboarding,
          currentBalance: finalBalance,
          allowance: finalBalance.toLocaleString("en-IN"),
          frequency: newFrequency || onboarding.frequency,
          savingsProgressAmount: newSavingsProgress1,
          savingsProgress2: newSavingsProgress2,
          savingsProgress3: newSavingsProgress3,
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
          You saved ₹{savedAmount?.toLocaleString("en-IN")} this time! How would you like to allocate it?
        </Text>

        {/* Mode Selector Option Cards */}
        {activeAllocationGoals.length === 0 ? (
          <>
            <BlurView intensity={100} tint="dark" style={[styles.optionCard, { paddingVertical: 24, alignItems: "center" }]}>
              <Feather name="info" size={24} color="#8A90A8" style={{ marginBottom: 8 }} />
              <Text style={[styles.optionTitle, { textAlign: "center" }]}>NO ACTIVE GOALS</Text>
              <Text style={[styles.optionDescription, { marginTop: 6, fontSize: 13, lineHeight: 20, textAlign: "center" }]}>
                No active goals found. Extra savings allocated to next allowance.
              </Text>
            </BlurView>

            {/* Bottom CTA Action Button */}
            <TouchableOpacity
              onPress={handleConfirm}
              onPressIn={() => handlePressIn(confirmScale)}
              onPressOut={() => handlePressOut(confirmScale)}
              disabled={isUpdating}
              activeOpacity={1}
              style={[styles.confirmButtonContainer, { marginTop: 24 }]}
            >
              <Animated.View style={[styles.buttonScaleWrapper, buttonScaleStyle(confirmScale)]}>
                <LinearGradient
                  colors={["#9D4EDD", "#7B2CBF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmButtonGradient}
                >
                  {isUpdating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Continue</Text>
                  )}
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </>
        ) : (
          <>
            {/* Mode 1: Equal Split */}
            <TouchableOpacity
              onPress={() => {
                setAllocationMode("equal");
                setSelectedGoalId(null);
              }}
              activeOpacity={0.9}
              style={{ width: "100%", marginBottom: 12 }}
            >
              <BlurView
                intensity={100}
                tint="dark"
                style={[
                  styles.optionCard,
                  allocationMode === "equal" && styles.optionCardSelected
                ]}
              >
                <View style={styles.optionHeaderRow}>
                  <View style={styles.optionTitleBlock}>
                    <MaterialCommunityIcons name="arrow-split-vertical" size={22} color={allocationMode === "equal" ? "#9D4EDD" : "#8A90A8"} />
                    <Text style={[styles.optionTitle, allocationMode === "equal" && styles.optionTitleActive]}>
                      Divide Equally
                    </Text>
                  </View>
                  <View style={[styles.radioCircle, allocationMode === "equal" && styles.radioCircleActive]}>
                    {allocationMode === "equal" && <View style={styles.radioDot} />}
                  </View>
                </View>
                <Text style={styles.optionDescription}>
                  {activeCount === 1 
                    ? `Puts the entire ₹${savedAmount?.toLocaleString("en-IN")} amount into the 1 remaining active goal.`
                    : `Splits ₹${savedAmount?.toLocaleString("en-IN")} evenly across the ${activeCount} remaining active goals (₹${Math.round(savedAmount / activeCount).toLocaleString("en-IN")} each).`
                  }
                </Text>
              </BlurView>
            </TouchableOpacity>

            {/* Mode 2: Single Target */}
            <TouchableOpacity
              onPress={() => setAllocationMode("single")}
              activeOpacity={0.9}
              style={{ width: "100%", marginBottom: 16 }}
            >
              <BlurView
                intensity={100}
                tint="dark"
                style={[
                  styles.optionCard,
                  allocationMode === "single" && styles.optionCardSelected
                ]}
              >
                <View style={styles.optionHeaderRow}>
                  <View style={styles.optionTitleBlock}>
                    <Feather name="target" size={20} color={allocationMode === "single" ? "#9D4EDD" : "#8A90A8"} />
                    <Text style={[styles.optionTitle, allocationMode === "single" && styles.optionTitleActive]}>
                      Allocate to One Goal
                    </Text>
                  </View>
                  <View style={[styles.radioCircle, allocationMode === "single" && styles.radioCircleActive]}>
                    {allocationMode === "single" && <View style={styles.radioDot} />}
                  </View>
                </View>
                <Text style={styles.optionDescription}>
                  Puts the entire ₹{savedAmount?.toLocaleString("en-IN")} amount towards one specific target goal of your choice.
                </Text>
              </BlurView>
            </TouchableOpacity>

            {/* Goal Selector (displays if Single target is chosen) */}
            {allocationMode === "single" && (
              <View style={styles.goalsSelectorContainer}>
                <Text style={styles.goalsSelectorLabel}>CHOOSE TARGET GOAL:</Text>
                {activeAllocationGoals.map((g) => (
                  <TouchableOpacity
                    key={g.id}
                    onPress={() => setSelectedGoalId(g.id)}
                    activeOpacity={0.8}
                    style={[
                      styles.goalSelectRow,
                      selectedGoalId === g.id && styles.goalSelectRowActive
                    ]}
                  >
                    <View style={styles.goalSelectInfo}>
                      <Text style={styles.goalSelectName}>{g.name}</Text>
                      <Text style={styles.goalSelectPrice}>Target: ₹{g.target?.toLocaleString("en-IN")}</Text>
                    </View>
                    <View style={[styles.checkCircle, selectedGoalId === g.id && styles.checkCircleActive]}>
                      {selectedGoalId === g.id && <Feather name="check" size={14} color="#FFFFFF" />}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Bottom CTA Action Button */}
            <TouchableOpacity
              onPress={handleConfirm}
              onPressIn={() => handlePressIn(confirmScale)}
              onPressOut={() => handlePressOut(confirmScale)}
              disabled={isUpdating}
              activeOpacity={1}
              style={styles.confirmButtonContainer}
            >
              <Animated.View style={[styles.buttonScaleWrapper, buttonScaleStyle(confirmScale)]}>
                <LinearGradient
                  colors={["#9D4EDD", "#7B2CBF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.confirmButtonGradient}
                >
                  {isUpdating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Save & Apply Allocation</Text>
                  )}
                </LinearGradient>
              </Animated.View>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>

      {/* Success Modal */}
      <Modal
        transparent
        visible={isSuccessModalVisible}
        animationType="fade"
        onRequestClose={handleDismissSuccess}
      >
        <View style={styles.modalBg}>
          <BlurView intensity={90} tint="dark" style={styles.modalContent}>
            <Feather name="check-circle" size={48} color="#9D4EDD" style={{ marginBottom: 16 }} />
            <Text style={styles.modalTitle}>Savings Allocated</Text>
            <Text style={styles.modalMessage}>
              {activeAllocationGoals.length === 0 
                ? `₹${savedAmount?.toLocaleString("en-IN")} allocated to next allowance.` 
                : (allocationMode === "single" 
                    ? `₹${savedAmount?.toLocaleString("en-IN")} committed to ${goals?.find(g => g.id === selectedGoalId)?.name || "goal"}.` 
                    : `₹${savedAmount?.toLocaleString("en-IN")} committed to goals.`)}
            </Text>

            <TouchableOpacity onPress={handleDismissSuccess} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Done</Text>
            </TouchableOpacity>
          </BlurView>
        </View>
      </Modal>
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
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 10
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
  optionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  optionTitleBlock: {
    flexDirection: "row",
    alignItems: "center"
  },
  optionTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    marginLeft: 8
  },
  optionTitleActive: {
    color: "#9D4EDD"
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#8A90A8",
    justifyContent: "center",
    alignItems: "center"
  },
  radioCircleActive: {
    borderColor: "#9D4EDD"
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9D4EDD"
  },
  optionDescription: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    lineHeight: 16,
    marginTop: 4
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
  goalSelectRow: {
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
  goalSelectRowActive: {
    borderColor: "rgba(106, 201, 122, 0.4)",
    backgroundColor: "rgba(106, 201, 122, 0.02)"
  },
  goalSelectInfo: {
    flex: 1
  },
  goalSelectName: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular"
  },
  goalSelectPrice: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 2
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center"
  },
  checkCircleActive: {
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
  confirmButtonGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5
  },
  modalBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  modalContent: {
    width: "80%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(26, 28, 25, 0.9)"
  },
  modalTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    marginBottom: 8,
    textAlign: "center"
  },
  modalMessage: {
    fontSize: 13,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20
  },
  modalButton: {
    width: "100%",
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9D4EDD",
    justifyContent: "center",
    alignItems: "center"
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "DMSerifDisplay-Regular"
  }
});
