import React from "react";
import { View, Text, TouchableOpacity, Platform, StatusBar } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./PocketMoneyHeader.styles";

export default function PocketMoneyHeader({ onBack }) {
  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : StatusBar.currentHeight || 24;

  return (
    <>
      <TouchableOpacity
        onPress={onBack}
        style={[styles.backButtonContainer, { top: STATUS_BAR_HEIGHT + 10 }]}
        activeOpacity={0.7}
      >
        <Feather name="arrow-left" size={20} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={[styles.headerTextContainer, { paddingTop: STATUS_BAR_HEIGHT + 80 }]}>
        <Text style={styles.headerTitle}>{"Setup Your\nPocket Money"}</Text>
      </View>
    </>
  );
}
