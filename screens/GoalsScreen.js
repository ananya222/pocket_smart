// GoalsScreen.js
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
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundGrid from "../components/BackgroundGrid";

export default function GoalsScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
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
        iconType: selectedIcon,
        image: selectedGoalImage,
        isActive: true
      }
    ];
    return goalsList;
  });

  const fetchGoals = async () => {
    try {
      const userId = user.id || user.userId || route.params?.user?.id;
      if (!userId) return;
      const response = await fetch(`http://192.168.1.4:5000/get_goals?userId=${userId}`);
      const data = await response.json();
      if (response.ok && data.goals) {
        const mapped = data.goals.map((g) => {
          const targetNum = parseFloat(String(g.target_amount).replace(/,/g, "")) || 1000;
          const progressPercent = Math.min(100, Math.round((g.progress_amount / targetNum) * 100));
          return {
            id: String(g.id),
            name: g.name,
            target: targetNum,
            progressAmount: g.progress_amount,
            progressPercent: progressPercent,
            timeLeft: g.time_to_reach 
              ? `${g.time_to_reach} ${frequency === "Weekly" ? (g.time_to_reach === 1 ? "week" : "weeks") : (g.time_to_reach === 1 ? "month" : "months")} left`
              : "2 weeks left",
            iconType: getGoalIconType(g.name),
            image: g.image_url,
            isActive: g.is_active === 1
          };
        });
        setDbGoals(mapped);
      }
    } catch (err) {
      console.log("Fetch goals failed:", err);
    }
  };

  React.useEffect(() => {
    fetchGoals();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchGoals();
    });
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
              const userId = user.id || user.userId || route.params?.user?.id;
              if (!userId) return;
              const response = await fetch("http://192.168.1.4:5000/delete_goal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, goalId })
              });
              const data = await response.json();
              if (response.ok) {
                fetchGoals();
              } else {
                Alert.alert("Failed", data.error || "Could not delete goal.");
              }
            } catch (err) {
              console.log("Delete goal failed:", err);
              Alert.alert("Error", "Network error. Could not delete goal.");
            }
          }
        }
      ]
    );
  };

  const ongoingGoals = dbGoals.filter(g => g.progressAmount < g.target);
  const completedGoals = dbGoals.filter(g => g.progressAmount >= g.target);

  const renderGoalIcon = (iconType, image) => {
    if (image) {
      return (
        <Image 
          source={{ uri: image }} 
          style={{ width: 32, height: 32, borderRadius: 8, resizeMode: "cover" }} 
        />
      );
    }
    if (iconType === "headphones") {
      return (
        <Image 
          source={require("../assets/images/savings_headphones.png")} 
          style={{ width: 32, height: 32, borderRadius: 8, resizeMode: "contain" }} 
        />
      );
    }
    if (iconType === "gamepad") {
      return (
        <MaterialCommunityIcons name="gamepad-variant" size={20} color={accentColor} />
      );
    }
    if (iconType === "bicycle") {
      return (
        <MaterialCommunityIcons name="bicycle" size={20} color={accentColor} />
      );
    }
    return (
      <Feather name="target" size={18} color={accentColor} />
    );
  };

  // Helper to check if text is a URL
  const isUrl = (text) => {
    const t = text.trim().toLowerCase();
    return t.startsWith("http://") || t.startsWith("https://") || t.startsWith("www.");
  };

  // Calculate time to reach
  const numericPrice = parseInt(String(selectedTargetAmount).replace(/[^0-9]/g, ""), 10) || 0;
  const numericContribution = parseInt(String(savingsContribution).replace(/[^0-9]/g, ""), 10) || 0;
  const timeToReach = numericContribution > 0 ? Math.ceil(numericPrice / numericContribution) : 0;

  // Animated scale values for buttons
  const backScale = useRef(new Animated.Value(1)).current;
  const updateScale = useRef(new Animated.Value(1)).current;

  const buttonScaleStyle = (scaleVar) => ({
    transform: [{ scale: scaleVar }],
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

  // Derive dynamic illustration logic
  const getSelectedIcon = () => {
    const q = selectedGoalName.toLowerCase();
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

  const selectedIcon = getSelectedIcon();

  const renderGoalIllustration = () => {
    if (selectedGoalImage) {
      return (
        <Image
          source={{ uri: selectedGoalImage }}
          style={styles.previewImage}
          resizeMode="cover"
        />
      );
    }
    if (selectedIcon === "headphones") {
      return (
        <Image
          source={require("../assets/images/savings_headphones.png")}
          style={styles.previewImage}
          resizeMode="contain"
        />
      );
    } else if (selectedIcon === "gamepad") {
      return (
        <Ionicons name="game-controller" size={32} color={accentColor} />
      );
    } else if (selectedIcon === "bicycle") {
      return (
        <MaterialCommunityIcons name="bicycle" size={32} color={accentColor} />
      );
    }
    return (
      <Feather name="target" size={28} color={accentColor} />
    );
  };

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
          contentContainerStyle={[styles.scrollContainer, { paddingTop: STATUS_BAR_HEIGHT + 20, paddingBottom: insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              onPressIn={() => handlePressIn(backScale)}
              onPressOut={() => handlePressOut(backScale)}
              activeOpacity={1}
              style={styles.backButton}
            >
              <Animated.View style={buttonScaleStyle(backScale)}>
                <Feather name="arrow-left" size={20} color="#FFFFFF" />
              </Animated.View>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Savings Goals</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("SavingsGoal", {
                user,
                allowance,
                frequency,
                savingRatio: onboarding.savingRatio || 30,
                fromDashboard: true
              })}
              activeOpacity={0.8}
              style={styles.backButton}
            >
              <Feather name="plus" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Ongoing Goals Section */}
          <Text style={styles.sectionTitle}>ONGOING GOALS</Text>
          {ongoingGoals.length > 0 ? (
            ongoingGoals.map(g => (
              <BlurView key={g.id} intensity={100} tint="dark" style={styles.goalCard}>
                <View style={styles.goalMainRow}>
                  <View style={styles.goalIconWrapper}>
                    {renderGoalIcon(g.iconType, g.image)}
                  </View>
                  <View style={styles.goalInfoContainer}>
                    <Text style={styles.goalTitle}>{g.name}</Text>
                    <Text style={styles.goalProgressText}>
                      ₹{g.progressAmount.toLocaleString("en-IN")} of ₹{g.target.toLocaleString("en-IN")}
                    </Text>
                  </View>
                  {/* Subtle Delete Goal Button */}
                  <TouchableOpacity
                    onPress={() => handleDeleteGoal(g.id, g.name)}
                    activeOpacity={0.7}
                    style={{ padding: 6, marginLeft: 8 }}
                  >
                    <Feather name="trash-2" size={16} color="#8A90A8" />
                  </TouchableOpacity>
                </View>
                {/* Progress Bar */}
                <View style={styles.goalProgressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${g.progressPercent}%`, backgroundColor: accentColor }]} />
                  </View>
                </View>
                <View style={styles.goalFooterRow}>
                  <Text style={styles.goalTimeText}>
                    {g.id === "1" && timeToReach > 0 
                      ? `${timeToReach} ${frequency === "Weekly" ? (timeToReach === 1 ? "week" : "weeks") : (timeToReach === 1 ? "month" : "months")} left` 
                      : g.id === "2" ? "5 weeks left" : "12 weeks left"}
                  </Text>
                  <Text style={[styles.goalPercentText, { color: accentColor }]}>{g.progressPercent}%</Text>
                </View>
              </BlurView>
            ))
          ) : (
            <BlurView intensity={100} tint="dark" style={[styles.goalCard, { paddingVertical: 20, alignItems: "center", justifyContent: "center" }]}>
              <Feather name="target" size={24} color="#8A90A8" style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 13, color: "#FFFFFF", fontFamily: "DMSerifDisplay-Regular" }}>No ongoing goals</Text>
              <Text style={{ fontSize: 10, color: "#8A90A8", fontFamily: "DMSerifDisplay-Regular", marginTop: 2, textAlign: "center", paddingHorizontal: 12 }}>
                You have completed all active goals! Add a new one below.
              </Text>
            </BlurView>
          )}

          {/* Completed Goals Section */}
          <Text style={[styles.sectionTitle, { marginTop: 16 }]}>COMPLETED GOALS</Text>
          {completedGoals.length > 0 ? (
            completedGoals.map(g => (
              <BlurView key={g.id} intensity={100} tint="dark" style={[styles.goalCard, { opacity: 0.8 }]}>
                <View style={styles.goalMainRow}>
                  <View style={styles.goalIconWrapper}>
                    {renderGoalIcon(g.iconType, g.image)}
                  </View>
                  <View style={styles.goalInfoContainer}>
                    <Text style={styles.goalTitle}>{g.name}</Text>
                    <Text style={styles.goalProgressText}>
                      Target: ₹{g.target.toLocaleString("en-IN")}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: "rgba(106, 201, 122, 0.1)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12 }}>
                    <Feather name="check" size={12} color={accentColor} style={{ marginRight: 4 }} />
                    <Text style={{ fontSize: 11, color: accentColor, fontFamily: "DMSerifDisplay-Regular" }}>Achieved</Text>
                  </View>
                </View>
              </BlurView>
            ))
          ) : (
            <BlurView intensity={100} tint="dark" style={[styles.goalCard, { paddingVertical: 20, alignItems: "center", justifyContent: "center" }]}>
              <Feather name="award" size={24} color="#8A90A8" style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 13, color: "#FFFFFF", fontFamily: "DMSerifDisplay-Regular" }}>No completed goals yet</Text>
              <Text style={{ fontSize: 10, color: "#8A90A8", fontFamily: "DMSerifDisplay-Regular", marginTop: 2, textAlign: "center", paddingHorizontal: 12 }}>
                Keep saving allowance to complete your active goals!
              </Text>
            </BlurView>
          )}


        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#111210",
  },
  scrollContainer: {
    paddingHorizontal: 20,
    flexGrow: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
  },
  previewCard: {
    backgroundColor: "rgba(26, 28, 25, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    overflow: "hidden",
  },
  previewImageContainer: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: "#111210",
    borderWidth: 1,
    borderColor: "#2C2D35",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  previewInfoContainer: {
    flex: 1,
    marginLeft: 14,
  },
  previewLabel: {
    fontSize: 9,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },
  previewTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
  previewPrice: {
    fontSize: 16,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
  },
  searchCard: {
    backgroundColor: "rgba(26, 28, 25, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    overflow: "hidden",
  },
  sectionTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    marginBottom: 14,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 12,
    marginBottom: 14,
  },
  searchBarContainerFocused: {
    borderColor: "#9D4EDD",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
  resultsWrapper: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.04)",
  },
  resultItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  resultImage: {
    width: 38,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#2C2D35",
  },
  resultInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  resultTitle: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
  resultSource: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 1,
  },
  resultPrice: {
    fontSize: 13,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
    marginLeft: 8,
  },
  updateButtonContainer: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    shadowColor: "#7B2CBF",
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
    marginTop: 10,
  },
  buttonScaleWrapper: {
    flex: 1,
  },
  updateButtonGradient: {
    flex: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  updateButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },
  confirmPanel: {
    width: "100%",
  },
  confirmButton: {
    flex: 1,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  confirmButtonCancel: {
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  confirmButtonConfirm: {
    backgroundColor: "#9D4EDD",
  },
  confirmButtonCancelText: {
    color: "#8A90A8",
    fontSize: 13,
    fontFamily: "DMSerifDisplay-Regular",
  },
  confirmButtonConfirmText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "DMSerifDisplay-Regular",
  },
  inputLabel: {
    fontSize: 12,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginBottom: 6,
  },
  currencyPrefix: {
    fontSize: 16,
    marginRight: 6,
    fontFamily: "DMSerifDisplay-Regular",
    color: "#8A90A8",
  },
  estimatorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(106, 201, 122, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(106, 201, 122, 0.15)",
    borderRadius: 10,
    padding: 12,
    marginTop: 16,
  },
  estimatorText: {
    flex: 1,
    fontSize: 13,
    color: "#ECEEF4",
    fontFamily: "DMSerifDisplay-Regular",
    lineHeight: 18,
  },
  estimatorHighlight: {
    color: "#9D4EDD",
  },
  goalCard: {
    backgroundColor: "rgba(26, 28, 25, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    padding: 12,
    marginBottom: 12,
  },
  goalMainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#111210",
    borderWidth: 1,
    borderColor: "#2C2D35",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  goalInfoContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
  goalProgressText: {
    fontSize: 12,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 2,
  },
  goalProgressBarContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#2C2D35",
    borderRadius: 3,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
  },
  goalFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalTimeText: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
  },
  goalPercentText: {
    fontSize: 11,
    fontFamily: "DMSerifDisplay-Regular",
  },
});