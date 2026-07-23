import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./OtpHeader.styles";

export default function OtpHeader({ onBackPress }) {
  return (
    <>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "center", width: "100%", height: 40 }}>
        <TouchableOpacity 
          onPress={onBackPress} 
          style={styles.backButtonContainer}
          activeOpacity={0.7}
        >
          <Feather name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.headerTextContainer}>
        <Text style={styles.headerTitle}>Verification Code</Text>
        <Text style={styles.headerDescription}>
          We have sent a security verification code to your registered email address.
        </Text>
      </View>
    </>
  );
}
