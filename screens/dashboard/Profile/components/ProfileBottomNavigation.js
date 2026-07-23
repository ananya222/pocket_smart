import React from "react";
import { View, TouchableOpacity, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { getStyles } from "./ProfileBottomNavigation.styles";

export default function ProfileBottomNavigation({ navigation, user, darkModeEnabled, isSmallDevice }) {
  const styles = getStyles(isSmallDevice, darkModeEnabled);
  const accentColor = "#9D4EDD";

  return (
    <View style={styles.bottomNavBar}>
      <BlurView
        intensity={100}
        tint={darkModeEnabled ? "dark" : "light"}
        style={styles.navBlurView}
      />
      <TouchableOpacity 
        style={styles.navItem} 
        activeOpacity={0.7}
        onPress={() => navigation.navigate("Dashboard", { user })}
      >
        <Feather name="home" size={21} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        activeOpacity={0.7}
        onPress={() => navigation.navigate("Goals", { user })}
      >
        <Feather name="target" size={21} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.centerNavItem} 
        activeOpacity={0.8}
        onPress={() => navigation.navigate("AddExpense", { user })}
      >
        <Feather name="plus" size={22} color="#FFFFFF" />
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.navItem} 
        activeOpacity={0.7}
        onPress={() => navigation.navigate("Insights", { user })}
      >
        <Feather name="bar-chart-2" size={21} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
        <Feather name="user" size={21} color={accentColor} />
      </TouchableOpacity>
    </View>
  );
}
