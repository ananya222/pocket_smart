import React, { useState } from "react";
import { Alert, Pressable, StatusBar, View } from "react-native";
import { auth } from "../../config";
import { AppText, Field, PrimaryButton, Screen, SecondaryButton } from "../../components/ui";
import { colors, spacing } from "../../theme/theme";
import { UI_PREVIEW_MODE } from "../../config/uiPreview";
import { styles } from "./v2Styles";

const getPasswordError = (error) => {
  switch (error?.code) {
    case "auth/wrong-password":
    case "auth/invalid-credential":
      return "Your current password is incorrect.";
    case "auth/requires-recent-login":
      return "Please sign in again before changing your password.";
    case "auth/weak-password":
      return "Choose a stronger password.";
    case "auth/network-request-failed":
      return "Check your connection and try again.";
    case "auth/too-many-requests":
      return "Too many attempts. Please wait and try again.";
    default:
      return "We couldn't change your password. Please try again.";
  }
};

export default function ChangePasswordScreenV2({ navigation, route }) {
  const user = route?.params?.user || {};
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const firstName = (user.fullName || "there").trim().split(" ")[0];

  const validate = () => {
    const nextErrors = {};
    if (!currentPassword) nextErrors.currentPassword = "Enter your current password.";
    if (!newPassword) nextErrors.newPassword = "Enter a new password.";
    else if (newPassword.length < 6) nextErrors.newPassword = "Use at least 6 characters.";
    if (!confirmPassword) nextErrors.confirmPassword = "Confirm your new password.";
    else if (newPassword !== confirmPassword) nextErrors.confirmPassword = "Your passwords do not match.";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChangePassword = async () => {
    if (submitting || !validate()) return;
    setSubmitting(true);
    try {
      const currentUser = UI_PREVIEW_MODE ? null : auth().currentUser;
      if (!UI_PREVIEW_MODE) {
        if (!currentUser) throw new Error("No session");
        const isPasswordUser = currentUser.providerData?.some(({ providerId }) => providerId === "password");
        if (isPasswordUser) {
          const credential = auth.EmailAuthProvider.credential(currentUser.email, currentPassword);
          await currentUser.reauthenticateWithCredential(credential);
        }
        await currentUser.updatePassword(newPassword);
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setErrors({});
      Alert.alert("Password updated", "Your password has been changed.", [{ text: "OK", onPress: returnToProfile }]);
    } catch (error) {
      setErrors({ form: getPasswordError(error) });
    } finally {
      setSubmitting(false);
    }
  };

  const returnToProfile = () => {
    if (UI_PREVIEW_MODE) navigation.navigate("Profile", { user });
    else navigation.goBack();
  };
  const close = () => { if (!submitting) returnToProfile(); };
  const openProfile = () => {
    if (UI_PREVIEW_MODE) navigation.navigate("Profile", { user });
    else navigation.navigate("Dashboard", { user, screen: "Profile" });
  };

  return (
    <Screen scroll contentContainerStyle={styles.changePasswordContent}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.changePasswordHeader}>
        <Pressable
          style={styles.flowAvatar}
          onPress={openProfile}
          accessibilityLabel="Open profile"
        >
          <AppText style={styles.avatarText}>{firstName[0]?.toUpperCase() || "P"}</AppText>
        </Pressable>
        <AppText style={styles.changePasswordEyebrow}>ACCOUNT SECURITY</AppText>
        <AppText style={[styles.flowTitle, styles.changePasswordTitle]}>Change password</AppText>
      </View>
      <AppText muted style={styles.changePasswordCopy}>Choose a new password for your account.</AppText>
      <Field label="Current password" value={currentPassword} onChangeText={setCurrentPassword} secureTextEntry showPasswordToggle error={errors.currentPassword} style={styles.changePasswordField} />
      <Field label="New password" value={newPassword} onChangeText={setNewPassword} secureTextEntry showPasswordToggle error={errors.newPassword} style={styles.changePasswordField} />
      <Field label="Confirm new password" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry showPasswordToggle error={errors.confirmPassword} />
      {errors.form ? <AppText style={styles.changePasswordFormError}>{errors.form}</AppText> : null}
      <View style={styles.changePasswordActions}>
        <PrimaryButton onPress={handleChangePassword} loading={submitting}>Change password</PrimaryButton>
        <SecondaryButton onPress={close} style={{ marginTop: spacing.md }}>Cancel</SecondaryButton>
      </View>
    </Screen>
  );
}
