import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { BlurView } from "expo-blur";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { styles } from "./GoalCard.styles";

export default function GoalCard({ 
  goal, 
  isCompleted, 
  onDelete, 
  timeToReach, 
  frequency, 
  accentColor 
}) {
  const renderGoalIcon = (goalName) => {
    if (!goalName) return <Feather name="target" size={18} color={accentColor} />;
    const q = goalName.toLowerCase().trim();
    if (q.includes("shoe") || q.includes("nike") || q.includes("adidas") || q.includes("sneaker") || q.includes("puma") || q.includes("jordan") || q.includes("footwear")) {
      return <MaterialCommunityIcons name="shoe-sneaker" size={20} color={accentColor} />;
    }
    if (q.includes("football") || q.includes("soccer") || q.includes("ball") || q.includes("cricket") || q.includes("bat") || q.includes("sport") || q.includes("gym") || q.includes("fit")) {
      return <Feather name="award" size={20} color={accentColor} />;
    }
    if (q.includes("headphones") || q.includes("sony") || q.includes("music") || q.includes("earphone") || q.includes("airpods") || q.includes("headset") || q.includes("song")) {
      return <Feather name="headphones" size={20} color={accentColor} />;
    }
    if (q.includes("controller") || q.includes("gamepad") || q.includes("ps5") || q.includes("playstation") || q.includes("xbox") || q.includes("nintendo") || q.includes("gaming") || q.includes("console")) {
      return <MaterialCommunityIcons name="gamepad-variant" size={20} color={accentColor} />;
    }
    if (q.includes("bike") || q.includes("bicycle") || q.includes("cycle")) {
      return <MaterialCommunityIcons name="bicycle" size={20} color={accentColor} />;
    }
    if (q.includes("laptop") || q.includes("macbook") || q.includes("computer") || q.includes("pc") || q.includes("monitor") || q.includes("tech") || q.includes("device") || q.includes("electronics")) {
      return <Feather name="laptop" size={20} color={accentColor} />;
    }
    if (q.includes("watch") || q.includes("smartwatch") || q.includes("rolex") || q.includes("accessory")) {
      return <Feather name="watch" size={20} color={accentColor} />;
    }
    if (q.includes("book") || q.includes("novel") || q.includes("read") || q.includes("study") || q.includes("course")) {
      return <Feather name="book-open" size={20} color={accentColor} />;
    }
    if (q.includes("car") || q.includes("drive") || q.includes("vehicle") || q.includes("tesla")) {
      return <Ionicons name="car-sport-outline" size={20} color={accentColor} />;
    }
    if (q.includes("travel") || q.includes("trip") || q.includes("flight") || q.includes("vacation") || q.includes("hotel")) {
      return <Ionicons name="airplane-outline" size={20} color={accentColor} />;
    }
    return <Feather name="target" size={18} color={accentColor} />;
  };

  const getTimeLeftText = () => {
    if (goal.id === "1" && timeToReach > 0) {
      return `${timeToReach} ${frequency === "Weekly" ? (timeToReach === 1 ? "week" : "weeks") : (timeToReach === 1 ? "month" : "months")} left`;
    } else if (goal.id === "2") {
      return "5 weeks left";
    }
    return "12 weeks left";
  };

  if (isCompleted) {
    return (
      <BlurView intensity={100} tint="dark" style={[styles.goalCard, styles.completedGoalCard]}>
        <View style={styles.goalMainRow}>
          <View style={styles.goalIconWrapper}>
            {renderGoalIcon(goal.name)}
          </View>
          <View style={styles.goalInfoContainer}>
            <Text style={styles.goalTitle}>{goal.name}</Text>
            <Text style={styles.goalProgressText}>
              Target: ₹{goal.target.toLocaleString("en-IN")}
            </Text>
          </View>
          <View style={styles.achievedBadge}>
            <Feather name="check" size={12} color={accentColor} style={{ marginRight: 4 }} />
            <Text style={[styles.achievedBadgeText, { color: accentColor }]}>Achieved</Text>
          </View>
        </View>
      </BlurView>
    );
  }

  return (
    <BlurView intensity={100} tint="dark" style={styles.goalCard}>
      <View style={styles.goalMainRow}>
        <View style={styles.goalIconWrapper}>
          {renderGoalIcon(goal.name)}
        </View>
        <View style={styles.goalInfoContainer}>
          <Text style={styles.goalTitle}>{goal.name}</Text>
          <Text style={styles.goalProgressText}>
            ₹{goal.progressAmount.toLocaleString("en-IN")} of ₹{goal.target.toLocaleString("en-IN")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onDelete && onDelete(goal.id, goal.name)}
          activeOpacity={0.7}
          style={styles.deleteButton}
        >
          <Feather name="trash-2" size={16} color="#8A90A8" />
        </TouchableOpacity>
      </View>
      <View style={styles.goalProgressBarContainer}>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${goal.progressPercent}%`, backgroundColor: accentColor }]} />
        </View>
      </View>
      <View style={styles.goalFooterRow}>
        <Text style={styles.goalTimeText}>
          {getTimeLeftText()}
        </Text>
        <Text style={[styles.goalPercentText, { color: accentColor }]}>{goal.progressPercent}%</Text>
      </View>
    </BlurView>
  );
}
