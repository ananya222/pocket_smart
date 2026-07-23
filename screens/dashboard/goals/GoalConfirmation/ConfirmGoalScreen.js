import { API_BASE_URL, apiFetch } from "../../../../config";
import React, { useState } from "react";
import {
  View,
  StatusBar,
  Platform,
  Alert,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundGrid from "../../../../components/BackgroundGrid/BackgroundGrid";
import { styles } from "./ConfirmGoalScreen.styles";
import ConfirmGoalDetails from "./components/ConfirmGoalDetails/ConfirmGoalDetails";
import ConfirmGoalActionButtons from "./components/ConfirmGoalActionButtons/ConfirmGoalActionButtons";

export default function ConfirmGoalScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmallDevice = height < 700;

  // Extract navigation parameters
  const { user, goalName, targetAmount, goalImage, timeToReach } = route.params || {};
  const onboarding = user?.onboarding || {};
  const frequency = onboarding.frequency || "Monthly";

  const [isUpdating, setIsUpdating] = useState(false);

  const handleConfirm = async () => {
    setIsUpdating(true);
    try {
      const response = await apiFetch("/update_goal", {
        method: "POST",
        body: JSON.stringify({
          goalName,
          targetAmount,
          goalImage,
          timeToReach,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedUser = {
          ...user,
          onboarding: {
            ...onboarding,
            goalName,
            targetAmount,
            goalImage,
            timeToReach,
            savingsProgressAmount: 0,
          },
        };
        Alert.alert("Goal Updated", `Your savings goal has been updated to "${goalName}".`, [
          { text: "OK", onPress: () => navigation.navigate("Dashboard", { user: updatedUser }) },
        ]);
      } else {
        Alert.alert("Update Failed", data.error || "Could not update your goal.");
      }
    } catch (error) {
      Alert.alert("Network Error", "Could not connect to the server. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <BackgroundGrid type="goals" />

      <View style={[styles.contentContainer, { paddingTop: STATUS_BAR_HEIGHT + 40, paddingBottom: insets.bottom + 20 }]}>
        <ConfirmGoalDetails
          goalName={goalName}
          targetAmount={targetAmount}
          timeToReach={timeToReach}
          frequency={frequency}
        />

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        <ConfirmGoalActionButtons
          onCancel={() => navigation.goBack()}
          onConfirm={handleConfirm}
          isUpdating={isUpdating}
        />
      </View>
    </View>
  );
}


