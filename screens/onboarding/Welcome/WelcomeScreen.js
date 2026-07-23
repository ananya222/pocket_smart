// WelcomeScreen.js

import React from "react";
import {
  View, Platform, StatusBar,
  ScrollView
} from "react-native";
import { BlurView } from "expo-blur";
import BackgroundGrid from "../../../components/BackgroundGrid/BackgroundGrid";
import { styles } from "./WelcomeScreen.styles";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WelcomeHeader from "./components/WelcomeHeader/WelcomeHeader";
import WelcomePoints from "./components/WelcomePoints/WelcomePoints";
import WelcomeGetStartedButton from "./components/WelcomeGetStartedButton/WelcomeGetStartedButton";
import WelcomeBackButton from "./components/WelcomeBackButton/WelcomeBackButton";

export default function WelcomeScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  const handleGetStarted = () => {
    navigation.navigate("PocketMoney", { user: route?.params?.user });
  };

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <BackgroundGrid type="welcome" />

      {/* Sticky Back Button in Safe Area */}
      <WelcomeBackButton 
        onPress={() => navigation.navigate("Login")} 
        topPosition={STATUS_BAR_HEIGHT + 10} 
      />

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
          <WelcomeHeader />
          <WelcomePoints />
          <WelcomeGetStartedButton onPress={handleGetStarted} />
        </BlurView>

        {/* Bottom spacing helper */}
        <View style={{ height: insets.bottom + 24 }} />
      </ScrollView>
    </View>
  );
}