import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Animated, Platform } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";

export default function DashboardSidebarDrawer({
  isSidebarVisible,
  toggleSidebar,
  sidebarSlide,
  backdropOpacity,
  sidebarStyles,
  darkModeEnabled,
  firstName,
  fullName,
  user,
  navigation,
  allowance,
  frequency,
  onSetAllowancePress,
  onSecurityPress,
  onLogoutPress,
  notificationsEnabled,
  onToggleNotifications,
  onToggleDarkMode,
  onSimulateRollover
}) {
  if (!isSidebarVisible) return null;

  const iconColor = darkModeEnabled ? "#8A90A8" : "#5A607F";

  const renderDrawerContent = () => (
    <View style={sidebarStyles.drawerContainer}>
      <View style={{ height: Platform.OS === "ios" ? 75 : 70 }} />
      <View style={sidebarStyles.profileHeader}>
        <View style={sidebarStyles.avatarWrapper}>
          <Text style={sidebarStyles.avatarText}>{firstName[0]?.toUpperCase() || "A"}</Text>
        </View>
        <Text style={sidebarStyles.profileName} numberOfLines={1}>{fullName}</Text>
        <Text style={sidebarStyles.profileEmail} numberOfLines={1}>{user.email || "user@pocketsmart.com"}</Text>
      </View>
      <View style={sidebarStyles.divider} />
      <ScrollView contentContainerStyle={sidebarStyles.menuScrollView} showsVerticalScrollIndicator={false}>
        <Text style={sidebarStyles.menuSectionLabel}>MENU</Text>

        <TouchableOpacity 
          style={sidebarStyles.menuItem} 
          activeOpacity={0.7}
          onPress={() => { toggleSidebar(); onSetAllowancePress(); }}
        >
          <Feather name="sliders" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
          <Text style={sidebarStyles.menuItemText}>Allowance Configuration</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={sidebarStyles.menuItem} 
          activeOpacity={0.7}
          onPress={() => { toggleSidebar(); navigation.navigate("Goals", { user }); }}
        >
          <Feather name="target" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
          <Text style={sidebarStyles.menuItemText}>Savings Goals</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={sidebarStyles.menuItem} 
          activeOpacity={0.7}
          onPress={() => { toggleSidebar(); navigation.navigate("Insights", { user }); }}
        >
          <Feather name="bar-chart-2" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
          <Text style={sidebarStyles.menuItemText}>Spending Insights</Text>
        </TouchableOpacity>

        <View style={sidebarStyles.menuDivider} />
        <Text style={sidebarStyles.menuSectionLabel}>PREFERENCES</Text>
        
        <View style={sidebarStyles.prefItem}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="bell" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
            <Text style={sidebarStyles.menuItemText}>Daily Reminders</Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={onToggleNotifications} 
            style={[sidebarStyles.toggleContainer, notificationsEnabled && sidebarStyles.toggleActive]}
          >
            <View style={[sidebarStyles.toggleDot, notificationsEnabled && sidebarStyles.toggleDotActive]} />
          </TouchableOpacity>
        </View>

        <View style={sidebarStyles.prefItem}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Feather name="moon" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
            <Text style={sidebarStyles.menuItemText}>Dark Mode</Text>
          </View>
          <TouchableOpacity 
            activeOpacity={0.8}
            onPress={onToggleDarkMode} 
            style={[sidebarStyles.toggleContainer, darkModeEnabled && sidebarStyles.toggleActive]}
          >
            <View style={[sidebarStyles.toggleDot, darkModeEnabled && sidebarStyles.toggleDotActive]} />
          </TouchableOpacity>
        </View>

        <View style={sidebarStyles.menuDivider} />
        <Text style={sidebarStyles.menuSectionLabel}>SECURITY</Text>

        <TouchableOpacity 
          style={sidebarStyles.menuItem} 
          activeOpacity={0.7}
          onPress={() => { toggleSidebar(); onSecurityPress(); }}
        >
          <Feather name="lock" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
          <Text style={sidebarStyles.menuItemText}>Change Password</Text>
        </TouchableOpacity>

        <View style={sidebarStyles.menuDivider} />
        <Text style={sidebarStyles.menuSectionLabel}>TESTING / DEV</Text>

        <TouchableOpacity 
          style={sidebarStyles.menuItem} 
          activeOpacity={0.7}
          onPress={() => { toggleSidebar(); onSimulateRollover(); }}
        >
          <Feather name="refresh-cw" size={16} color={iconColor} style={sidebarStyles.menuIcon} />
          <Text style={sidebarStyles.menuItemText}>Simulate Cycle End</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[sidebarStyles.menuItem, { marginTop: 24 }]} 
          activeOpacity={0.7}
          onPress={() => { toggleSidebar(); onLogoutPress(); }}
        >
          <Feather name="log-out" size={16} color="#FF6B6B" style={sidebarStyles.menuIcon} />
          <Text style={[sidebarStyles.menuItemText, { color: "#FF6B6B" }]}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );

  return (
    <View style={sidebarStyles.overlayContainer}>
      <Animated.View style={[sidebarStyles.backdrop, { opacity: backdropOpacity }]}>
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={toggleSidebar}
        />
      </Animated.View>
      <Animated.View style={[sidebarStyles.drawerPanel, { transform: [{ translateX: sidebarSlide }] }]}>
        {Platform.OS === "ios" ? (
          <BlurView intensity={100} tint={darkModeEnabled ? "dark" : "light"} style={sidebarStyles.drawerBlur}>
            {renderDrawerContent()}
          </BlurView>
        ) : (
          <View style={[sidebarStyles.drawerBlur, { backgroundColor: darkModeEnabled ? "rgba(17, 18, 16, 0.98)" : "rgba(244, 245, 247, 0.98)" }]}>
            {renderDrawerContent()}
          </View>
        )}
      </Animated.View>
    </View>
  );
}
