import React from "react";
import { View, Text, TouchableOpacity, Modal, TextInput } from "react-native";
import { BlurView } from "expo-blur";

export default function DashboardBudgetModal({
  isVisible,
  onClose,
  onSave,
  tempAllowanceInput,
  setTempAllowanceInput,
  tempFrequency,
  setTempFrequency,
  darkModeEnabled,
  sidebarStyles
}) {
  return (
    <Modal
      transparent
      visible={isVisible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={sidebarStyles.modalBackdrop}>
        <BlurView intensity={90} tint={darkModeEnabled ? "dark" : "light"} style={sidebarStyles.modalContent}>
          <Text style={sidebarStyles.modalTitle}>Allowance Configuration</Text>
          <Text style={sidebarStyles.modalSubtitle}>Configure your allowance settings below:</Text>

          <Text style={sidebarStyles.fieldLabel}>ALLOWANCE AMOUNT:</Text>
          <View style={sidebarStyles.modalInputRow}>
            <Text style={sidebarStyles.modalCurrency}>₹</Text>
            <TextInput
              style={sidebarStyles.modalInput}
              keyboardType="numeric"
              value={tempAllowanceInput}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, "");
                if (!clean) { setTempAllowanceInput(""); return; }
                setTempAllowanceInput(parseInt(clean, 10).toLocaleString("en-IN"));
              }}
            />
          </View>

          <Text style={sidebarStyles.fieldLabel}>FREQUENCY:</Text>
          <View style={sidebarStyles.frequencyRow}>
            {["Weekly", "Monthly"].map((item) => {
              const isActive = tempFrequency === item;
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.8}
                  style={[sidebarStyles.frequencyButton, isActive && sidebarStyles.frequencyButtonActive]}
                  onPress={() => setTempFrequency(item)}
                >
                  <Text style={[sidebarStyles.frequencyText, isActive && sidebarStyles.frequencyTextActive]}>
                    {item}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={sidebarStyles.modalButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onClose}
              style={sidebarStyles.modalCancelButton}
            >
              <Text style={sidebarStyles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={onSave}
              style={sidebarStyles.modalSaveButton}
            >
              <Text style={sidebarStyles.modalSaveButtonText}>Save Settings</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}
