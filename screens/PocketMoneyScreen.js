// PocketMoneyScreen.js

import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  useWindowDimensions,
  Animated,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BackgroundGrid from "../components/BackgroundGrid";
import { styles, chartStyles } from "../styles/PocketMoneyScreen.styles";
import { Feather, FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// ─────────────────────────────────────────────
// Half-circle helper (purple left, transparent right)
// ─────────────────────────────────────────────
function PurpleHalfCircleLeft({ style }) {
  return (
    <View style={[chartStyles.halfCircleContainer, style]}>
      <View style={chartStyles.halfCirclePurpleLeft} />
    </View>
  );
}

// ─────────────────────────────────────────────
// Pie Chart
// ─────────────────────────────────────────────
function PieChart({ savingRatio }) {
  const S = savingRatio;
  const deg = (S / 100) * 360;

  const rotateStyle = React.useMemo(
    () => ({ transform: [{ rotate: `${deg}deg` }] }),
    [deg]
  );

  const rotate180Style = React.useMemo(
    () => ({ transform: [{ rotate: "180deg" }] }),
    []
  );

  return (
    <View style={chartStyles.container}>
      {/* Base circle — spending colour */}
      <View style={chartStyles.circleBlue} collapsable={false}>
        {S > 0 && S <= 50 ? (
          // Savings ≤ 50%: show only the right-half rotated by deg
          <View style={chartStyles.rightHalfContainer} collapsable={false}>
            <PurpleHalfCircleLeft style={[chartStyles.rightHalfPurple, rotateStyle]} />
          </View>
        ) : S > 50 ? (
          // Savings > 50%: full right half + left half rotated
          <>
            <View style={chartStyles.rightHalfContainer} collapsable={false}>
              <PurpleHalfCircleLeft style={[chartStyles.rightHalfPurple, rotate180Style]} />
            </View>
            <View style={chartStyles.leftHalfContainer} collapsable={false}>
              <PurpleHalfCircleLeft style={[chartStyles.leftHalfPurple, rotateStyle]} />
            </View>
          </>
        ) : null}
      </View>
    </View>
  );
}

// ─────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────
export default function PocketMoneyScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // ── State ──────────────────────────────────
  const [allowance, setAllowance] = useState("5,000");
  const [frequency, setFrequency] = useState("Weekly");
  const [savingRatio, setSavingRatio] = useState(30);
  const [isFocused, setIsFocused] = useState(false);
  const [sliderLayout, setSliderLayout] = useState({ pageY: 0, height: 240 });

  // ── Animation refs ─────────────────────────
  const backScale = useRef(new Animated.Value(1)).current;
  const nextScale = useRef(new Animated.Value(1)).current;
  const nextScaleStyle = { transform: [{ scale: nextScale }], flex: 1 };

  const containerRef = useRef(null);

  // ── Helpers ────────────────────────────────
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

  // Measure the absolute on-screen position of the slider track
  const measureSlider = () => {
    if (containerRef.current) {
      containerRef.current.measure((x, y, w, h, pageX, pageYOffset) => {
        if (h > 0) {
          setSliderLayout({ pageY: pageYOffset, height: h });
        }
      });
    }
  };

  // Format allowance with Indian commas
  const handleAllowanceChange = (val) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean) {
      setAllowance("");
      return;
    }
    setAllowance(parseInt(clean, 10).toLocaleString("en-IN"));
  };

  // Convert a touch pageY into a saving ratio (0-100)
  const handleTouch = (pageY) => {
    const { pageY: pageYOffset, height: trackContainerHeight } = sliderLayout;
    if (trackContainerHeight === 0) return;

    const relativeY = pageY - pageYOffset;
    const margin = 10;
    const clampedY = Math.max(margin, Math.min(trackContainerHeight - margin, relativeY));
    const trackHeight = trackContainerHeight - margin * 2;
    const ratio = 1 - (clampedY - margin) / trackHeight;
    // Round to nearest 5 for clean snapping
    const newRatio = Math.round(ratio * 100 / 5) * 5;
    setSavingRatio(Math.max(0, Math.min(100, newRatio)));
  };

  // ── Derived values ─────────────────────────
  const numericAllowance = parseInt(allowance.replace(/[^0-9]/g, ""), 10) || 0;
  const spendingPercent = 100 - savingRatio;
  const savingAmount = Math.round(numericAllowance * (savingRatio / 100));
  const spendingAmount = Math.round(numericAllowance * (spendingPercent / 100));

  const trackHeight = sliderLayout.height - 20;
  const knobBottom = (savingRatio / 100) * trackHeight - 4;

  const STATUS_BAR_HEIGHT =
    Platform.OS === "ios" ? 47 : StatusBar.currentHeight || 24;

  // ── Render ─────────────────────────────────
  return (
    <LinearGradient
      colors={["#9D4EDD", "#7B2CBF"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.mainContainer}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <BackgroundGrid type="pocket_money" />

      {/* Back button */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Welcome")}
        style={[styles.backButtonContainer, { top: STATUS_BAR_HEIGHT + 10 }]}
      >
        <Feather name="arrow-left" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Header */}
      <View style={[styles.headerTextContainer, { paddingTop: STATUS_BAR_HEIGHT + 80 }]}>
        <Text style={styles.headerTitle}>{"Setup Your\nPocket Money"}</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Allowance Input ─────────────────── */}
        <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.inputFlex}
            placeholder="5,000"
            placeholderTextColor="#9CA3AF"
            keyboardType="numeric"
            value={allowance}
            onChangeText={handleAllowanceChange}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
          />
        </View>

        {/* ── Frequency Toggle ────────────────── */}
        <View style={styles.frequencyRow}>
          <Text style={styles.frequencyLabel}>Frequency:</Text>
          <View style={styles.pillContainer}>
            <TouchableOpacity
              onPress={() => setFrequency("Weekly")}
              style={[
                styles.frequencyPill,
                frequency === "Weekly" && styles.activePillWeekly,
              ]}
            >
              <Text
                style={[
                  styles.frequencyPillText,
                  frequency === "Weekly" && styles.activePillText,
                ]}
              >
                Weekly
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setFrequency("Monthly")}
              style={[
                styles.frequencyPill,
                frequency === "Monthly" && styles.activePillMonthly,
              ]}
            >
              <Text
                style={[
                  styles.frequencyPillText,
                  frequency === "Monthly" && styles.activePillText,
                ]}
              >
                Monthly
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Ratio Section ───────────────────── */}
        <Text style={styles.sectionTitle}>Set Spending vs. Saving Ratio</Text>

        <View style={styles.ratioContainer}>
          {/* Left: Vertical Slider */}
          <View style={styles.sliderColumn}>
            <Text style={styles.sliderLabel}>Spending</Text>

            <View
              ref={containerRef}
              style={styles.sliderTrackContainer}
              onLayout={measureSlider}
              onStartShouldSetResponder={() => true}
              onMoveShouldSetResponder={() => true}
              onResponderGrant={(evt) => handleTouch(evt.nativeEvent.pageY)}
              onResponderMove={(evt) => handleTouch(evt.nativeEvent.pageY)}
            >
              {/* Track */}
              <View style={[styles.sliderTrack, { backgroundColor: "#7B2CBF" }]}>
                {/* Active (spending) fill — from top down */}
                <View
                  style={[
                    styles.sliderActiveTrack,
                    styles.sliderActiveTrackFill,
                    { height: `${spendingPercent}%` },
                  ]}
                />
              </View>

              {/* Knob */}
              <View style={[styles.sliderThumb, { bottom: knobBottom }]}>
                <View style={styles.sliderThumbInner} />
              </View>
            </View>

            <Text style={styles.sliderLabel}>Saving</Text>
          </View>

          {/* Right: Pie Chart + Labels */}
          <View style={styles.chartColumn}>
            <PieChart savingRatio={savingRatio} />

            <View style={styles.chartLabelsContainer}>
              <View style={styles.chartLabelRow}>
                <View style={[styles.dot, styles.dotBlue]} />
                <Text style={styles.chartLabelText}>
                  SPENDING ({spendingPercent}%):{" "}
                  <Text style={styles.chartLabelBold}>
                    ₹{spendingAmount.toLocaleString("en-IN")}
                  </Text>
                </Text>
              </View>

              <View style={styles.chartLabelRow}>
                <View style={[styles.dot, styles.dotPurple]} />
                <Text style={styles.chartLabelText}>
                  SAVING ({savingRatio}%):{" "}
                  <Text style={styles.chartLabelBold}>
                    ₹{savingAmount.toLocaleString("en-IN")}
                  </Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* ── Back / Next Buttons ─────────────── */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Welcome")}
            onPressIn={() => handlePressIn(backScale)}
            onPressOut={() => handlePressOut(backScale)}
            activeOpacity={1}
            style={styles.backButton}
          >
            <Animated.View style={{ transform: [{ scale: backScale }] }}>
              <Text style={styles.backButtonText}>Back</Text>
            </Animated.View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() =>
              navigation.navigate("SavingsGoal", {
                user: route.params?.user,
                allowance,
                frequency,
                savingRatio,
              })
            }
            onPressIn={() => handlePressIn(nextScale)}
            onPressOut={() => handlePressOut(nextScale)}
            activeOpacity={1}
            style={styles.nextButton}
          >
            <Animated.View style={nextScaleStyle}>
              <LinearGradient
                colors={["#9D4EDD", "#7B2CBF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.nextButtonGradient}
              >
                <Text style={styles.nextButtonText}>Next</Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}