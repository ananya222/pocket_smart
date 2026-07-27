import { auth, firestore } from "../../../config";
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Image,
  useWindowDimensions,
  Alert,
  Modal,
  TextInput,
  Animated,
  StyleSheet
} from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { getStyles } from "./DashboardScreen.styles";
import BackgroundGrid from "../../../components/BackgroundGrid/BackgroundGrid";

import DashboardHeader from "./components/DashboardHeader/DashboardHeader";
import DashboardBalanceCard from "./components/DashboardBalanceCard/DashboardBalanceCard";
import DashboardGoalsCarousel from "./components/DashboardGoalsCarousel/DashboardGoalsCarousel";
import DashboardRecentTransactions from "./components/DashboardRecentTransactions/DashboardRecentTransactions";
import DashboardSidebarDrawer from "./components/DashboardSidebarDrawer/DashboardSidebarDrawer";
import DashboardBudgetModal from "./components/DashboardModals/DashboardBudgetModal";
import DashboardPasswordModal from "./components/DashboardModals/DashboardPasswordModal";
import DashboardTopUpModal from "./components/DashboardModals/DashboardTopUpModal";
// Force Metro Cache Invalidation to reload stylesheets: 2026-06-25T10:35:57


export default function DashboardScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bottomPadding = 16;
  const isSmallDevice = height < 700;
  const staticCardWidth = width - (isSmallDevice ? 80 : 90);

  const [activeGoalIndex, setActiveGoalIndex] = React.useState(0);
  const accentColor = "#9D4EDD";
  const [isAllowanceModalVisible, setIsAllowanceModalVisible] = React.useState(false);
  const [newAllowanceInput, setNewAllowanceInput] = React.useState("");
  const [dbTransactions, setDbTransactions] = React.useState([]);

  const goalsScrollViewRef = React.useRef(null);

  // Sidebar states & animated value
  const [isSidebarVisible, setIsSidebarVisible] = React.useState(false);
  const sidebarSlide = React.useRef(new Animated.Value(280)).current;
  const backdropOpacity = React.useRef(new Animated.Value(0)).current;

  const toggleSidebar = () => {
    if (isSidebarVisible) {
      Animated.parallel([
        Animated.timing(sidebarSlide, {
          toValue: 280,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        })
      ]).start(() => setIsSidebarVisible(false));
    } else {
      setIsSidebarVisible(true);
      Animated.parallel([
        Animated.timing(sidebarSlide, {
          toValue: 0,
          duration: 220,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 220,
          useNativeDriver: true,
        })
      ]).start();
    }
  };
  // Budget & Frequency Modal States (Mock Mode)
  const [isBudgetModalVisible, setIsBudgetModalVisible] = React.useState(false);
  const [tempAllowanceInput, setTempAllowanceInput] = React.useState("");
  const [tempFrequency, setTempFrequency] = React.useState("Monthly");

  const handleSaveBudgetSettings = () => {
    const cleanNew = parseFloat(tempAllowanceInput.replace(/,/g, "")) || 5000;
    setIsBudgetModalVisible(false);

    const nextOnboarding = {
      ...onboardingData,
      currentBalance: cleanNew,
      allowance: cleanNew.toLocaleString("en-IN"),
      frequency: tempFrequency
    };

    // 1. Optimistic Update (Immediate UI response)
    navigation.setParams({
      user: {
        ...user,
        onboarding: nextOnboarding
      }
    });
    setCurrentBalanceVal(cleanNew);
    setOnboardingData(nextOnboarding);
    Alert.alert("Success", "Allowance Configuration updated successfully!");

    // 2. Perform Firestore update in background (non-blocking sync)
    const userUid = user.id || user.userId || route.params?.user?.id || auth().currentUser?.uid;
    if (userUid) {
      firestore().collection("users").doc(userUid).update({
        "onboarding.allowance_amount": String(cleanNew),
        "onboarding.allowance_frequency": tempFrequency,
        "onboarding.current_balance": String(cleanNew)
      })
      .catch((err) => console.error("Error updating budget in Firestore:", err));
    }
  };

  // Change Password Modal States (Mock Mode)
  const [isPasswordModalVisible, setIsPasswordModalVisible] = React.useState(false);
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleChangePassword = () => {
    if (!oldPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
      Alert.alert("Input Required", "Please fill in all password fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Mismatch", "New passwords do not match.");
      return;
    }
    if (newPassword.length < 4) {
      Alert.alert("Weak Password", "Password must be at least 4 characters.");
      return;
    }

    try {
      const currentUser = auth().currentUser;
      if (currentUser) {
        await currentUser.updatePassword(newPassword);
        Alert.alert("Success", "Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsPasswordModalVisible(false);
      } else {
        Alert.alert("Error", "No authenticated user session found.");
      }
    } catch (error) {
      console.error(error);
      let message = "Failed to update password. Please try again.";
      if (error.code === "auth/requires-recent-login") {
        message = "For security reasons, changing your password requires logging in again.";
      }
      Alert.alert("Error", message);
    }
  };

  // Preferences Toggles & Local Persistence
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = React.useState(true);

  React.useEffect(() => {
    const loadSavedPreferences = async () => {
      try {
        const savedReminders = await AsyncStorage.getItem("dailyRemindersEnabled");
        const savedDarkMode = await AsyncStorage.getItem("darkModeEnabled");
        if (savedReminders !== null) {
          setNotificationsEnabled(savedReminders === "true");
        }
        if (savedDarkMode !== null) {
          setDarkModeEnabled(savedDarkMode === "true");
        }
      } catch {
      }
    };
    loadSavedPreferences();
  }, []);

  const handleToggleNotifications = async () => {
    const nextVal = !notificationsEnabled;
    setNotificationsEnabled(nextVal);
    try {
      await AsyncStorage.setItem("dailyRemindersEnabled", String(nextVal));
    } catch {
    }
  };

  const handleToggleDarkMode = async () => {
    const nextVal = !darkModeEnabled;
    setDarkModeEnabled(nextVal);
    try {
      await AsyncStorage.setItem("darkModeEnabled", String(nextVal));
    } catch {
    }
  };

  const styles = getStyles(isSmallDevice, darkModeEnabled);
  const sidebarStyles = getSidebarStyles(darkModeEnabled);

  // Extract user details and onboarding parameters
  const user = route.params?.user || {};
  const fullName = user.fullName || "Aarav";
  const [onboardingData, setOnboardingData] = React.useState(user.onboarding || {});

  const allowance = onboardingData.allowance || "5,000";
  const frequency = onboardingData.frequency || "Monthly";
  const goalName = onboardingData.goalName || "Sony Headphones";
  const targetAmount = onboardingData.targetAmount || "8,000";
  const timeToReach = onboardingData.timeToReach || 6;
  const goalImage = onboardingData.goalImage || null;

  // Derive first name for personalized greeting
  const firstName = fullName.split(" ")[0];

  // Available Balance State
  const [currentBalanceVal, setCurrentBalanceVal] = React.useState(() => {
    const dbBal = onboardingData.currentBalance;
    if (dbBal !== undefined && dbBal !== null) {
      const parsed = parseFloat(String(dbBal).replace(/,/g, ""));
      return !isNaN(parsed) ? parsed : 2450;
    }
    const cleanAllowance = parseFloat(String(allowance).replace(/,/g, "")) || 5000;
    return Math.round(cleanAllowance * 0.49);
  });

  // Goal Progress States
  const [savingsProgressVal, setSavingsProgressVal] = React.useState(() => {
    const dbProgress = onboardingData.savingsProgressAmount;
    return parseInt(String(dbProgress !== undefined && dbProgress !== null ? dbProgress : 0).replace(/[^0-9]/g, ""), 10) || 0;
  });

  const [savingsProgressVal2, setSavingsProgressVal2] = React.useState(() => {
    const dbVal = onboardingData.savingsProgress2;
    return dbVal !== undefined && dbVal !== null ? parseFloat(String(dbVal).replace(/,/g, "")) : 2200;
  });

  const [savingsProgressVal3, setSavingsProgressVal3] = React.useState(() => {
    const dbVal = onboardingData.savingsProgress3;
    return dbVal !== undefined && dbVal !== null ? parseFloat(String(dbVal).replace(/,/g, "")) : 3000;
  });

  // Sync state with route params user object on transition back
  // Consolidated mount & focus route parameters sync is now handled in the main useEffect below.

  // Dynamic calculations for Savings Goal
  const targetAmountStr = typeof targetAmount === "string" ? targetAmount : String(targetAmount || "");
  const cleanTarget = parseFloat(targetAmountStr.replace(/,/g, "")) || 8000;

  // Determine active icon for the user's custom goal
  const getSelectedIcon = (name) => {
    const q = name.toLowerCase();
    if (q.includes("headphones") || q.includes("sony") || q.includes("music") || q.includes("earphone") || q.includes("headset")) {
      return "headphones";
    }
    if (q.includes("controller") || q.includes("gamepad") || q.includes("ps5") || q.includes("playstation") || q.includes("xbox") || q.includes("nintendo") || q.includes("gaming")) {
      return "gamepad";
    }
    if (q.includes("bike") || q.includes("bicycle") || q.includes("cycle")) {
      return "bicycle";
    }
    if (q.includes("shoe") || q.includes("nike") || q.includes("adidas") || q.includes("sneaker") || q.includes("puma") || q.includes("jordan")) {
      return "shoe";
    }
    if (q.includes("football") || q.includes("soccer") || q.includes("ball") || q.includes("cricket") || q.includes("bat") || q.includes("sport") || q.includes("gym") || q.includes("fit")) {
      return "award";
    }
    if (q.includes("laptop") || q.includes("macbook") || q.includes("computer") || q.includes("pc") || q.includes("monitor") || q.includes("tech")) {
      return "laptop";
    }
    if (q.includes("watch") || q.includes("smartwatch") || q.includes("rolex")) {
      return "watch";
    }
    if (q.includes("book") || q.includes("novel") || q.includes("read") || q.includes("study")) {
      return "book";
    }
    if (q.includes("car") || q.includes("drive") || q.includes("vehicle")) {
      return "car";
    }
    if (q.includes("travel") || q.includes("trip") || q.includes("flight") || q.includes("vacation")) {
      return "airplane";
    }
    return "target";
  };

  const selectedIcon = getSelectedIcon(goalName);

  // Initialize dynamic goals state with the primary onboarding goal
  const [dbGoals, setDbGoals] = React.useState([
    {
      id: "1",
      name: goalName,
      target: cleanTarget,
      progressPercent: Math.min(100, Math.round((savingsProgressVal / cleanTarget) * 100)),
      progressAmount: savingsProgressVal,
      timeLeft: timeToReach 
        ? `${timeToReach} ${frequency === "Weekly" ? (timeToReach === 1 ? "week" : "weeks") : (timeToReach === 1 ? "month" : "months")} left`
        : "2 weeks left",
      iconType: selectedIcon,
      isActive: true
    }
  ]);

  React.useEffect(() => {
    const userId = user.id || user.userId || route.params?.user?.id || auth().currentUser?.uid;
    if (!userId) return;

    // 1. Listen to Onboarding / Profile changes
    const unsubOnboarding = firestore()
      .collection("users")
      .doc(userId)
      .onSnapshot((doc) => {
        if (doc.exists) {
          const userData = doc.data();
          const info = userData.onboarding || {};
          const mappedOnboarding = {
            allowance: info.allowance_amount || "5,000",
            frequency: info.allowance_frequency || "Monthly",
            currentBalance: info.current_balance !== undefined ? parseFloat(info.current_balance) : 2450,
            savingsProgressAmount: info.savings_progress_amount || 0,
            savingsProgress2: info.savings_progress_2 || 2200,
            savingsProgress3: info.savings_progress_3 || 3000,
            goalName: info.goal_name || "Savings Goal",
            targetAmount: info.target_amount || "8,000",
          };
          setOnboardingData(mappedOnboarding);
          setCurrentBalanceVal(mappedOnboarding.currentBalance);
          setSavingsProgressVal(parseInt(String(mappedOnboarding.savingsProgressAmount).replace(/[^0-9]/g, ""), 10) || 0);
          setSavingsProgressVal2(parseInt(String(mappedOnboarding.savingsProgress2).replace(/[^0-9]/g, ""), 10) || 2200);
          setSavingsProgressVal3(parseInt(String(mappedOnboarding.savingsProgress3).replace(/[^0-9]/g, ""), 10) || 3000);
        }
      }, (err) => console.error("Error listening to onboarding changes:", err));

    // 2. Listen to Goals changes
    const unsubGoals = firestore()
      .collection("users")
      .doc(userId)
      .collection("goals")
      .onSnapshot((goalsSnap) => {
        const goalsList = [];
        goalsSnap.forEach((docSnap) => {
          const g = docSnap.data();
          const targetNum = parseFloat(String(g.target_amount).replace(/,/g, "")) || 1000;
          const progressAmount = parseFloat(String(g.progress || 0).replace(/,/g, "")) || 0;
          const progressPercent = Math.min(100, Math.round((progressAmount / targetNum) * 100));
          
          goalsList.push({
            id: docSnap.id,
            name: g.name,
            target: targetNum,
            progressAmount: progressAmount,
            progressPercent: progressPercent,
            timeLeft: g.time_to_reach 
              ? `${g.time_to_reach} ${frequency === "Weekly" ? (g.time_to_reach === 1 ? "week" : "weeks") : (g.time_to_reach === 1 ? "month" : "months")} left`
              : "2 weeks left",
            iconType: getSelectedIcon(g.name),
            image: g.image_url,
            isActive: g.is_active === 1,
            priority: g.priority !== undefined && g.priority !== null ? parseInt(String(g.priority), 10) : 3
          });
        });

        const sorted = goalsList.sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority;
          }
          if (a.target !== b.target) {
            return b.target - a.target;
          }
          return a.name.localeCompare(b.name);
        });
        setDbGoals(sorted);
      }, (err) => console.error("Error listening to goals changes:", err));

    // 3. Listen to Transactions changes
    const unsubTransactions = firestore()
      .collection("users")
      .doc(userId)
      .collection("transactions")
      .orderBy("created_at", "desc")
      .onSnapshot((txSnap) => {
        const txList = [];
        txSnap.forEach((docSnap) => {
          const tx = docSnap.data();
          txList.push({
            id: docSnap.id,
            title: tx.title,
            category: tx.category,
            amount: parseFloat(tx.amount) || 0,
            date: tx.date,
            icon: tx.icon,
            monthLabel: tx.monthLabel,
            avoidable: tx.avoidable,
            reason: tx.reason
          });
        });
        setDbTransactions(txList);
      }, (err) => console.error("Error listening to transactions changes:", err));

    return () => {
      unsubOnboarding();
      unsubGoals();
      unsubTransactions();
    };
  }, [navigation, user.id]);

  const activeCarouselGoals = dbGoals.filter(g => g.progressPercent < 100);

  const handleLogout = () => {
    // Navigate back to Login and reset routing
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }]
    });
  };

  const handleSimulateRollover = async () => {
    try {
      const userId = user.id || user.userId || route.params?.user?.id || auth().currentUser?.uid;
      if (!userId) return;

      await firestore().collection("users").doc(userId).update({
        "onboarding.last_refreshed": firestore.FieldValue.serverTimestamp()
      });
      Alert.alert("Success", "Simulated cycle end. Refreshing dashboard...");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to simulate rollover");
    }
  };

  const handleConfirmAllowance = () => {
    const inputAmt = parseFloat(newAllowanceInput.replace(/,/g, "")) || 0;
    if (inputAmt <= 0) {
      Alert.alert("Invalid Amount", "Please enter an amount greater than zero.");
      return;
    }
    
    setIsAllowanceModalVisible(false);
    setNewAllowanceInput("");

    const newBalance = currentBalanceVal + inputAmt;
    const newAllowanceLimit = cleanAllowance + inputAmt;

    const nextOnboarding = {
      ...onboardingData,
      currentBalance: newBalance,
      allowance: newAllowanceLimit.toLocaleString("en-IN")
    };

    // 1. Optimistic Update (Immediate UI response)
    navigation.setParams({
      user: {
        ...user,
        onboarding: nextOnboarding
      }
    });
    setCurrentBalanceVal(newBalance);
    setOnboardingData(nextOnboarding);
    Alert.alert("Success", `₹${inputAmt.toLocaleString("en-IN")} successfully added to your current ${frequency.toLowerCase()} allowance!`);

    // 2. Perform Firestore update in background (non-blocking sync)
    const userId = user.id || user.userId || route.params?.user?.id || auth().currentUser?.uid;
    if (userId) {
      firestore().collection("users").doc(userId).update({
        "onboarding.current_balance": String(newBalance),
        "onboarding.allowance_amount": String(newAllowanceLimit)
      })
      .catch((err) => console.error("Error updating allowance in Firestore:", err));
    }
  };

    const getUniqueTransactions = (dbList, localList) => {
    const combined = [...(dbList || [])];
    (localList || []).forEach(localTx => {
      const exists = combined.some(dbTx => 
        dbTx.title === localTx.title &&
        Math.abs(dbTx.amount) === Math.abs(localTx.amount) &&
        dbTx.date === localTx.date &&
        dbTx.category === localTx.category
      );
      if (!exists) {
        combined.push(localTx);
      }
    });
    return combined;
  };

  const transactions = getUniqueTransactions(dbTransactions, user.customTransactions)
    .map(tx => ({
      ...tx,
      iconColor: "#9D4EDD" // Standard brand accent color for custom transaction icons
    }))
    .slice(0, 7);

  // Dynamic calculations for Available Balance
  const allowanceStr = typeof allowance === "string" ? allowance : String(allowance || "");
  const cycleLimitStr = typeof onboardingData.cycleLimit === "string" ? onboardingData.cycleLimit : String(onboardingData.cycleLimit || "");
  const cleanAllowance = parseFloat(allowanceStr.replace(/,/g, "")) || 5000;
  
  // Use cycleLimit from backend, default to configured allowance, but ensure it is at least equal to the current balance
  const dynamicAllowanceLimit = Math.max(
    cleanAllowance,
    currentBalanceVal,
    parseFloat(cycleLimitStr.replace(/,/g, "")) || 0
  );
  const spent = Math.max(0, dynamicAllowanceLimit - currentBalanceVal);
  const formattedBalance = currentBalanceVal.toLocaleString("en-IN");
  const formattedAllowance = dynamicAllowanceLimit.toLocaleString("en-IN");
  const formattedSpent = spent.toLocaleString("en-IN");
  const usedPercent = Math.round((spent / (dynamicAllowanceLimit || 1)) * 100);

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={{ flex: 1 }}>
      <StatusBar barStyle={darkModeEnabled ? "light-content" : "dark-content"} backgroundColor={darkModeEnabled ? "#111210" : "#F4F5F7"} />
      <BackgroundGrid type="dashboard" />

      <ScrollView
        style={{ flex: 1, backgroundColor: "transparent" }}
        contentContainerStyle={[styles.scrollContainer, { paddingBottom: bottomPadding }]}
        showsVerticalScrollIndicator={false}
      >
        <DashboardHeader
          firstName={firstName}
          onMenuPress={toggleSidebar}
          darkModeEnabled={darkModeEnabled}
          isSmallDevice={isSmallDevice}
        />

        <DashboardBalanceCard
          formattedBalance={formattedBalance}
          formattedAllowance={formattedAllowance}
          formattedSpent={formattedSpent}
          usedPercent={usedPercent}
          darkModeEnabled={darkModeEnabled}
          isSmallDevice={isSmallDevice}
          accentColor={accentColor}
          onTopUpPress={() => setIsAllowanceModalVisible(true)}
        />

        <DashboardGoalsCarousel
          activeCarouselGoals={activeCarouselGoals}
          activeGoalIndex={activeGoalIndex}
          setActiveGoalIndex={setActiveGoalIndex}
          goalsScrollViewRef={goalsScrollViewRef}
          staticCardWidth={staticCardWidth}
          isSmallDevice={isSmallDevice}
          darkModeEnabled={darkModeEnabled}
          accentColor={accentColor}
          navigation={navigation}
          user={user}
          timeToReach={timeToReach}
          cleanTarget={cleanTarget}
          frequency={frequency}
        />

        <DashboardRecentTransactions
          transactions={transactions}
          darkModeEnabled={darkModeEnabled}
          isSmallDevice={isSmallDevice}
          accentColor={accentColor}
          navigation={navigation}
          user={user}
        />
      </ScrollView>

      <DashboardTopUpModal
        isVisible={isAllowanceModalVisible}
        onClose={() => setIsAllowanceModalVisible(false)}
        onConfirm={handleConfirmAllowance}
        newAllowanceInput={newAllowanceInput}
        setNewAllowanceInput={setNewAllowanceInput}
        frequency={frequency}
        width={width}
        accentColor={accentColor}
        darkModeEnabled={darkModeEnabled}
      />

      <DashboardBudgetModal
        isVisible={isBudgetModalVisible}
        onClose={() => setIsBudgetModalVisible(false)}
        onSave={handleSaveBudgetSettings}
        tempAllowanceInput={tempAllowanceInput}
        setTempAllowanceInput={setTempAllowanceInput}
        tempFrequency={tempFrequency}
        setTempFrequency={setTempFrequency}
        darkModeEnabled={darkModeEnabled}
        sidebarStyles={sidebarStyles}
      />

      <DashboardPasswordModal
        isVisible={isPasswordModalVisible}
        onClose={() => setIsPasswordModalVisible(false)}
        onChangePassword={handleChangePassword}
        oldPassword={oldPassword}
        setOldPassword={setOldPassword}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        darkModeEnabled={darkModeEnabled}
        sidebarStyles={sidebarStyles}
      />

    </SafeAreaView>



    <DashboardSidebarDrawer
      isSidebarVisible={isSidebarVisible}
      toggleSidebar={toggleSidebar}
      sidebarSlide={sidebarSlide}
      backdropOpacity={backdropOpacity}
      sidebarStyles={sidebarStyles}
      darkModeEnabled={darkModeEnabled}
      firstName={firstName}
      fullName={fullName}
      user={user}
      navigation={navigation}
      allowance={allowance}
      frequency={frequency}
      onSetAllowancePress={() => {
        setTempAllowanceInput(allowance);
        setTempFrequency(frequency);
        setIsBudgetModalVisible(true);
      }}
      onSecurityPress={() => setIsPasswordModalVisible(true)}
      onLogoutPress={handleLogout}
      notificationsEnabled={notificationsEnabled}
      onToggleNotifications={handleToggleNotifications}
      onToggleDarkMode={handleToggleDarkMode}
      onSimulateRollover={handleSimulateRollover}
    />

  </View>
  );
}

