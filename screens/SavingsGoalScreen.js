// SavingsGoalScreen.js
import { API_BASE_URL } from "../config";
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
  const [priority, setPriority] = useState(3);

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
        const response = await fetch(`${API_BASE_URL}/add_goal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: routeParams.user?.id || routeParams.user?.userId,
            goalName: searchQuery,
            targetAmount: targetAmount,
            timeToReach: timeToReach || 6,
            goalImage: goalImage,
            progressAmount: 0,
            priority: priority
          })
        });
        const data = await response.json();
        if (response.ok) {
          navigation.navigate("Dashboard", { user: routeParams.user });
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
        priority: priority
      });
    }
  };

  // ── Icon / illustration helpers ──────────────────────────────────────────────
  const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 47 : StatusBar.currentHeight || 24;

  const getSelectedIcon = () => {
    const q = searchQuery.toLowerCase();
    if (q.includes("headphones") || q.includes("sony") || q.includes("earphone") || q.includes("headset") || q.includes("music"))
      return "headphones";
    if (q.includes("controller") || q.includes("ps5") || q.includes("playstation") || q.includes("game") || q.includes("gamepad") || q.includes("xbox"))
      return "gamepad";
    if (q.includes("bicycle") || q.includes("bike") || q.includes("cycle"))
      return "bicycle";
    if (q.includes("shoe") || q.includes("nike") || q.includes("adidas") || q.includes("sneaker") || q.includes("puma") || q.includes("jordan"))
      return "shoe";
    if (q.includes("football") || q.includes("soccer") || q.includes("ball") || q.includes("cricket") || q.includes("bat") || q.includes("sport") || q.includes("gym") || q.includes("fit"))
      return "award";
    if (q.includes("laptop") || q.includes("macbook") || q.includes("computer") || q.includes("pc") || q.includes("monitor") || q.includes("tech"))
      return "laptop";
    if (q.includes("watch") || q.includes("smartwatch") || q.includes("rolex"))
      return "watch";
    if (q.includes("book") || q.includes("novel") || q.includes("read") || q.includes("study"))
      return "book";
    if (q.includes("car") || q.includes("drive") || q.includes("vehicle"))
      return "car";
    if (q.includes("travel") || q.includes("trip") || q.includes("flight") || q.includes("vacation"))
      return "airplane";
    return "default";
  };

  const selectedIcon = getSelectedIcon();

  const renderGoalIllustration = (size) => {
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
    if (selectedIcon === "shoe") {
      return <MaterialCommunityIcons name="shoe-sneaker" size={size * 0.55} color="#9D4EDD" />;
    }
    if (selectedIcon === "award") {
      return <Ionicons name="trophy-outline" size={size * 0.55} color="#9D4EDD" />;
    }
    if (selectedIcon === "laptop") {
      return <Ionicons name="laptop-outline" size={size * 0.55} color="#9D4EDD" />;
    }
    if (selectedIcon === "watch") {
      return <Ionicons name="watch-outline" size={size * 0.55} color="#9D4EDD" />;
    }
    if (selectedIcon === "book") {
      return <Ionicons name="book-outline" size={size * 0.55} color="#9D4EDD" />;
    }
    if (selectedIcon === "car") {
      return <Ionicons name="car-sport-outline" size={size * 0.55} color="#9D4EDD" />;
    }
    if (selectedIcon === "airplane") {
      return <Ionicons name="airplane-outline" size={size * 0.55} color="#9D4EDD" />;
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
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: Platform.OS === "ios" ? 10 : 16 }} showsVerticalScrollIndicator={false}>

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

          {/* ── Goal Priority Selection ────────────────────── */}
          <Text style={styles.sectionTitle}>Goal Priority:</Text>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: metrics.marginSpacing }}>
            {[1, 2, 3, 4, 5].map((num) => {
              const isSelected = priority === num;
              
              // Map numbers to professional labels and colors
              let label = "Medium";
              let activeColor = "#9D4EDD";
              if (num === 1) { label = "Critical"; activeColor = "#EF476F"; }
              else if (num === 2) { label = "High"; activeColor = "#F77F00"; }
              else if (num === 3) { label = "Medium"; activeColor = "#FFD166"; }
              else if (num === 4) { label = "Low"; activeColor = "#06D6A0"; }
              else if (num === 5) { label = "Wishlist"; activeColor = "#118AB2"; }

              return (
                <TouchableOpacity
                  key={num}
                  onPress={() => setPriority(num)}
                  activeOpacity={0.8}
                  style={{
                    flex: 1,
                    marginHorizontal: 2,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: isSelected ? activeColor : "rgba(255, 255, 255, 0.08)",
                    backgroundColor: isSelected ? `${activeColor}1F` : "rgba(255, 255, 255, 0.03)",
                    paddingVertical: 8,
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Text style={{
                    color: isSelected ? "#FFFFFF" : "#8A90A8",
                    fontSize: 14,
                    fontFamily: "Geist-SemiBold"
                  }}>
                    {num}
                  </Text>
                  <Text style={{
                    color: isSelected ? "#FFFFFF" : "#8A90A8",
                    fontSize: 8,
                    fontFamily: "Geist-Regular",
                    marginTop: 2,
                    textAlign: "center"
                  }}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

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
              <View style={styles.buttonSolid}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.buttonText}>
                    {routeParams.fromDashboard ? "Add Goal" : "Create Goal"}
                  </Text>
                )}
              </View>
            </Animated.View>
          </TouchableOpacity>

        </ScrollView>
      </View>
    </View>
  );
}