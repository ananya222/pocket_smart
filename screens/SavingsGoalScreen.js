// SavingsGoalScreen.js

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  useWindowDimensions,
  Animated,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BackgroundGrid from "../components/BackgroundGrid";
import { styles } from "../styles/SavingsGoalScreen.styles";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function SavingsGoalScreen({ navigation, route }) {
  console.log("SavingsGoal Screen Params:", route.params);

  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // ── Route params ────────────────────────────────────────────────────────────
  const routeParams = route?.params || {};
  const allowanceStr = routeParams.allowance || "5,000";
  const freq = routeParams.frequency || "Weekly";
  const savingRatio = routeParams.savingRatio || 30;

  // ── State ────────────────────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState("Sony Headphones");
  const [targetAmount, setTargetAmount] = useState("8,000");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isAmountFocused, setIsAmountFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [goalImage, setGoalImage] = useState(null);

  // ── Animation refs ───────────────────────────────────────────────────────────
  const createGoalScale = useRef(new Animated.Value(1)).current;
  const createGoalScaleStyle = React.useMemo(
    () => ({ transform: [{ scale: createGoalScale }], flex: 1 }),
    [createGoalScale]
  );

  // ── Viewport-responsive metrics ──────────────────────────────────────────────
  const metrics = React.useMemo(() => {
    const cardMarginTop   = Math.max(16, Math.min(28, height * 0.035));
    const marginSpacing   = Math.max(8,  Math.min(20, (height - 540) / 12));
    const previewSize     = Math.max(64, Math.min(90, height * 0.10));
    const previewImgSize  = previewSize - 10;
    const innerCardPadding = Math.max(8,  Math.min(14, height * 0.015));
    const cardPaddingTop  = Math.max(14, Math.min(28, height * 0.035));
    const cardPaddingBottom = Math.max(10, Math.min(18, height * 0.022));
    const inputHeight     = Math.max(40, Math.min(48, height * 0.06));
    return {
      cardMarginTop,
      marginSpacing,
      previewSize,
      previewImgSize,
      innerCardPadding,
      cardPaddingTop,
      cardPaddingBottom,
      inputHeight,
    };
  }, [height]);

  const goalIllustrationStyle = React.useMemo(() => ({
    width: metrics.previewImgSize,
    height: metrics.previewImgSize,
    borderRadius: 10,
  }), [metrics.previewImgSize]);

  // ── Derived savings timeline ─────────────────────────────────────────────────
  const numericAllowance = parseInt(allowanceStr.replace(/[^0-9]/g, ""), 10) || 0;
  const numericTarget    = parseInt(targetAmount.replace(/[^0-9]/g, ""), 10) || 0;
  const savingAmount     = Math.round(numericAllowance * (savingRatio / 100));
  const timeToReach = (savingAmount > 0 && numericTarget > 0)
    ? Math.ceil(numericTarget / savingAmount)
    : null;

  // ── Spring animation helpers ─────────────────────────────────────────────────
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

  // ── Input handlers ───────────────────────────────────────────────────────────
  const handleAmountChange = (val) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean) {
      setTargetAmount("");
      return;
    }
    setTargetAmount(parseInt(clean, 10).toLocaleString("en-IN"));
  };

  const handleSearchChange = (val) => {
    setSearchQuery(val);
    const normalized = val.toLowerCase().trim();
    if (["sony headphones", "sony headphone", "headphones"].includes(normalized)) {
      setTargetAmount("8,000");
    } else if (["ps5 controller", "controller", "playstation 5 controller"].includes(normalized)) {
      setTargetAmount("5,499");
    } else if (["mountain bike", "bicycle", "bike"].includes(normalized)) {
      setTargetAmount("15,000");
    }
  };

  // ── Navigation ───────────────────────────────────────────────────────────────
  const handleCreateGoal = async () => {
    if (routeParams.fromDashboard) {
      if (!searchQuery.trim()) {
        Alert.alert("Input Required", "Please enter a name for your savings goal.");
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch("http://192.168.1.4:5000/add_goal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: routeParams.user?.id || routeParams.user?.userId,
            goalName: searchQuery,
            targetAmount: targetAmount,
            timeToReach: timeToReach || 6,
            goalImage: goalImage,
            progressAmount: 0
          })
        });
        const data = await response.json();
        if (response.ok) {
          Alert.alert("Success", "New savings goal added successfully!", [
            {
              text: "OK",
              onPress: () => {
                navigation.navigate("Dashboard", { user: routeParams.user });
              }
            }
          ]);
        } else {
          Alert.alert("Failed", data.error || "Could not add goal.");
        }
      } catch (error) {
        console.log("Add goal failed:", error);
        Alert.alert("Network Error", "Could not connect to the server.");
      } finally {
        setIsLoading(false);
      }
    } else {
      navigation.navigate("OnboardingComplete", {
        user: routeParams.user,
        allowance: allowanceStr,
        frequency: freq,
        goalName: searchQuery,
        targetAmount,
        timeToReach,
        goalImage,
      });
    }
  };

  // ── Icon / illustration helpers ──────────────────────────────────────────────
  const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 47 : StatusBar.currentHeight || 24;

  const getSelectedIcon = () => {
    const q = searchQuery.toLowerCase();
    if (q.includes("headphones") || q.includes("sony") || q.includes("earphone") || q.includes("headset"))
      return "headphones";
    if (q.includes("controller") || q.includes("ps5") || q.includes("playstation") || q.includes("game") || q.includes("gamepad") || q.includes("xbox"))
      return "gamepad";
    if (q.includes("bicycle") || q.includes("bike") || q.includes("cycle"))
      return "bicycle";
    return "default";
  };

  const selectedIcon = getSelectedIcon();

  const renderGoalIllustration = (size) => {
    if (goalImage) {
      return (
        <Image
          source={{ uri: goalImage }}
          style={goalIllustrationStyle}
          resizeMode="contain"
        />
      );
    }
    if (selectedIcon === "headphones") {
      return (
        <Image
          source={require("../assets/images/savings_headphones.png")}
          style={goalIllustrationStyle}
          resizeMode="contain"
        />
      );
    }
    if (selectedIcon === "gamepad") {
      return <Ionicons name="game-controller-outline" size={size * 0.55} color="#9D4EDD" />;
    }
    if (selectedIcon === "bicycle") {
      return <Ionicons name="bicycle-outline" size={size * 0.55} color="#9D4EDD" />;
    }
    return <Ionicons name="gift-outline" size={size * 0.55} color="#9D4EDD" />;
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <BackgroundGrid type="goals" />

      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={[styles.backButtonContainer, { top: STATUS_BAR_HEIGHT + 10 }]}
      >
        <Feather name="arrow-left" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Header */}
      <View style={[styles.headerTextContainer, { paddingTop: STATUS_BAR_HEIGHT + 60 }]}>
        <Text style={styles.headerTitle}>
          {routeParams.fromDashboard ? "Add a New\nSavings Goal!" : "Set Your First\nSavings Goal!"}
        </Text>
      </View>

      {/* White card */}
      <View
        style={[
          styles.card,
          {
            marginTop: metrics.cardMarginTop,
            paddingTop: metrics.cardPaddingTop,
            paddingBottom: metrics.cardPaddingBottom + insets.bottom,
          },
        ]}
      >
        <View style={{ flex: 1, paddingBottom: Platform.OS === "ios" ? 10 : 16 }}>

          {/* ── Goal Name Input ─────────────────────────── */}
          <Text style={styles.sectionTitle}>Goal Name:</Text>
          <View
            style={[
              styles.searchBarContainer,
              isSearchFocused && styles.searchBarContainerFocused,
              { marginBottom: metrics.marginSpacing, height: metrics.inputHeight },
            ]}
          >
            <TextInput
              style={[styles.searchInput, { paddingLeft: 14 }]}
              placeholder="e.g. Sony Headphones"
              placeholderTextColor="#8A90A8"
              value={searchQuery}
              onChangeText={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </View>

          {/* ── Target Amount Input ──────────────────────── */}
          <Text style={styles.sectionTitle}>Target Amount:</Text>
          <View
            style={[
              styles.inputContainer,
              isAmountFocused && styles.inputContainerFocused,
              { marginBottom: metrics.marginSpacing, height: metrics.inputHeight },
            ]}
          >
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.inputFlex}
              placeholder="8,000"
              placeholderTextColor="#8A90A8"
              keyboardType="numeric"
              value={targetAmount}
              onChangeText={handleAmountChange}
              onFocus={() => setIsAmountFocused(true)}
              onBlur={() => setIsAmountFocused(false)}
            />
          </View>

          {/* ── Time-to-reach hint ───────────────────────── */}
          {timeToReach !== null && (
            <View style={[styles.progressWrapper, { marginBottom: metrics.marginSpacing }]}>
              <Text style={styles.progressText}>
                At your saving rate you'll reach this goal in{" "}
                <Text style={styles.progressBold}>
                  {timeToReach} {freq === "Weekly" ? "week" : "month"}
                  {timeToReach !== 1 ? "s" : ""}
                </Text>
                .
              </Text>
            </View>
          )}

          {/* ── Goal Preview Card ────────────────────────── */}
          <Text style={styles.sectionTitle}>Goal Preview:</Text>
          <View
            style={[
              styles.previewCard,
              { marginBottom: metrics.marginSpacing, padding: metrics.innerCardPadding },
            ]}
          >
            <View
              style={[
                styles.previewImageContainer,
                { width: metrics.previewSize, height: metrics.previewSize },
              ]}
            >
              {renderGoalIllustration(metrics.previewImgSize)}
            </View>
            <Text style={styles.previewText} numberOfLines={2}>
              {searchQuery || "Savings Goal"}
            </Text>
          </View>

          {/* ── Create Goal CTA ──────────────────────────── */}
          <TouchableOpacity
            onPress={handleCreateGoal}
            onPressIn={() => handlePressIn(createGoalScale)}
            onPressOut={() => handlePressOut(createGoalScale)}
            activeOpacity={1}
            disabled={isLoading}
            style={styles.buttonContainer}
          >
            <Animated.View style={[styles.buttonScaleWrapper, createGoalScaleStyle]}>
              <LinearGradient
                colors={["#9D4EDD", "#7B2CBF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>
                    {routeParams.fromDashboard ? "Add Goal" : "Create Goal"}
                  </Text>
                )}
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
}