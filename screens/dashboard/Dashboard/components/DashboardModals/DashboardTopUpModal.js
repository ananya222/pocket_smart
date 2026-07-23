import React from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { BlurView } from "expo-blur";

export default function DashboardTopUpModal({
  isVisible,
  onClose,
  onConfirm,
  newAllowanceInput,
  setNewAllowanceInput,
  frequency,
  width,
  accentColor,
  darkModeEnabled
}) {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.6)"
      }}>
        <BlurView
          intensity={90}
          tint={darkModeEnabled ? "dark" : "light"}
          style={{
            width: width - 40,
            borderRadius: 24,
            padding: 24,
            borderWidth: 1,
            borderColor: darkModeEnabled ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
            backgroundColor: darkModeEnabled ? "rgba(26, 28, 25, 0.9)" : "rgba(255, 255, 255, 0.95)"
          }}
        >
          <Text style={{
            fontSize: 18,
            color: darkModeEnabled ? "#FFFFFF" : "#111210",
            fontFamily: "DMSerifDisplay-Regular",
            textAlign: "center",
            marginBottom: 8
          }}>
            Top Up Cycle
          </Text>
          
          <Text style={{
            fontSize: 13,
            color: darkModeEnabled ? "#8A90A8" : "#5A607F",
            fontFamily: "DMSerifDisplay-Regular",
            textAlign: "center",
            marginBottom: 20,
            lineHeight: 18
          }}>
            Add extra money to your current <Text style={{ color: accentColor }}>{frequency.toLowerCase()}</Text> cycle. This will increase your available balance and total allowance limit.
          </Text>

          <View style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: darkModeEnabled ? "rgba(17, 18, 16, 0.68)" : "#FFFFFF",
            borderRadius: 10,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: darkModeEnabled ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
            height: 46,
            marginBottom: 24
          }}>
            <Text style={{ fontSize: 16, marginRight: 6, color: darkModeEnabled ? "#8A90A8" : "#5A607F", fontFamily: "DMSerifDisplay-Regular" }}>₹</Text>
            <TextInput
              style={{
                flex: 1,
                height: "100%",
                fontSize: 15,
                color: darkModeEnabled ? "#FFFFFF" : "#111210",
                fontFamily: "DMSerifDisplay-Regular"
              }}
              placeholder="2,000"
              placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.2)" : "rgba(0, 0, 0, 0.3)"}
              keyboardType="numeric"
              value={newAllowanceInput}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, "");
                if (!clean) {
                  setNewAllowanceInput("");
                  return;
                }
                const num = parseInt(clean, 10);
                setNewAllowanceInput(num.toLocaleString("en-IN"));
              }}
            />
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <TouchableOpacity
              onPress={onClose}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 21,
                backgroundColor: darkModeEnabled ? "rgba(17, 18, 16, 0.68)" : "#E5E7EB",
                borderWidth: 1,
                borderColor: darkModeEnabled ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
                justifyContent: "center",
                alignItems: "center",
                marginRight: 8
              }}
            >
              <Text style={{ color: darkModeEnabled ? "#8A90A8" : "#5A607F", fontSize: 13, fontFamily: "DMSerifDisplay-Regular" }}>
                Cancel
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              style={{
                flex: 1,
                height: 42,
                borderRadius: 21,
                backgroundColor: accentColor,
                justifyContent: "center",
                alignItems: "center",
                marginLeft: 8
              }}
            >
              <Text style={{ color: "#FFFFFF", fontSize: 13, fontFamily: "DMSerifDisplay-Regular" }}>
                Confirm Top Up
              </Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}
