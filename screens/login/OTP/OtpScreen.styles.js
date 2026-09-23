import { StyleSheet } from "react-native";
import { colors, control, radius, spacing, typography } from "../../../theme/theme";
export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.background }, keyboard: { flex: 1 }, content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 18, paddingBottom: 32 },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginLeft: -10 }, intro: { marginTop: 34, marginBottom: 42 },
  eyebrow: { color: colors.accent, ...typography.eyebrow, marginBottom: 14 }, title: { color: colors.text, ...typography.heading }, subtitle: { color: colors.textMuted, ...typography.body, marginTop: 10, maxWidth: 290 },
  form: { width: "100%" }, label: { color: colors.textMuted, ...typography.label, marginBottom: 8 }, codeInput: { backgroundColor: colors.inputSurface, borderColor: colors.border, borderRadius: radius.button, borderWidth: 1, color: colors.text, fontFamily: "Inter-SemiBold", fontSize: 24, height: 58, letterSpacing: 8, paddingHorizontal: 18, textAlign: "center" },
  primaryButton: { alignItems: "center", backgroundColor: colors.text, borderRadius: radius.button, minHeight: control.buttonHeight, justifyContent: "center", marginTop: 30 }, primaryButtonText: { color: colors.white, ...typography.button }, disabled: { opacity: 0.55 }, resendLink: { alignItems: "center", minHeight: 44, justifyContent: "center", marginTop: 18 }, resendText: { color: colors.accent, ...typography.button }, resendDisabled: { color: colors.textMuted },
});
