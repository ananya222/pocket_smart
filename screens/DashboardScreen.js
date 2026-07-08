import { API_BASE_URL } from "../config";
// DashboardScreen.js
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  SafeAreaView,
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
import { getStyles } from "../styles/DashboardScreen.styles";
import BackgroundGrid from "../components/BackgroundGrid";
// Force Metro Cache Invalidation to reload stylesheets: 2026-06-25T10:35:57


export default function DashboardScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
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

  const renderDrawerContent = () => {
    const iconColor = darkModeEnabled ? "#8A90A8" : "#5A607F";
    return (
      <View style={sidebarStyles.drawerContainer}>
        {/* Top Spacer to prevent status bar clipping */}
        <View style={{ height: Platform.OS === "ios" ? 75 : 70 }} />

        {/* Profile Header */}
        <View style={sidebarStyles.profileHeader}>
          <View style={sidebarStyles.avatarWrapper}>
            <Text style={sidebarStyles.avatarText}>{firstName[0]?.toUpperCase() || "A"}</Text>
          </View>
          <Text style={sidebarStyles.profileName} numberOfLines={1}>{fullName}</Text>
          <Text style={sidebarStyles.profileEmail} numberOfLines={1}>{user.email || "user@pocketsmart.com"}</Text>
        </View>

        {/* Divider */}
        <View style={sidebarStyles.divider} />

        {/* Menu List */}
        <ScrollView contentContainerStyle={sidebarStyles.menuScrollView} showsVerticalScrollIndicator={false}>
          
          <Text style={sidebarStyles.menuSectionLabel}>MENU</Text>

          <TouchableOpacity 
            style={sidebarStyles.menuItem} 
            activeOpacity={0.7}
            onPress={() => { toggleSidebar(); setTempAllowanceInput(allowance); setTempFrequency(frequency); setIsBudgetModalVisible(true); }}
          >
            <Feather name="sliders" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
            <Text style={sidebarStyles.menuItemText}>Allowance Configuration</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={sidebarStyles.menuItem} 
            activeOpacity={0.7}
            onPress={() => { toggleSidebar(); navigation.navigate("Goals", { user }); }}
          >
            <Feather name="target" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
            <Text style={sidebarStyles.menuItemText}>Savings Goals</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={sidebarStyles.menuItem} 
            activeOpacity={0.7}
            onPress={() => { toggleSidebar(); navigation.navigate("Insights", { user }); }}
          >
            <Feather name="bar-chart-2" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
            <Text style={sidebarStyles.menuItemText}>Spending Insights</Text>
          </TouchableOpacity>

          <View style={sidebarStyles.menuDivider} />

          <Text style={sidebarStyles.menuSectionLabel}>PREFERENCES</Text>
          
          <View style={sidebarStyles.prefItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="bell" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
              <Text style={sidebarStyles.menuItemText}>Daily Reminders</Text>
            </View>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleToggleNotifications} 
              style={[sidebarStyles.toggleContainer, notificationsEnabled && sidebarStyles.toggleActive]}
            >
              <View style={[sidebarStyles.toggleDot, notificationsEnabled && sidebarStyles.toggleDotActive]} />
            </TouchableOpacity>
          </View>

          <View style={sidebarStyles.prefItem}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Feather name="moon" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
              <Text style={sidebarStyles.menuItemText}>Dark Mode</Text>
            </View>
            <TouchableOpacity 
              activeOpacity={0.8}
              onPress={handleToggleDarkMode} 
              style={[sidebarStyles.toggleContainer, darkModeEnabled && sidebarStyles.toggleActive]}
            >
              <View style={[sidebarStyles.toggleDot, darkModeEnabled && sidebarStyles.toggleDotActive]} />
            </TouchableOpacity>
          </View>

          <View style={sidebarStyles.menuDivider} />

          <Text style={sidebarStyles.menuSectionLabel}>SECURITY</Text>

          <TouchableOpacity 
            style={sidebarStyles.menuItem} 
            activeOpacity={0.7}
            onPress={() => { toggleSidebar(); setIsPasswordModalVisible(true); }}
          >
            <Feather name="lock" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
            <Text style={sidebarStyles.menuItemText}>Change Password</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[sidebarStyles.menuItem, { marginTop: 24 }]} 
            activeOpacity={0.7}
            onPress={() => { toggleSidebar(); handleLogout(); }}
          >
            <Feather name="log-out" size={16} color="#FF6B6B" style={sidebarStyles.menuIcon} />
            <Text style={[sidebarStyles.menuItemText, { color: "#FF6B6B" }]}>Log Out</Text>
          </TouchableOpacity>

        </ScrollView>
      </View>
    );
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

    // 2. Perform API call in background (non-blocking sync)
    fetch(`${API_BASE_URL}/update_allowance_savings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id || user.userId || route.params?.user?.id,
        savingsProgressAmount: savingsProgressVal,
        currentBalance: cleanNew,
        savingsProgress2: savingsProgressVal2,
        savingsProgress3: savingsProgressVal3,
        allowance: cleanNew,
        frequency: tempFrequency
      })
    })
    .then((response) => {
      if (!response.ok) {
        console.log("Background budget sync failed on server");
      } else {
        console.log("Background budget sync succeeded");
      }
    })
    .catch((err) => {
      console.log("Background budget sync failed (offline):", err);
    });
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

    fetch(`${API_BASE_URL}/change_password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id || user.userId || route.params?.user?.id,
        oldPassword: oldPassword,
        newPassword: newPassword
      })
    })
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        Alert.alert("Error", data.error || "Failed to update password.");
      } else {
        Alert.alert("Success", "Password updated successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setIsPasswordModalVisible(false);
      }
    })
    .catch((err) => {
      Alert.alert("Network Error", "Could not connect to server to update password.");
      console.log("Password change failed:", err);
    });
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
      } catch (e) {
        console.log("Failed to load preferences:", e);
      }
    };
    loadSavedPreferences();
  }, []);

  const handleToggleNotifications = async () => {
    const nextVal = !notificationsEnabled;
    setNotificationsEnabled(nextVal);
    try {
      await AsyncStorage.setItem("dailyRemindersEnabled", String(nextVal));
    } catch (e) {
      console.log("Failed to save daily reminders pref:", e);
    }
  };

  const handleToggleDarkMode = async () => {
    const nextVal = !darkModeEnabled;
    setDarkModeEnabled(nextVal);
    try {
      await AsyncStorage.setItem("darkModeEnabled", String(nextVal));
    } catch (e) {
      console.log("Failed to save dark mode pref:", e);
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

  const fetchOnboarding = async () => {
    try {
      const userId = user.id || user.userId || route.params?.user?.id;
      if (!userId) return;
      const response = await fetch(`${API_BASE_URL}/get_onboarding?userId=${userId}`);
      const data = await response.json();
      if (response.ok && data.onboarding) {
        setOnboardingData(data.onboarding);

        // Check for cycle rollover
        if (data.onboarding.rolloverDue) {
          navigation.navigate("Allocation", {
            user: {
              ...user,
              onboarding: data.onboarding
            },
            savedAmount: data.onboarding.savedAmount || 0,
            newAllowance: parseFloat(String(data.onboarding.allowance || "5000").replace(/,/g, "")) || 5000,
            newFrequency: data.onboarding.frequency || "Monthly",
            goals: data.onboarding.goals || []
          });
          return;
        }

        navigation.setParams({
          user: {
            ...user,
            onboarding: data.onboarding
          }
        });
        const dbBal = data.onboarding.currentBalance;
        if (dbBal !== undefined && dbBal !== null) {
          const parsed = parseFloat(String(dbBal).replace(/,/g, ""));
          setCurrentBalanceVal(!isNaN(parsed) ? parsed : 2450);
        }
        const dbProgress1 = data.onboarding.savingsProgressAmount;
        if (dbProgress1 !== undefined && dbProgress1 !== null) {
          setSavingsProgressVal(parseInt(String(dbProgress1).replace(/[^0-9]/g, ""), 10) || 0);
        }
        const dbProgress2 = data.onboarding.savingsProgress2;
        if (dbProgress2 !== undefined && dbProgress2 !== null) {
          setSavingsProgressVal2(parseInt(String(dbProgress2).replace(/[^0-9]/g, ""), 10) || 2200);
        }
        const dbProgress3 = data.onboarding.savingsProgress3;
        if (dbProgress3 !== undefined && dbProgress3 !== null) {
          setSavingsProgressVal3(parseInt(String(dbProgress3).replace(/[^0-9]/g, ""), 10) || 3000);
        }
      }
    } catch (err) {
      console.log("Fetch onboarding failed:", err);
    }
  };

  const fetchGoals = async () => {
    try {
      const userId = user.id || user.userId || route.params?.user?.id;
      if (!userId) return;
      const response = await fetch(`${API_BASE_URL}/get_goals?userId=${userId}`);
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
            iconType: getSelectedIcon(g.name),
            image: g.image_url,
            isActive: g.is_active === 1,
            priority: g.priority !== undefined && g.priority !== null ? parseInt(String(g.priority), 10) : 3
          };
        });

        const sorted = mapped.sort((a, b) => {
          if (a.priority !== b.priority) {
            return a.priority - b.priority; // Ascending priority (1 comes first)
          }
          if (a.target !== b.target) {
            return b.target - a.target; // Descending budget (highest target first)
          }
          return a.name.localeCompare(b.name); // Alphabetical sorting as a secondary tie-breaker
        });

        setDbGoals(sorted);
      }
    } catch (err) {
      console.log("Fetch goals failed:", err);
    }
  };

  const fetchTransactions = async () => {
    try {
      const userId = user.id || user.userId || route.params?.user?.id;
      if (!userId) return;
      const response = await fetch(`${API_BASE_URL}/get_transactions?userId=${userId}`);
      const data = await response.json();
      if (response.ok && data.transactions) {
        setDbTransactions(data.transactions);
      }
    } catch (err) {
      console.log("Fetch transactions failed:", err);
    }
  };

  React.useEffect(() => {
    const syncRouteParams = () => {
      if (route.params?.user) {
        const updatedOnboarding = route.params.user.onboarding || {};
        setOnboardingData(updatedOnboarding);
        
        const dbBal = updatedOnboarding.currentBalance;
        if (dbBal !== undefined && dbBal !== null) {
          const parsed = parseFloat(String(dbBal).replace(/,/g, ""));
          setCurrentBalanceVal(!isNaN(parsed) ? parsed : 2450);
        }
        
        const dbProgress1 = updatedOnboarding.savingsProgressAmount;
        if (dbProgress1 !== undefined && dbProgress1 !== null) {
          setSavingsProgressVal(parseInt(String(dbProgress1).replace(/[^0-9]/g, ""), 10) || 0);
        }
        
        const dbProgress2 = updatedOnboarding.savingsProgress2;
        if (dbProgress2 !== undefined && dbProgress2 !== null) {
          setSavingsProgressVal2(parseInt(String(dbProgress2).replace(/[^0-9]/g, ""), 10) || 2200);
        }
        
        const dbProgress3 = updatedOnboarding.savingsProgress3;
        if (dbProgress3 !== undefined && dbProgress3 !== null) {
          setSavingsProgressVal3(parseInt(String(dbProgress3).replace(/[^0-9]/g, ""), 10) || 3000);
        }
      }
    };

    // Run on initial mount
    syncRouteParams();
    fetchOnboarding();
    fetchGoals();
    fetchTransactions();

    const unsubscribe = navigation.addListener("focus", () => {
      // Run on focus (returning from other screens)
      syncRouteParams();
      fetchOnboarding();
      fetchGoals();
      fetchTransactions();
    });
    return unsubscribe;
  }, [navigation, user.id]);

  const activeCarouselGoals = dbGoals.filter(g => g.progressPercent < 100);

  // Helper to render specific illustration/icon dynamically
  const renderGoalIcon = (iconType) => {
    const size = isSmallDevice ? 20 : 24;
    if (iconType === "headphones") {
      return (
        <Feather name="headphones" size={size} color={accentColor} />
      );
    }
    if (iconType === "gamepad") {
      return (
        <MaterialCommunityIcons name="gamepad-variant" size={size} color={accentColor} />
      );
    }
    if (iconType === "bicycle") {
      return (
        <MaterialCommunityIcons name="bicycle" size={size} color={accentColor} />
      );
    }
    if (iconType === "shoe") {
      return (
        <MaterialCommunityIcons name="shoe-sneaker" size={size} color={accentColor} />
      );
    }
    if (iconType === "award") {
      return (
        <Feather name="award" size={size} color={accentColor} />
      );
    }
    if (iconType === "laptop") {
      return (
        <Feather name="laptop" size={size} color={accentColor} />
      );
    }
    if (iconType === "watch") {
      return (
        <Feather name="watch" size={size} color={accentColor} />
      );
    }
    if (iconType === "book") {
      return (
        <Feather name="book-open" size={size} color={accentColor} />
      );
    }
    if (iconType === "car") {
      return (
        <Ionicons name="car-sport-outline" size={size} color={accentColor} />
      );
    }
    if (iconType === "airplane") {
      return (
        <Ionicons name="airplane-outline" size={size} color={accentColor} />
      );
    }
    return (
      <Feather name="target" size={isSmallDevice ? 18 : 20} color={accentColor} />
    );
  };

  const handleLogout = () => {
    // Navigate back to Login and reset routing
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }]
    });
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

    // 2. Perform API call in background (non-blocking sync)
    fetch(`${API_BASE_URL}/update_allowance_savings`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id || user.userId || route.params?.user?.id,
        savingsProgressAmount: savingsProgressVal,
        currentBalance: newBalance,
        savingsProgress2: savingsProgressVal2,
        savingsProgress3: savingsProgressVal3,
        allowance: newAllowanceLimit
      })
    })
    .then((response) => {
      if (!response.ok) {
        console.log("Background top up sync failed on server");
      } else {
        console.log("Background top up sync succeeded");
      }
    })
    .catch((err) => {
      console.log("Background top up sync failed (offline):", err);
    });
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
        contentContainerStyle={[styles.scrollContainer, { paddingTop: STATUS_BAR_HEIGHT + 10 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerRow}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.welcomeText}>Hey, {firstName}</Text>
            <Text style={styles.subtitleText}>Let's keep building your future</Text>
          </View>
          <TouchableOpacity 
            style={styles.notificationButton} 
            activeOpacity={0.8}
            onPress={toggleSidebar}
          >
            <Feather name="menu" size={20} color={darkModeEnabled ? "#FFFFFF" : "#111210"} />
          </TouchableOpacity>
        </View>



        {/* Available Balance Card */}
        <BlurView intensity={100} tint={darkModeEnabled ? "dark" : "light"} style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Feather name="eye" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} />
            <Text style={styles.balanceHeaderText}>AVAILABLE BALANCE</Text>
          </View>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.balanceAmount}>₹{formattedBalance}</Text>
            <TouchableOpacity 
              style={styles.topUpButton} 
              activeOpacity={0.8}
              onPress={() => setIsAllowanceModalVisible(true)}
            >
              <Feather name="plus" size={11} color={darkModeEnabled ? "#FFFFFF" : "#111210"} style={{ marginRight: 4 }} />
              <Text style={styles.topUpText}>Top Up</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.balanceSubtitle}>
            Left from ₹{formattedAllowance} allowance
          </Text>


          {/* Progress Bar */}
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${usedPercent}%`, backgroundColor: accentColor }]} />
          </View>

          <View style={styles.balanceFooter}>
            <Text style={[styles.balanceFooterTextAccent, { color: accentColor }]}>{usedPercent}% used</Text>
            <Text style={styles.balanceFooterTextMuted}>₹{formattedSpent} spent</Text>
          </View>
        </BlurView>

        {/* Goals Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>SAVINGS GOALS</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("Goals", { user })}>
            <Text style={[styles.viewAllText, { color: accentColor }]}>View all </Text>
          </TouchableOpacity>
        </View>

        {/* Goals Carousel */}
        <ScrollView
          ref={goalsScrollViewRef}
          horizontal
          pagingEnabled={false}
          showsHorizontalScrollIndicator={false}
          snapToInterval={staticCardWidth + 12}
          decelerationRate="fast"
          onScroll={(event) => {
            const snapInterval = staticCardWidth + 12;
            const index = event.nativeEvent.contentOffset.x / snapInterval;
            const roundIndex = Math.round(index);
            if (roundIndex !== activeGoalIndex) {
              setActiveGoalIndex(roundIndex);
            }
          }}
          scrollEventThrottle={200}
          style={{ height: isSmallDevice ? 114 : 130, flexGrow: 0 }}
        >
          {activeCarouselGoals.length > 0 ? (
            activeCarouselGoals.map((g) => (
              <BlurView
                key={g.id}
                intensity={100}
                tint={darkModeEnabled ? "dark" : "light"}
                style={[styles.goalCard, {
                  width: staticCardWidth,
                  marginRight: 12,
                  paddingHorizontal: isSmallDevice ? 12 : 14,
                  paddingTop: isSmallDevice ? 10 : 12,
                  paddingBottom: isSmallDevice ? 8 : 10
                }]}
              >
                <View style={styles.goalMainRow}>
                  <View style={styles.goalIconWrapper}>
                    {renderGoalIcon(g.iconType)}
                  </View>
                  <View style={styles.goalInfoContainer}>
                    <Text style={styles.goalTitle}>{g.name}</Text>
                    <Text style={styles.goalProgressText}>
                      ₹{g.progressAmount.toLocaleString("en-IN")} of ₹{g.target.toLocaleString("en-IN")}
                    </Text>
                  </View>
                </View>

                {/* Progress Bar */}
                <View style={styles.goalProgressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View style={[styles.progressBarFill, { width: `${g.progressPercent}%`, backgroundColor: accentColor }]} />
                  </View>
                </View>

                <View style={styles.goalFooterRow}>
                  <View style={styles.goalTimeContainer}>
                    {g.progressPercent >= 100 ? (
                      <Feather name="check-circle" size={14} color={accentColor} />
                    ) : (
                      <Feather name="calendar" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} />
                    )}
                    <Text style={[styles.goalTimeText, g.progressPercent >= 100 && { color: accentColor, fontWeight: "600" }]}>
                      {g.progressPercent >= 100 ? " Achieved!" : ` ${g.timeLeft}`}
                      {g.isActive && timeToReach > 0 && g.progressPercent < 100 && (
                        <Text style={{ color: darkModeEnabled ? "#8A90A8" : "#5A607F", fontWeight: "normal" }}>
                          {" "}• ₹{Math.round(cleanTarget / timeToReach).toLocaleString("en-IN")}/{frequency === "Weekly" ? "wk" : "mo"}
                        </Text>
                      )}
                    </Text>
                  </View>
                  <Text style={[styles.goalPercentText, { color: accentColor }]}>{g.progressPercent}%</Text>
                </View>
              </BlurView>
            ))
          ) : (
            <BlurView
              intensity={100}
              tint={darkModeEnabled ? "dark" : "light"}
              style={[styles.goalCard, {
                width: staticCardWidth,
                paddingVertical: isSmallDevice ? 16 : 24,
                paddingHorizontal: 20,
                alignItems: "center",
                justifyContent: "center"
              }]}
            >
              <Feather name="award" size={28} color={accentColor} style={{ marginBottom: 8 }} />
              <Text style={{ fontSize: 13, color: darkModeEnabled ? "#FFFFFF" : "#111210", fontFamily: "DMSerifDisplay-Regular"}}>{`All Goals Achieved`}</Text>
              <Text style={{ fontSize: 10, color: darkModeEnabled ? "#8A90A8" : "#5A607F", fontFamily: "DMSerifDisplay-Regular", marginTop: 2, textAlign: "center" }}>
                Your goals have been fully saved. Tap Goals below to start a new target.
              </Text>
            </BlurView>
          )}
        </ScrollView>

        {/* Page Indicators (Dots) */}
        {activeCarouselGoals.length > 1 && (
          <View style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: 8,
            paddingBottom: isSmallDevice ? 10 : 12
          }}>
            {activeCarouselGoals.map((_, i) => (
              <View
                key={i}
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: 2.5,
                  backgroundColor: i === activeGoalIndex ? accentColor : "#8A90A8",
                  marginHorizontal: 3,
                  opacity: i === activeGoalIndex ? 1 : 0.4
                }}
              />
            ))}
          </View>
        )}



        {/* Recent Transactions Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>RECENT TRANSACTIONS</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("Insights", { user })}>
            <Text style={[styles.viewAllText, { color: accentColor }]}>View all </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Transactions List */}
        <BlurView intensity={100} tint={darkModeEnabled ? "dark" : "light"} style={styles.transactionCard}>
          {transactions.length === 0 ? (
            <View style={{ paddingVertical: 28, alignItems: "center", justifyContent: "center" }}>
              <Feather name="activity" size={24} color={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.25)"} style={{ marginBottom: 8 }} />
              <Text style={{ color: darkModeEnabled ? "#8A90A8" : "#5A607F", fontSize: 13, fontFamily: "Geist-Regular", textAlign: "center" }}>
                No transactions yet
              </Text>
            </View>
          ) : (
            transactions.map((tx, idx) => (
              <View 
                key={`${tx.id}-${idx}`} 
                style={idx === transactions.length - 1 ? styles.transactionItemLast : styles.transactionItem}
              >
                <View style={styles.transactionIconWrapper}>
                  <Feather name={tx.icon || "shopping-cart"} size={isSmallDevice ? 14 : 18} color={tx.iconColor} />
                </View>
                <View style={styles.transactionDetails}>
                  <Text style={styles.transactionTitle}>{tx.title}</Text>
                  <Text style={styles.transactionCategory}>{tx.category}</Text>
                </View>
                <View style={styles.transactionAmountContainer}>
                  <Text 
                    style={
                      tx.amount < 0 
                        ? styles.transactionAmountNegative 
                        : [styles.transactionAmountPositive, { color: accentColor }]
                    }
                  >
                    {tx.amount < 0 ? "-" : "+"}₹{Math.abs(tx.amount).toLocaleString("en-IN")}
                  </Text>
                  <Text style={styles.transactionDate}>{tx.date}</Text>
                </View>
              </View>
            ))
          )}
        </BlurView>
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={styles.bottomNavBar}>
        <BlurView
          intensity={100}
          tint={darkModeEnabled ? "dark" : "light"}
          style={styles.navBlurView}
        />
        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Feather name="home" size={21} color={accentColor} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Goals", { user })}
        >
          <Feather name="target" size={21} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.centerNavItem} 
          activeOpacity={0.8}
          onPress={() => navigation.navigate("AddExpense", { user })}
        >
          <Feather name="plus" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Insights", { user })}
        >
          <Feather name="bar-chart-2" size={21} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7} 
          onPress={() => navigation.navigate("Profile", { user })}
        >
          <Feather name="user" size={21} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} />
        </TouchableOpacity>
      </View>

      {/* Top Up Simulation Input Modal */}
      <Modal
        transparent
        visible={isAllowanceModalVisible}
        animationType="fade"
        onRequestClose={() => setIsAllowanceModalVisible(false)}
      >
        <View style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.6)"
        }}>
          <BlurView
            intensity={90}
            tint={darkModeEnabled ? "dark" : "light"}
            style={{
              width: width - 40,
              borderRadius: 24,
              padding: 24,
              borderWidth: 1,
              borderColor: darkModeEnabled ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
              backgroundColor: darkModeEnabled ? "rgba(26, 28, 25, 0.9)" : "rgba(255, 255, 255, 0.95)"
            }}
          >
            <Text style={{
              fontSize: 18,
              color: darkModeEnabled ? "#FFFFFF" : "#111210",
              fontFamily: "DMSerifDisplay-Regular",
              textAlign: "center",
              marginBottom: 8
            }}>
              Top Up Cycle
            </Text>
            
            <Text style={{
              fontSize: 13,
              color: darkModeEnabled ? "#8A90A8" : "#5A607F",
              fontFamily: "DMSerifDisplay-Regular",
              textAlign: "center",
              marginBottom: 20,
              lineHeight: 18
            }}>
              Add extra money to your current <Text style={{ color: accentColor }}>{frequency.toLowerCase()}</Text> cycle. This will increase your available balance and total allowance limit.
            </Text>

            <View style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: darkModeEnabled ? "rgba(17, 18, 16, 0.68)" : "#FFFFFF",
              borderRadius: 10,
              paddingHorizontal: 12,
              borderWidth: 1,
              borderColor: darkModeEnabled ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
              height: 46,
              marginBottom: 24
            }}>
              <Text style={{ fontSize: 16, marginRight: 6, color: darkModeEnabled ? "#8A90A8" : "#5A607F", fontFamily: "DMSerifDisplay-Regular" }}>₹</Text>
              <TextInput
                style={{
                  flex: 1,
                  height: "100%",
                  fontSize: 15,
                  color: darkModeEnabled ? "#FFFFFF" : "#111210",
                  fontFamily: "DMSerifDisplay-Regular"
                }}
                placeholder="2,000"
                placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.3)"}
                keyboardType="numeric"
                value={newAllowanceInput}
                onChangeText={(text) => {
                  const clean = text.replace(/[^0-9]/g, "");
                  if (!clean) {
                    setNewAllowanceInput("");
                    return;
                  }
                  const num = parseInt(clean, 10);
                  setNewAllowanceInput(num.toLocaleString("en-IN"));
                }}
              />
            </View>

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <TouchableOpacity
                onPress={() => setIsAllowanceModalVisible(false)}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: darkModeEnabled ? "rgba(17, 18, 16, 0.68)" : "#E5E7EB",
                  borderWidth: 1,
                  borderColor: darkModeEnabled ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginRight: 8
                }}
              >
                <Text style={{ color: darkModeEnabled ? "#8A90A8" : "#5A607F", fontSize: 13, fontFamily: "DMSerifDisplay-Regular" }}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleConfirmAllowance}
                style={{
                  flex: 1,
                  height: 42,
                  borderRadius: 21,
                  backgroundColor: accentColor,
                  justifyContent: "center",
                  alignItems: "center",
                  marginLeft: 8
                }}
              >
                <Text style={{ color: "#FFFFFF", fontSize: 13, fontFamily: "DMSerifDisplay-Regular" }}>
                  Confirm Top Up
                </Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>



      {/* Budget & Frequency Modal Sheet (Mock Mode) */}
      <Modal
        transparent
        visible={isBudgetModalVisible}
        animationType="fade"
        onRequestClose={() => setIsBudgetModalVisible(false)}
      >
        <View style={sidebarStyles.modalBackdrop}>
          <BlurView intensity={90} tint={darkModeEnabled ? "dark" : "light"} style={sidebarStyles.modalContent}>
            <Text style={sidebarStyles.modalTitle}>Allowance Configuration</Text>
            <Text style={sidebarStyles.modalSubtitle}>Configure your allowance settings below:</Text>

            <Text style={sidebarStyles.fieldLabel}>ALLOWANCE AMOUNT:</Text>
            <View style={sidebarStyles.modalInputRow}>
              <Text style={sidebarStyles.modalCurrency}>₹</Text>
              <TextInput
                style={sidebarStyles.modalInput}
                keyboardType="numeric"
                value={tempAllowanceInput}
                onChangeText={(text) => {
                  const clean = text.replace(/[^0-9]/g, "");
                  if (!clean) { setTempAllowanceInput(""); return; }
                  setTempAllowanceInput(parseInt(clean, 10).toLocaleString("en-IN"));
                }}
              />
            </View>

            <Text style={sidebarStyles.fieldLabel}>FREQUENCY:</Text>
            <View style={sidebarStyles.frequencyRow}>
              {["Weekly", "Monthly"].map((item) => {
                const isActive = tempFrequency === item;
                return (
                  <TouchableOpacity
                    key={item}
                    activeOpacity={0.8}
                    style={[sidebarStyles.frequencyButton, isActive && sidebarStyles.frequencyButtonActive]}
                    onPress={() => setTempFrequency(item)}
                  >
                    <Text style={[sidebarStyles.frequencyText, isActive && sidebarStyles.frequencyTextActive]}>
                      {item}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={sidebarStyles.modalButtonsRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsBudgetModalVisible(false)}
                style={sidebarStyles.modalCancelButton}
              >
                <Text style={sidebarStyles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleSaveBudgetSettings}
                style={sidebarStyles.modalSaveButton}
              >
                <Text style={sidebarStyles.modalSaveButtonText}>Save Settings</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>

      {/* Change Password Modal Sheet (Mock Mode) */}
      <Modal
        transparent
        visible={isPasswordModalVisible}
        animationType="fade"
        onRequestClose={() => setIsPasswordModalVisible(false)}
      >
        <View style={sidebarStyles.modalBackdrop}>
          <BlurView intensity={90} tint={darkModeEnabled ? "dark" : "light"} style={sidebarStyles.modalContent}>
            <Text style={sidebarStyles.modalTitle}>Change Password</Text>
            <Text style={sidebarStyles.modalSubtitle}>Update your account security details:</Text>

            <Text style={sidebarStyles.fieldLabel}>CURRENT PASSWORD:</Text>
            <View style={sidebarStyles.modalInputRow}>
              <TextInput
                style={sidebarStyles.modalTextInputField}
                secureTextEntry
                placeholder="Enter current password"
                placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
                value={oldPassword}
                onChangeText={setOldPassword}
              />
            </View>

            <Text style={sidebarStyles.fieldLabel}>NEW PASSWORD:</Text>
            <View style={sidebarStyles.modalInputRow}>
              <TextInput
                style={sidebarStyles.modalTextInputField}
                secureTextEntry
                placeholder="At least 4 characters"
                placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>

            <Text style={sidebarStyles.fieldLabel}>CONFIRM NEW PASSWORD:</Text>
            <View style={sidebarStyles.modalInputRow}>
              <TextInput
                style={sidebarStyles.modalTextInputField}
                secureTextEntry
                placeholder="Confirm your new password"
                placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            <View style={sidebarStyles.modalButtonsRow}>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => setIsPasswordModalVisible(false)}
                style={sidebarStyles.modalCancelButton}
              >
                <Text style={sidebarStyles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={handleChangePassword}
                style={sidebarStyles.modalSaveButton}
              >
                <Text style={sidebarStyles.modalSaveButtonText}>Update</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
        </View>
      </Modal>

    </SafeAreaView>

    {/* Sidebar Drawer Overlay */}
    {isSidebarVisible && (
      <View style={sidebarStyles.overlayContainer}>
        {/* Backdrop */}
        <Animated.View style={[sidebarStyles.backdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={{ flex: 1 }}
            activeOpacity={1}
            onPress={toggleSidebar}
          />
        </Animated.View>
        {/* Drawer Panel */}
        <Animated.View style={[sidebarStyles.drawerPanel, { transform: [{ translateX: sidebarSlide }] }]}>
          {Platform.OS === "ios" ? (
            <BlurView intensity={100} tint={darkModeEnabled ? "dark" : "light"} style={sidebarStyles.drawerBlur}>
              {renderDrawerContent()}
            </BlurView>
          ) : (
            <View style={[sidebarStyles.drawerBlur, { backgroundColor: darkModeEnabled ? "rgba(17, 18, 16, 0.98)" : "rgba(244, 245, 247, 0.98)" }]}>
              {renderDrawerContent()}
            </View>
          )}
        </Animated.View>
      </View>
    )}

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
