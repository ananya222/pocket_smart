import React from "react";
import { View, Text } from "react-native";
import { Feather, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { styles } from "./ConfirmGoalDetails.styles";

export default function ConfirmGoalDetails({ goalName, targetAmount, timeToReach, frequency }) {
  const getGoalIcon = (name) => {
    if (!name) return { lib: Feather, name: "target", color: "#9D4EDD" };
    const q = name.toLowerCase().trim();
    if (q.includes("shoe") || q.includes("nike") || q.includes("adidas") || q.includes("sneaker") || q.includes("puma") || q.includes("jordan") || q.includes("footwear")) {
      return { lib: MaterialCommunityIcons, name: "shoe-sneaker", color: "#FF5E7E" };
    }
    if (q.includes("football") || q.includes("soccer") || q.includes("ball") || q.includes("cricket") || q.includes("bat") || q.includes("sport") || q.includes("gym") || q.includes("fit")) {
      return { lib: Feather, name: "award", color: "#4EA8DE" };
    }
    if (q.includes("headphones") || q.includes("sony") || q.includes("music") || q.includes("earphone") || q.includes("airpods") || q.includes("headset") || q.includes("song")) {
      return { lib: Feather, name: "headphones", color: "#9D4EDD" };
    }
    if (q.includes("controller") || q.includes("gamepad") || q.includes("ps5") || q.includes("playstation") || q.includes("xbox") || q.includes("nintendo") || q.includes("gaming") || q.includes("console")) {
      return { lib: MaterialCommunityIcons, name: "gamepad-variant", color: "#FF9F1C" };
    }
    if (q.includes("bike") || q.includes("bicycle") || q.includes("cycle")) {
      return { lib: MaterialCommunityIcons, name: "bike", color: "#2EC4B6" };
    }
    if (q.includes("laptop") || q.includes("macbook") || q.includes("computer") || q.includes("pc") || q.includes("monitor") || q.includes("tech") || q.includes("device") || q.includes("electronics")) {
      return { lib: Feather, name: "laptop", color: "#70E000" };
    }
    if (q.includes("watch") || q.includes("smartwatch") || q.includes("rolex") || q.includes("accessory")) {
      return { lib: Feather, name: "watch", color: "#FFD166" };
    }
    if (q.includes("book") || q.includes("novel") || q.includes("read") || q.includes("study") || q.includes("course")) {
      return { lib: Feather, name: "book-open", color: "#FF6B6B" };
    }
    if (q.includes("car") || q.includes("drive") || q.includes("vehicle") || q.includes("tesla")) {
      return { lib: Ionicons, name: "car-sport-outline", color: "#3A86C8" };
    }
    if (q.includes("travel") || q.includes("trip") || q.includes("flight") || q.includes("vacation") || q.includes("hotel")) {
      return { lib: Ionicons, name: "airplane-outline", color: "#5BC0EB" };
    }
    return { lib: Feather, name: "target", color: "#9D4EDD" };
  };

  const iconInfo = getGoalIcon(goalName);
  const IconLib = iconInfo.lib;

  return (
    <>
      <View style={styles.productImageContainer}>
        <IconLib name={iconInfo.name} size={48} color={iconInfo.color} />
      </View>

      <Text style={styles.productTitle}>{goalName || "Savings Goal"}</Text>
      <Text style={styles.productPrice}>₹{targetAmount || "0"}</Text>

      {timeToReach > 0 && (
        <Text style={styles.timeEstimate}>
          {timeToReach} {frequency === "Weekly" ? (timeToReach === 1 ? "week" : "weeks") : (timeToReach === 1 ? "month" : "months")} to reach
        </Text>
      )}
    </>
  );
}
