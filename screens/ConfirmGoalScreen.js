// ConfirmGoalScreen.js
import { API_BASE_URL } from "../config";
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Platform,
  Alert,
  Animated,
  useWindowDimensions,
} from "react-native";
import { BlurView } from "expo-blur";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BackgroundGrid from "../components/BackgroundGrid";

export default function ConfirmGoalScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const isSmallDevice = height < 700;

  // Extract navigation parameters
  const { user, goalName, targetAmount, goalImage, timeToReach } = route.params || {};
  const onboarding = user?.onboarding || {};
  const frequency = onboarding.frequency || "Monthly";

  const getGoalIcon = (name) => {
    if (!name) return { lib: Feather, name: "target", color: "#9D4EDD" };
    const q = name.toLowerCase().trim();
    if (q.includes("shoe") || q.includes("nike") || q.includes("adidas") || q.includes("sneaker") || q.includes("puma") || q.includes("jordan") || q.includes("footwear")) {
      return { lib: MaterialCommunityIcons, name: "shoe-sneaker", color: "#FF5E7E" };
    }
    if (q.includes("football") || q.includes("soccer") || q.includes("ball") || q.includes("cricket") || q.includes("bat") || q.includes("sport") || q.includes("gym") || q.includes("fit")) {
      return { lib: Feather, name: "award", color: "#4EA8DE" };
    }
    if (q.includes("headphones") || q.includes("sony") || q.includes("music") || q.includes("earphone") || q.includes("airpods") || q.includes("headset") || q.includes("song")) {
      return { lib: Feather, name: "headphones", color: "#9D4EDD" };
    }
    if (q.includes("controller") || q.includes("gamepad") || q.includes("ps5") || q.includes("playstation") || q.includes("xbox") || q.includes("nintendo") || q.includes("gaming") || q.includes("console")) {
      return { lib: MaterialCommunityIcons, name: "gamepad-variant", color: "#FF9F1C" };
    }
    if (q.includes("bike") || q.includes("bicycle") || q.includes("cycle")) {
      return { lib: MaterialCommunityIcons, name: "bike", color: "#2EC4B6" };
    }
    if (q.includes("laptop") || q.includes("macbook") || q.includes("computer") || q.includes("pc") || q.includes("monitor") || q.includes("tech") || q.includes("device") || q.includes("electronics")) {
      return { lib: Feather, name: "laptop", color: "#70E000" };
    }
    if (q.includes("watch") || q.includes("smartwatch") || q.includes("rolex") || q.includes("accessory")) {
      return { lib: Feather, name: "watch", color: "#FFD166" };
    }
    if (q.includes("book") || q.includes("novel") || q.includes("read") || q.includes("study") || q.includes("course")) {
      return { lib: Feather, name: "book-open", color: "#FF6B6B" };
    }
    if (q.includes("car") || q.includes("drive") || q.includes("vehicle") || q.includes("tesla")) {
      return { lib: Ionicons, name: "car-sport-outline", color: "#3A86C8" };
    }
    if (q.includes("travel") || q.includes("trip") || q.includes("flight") || q.includes("vacation") || q.includes("hotel")) {
      return { lib: Ionicons, name: "airplane-outline", color: "#5BC0EB" };
    }
    return { lib: Feather, name: "target", color: "#9D4EDD" };
  };

  const [isUpdating, setIsUpdating] = useState(false);
  const confirmScale = useRef(new Animated.Value(1)).current;
  const cancelScale = useRef(new Animated.Value(1)).current;

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

  const handleConfirm = async () => {
    setIsUpdating(true);
    try {
      const response = await fetch(`${API_BASE_URL}/update_goal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user?.id || user?.userId || user?._id,
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
      console.log(error);
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
        {/* Product Image */}
        <View style={styles.productImageContainer}>
          {(() => {
            const iconInfo = getGoalIcon(goalName);
            const IconLib = iconInfo.lib;
            return <IconLib name={iconInfo.name} size={48} color={iconInfo.color} />;
          })()}
        </View>

        {/* Goal Name */}
        <Text style={styles.productTitle}>{goalName || "Savings Goal"}</Text>

        {/* Target Amount */}
        <Text style={styles.productPrice}>₹{targetAmount || "0"}</Text>

        {/* Time estimate */}
        {timeToReach > 0 && (
          <Text style={styles.timeEstimate}>
            {timeToReach} {frequency === "Weekly" ? (timeToReach === 1 ? "week" : "weeks") : (timeToReach === 1 ? "month" : "months")} to reach
          </Text>
        )}

        {/* Spacer */}
        <View style={{ flex: 1 }} />

        {/* Button Row */}
        <View style={styles.buttonRow}>
          {/* Cancel Button */}
          <View style={styles.cancelButtonContainer}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              onPressIn={() => handlePressIn(cancelScale)}
              onPressOut={() => handlePressOut(cancelScale)}
              activeOpacity={1}
              style={{ flex: 1 }}
            >
              <Animated.View style={[styles.buttonScaleWrapper, buttonScaleStyle(cancelScale)]}>
                <View style={styles.cancelButton}>
                  <Text style={styles.cancelButtonText}>Go Back</Text>
                </View>
              </Animated.View>
            </TouchableOpacity>
          </View>

          {/* Confirm Button */}
          <View style={styles.confirmButtonContainer}>
            <TouchableOpacity
              onPress={handleConfirm}
              onPressIn={() => handlePressIn(confirmScale)}
              onPressOut={() => handlePressOut(confirmScale)}
              disabled={isUpdating}
              activeOpacity={1}
              style={{ flex: 1 }}
            >
              <Animated.View style={[styles.buttonScaleWrapper, buttonScaleStyle(confirmScale)]}>
                <View style={styles.confirmButtonSolid}>
                  {isUpdating ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.confirmButtonText}>Confirm</Text>
                  )}
                </View>
              </Animated.View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#111210",
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  productImageContainer: {
    width: 180,
    height: 180,
    borderRadius: 16,
    backgroundColor: "#111210",
    borderWidth: 1,
    borderColor: "#2C2D35",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 20,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 22,
  },
  productPrice: {
    fontSize: 24,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 4,
  },
  timeEstimate: {
    fontSize: 13,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 8,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 50,
  },
  cancelButtonContainer: {
    flex: 1,
    marginRight: 8,
    height: "100%",
  },
  cancelButton: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#8A90A8",
    fontSize: 15,
    fontFamily: "DMSerifDisplay-Regular",
  },
  confirmButtonContainer: {
    flex: 1,
    marginLeft: 8,
    height: "100%",
  },
  buttonScaleWrapper: {
    flex: 1,
  },
  confirmButtonSolid: {
    flex: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "DMSerifDisplay-Regular",
  },
});
