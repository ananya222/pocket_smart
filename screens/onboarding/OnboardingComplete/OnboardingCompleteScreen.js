import { auth, firestore } from "../../../config";
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
    const userUid = routeParams.user?.id || auth().currentUser?.uid;
    if (!userUid) {
      Alert.alert("Error", "No authenticated user session found.");
      return;
    }

    try {
      const cleanAllowance = parseFloat(String(allowance).replace(/,/g, "")) || 5000;
      const cleanTarget = parseFloat(String(targetAmount).replace(/,/g, "")) || 8000;

      // Keep exact matching names from MySQL 'accounts' table columns
      const onboardingData = {
        allowance_amount: String(allowance),
        allowance_frequency: String(frequency),
        current_balance: String(cleanAllowance),
        cycle_limit: String(cleanAllowance),
        last_refreshed: firestore.FieldValue.serverTimestamp(),
      };

      // Write onboarding status and details to the user profile in Firestore
      await firestore()
        .collection("users")
        .doc(userUid)
        .update({
          onboardingCompleted: true,
          onboarding: onboardingData
        });

      // Also create their first goal in the goals subcollection matching the 'goals' table columns
      await firestore()
        .collection("users")
        .doc(userUid)
        .collection("goals")
        .add({
          name: goalName,
          target_amount: String(targetAmount),
          time_to_reach: parseInt(String(timeToReach), 10) || 6,
          progress: 0,
          priority: parseInt(String(routeParams.priority || 3), 10) || 3,
          is_active: 1,
          created_at: firestore.FieldValue.serverTimestamp()
        });

      // Maintain structure for screen navigation context compatibility
      const updatedUser = {
        ...routeParams.user,
        onboardingCompleted: true,
        onboarding: onboardingData
      };

      navigation.navigate("Dashboard", { user: updatedUser });
    } catch (error) {
      console.error("Error saving onboarding details to Firestore:", error);
      Alert.alert(
        "Onboarding Failed",
        "Could not save your setup details. Please check your internet connection and try again."
      );
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
