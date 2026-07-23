import React from "react";
import { TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./WelcomeBackButton.styles";

export default function WelcomeBackButton({ onPress, topPosition }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.backButtonContainer, { top: topPosition }]}
    >
      <Feather name="arrow-left" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
}
