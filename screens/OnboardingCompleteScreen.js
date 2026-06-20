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
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { styles } from "../styles/OnboardingCompleteScreen.styles";
import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";

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
  const imageSize = Math.max(180, Math.min(350, height * 0.50));
  
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

  const handleProceed = () => {
    Alert.alert(
      "Welcome to your Dashboard!",
      "Proceeding to dashboard...\n\nYour setup:\n• Allowance: ₹" + allowance + " (" + frequency + ")\n• Target Goal: ₹" + targetAmount + " (" + goalName + ")",
      [
        {
          text: "Start Over",
          onPress: () => navigation.navigate("Welcome"),
          style: "destructive"
        },
        {
          text: "Done",
          onPress: async () => {
            try {
              const cleanAllowance = parseFloat(String(allowance).replace(/,/g, "")) || 5000;
              const cleanTarget = parseFloat(String(targetAmount).replace(/,/g, "")) || 8000;

              const response = await fetch("http://192.168.1.4:5000/submit_onboarding", {
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
                  currentBalance: cleanAllowance
                }),
              });

              if (response.ok) {
                navigation.navigate("Dashboard", {
                  user: {
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
                    }
                  }
                });
              } else {
                const data = await response.json();
                Alert.alert("Onboarding Failed", data.error || "Could not save onboarding details.");
              }
            } catch (error) {
              console.log("Onboarding submission failed:", error);
              // Fallback for offline testing / development bypass
              navigation.navigate("Dashboard", {
                user: {
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
                  }
                }
              });
            }
          }
        }
      ]
    );
  };

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  return (
    <LinearGradient
      colors={["#9D4EDD", "#7B2CBF"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.mainContainer}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />



      {/* Top Purple Illustration Area */}
      <View style={[styles.headerWrapper, { paddingTop: STATUS_BAR_HEIGHT + 20 }]}>
        <View style={styles.heroImageContainer}>
          <Image
            source={require("../assets/images/onboarding_complete_hero.png")}
            style={[styles.heroImage, { width: imageSize, height: imageSize }]}
          />
        </View>
      </View>

      {/* Bottom White Card */}
      <View style={[styles.card, { paddingTop: cardPaddingTop, paddingBottom: cardPaddingBottom }]}>
        
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
            <LinearGradient
              colors={["#0088FF", "#0055EE"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonGradient}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.buttonText}>Proceed to Dashboard</Text>
                <Feather name="arrow-right" size={16} color="#FFFFFF" style={{ marginLeft: 8 }} />
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableOpacity>

      </View>
    </LinearGradient>
  );
}
