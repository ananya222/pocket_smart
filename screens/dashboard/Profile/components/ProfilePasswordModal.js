import React from "react";
import { View, Text, TouchableOpacity, TextInput, Modal } from "react-native";
import { BlurView } from "expo-blur";

export default function ProfilePasswordModal({
  isPasswordModalVisible,
  setIsPasswordModalVisible,
  oldPassword,
  setOldPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  handleChangePassword,
  darkModeEnabled,
  styles
}) {
  return (
    <Modal
      transparent
      visible={isPasswordModalVisible}
      animationType="fade"
      onRequestClose={() => setIsPasswordModalVisible(false)}
    >
      <View style={styles.modalBackdrop}>
        <BlurView intensity={90} tint={darkModeEnabled ? "dark" : "light"} style={styles.modalContent}>
          <Text style={styles.modalTitle}>Change Password</Text>
          <Text style={styles.modalSubtitle}>Update your account security details:</Text>

          <Text style={styles.fieldLabel}>CURRENT PASSWORD:</Text>
          <View style={styles.modalInputRow}>
            <TextInput
              style={styles.modalTextInputField}
              secureTextEntry
              placeholder="Enter current password"
              placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
              value={oldPassword}
              onChangeText={setOldPassword}
            />
          </View>

          <Text style={styles.fieldLabel}>NEW PASSWORD:</Text>
          <View style={styles.modalInputRow}>
            <TextInput
              style={styles.modalTextInputField}
              secureTextEntry
              placeholder="At least 4 characters"
              placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
              value={newPassword}
              onChangeText={setNewPassword}
            />
          </View>

          <Text style={styles.fieldLabel}>CONFIRM NEW PASSWORD:</Text>
          <View style={styles.modalInputRow}>
            <TextInput
              style={styles.modalTextInputField}
              secureTextEntry
              placeholder="Confirm your new password"
              placeholderTextColor={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.35)"}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
          </View>

          <View style={styles.modalButtonsRow}>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setIsPasswordModalVisible(false)}
              style={styles.modalCancelButton}
            >
              <Text style={styles.modalCancelButtonText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleChangePassword}
              style={styles.modalSaveButton}
            >
              <Text style={styles.modalSaveButtonText}>Update</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
      </View>
    </Modal>
  );
}
