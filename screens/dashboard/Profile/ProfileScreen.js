import { API_BASE_URL, apiFetch, removeToken } from "../../../config";
// ProfileScreen.js
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  useWindowDimensions,
  Alert,
  Modal,
  TextInput,
  Animated
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { getStyles } from "./ProfileScreen.styles";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundGrid from "../../../components/BackgroundGrid/BackgroundGrid";

export default function ProfileScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const bottomPadding = 16;
  const isSmallDevice = height < 700;
  const accentColor = "#9D4EDD";

  // User details
  const user = route.params?.user || {};
  const fullName = user.fullName || "Aarav";
  const firstName = fullName.split(" ")[0];
  const email = user.email || "user@pocketsmart.com";

  // Data states
  const [allowance, setAllowance] = useState("5,000");
  const [frequency, setFrequency] = useState("Monthly");
  const [balance, setBalance] = useState("2,450");
  const [goalsCount, setGoalsCount] = useState(0);
  const [goalsTotalSaved, setGoalsTotalSaved] = useState(0);
  const [goalsTotalTarget, setGoalsTotalTarget] = useState(0);

  // App preferences
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(true);

  // Password Modal states
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const styles = getStyles(isSmallDevice, darkModeEnabled);

  // Fetch live user info, allowance, and goals
  const loadOnboardingAndGoals = async () => {
    const userId = user.id || user.userId || route.params?.user?.id;
    if (!userId) return;

    try {
      // Get Onboarding / Allowance info
       const onboardingResponse = await apiFetch("/get_onboarding");
      if (onboardingResponse.ok) {
        const onboardingData = await onboardingResponse.json();
        if (onboardingData && onboardingData.onboarding) {
          const info = onboardingData.onboarding;
          const rawAllowance = info.allowance || "5,000";
          setAllowance(parseFloat(String(rawAllowance).replace(/,/g, "")).toLocaleString("en-IN"));
          setFrequency(info.frequency || "Monthly");
          
          const rawBalance = info.currentBalance !== undefined ? info.currentBalance : 0;
          setBalance(parseFloat(String(rawBalance).replace(/,/g, "")).toLocaleString("en-IN"));
        }
      }

      // Get Goals summary
      const goalsResponse = await apiFetch("/get_goals");
      if (goalsResponse.ok) {
        const goalsData = await goalsResponse.json();
        if (goalsData && Array.isArray(goalsData.goals)) {
          setGoalsCount(goalsData.goals.length);
          let totalSaved = 0;
          let totalTarget = 0;
          goalsData.goals.forEach(g => {
            totalSaved += parseFloat(String(g.progress_amount || 0).replace(/,/g, ""));
            totalTarget += parseFloat(String(g.target_amount || 0).replace(/,/g, ""));
          });
          setGoalsTotalSaved(totalSaved);
          setGoalsTotalTarget(totalTarget);
        }
      }
    } catch {
    }
  };

  // Load preferences on mount
  useEffect(() => {
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
    loadOnboardingAndGoals();
  }, []);

  // Listen to navigation focus to refresh stats
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      loadOnboardingAndGoals();
    });
    return unsubscribe;
  }, [navigation]);

  // Preference Toggle handlers
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

  // Change Password logic
  const handleChangePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
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

    apiFetch("/change_password", {
      method: "POST",
      body: JSON.stringify({
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
    });
  };

  const handleLogout = async () => {
    try {
      await removeToken();
      await AsyncStorage.removeItem("userSession");
    } catch {
    }
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }]
    });
  };

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  return (
    <View style={styles.mainContainer}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle={darkModeEnabled ? "light-content" : "dark-content"} backgroundColor={darkModeEnabled ? "#111210" : "#F4F5F7"} />
        <BackgroundGrid />

        <ScrollView
          style={{ flex: 1, backgroundColor: "transparent" }}
          contentContainerStyle={[styles.scrollContainer, { paddingBottom: bottomPadding }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity 
              style={styles.backButton} 
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
            >
              <Feather name="arrow-left" size={18} color={darkModeEnabled ? "#FFFFFF" : "#111210"} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <View style={styles.placeholderButton} />
          </View>

          {/* Profile Header Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{firstName[0]?.toUpperCase() || "A"}</Text>
            </View>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>

          {/* Allowance Configuration Summary */}
          <Text style={styles.sectionTitle}>Budget & Allowance</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailItem}>
              <View style={styles.detailLabelContainer}>
                <Feather name="sliders" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} style={styles.detailIcon} />
                <Text style={styles.detailLabel}>Baseline Allowance</Text>
              </View>
              <Text style={styles.detailValue}>₹{allowance}</Text>
            </View>

            <View style={styles.detailItem}>
              <View style={styles.detailLabelContainer}>
                <Feather name="repeat" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} style={styles.detailIcon} />
                <Text style={styles.detailLabel}>Frequency</Text>
              </View>
              <Text style={styles.detailValue}>{frequency}</Text>
            </View>

            <View style={styles.detailItemLast}>
              <View style={styles.detailLabelContainer}>
                <Feather name="credit-card" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} style={styles.detailIcon} />
                <Text style={styles.detailLabel}>Available Balance</Text>
              </View>
              <Text style={styles.detailValue}>₹{balance}</Text>
            </View>
          </View>

          {/* Savings Summary */}
          <Text style={styles.sectionTitle}>Savings & Goals</Text>
          <View style={styles.detailCard}>
            <View style={styles.detailItem}>
              <View style={styles.detailLabelContainer}>
                <Feather name="target" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} style={styles.detailIcon} />
                <Text style={styles.detailLabel}>Active Targets</Text>
              </View>
              <Text style={styles.detailValue}>{goalsCount} goals</Text>
            </View>

            <View style={styles.detailItemLast}>
              <View style={styles.detailLabelContainer}>
                <Feather name="award" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} style={styles.detailIcon} />
                <Text style={styles.detailLabel}>Saved Progress</Text>
              </View>
              <Text style={styles.detailValue}>₹{goalsTotalSaved.toLocaleString("en-IN")} of ₹{goalsTotalTarget.toLocaleString("en-IN")}</Text>
            </View>
          </View>

          {/* App Preferences */}
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.detailCard}>
            <View style={styles.prefItem}>
              <View style={styles.prefTextContainer}>
                <Text style={styles.prefTitle}>Daily Reminders</Text>
                <Text style={styles.prefSubtitle}>Get notified to log your spending daily</Text>
              </View>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={handleToggleNotifications} 
                style={[styles.toggleContainer, notificationsEnabled && styles.toggleActive]}
              >
                <View style={[styles.toggleDot, notificationsEnabled && styles.toggleDotActive]} />
              </TouchableOpacity>
            </View>

            <View style={styles.prefItemLast}>
              <View style={styles.prefTextContainer}>
                <Text style={styles.prefTitle}>Dark Mode</Text>
                <Text style={styles.prefSubtitle}>Switch interface theme instantly</Text>
              </View>
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={handleToggleDarkMode} 
                style={[styles.toggleContainer, darkModeEnabled && styles.toggleActive]}
              >
                <View style={[styles.toggleDot, darkModeEnabled && styles.toggleDotActive]} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtonsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              activeOpacity={0.8}
              onPress={() => setIsPasswordModalVisible(true)}
            >
              <Feather name="lock" size={14} color={darkModeEnabled ? "#FFFFFF" : "#111210"} style={styles.actionButtonIcon} />
              <Text style={styles.actionButtonText}>Change Password</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.logoutButton}
              activeOpacity={0.8}
              onPress={handleLogout}
            >
              <Feather name="log-out" size={14} color="#FF6B6B" style={styles.actionButtonIcon} />
              <Text style={styles.logoutButtonText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Dynamic Modal Sheet for Change Password */}
        <Modal
          transparent
          visible={isPasswordModalVisible}
          animationType="fade"
          onRequestClose={() => setIsPasswordModalVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <BlurView intensity={90} tint={darkModeEnabled ? "dark" : "light"} style={styles.modalContent}>
              <Text style={styles.modalTitle}>Change Password</Text>
              <Text style={styles.modalSubtitle}>Update your account security details:</Text>

              <Text style={styles.fieldLabel}>CURRENT PASSWORD:</Text>
              <View style={styles.modalInputRow}>
                <TextInput
                  style={styles.modalTextInputField}
                  secureTextEntry
                  placeholder="Enter current password"
                  placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
                  value={oldPassword}
                  onChangeText={setOldPassword}
                />
              </View>

              <Text style={styles.fieldLabel}>NEW PASSWORD:</Text>
              <View style={styles.modalInputRow}>
                <TextInput
                  style={styles.modalTextInputField}
                  secureTextEntry
                  placeholder="At least 4 characters"
                  placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
                  value={newPassword}
                  onChangeText={setNewPassword}
                />
              </View>

              <Text style={styles.fieldLabel}>CONFIRM NEW PASSWORD:</Text>
              <View style={styles.modalInputRow}>
                <TextInput
                  style={styles.modalTextInputField}
                  secureTextEntry
                  placeholder="Confirm your new password"
                  placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
              </View>

              <View style={styles.modalButtonsRow}>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => setIsPasswordModalVisible(false)}
                  style={styles.modalCancelButton}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={handleChangePassword}
                  style={styles.modalSaveButton}
                >
                  <Text style={styles.modalSaveButtonText}>Update</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        </Modal>

      </SafeAreaView>
    </View>
  );
}
