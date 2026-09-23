import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import LoginScreen from "../login/Login/LoginScreen";
import { AppText } from "../../components/ui";
import { colors, spacing, typography } from "../../theme/theme";

// This route exists only beside the web gallery. It gives the developer an
// obvious way to compare the preview with the normal app entry point without
// changing the production navigator.
export default function DevNormalModeScreen({ navigation }) {
  return (
    <View style={styles.root}>
      <View style={styles.devBar}>
        <View style={styles.devBarCopy}>
          <AppText style={styles.devBarTitle}>NORMAL APP</AppText>
          <AppText style={styles.devBarSubtitle}>Development entry point</AppText>
        </View>
        <Pressable style={styles.previewButton} onPress={() => navigation.navigate("DevGallery")} accessibilityLabel="Return to UI preview">
          <Feather name="layout" size={15} color={colors.primary} />
          <AppText style={styles.previewButtonText}>UI preview</AppText>
        </Pressable>
      </View>
      <View style={styles.appArea}>
        <LoginScreen navigation={navigation} route={{ params: {} }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#111210" },
  devBar: { minHeight: 58, paddingHorizontal: spacing.lg, paddingVertical: spacing.sm, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border },
  devBarCopy: { flex: 1 },
  devBarTitle: { ...typography.label, color: colors.text },
  devBarSubtitle: { ...typography.small, color: colors.textMuted, marginTop: 1 },
  previewButton: { flexDirection: "row", alignItems: "center", gap: spacing.xs, borderWidth: 1, borderColor: colors.primary, borderRadius: 999, paddingHorizontal: spacing.md, paddingVertical: spacing.sm },
  previewButtonText: { ...typography.small, color: colors.primary, fontFamily: "SourceSansPro-SemiBold" },
  appArea: { flex: 1 },
});