function getSidebarStyles(isDarkMode) {
  const colors = {
    bg: isDarkMode ? "rgba(17, 18, 16, 0.95)" : "rgba(244, 245, 247, 0.95)",
    border: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.08)",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111210",
    textSecondary: isDarkMode ? "#8A90A8" : "#5A607F",
    divider: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)",
    sectionLabel: isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.4)",
    toggleBg: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
    modalContentBg: isDarkMode ? "rgba(26, 28, 25, 0.9)" : "rgba(255, 255, 255, 0.95)",
    inputBg: isDarkMode ? "rgba(17, 18, 16, 0.68)" : "#FFFFFF",
    cancelBtnBg: isDarkMode ? "rgba(17, 18, 16, 0.68)" : "#E5E7EB",
  };

  return StyleSheet.create({
    overlayContainer: {
      ...StyleSheet.absoluteFillObject,
      zIndex: 999,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    drawerPanel: {
      position: "absolute",
      right: 0,
      top: 0,
      bottom: 0,
      width: 280,
      backgroundColor: colors.bg,
      borderLeftWidth: 1,
      borderLeftColor: colors.border,
    },
    drawerBlur: {
      flex: 1,
    },
    drawerContainer: {
      flex: 1,
      paddingHorizontal: 20,
    },
    profileHeader: {
      alignItems: "center",
      paddingBottom: 24,
    },
    avatarWrapper: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: "#9D4EDD",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    avatarText: {
      color: "#FFFFFF",
      fontSize: 20,
      fontWeight: "bold",
    },
    profileName: {
      fontSize: 15,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
      textAlign: "center",
    },
    profileEmail: {
      fontSize: 11,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      marginTop: 2,
      textAlign: "center",
    },
    divider: {
      height: 1,
      backgroundColor: colors.border,
      marginBottom: 12,
    },
    menuScrollView: {
      paddingBottom: 40,
    },
    menuSectionLabel: {
      fontSize: 9,
      color: colors.sectionLabel,
      fontFamily: "DMSerifDisplay-Regular",
      letterSpacing: 1.2,
      marginTop: 18,
      marginBottom: 8,
    },
    menuItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 12,
    },
    menuIcon: {
      marginRight: 12,
      width: 18,
      textAlign: "center",
    },
    menuItemText: {
      fontSize: 13,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
    },
    menuDivider: {
      height: 1,
      backgroundColor: colors.divider,
      marginVertical: 12,
    },
    prefItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: 12,
    },
    toggleContainer: {
      width: 32,
      height: 18,
      borderRadius: 9,
      backgroundColor: colors.toggleBg,
      justifyContent: "center",
      paddingHorizontal: 2,
    },
    toggleActive: {
      backgroundColor: "#9D4EDD",
    },
    toggleDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.textSecondary,
    },
    toggleDotActive: {
      backgroundColor: "#FFFFFF",
      alignSelf: "flex-end",
    },
    modalBackdrop: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.6)",
    },
    modalContent: {
      width: "88%",
      borderRadius: 24,
      padding: 24,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.modalContentBg,
    },
    modalTitle: {
      fontSize: 18,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
      textAlign: "center",
      marginBottom: 6,
    },
    modalSubtitle: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      textAlign: "center",
      marginBottom: 20,
    },
    fieldLabel: {
      fontSize: 9,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      letterSpacing: 0.8,
      marginBottom: 8,
      marginLeft: 4,
    },
    modalInputRow: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.inputBg,
      borderRadius: 12,
      paddingHorizontal: 14,
      borderWidth: 1,
      borderColor: colors.border,
      height: 46,
      marginBottom: 20,
    },
    modalCurrency: {
      fontSize: 15,
      marginRight: 6,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
    },
    modalInput: {
      flex: 1,
      height: "100%",
      fontSize: 14,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
    },
    modalTextInputField: {
      flex: 1,
      height: "100%",
      fontSize: 13,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
    },
    frequencyRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 24,
    },
    frequencyButton: {
      flex: 1,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.inputBg,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 4,
    },
    frequencyButtonActive: {
      backgroundColor: "rgba(157, 78, 221, 0.15)",
      borderColor: "#9D4EDD",
    },
    frequencyText: {
      fontSize: 13,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
    },
    frequencyTextActive: {
      color: "#9D4EDD",
      fontWeight: "bold",
    },
    modalButtonsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 10,
    },
    modalCancelButton: {
      flex: 1,
      height: 42,
      borderRadius: 21,
      backgroundColor: colors.cancelBtnBg,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 8,
    },
    modalCancelButtonText: {
      color: colors.textSecondary,
      fontSize: 13,
      fontFamily: "DMSerifDisplay-Regular",
    },
    modalSaveButton: {
      flex: 1,
      height: 42,
      borderRadius: 21,
      backgroundColor: "#9D4EDD",
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 8,
    },
    modalSaveButtonText: {
      color: "#FFFFFF",
      fontSize: 13,
      fontFamily: "DMSerifDisplay-Regular",
    },
  });
}
