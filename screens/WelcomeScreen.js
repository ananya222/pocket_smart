// WelcomeScreen.js

import React, { useRef } from "react";
import {
  View, Text, TouchableOpacity, Image, Platform, StatusBar,
  useWindowDimensions, Animated
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BackgroundGrid from "../components/BackgroundGrid";
import { styles } from "../styles/WelcomeScreen.styles";
import { Feather } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function WelcomeScreen({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  const getStartedScale = useRef(new Animated.Value(1)).current;

  const getStartedScaleStyle = React.useMemo(() => ({
    transform: [{ scale: getStartedScale }]
  }), [getStartedScale]);

  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  const headerWrapperStyle = React.useMemo(() => [
    styles.headerWrapper, { paddingTop: STATUS_BAR_HEIGHT + 20 }
  ], [STATUS_BAR_HEIGHT]);

  const handlePressIn = (scaleVar) => {
    Animated.spring(scaleVar, { toValue: 0.96, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const handlePressOut = (scaleVar) => {
    Animated.spring(scaleVar, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 4 }).start();
  };

  const handleGetStarted = () => {
    navigation.navigate("PocketMoney", { user: route?.params?.user });
  };

  const heroImageStyle = React.useMemo(() => [
    styles.heroImage,
    {
      width: width * 0.87,
      height: (width * 0.87) * 0.95,
      bottom: -60
    }
  ], [width]);

  return (
    <LinearGradient
      colors={["#9D4EDD", "#7B2CBF"]}
      start={{ x: 1, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.mainContainer}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <View style={styles.scrollContainer}>
        <BackgroundGrid type="welcome" />

        {/* Top Header Section */}
        <View style={headerWrapperStyle}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={[styles.backButtonContainer, { top: STATUS_BAR_HEIGHT + 10 }]}
          >
            <Feather name="arrow-left" size={22} color="#FFFFFF" />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle} adjustsFontSizeToFit numberOfLines={2}>
              Welcome to{"\n"}
              <Text style={styles.highlightText}>PocketSmart!</Text>
            </Text>
            <Text style={styles.headerDescription}>
              Spend smarter, reach your goals faster.
            </Text>
          </View>

          <Image
            source={require("../assets/images/welcome_friends_hero_transparent.png")}
            style={heroImageStyle}
            pointerEvents="none"
          />
        </View>

        {/* Lower Info Card Section */}
        <View style={[styles.card, { paddingBottom: 32 + insets.bottom }]}>
          <View style={styles.bulletContainer}>
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
              <LinearGradient
                colors={["#9D4EDD", "#7B2CBF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>
                  Let's Get Started
                </Text>
              </LinearGradient>
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}