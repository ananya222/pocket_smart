import { API_BASE_URL } from "../config";
// OnboardingCompleteScreen.js

import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  useWindowDimensions,
  Animated,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import BackgroundGrid from "../components/BackgroundGrid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "../styles/OnboardingCompleteScreen.styles";
import { Feather } from "@expo/vector-icons";

export default function OnboardingCompleteScreen({ navigation, route }) {
  const { height } = useWindowDimensions();

  // Animated scale value for action button
  const buttonScale = useRef(new Animated.Value(1)).current;

  // Retrieve params from previous screens
  const routeParams = route?.params || {};
  const allowance = routeParams.allowance || "5,000";
  const frequency = routeParams.frequency || "Weekly";
  const goalName = routeParams.goalName || "Savings Goal";
  const targetAmount = routeParams.targetAmount || "8,000";
  const timeToReach = routeParams.timeToReach || 6;

  // VIEWPORT-RESPONSIVE DYNAMIC METRICS
  const imageSize = Math.max(180, Math.min(320, height * 0.45));
  
  // Card padding and vertical spacing
  const cardPaddingTop = Math.max(20, Math.min(32, height * 0.04));
  const cardPaddingBottom = Math.max(24, Math.min(40, height * 0.05));

  // Button haptic helpers
  const handlePressIn = () => {
    Animated.spring(buttonScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(buttonScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
      bounciness: 4,
    }).start();
  };

  const handleProceed = async () => {
    try {
      const cleanAllowance = parseFloat(String(allowance).replace(/,/g, "")) || 5000;
      const cleanTarget = parseFloat(String(targetAmount).replace(/,/g, "")) || 8000;

      const response = await fetch(`${API_BASE_URL}/submit_onboarding`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: routeParams.user?.id,
          allowance: cleanAllowance,
          frequency: frequency,
          goalName: goalName,
          targetAmount: cleanTarget,
          timeToReach: parseInt(String(timeToReach), 10) || 6,
          savingsProgressAmount: 0,
          currentBalance: cleanAllowance,
          priority: parseInt(String(routeParams.priority || 3), 10) || 3
        }),
      });

      if (response.ok) {
        const updatedUser = {
          ...routeParams.user,
          onboardingCompleted: true,
          onboarding: {
            allowance,
            frequency,
            goalName,
            targetAmount,
            timeToReach,
            savingsProgressAmount: 0,
            currentBalance: cleanAllowance,
            priority: parseInt(String(routeParams.priority || 3), 10) || 3
          }
        };
        await AsyncStorage.setItem("userSession", JSON.stringify(updatedUser));
        navigation.navigate("Dashboard", { user: updatedUser });
      } else {
        const data = await response.json();
        Alert.alert("Onboarding Failed", data.error || "Could not save onboarding details.");
      }
    } catch (error) {
      console.log("Onboarding submission failed:", error);
      // Fallback for offline testing / development bypass
      const updatedUser = {
        ...routeParams.user,
        onboardingCompleted: true,
        onboarding: {
          allowance,
          frequency,
          goalName,
          targetAmount,
          timeToReach,
          savingsProgressAmount: 0,
          currentBalance: parseFloat(String(allowance).replace(/,/g, "")) || 5000,
          priority: parseInt(String(routeParams.priority || 3), 10) || 3
        }
      };
      await AsyncStorage.setItem("userSession", JSON.stringify(updatedUser));
      navigation.navigate("Dashboard", { user: updatedUser });
    }
  };

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <BackgroundGrid type="onboarding_complete" />

      <ScrollView
        style={{ flex: 1, backgroundColor: "transparent" }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Top safety spacer */}
        <View style={{ height: STATUS_BAR_HEIGHT + 16 }} />

        {/* Bottom White Card */}
        <BlurView intensity={100} tint="dark" style={[styles.card, { paddingTop: cardPaddingTop, paddingBottom: cardPaddingBottom }]}>
          
          {/* Core completion copy */}
          <Text style={styles.title}>You're All Set!</Text>
          <Text style={styles.subtitle}>We've customized your savings journey based on your profile.</Text>

          {/* Unified Premium Money Profile Summary Widget */}
          <View style={styles.profileCard}>
            {/* Row 1: Budget */}
            <View style={styles.profileRow}>
              <View style={styles.profileDetails}>
                <Text style={styles.profileLabel}>BUDGET LIMIT</Text>
                <Text style={styles.profileSubLabel}>Allowance configured</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.profileValue}>₹{allowance}</Text>
                <Text style={styles.profileValueSubtitle}>{frequency === "Weekly" ? "weekly" : "monthly"}</Text>
              </View>
            </View>

            {/* Row Divider */}
            <View style={styles.profileDivider} />

            {/* Row 2: Savings Goal */}
            <View style={styles.profileRow}>
              <View style={styles.profileDetails}>
                <Text style={styles.profileLabel}>SAVINGS GOAL</Text>
                <Text style={styles.profileSubLabel}>{goalName}</Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.profileValue}>₹{targetAmount}</Text>
                <Text style={styles.profileValueSubtitle}>
                  {timeToReach} {timeToReach === 1 ? (frequency === "Weekly" ? "week" : "month") : (frequency === "Weekly" ? "weeks" : "months")}
                </Text>
              </View>
            </View>

            {/* Row Divider */}
            <View style={styles.profileDivider} />

            {/* Row 3: Security & Access */}
            <View style={styles.profileRow}>
              <View style={styles.profileDetails}>
                <Text style={styles.profileLabel}>ACCOUNT STATUS</Text>
                <Text style={styles.profileSubLabel}>Dashboard encrypted</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusBadgeText}>ACTIVE</Text>
              </View>
            </View>
          </View>

          {/* Primary CTA button */}
          <TouchableOpacity
            onPress={handleProceed}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            activeOpacity={1}
            style={[styles.buttonContainer, { marginBottom: Platform.OS === "ios" ? 10 : 0 }]}
          >
            <Animated.View style={{ transform: [{ scale: buttonScale }], flex: 1 }}>
              <View style={styles.buttonSolid}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.buttonText}>Proceed to Dashboard</Text>
                  <Feather name="arrow-right" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
                </View>
              </View>
            </Animated.View>
          </TouchableOpacity>

        </BlurView>
      </ScrollView>
    </View>
  );
}
