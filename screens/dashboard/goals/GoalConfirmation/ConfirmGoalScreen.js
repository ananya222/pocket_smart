import { auth, firestore } from "../../../../config";
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
      const userUid = user.id || user.userId || auth().currentUser?.uid;
      if (userUid) {
        const cleanTarget = parseFloat(String(targetAmount).replace(/,/g, "")) || 8000;
        
        await firestore()
          .collection("users")
          .doc(userUid)
          .collection("goals")
          .add({
            name: goalName,
            target_amount: String(cleanTarget),
            time_to_reach: parseInt(String(timeToReach), 10) || 6,
            progress: 0,
            priority: 3,
            is_active: 1,
            created_at: firestore.FieldValue.serverTimestamp()
          });

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
        Alert.alert("Update Failed", "No authenticated user session found.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not save your goal. Please try again.");
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


