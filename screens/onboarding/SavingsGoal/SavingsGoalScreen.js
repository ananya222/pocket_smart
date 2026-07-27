import { auth, firestore } from "../../../config";
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
import BackgroundGrid from "../../../components/BackgroundGrid/BackgroundGrid";
import { styles } from "./SavingsGoalScreen.styles";
import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import SavingsGoalHeader from "./components/SavingsGoalHeader/SavingsGoalHeader";
import SavingsGoalInput from "./components/SavingsGoalInput/SavingsGoalInput";
import SavingsGoalAmountInput from "./components/SavingsGoalAmountInput/SavingsGoalAmountInput";
import SavingsGoalProgressHint from "./components/SavingsGoalProgressHint/SavingsGoalProgressHint";
import SavingsGoalPrioritySelector from "./components/SavingsGoalPrioritySelector/SavingsGoalPrioritySelector";
import SavingsGoalPreview from "./components/SavingsGoalPreview/SavingsGoalPreview";
import SavingsGoalCreateButton from "./components/SavingsGoalCreateButton/SavingsGoalCreateButton";

export default function SavingsGoalScreen({ navigation, route }) {

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
        const userUid = routeParams.user?.id || routeParams.user?.userId || auth().currentUser?.uid;
        if (!userUid) throw new Error("No authenticated user.");

        await firestore()
          .collection("users")
          .doc(userUid)
          .collection("goals")
          .add({
            name: searchQuery,
            target_amount: String(targetAmount),
            time_to_reach: parseInt(String(timeToReach), 10) || 6,
            progress: 0,
            priority: parseInt(String(priority), 10) || 3,
            is_active: 1,
            created_at: firestore.FieldValue.serverTimestamp()
          });

        navigation.navigate("Dashboard", { user: routeParams.user });
      } catch (error) {
        console.error("Error creating goal in SavingsGoalScreen:", error);
        Alert.alert("Failed", "Could not add goal.");
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
          source={require("../../../assets/images/savings_headphones.png")}
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

      {/* Header */}
      <SavingsGoalHeader
        onBackPress={() => navigation.goBack()}
        title={routeParams.fromDashboard ? "Add a New\nSavings Goal!" : "Set Your First\nSavings Goal!"}
        statusBarHeight={STATUS_BAR_HEIGHT}
      />

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
          <SavingsGoalInput
            searchQuery={searchQuery}
            handleSearchChange={handleSearchChange}
            isSearchFocused={isSearchFocused}
            setIsSearchFocused={setIsSearchFocused}
            marginSpacing={metrics.marginSpacing}
            inputHeight={metrics.inputHeight}
          />

          {/* ── Target Amount Input ──────────────────────── */}
          <SavingsGoalAmountInput
            targetAmount={targetAmount}
            handleAmountChange={handleAmountChange}
            isAmountFocused={isAmountFocused}
            setIsAmountFocused={setIsAmountFocused}
            marginSpacing={metrics.marginSpacing}
            inputHeight={metrics.inputHeight}
          />

          {/* ── Time-to-reach hint ───────────────────────── */}
          <SavingsGoalProgressHint
            timeToReach={timeToReach}
            freq={freq}
            marginSpacing={metrics.marginSpacing}
          />

          {/* ── Goal Priority Selection ────────────────────── */}
          <SavingsGoalPrioritySelector
            priority={priority}
            setPriority={setPriority}
            marginSpacing={metrics.marginSpacing}
          />

          {/* ── Goal Preview Card ────────────────────────── */}
          <SavingsGoalPreview
            searchQuery={searchQuery}
            renderGoalIllustration={renderGoalIllustration}
            metrics={metrics}
          />

          {/* ── Create Goal CTA ──────────────────────────── */}
          <SavingsGoalCreateButton
            handleCreateGoal={handleCreateGoal}
            isLoading={isLoading}
            isFromDashboard={routeParams.fromDashboard}
            createGoalScale={createGoalScale}
            createGoalScaleStyle={createGoalScaleStyle}
            handlePressIn={handlePressIn}
            handlePressOut={handlePressOut}
          />

        </ScrollView>
      </View>
    </View>
  );
}
