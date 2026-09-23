import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./OtpHeader.styles";

export default function OtpHeader({ onBackPress, phoneNumber }) {
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
          We sent a 6-digit code to{"\n"}
          {phoneNumber || "your mobile number"}.
        </Text>
      </View>
    </>
  );
}
