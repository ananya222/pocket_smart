import { API_BASE_URL, apiFetch } from "../../../config";
import React, { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  StatusBar,
  useWindowDimensions,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import { BlurView } from "expo-blur";
import BackgroundGrid from "../../../components/BackgroundGrid/BackgroundGrid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { styles } from "./OnboardingCompleteScreen.styles";
import OnboardingProfileCard from "./components/OnboardingProfileCard";
import OnboardingProceedButton from "./components/OnboardingProceedButton";

export default function OnboardingCompleteScreen({ navigation, route }) {
  const { height } = useWindowDimensions();

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

  const handleProceed = async () => {
    try {
      const cleanAllowance = parseFloat(String(allowance).replace(/,/g, "")) || 5000;
      const cleanTarget = parseFloat(String(targetAmount).replace(/,/g, "")) || 8000;

      const response = await apiFetch("/submit_onboarding", {
        method: "POST",
        body: JSON.stringify({
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
          <OnboardingProfileCard 
            allowance={allowance}
            frequency={frequency}
            goalName={goalName}
            targetAmount={targetAmount}
            timeToReach={timeToReach}
          />

          {/* Primary CTA button */}
          <OnboardingProceedButton onPress={handleProceed} />

        </BlurView>
      </ScrollView>
    </View>
  );
}
