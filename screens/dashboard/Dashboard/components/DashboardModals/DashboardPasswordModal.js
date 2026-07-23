import React from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet } from "react-native";
import { BlurView } from "expo-blur";

export default function DashboardPasswordModal({
  isVisible,
  onClose,
  onChangePassword,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
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
          <Text style={sidebarStyles.modalTitle}>Change Password</Text>
          <Text style={sidebarStyles.modalSubtitle}>Update your account security details:</Text>

          <Text style={sidebarStyles.fieldLabel}>CURRENT PASSWORD:</Text>
          <View style={sidebarStyles.modalInputRow}>
            <TextInput
              style={sidebarStyles.modalTextInputField}
              secureTextEntry
              placeholder="Enter current password"
              placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
          </View>

          <Text style={sidebarStyles.fieldLabel}>NEW PASSWORD:</Text>
          <View style={sidebarStyles.modalInputRow}>
            <TextInput
              style={sidebarStyles.modalTextInputField}
              secureTextEntry
              placeholder="At least 4 characters"
              placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <Text style={sidebarStyles.fieldLabel}>CONFIRM NEW PASSWORD:</Text>
          <View style={sidebarStyles.modalInputRow}>
            <TextInput
              style={sidebarStyles.modalTextInputField}
              secureTextEntry
              placeholder="Confirm your new password"
              placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
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
              onPress={onChangePassword}
              style={sidebarStyles.modalSaveButton}
            >
              <Text style={sidebarStyles.modalSaveButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}
