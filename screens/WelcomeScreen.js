// WelcomeScreen.js

import React, { useRef } from "react";
import {
  View, Text, TouchableOpacity, Platform, StatusBar,
  ScrollView, Animated
} from "react-native";
import { BlurView } from "expo-blur";
import BackgroundGrid from "../components/BackgroundGrid";
import { styles } from "../styles/WelcomeScreen.styles";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();

  const getStartedScale = useRef(new Animated.Value(1)).current;

  const getStartedScaleStyle = React.useMemo(() => ({
    transform: [{ scale: getStartedScale }]
  }), [getStartedScale]);

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  const handlePressIn = (scaleVar) => {
    Animated.spring(scaleVar, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const handlePressOut = (scaleVar) => {
    Animated.spring(scaleVar, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const handleGetStarted = () => {
    navigation.navigate("PocketMoney", { user: route?.params?.user });
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <BackgroundGrid type="welcome" />

      {/* Sticky Back Button in Safe Area */}
      <TouchableOpacity
        onPress={() => navigation.navigate("Login")}
        style={[styles.backButtonContainer, { top: STATUS_BAR_HEIGHT + 10 }]}
      >
        <Feather name="arrow-left" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      <ScrollView
        style={{ flex: 1, backgroundColor: "transparent" }}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* Top spacer to center card and clear back button */}
        <View style={{ height: STATUS_BAR_HEIGHT + 60 }} />

        {/* Central Info Card Section */}
        <BlurView intensity={100} tint="dark" style={styles.card}>
          {/* Header Row inside the Card */}
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>
              Welcome to{"\n"}
              <Text style={styles.highlightText}>PocketSmart!</Text>
            </Text>
            <Text style={styles.headerDescription}>
              Spend smarter, reach your goals faster.
            </Text>
          </View>

          <View style={styles.pointsCard}>
            <View style={styles.minimalRow}>
              <View style={styles.minimalDot} />
              <Text style={styles.bulletText}>Budget Smart</Text>
            </View>
            <View style={styles.minimalRow}>
              <View style={styles.minimalDot} />
              <Text style={styles.bulletText}>Spend Wisely</Text>
            </View>
            <View style={styles.minimalRow}>
              <View style={styles.minimalDot} />
              <Text style={styles.bulletText}>Save Better</Text>
            </View>
            <View style={styles.minimalRow}>
              <View style={styles.minimalDot} />
              <Text style={styles.bulletText}>Reach Goals</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleGetStarted}
            onPressIn={() => handlePressIn(getStartedScale)}
            onPressOut={() => handlePressOut(getStartedScale)}
            activeOpacity={1}
            style={styles.buttonContainer}
          >
            <Animated.View style={[styles.buttonScaleWrapper, getStartedScaleStyle]}>
              <View style={styles.buttonSolid}>
                <Text style={styles.buttonText}>
                  Let's Get Started
                </Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        </BlurView>

        {/* Bottom spacing helper */}
        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}