import { StyleSheet } from "react-native";
import { colors, control, radius, spacing, typography } from "../../../theme/theme";

const paper = colors.background;
const ink = colors.text;
const bronze = colors.accent;

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: paper },
  keyboard: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 42, paddingBottom: 32 },
  intro: { marginBottom: 42 },
  eyebrow: { color: bronze, ...typography.eyebrow, marginBottom: 14 },
  title: { color: ink, ...typography.heading },
  subtitle: { color: colors.textMuted, ...typography.body, marginTop: 10 },
  form: { width: "100%" },
  label: { color: colors.textMuted, ...typography.label, marginBottom: 8 },
  passwordLabelRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", marginTop: 22 },
  forgot: { color: bronze, ...typography.label, marginBottom: 8 },
  input: { backgroundColor: colors.inputSurface, borderColor: colors.border, borderRadius: radius.input, borderWidth: 1, color: ink, ...typography.input, height: control.inputHeight, paddingHorizontal: 16 },
  primaryButton: { alignItems: "center", backgroundColor: ink, borderRadius: radius.button, minHeight: control.buttonHeight, justifyContent: "center", marginTop: 30 },
  primaryButtonText: { color: colors.white, ...typography.button },
  buttonDisabled: { opacity: 0.55 },
  divider: { alignItems: "center", flexDirection: "row", gap: 12, marginVertical: 24 },
  dividerLine: { backgroundColor: colors.border, flex: 1, height: 1 },
  dividerText: { color: colors.textMuted, ...typography.small },
  googleButton: { alignItems: "center", backgroundColor: colors.inputSurface, borderColor: colors.border, borderRadius: radius.button, borderWidth: 1, flexDirection: "row", minHeight: control.buttonHeight, justifyContent: "center" },
  googleIcon: { height: 19, marginRight: 11, resizeMode: "contain", width: 19 },
  googleButtonText: { color: ink, ...typography.button },
  signupLink: { alignItems: "center", marginTop: "auto", paddingTop: 42, paddingBottom: 4 },
  signupText: { color: colors.textMuted, ...typography.body },
  signupTextStrong: { color: bronze, fontFamily: "Inter-SemiBold" },
});
