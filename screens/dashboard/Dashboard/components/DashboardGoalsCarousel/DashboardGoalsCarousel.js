import React from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { getStyles } from "../../DashboardScreen.styles";

export default function DashboardGoalsCarousel({
  activeCarouselGoals,
  activeGoalIndex,
  setActiveGoalIndex,
  goalsScrollViewRef,
  staticCardWidth,
  isSmallDevice,
  darkModeEnabled,
  accentColor,
  navigation,
  user,
  timeToReach,
  frequency,
  cleanTarget
}) {
  const styles = getStyles(isSmallDevice, darkModeEnabled);

  const renderGoalIcon = (iconType) => {
    const size = isSmallDevice ? 20 : 24;
    if (iconType === "headphones") {
      return <Feather name="headphones" size={size} color={accentColor} />;
    }
    if (iconType === "gamepad") {
      return <MaterialCommunityIcons name="gamepad-variant" size={size} color={accentColor} />;
    }
    if (iconType === "bicycle") {
      return <MaterialCommunityIcons name="bicycle" size={size} color={accentColor} />;
    }
    if (iconType === "shoe") {
      return <MaterialCommunityIcons name="shoe-sneaker" size={size} color={accentColor} />;
    }
    if (iconType === "award") {
      return <Feather name="award" size={size} color={accentColor} />;
    }
    if (iconType === "laptop") {
      return <Feather name="laptop" size={size} color={accentColor} />;
    }
    if (iconType === "watch") {
      return <Feather name="watch" size={size} color={accentColor} />;
    }
    if (iconType === "book") {
      return <Feather name="book-open" size={size} color={accentColor} />;
    }
    if (iconType === "car") {
      return <Ionicons name="car-sport-outline" size={size} color={accentColor} />;
    }
    if (iconType === "airplane") {
      return <Ionicons name="airplane-outline" size={size} color={accentColor} />;
    }
    return <Feather name="target" size={isSmallDevice ? 18 : 20} color={accentColor} />;
  };

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>SAVINGS GOALS</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("Goals", { user })}>
          <Text style={[styles.viewAllText, { color: accentColor }]}>View all </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={goalsScrollViewRef}
        horizontal
        pagingEnabled={false}
        showsHorizontalScrollIndicator={false}
        snapToInterval={staticCardWidth + 12}
        decelerationRate="fast"
        onScroll={(event) => {
          const snapInterval = staticCardWidth + 12;
          const index = event.nativeEvent.contentOffset.x / snapInterval;
          const roundIndex = Math.round(index);
          if (roundIndex !== activeGoalIndex) {
            setActiveGoalIndex(roundIndex);
          }
        }}
        scrollEventThrottle={200}
        style={{ height: isSmallDevice ? 114 : 130, flexGrow: 0 }}
      >
        {activeCarouselGoals.length > 0 ? (
          activeCarouselGoals.map((g) => (
            <BlurView
              key={g.id}
              intensity={100}
              tint={darkModeEnabled ? "dark" : "light"}
              style={[styles.goalCard, {
                width: staticCardWidth,
                marginRight: 12,
                paddingHorizontal: isSmallDevice ? 12 : 14,
                paddingTop: isSmallDevice ? 10 : 12,
                paddingBottom: isSmallDevice ? 8 : 10
              }]}
            >
              <View style={styles.goalMainRow}>
                <View style={styles.goalIconWrapper}>
                  {renderGoalIcon(g.iconType)}
                </View>
                <View style={styles.goalInfoContainer}>
                  <Text style={styles.goalTitle}>{g.name}</Text>
                  <Text style={styles.goalProgressText}>
                    ₹{g.progressAmount.toLocaleString("en-IN")} of ₹{g.target.toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>

              <View style={styles.goalProgressBarContainer}>
                <View style={styles.progressBarBg}>
                  <View style={[styles.progressBarFill, { width: `${g.progressPercent}%`, backgroundColor: accentColor }]} />
                </View>
              </View>

              <View style={styles.goalFooterRow}>
                <View style={styles.goalTimeContainer}>
                  {g.progressPercent >= 100 ? (
                    <Feather name="check-circle" size={14} color={accentColor} />
                  ) : (
                    <Feather name="calendar" size={14} color={darkModeEnabled ? "#8A90A8" : "#5A607F"} />
                  )}
                  <Text style={[styles.goalTimeText, g.progressPercent >= 100 && { color: accentColor, fontWeight: "600" }]}>
                    {g.progressPercent >= 100 ? " Achieved!" : ` ${g.timeLeft}`}
                    {g.isActive && timeToReach > 0 && g.progressPercent < 100 && (
                      <Text style={{ color: darkModeEnabled ? "#8A90A8" : "#5A607F", fontWeight: "normal" }}>
                        {" "}• ₹{Math.round(cleanTarget / timeToReach).toLocaleString("en-IN")}/{frequency === "Weekly" ? "wk" : "mo"}
                      </Text>
                    )}
                  </Text>
                </View>
                <Text style={[styles.goalPercentText, { color: accentColor }]}>{g.progressPercent}%</Text>
              </View>
            </BlurView>
          ))
        ) : (
          <BlurView
            intensity={100}
            tint={darkModeEnabled ? "dark" : "light"}
            style={[styles.goalCard, {
              width: staticCardWidth,
              paddingVertical: isSmallDevice ? 16 : 24,
              paddingHorizontal: 20,
              alignItems: "center",
              justifyContent: "center"
            }]}
          >
            <Feather name="award" size={28} color={accentColor} style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 13, color: darkModeEnabled ? "#FFFFFF" : "#111210", fontFamily: "DMSerifDisplay-Regular"}}>{`All Goals Achieved`}</Text>
            <Text style={{ fontSize: 10, color: darkModeEnabled ? "#8A90A8" : "#5A607F", fontFamily: "DMSerifDisplay-Regular", marginTop: 2, textAlign: "center" }}>
              Your goals have been fully saved. Tap Goals below to start a new target.
            </Text>
          </BlurView>
        )}
      </ScrollView>

      {activeCarouselGoals.length > 1 && (
        <View style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 8,
          paddingBottom: isSmallDevice ? 10 : 12
        }}>
          {activeCarouselGoals.map((_, i) => (
            <View
              key={i}
              style={{
                width: 5,
                height: 5,
                borderRadius: 2.5,
                backgroundColor: i === activeGoalIndex ? accentColor : "#8A90A8",
                marginHorizontal: 3,
                opacity: i === activeGoalIndex ? 1 : 0.4
              }}
            />
          ))}
        </View>
      )}
    </>
  );
}
