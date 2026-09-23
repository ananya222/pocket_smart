import { StyleSheet } from "react-native";
import { colors, control, radius, spacing, typography } from "../../../theme/theme";

const paper = colors.background;
const ink = colors.text;
const bronze = colors.accent;

export const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: paper },
  keyboard: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: spacing.xl, paddingTop: 18, paddingBottom: 32 },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginLeft: -10 },
  intro: { marginTop: 18, marginBottom: 30 },
  eyebrow: { color: bronze, ...typography.eyebrow, marginBottom: 14 },
  title: { color: ink, ...typography.heading },
  subtitle: { color: colors.textMuted, ...typography.body, marginTop: 10, maxWidth: 290 },
  form: { width: "100%" },
  fieldGroup: { marginBottom: 18 },
  label: { color: colors.textMuted, ...typography.label, marginBottom: 8 },
  input: { backgroundColor: colors.inputSurface, borderColor: colors.border, borderRadius: radius.input, borderWidth: 1, color: ink, ...typography.input, height: control.inputHeight, paddingHorizontal: 16 },
  primaryButton: { alignItems: "center", backgroundColor: ink, borderRadius: radius.button, minHeight: control.buttonHeight, justifyContent: "center", marginTop: 10 },
  primaryButtonText: { color: colors.white, ...typography.button },
  disabled: { opacity: 0.55 },
  divider: { alignItems: "center", flexDirection: "row", gap: 12, marginVertical: 22 },
  dividerLine: { backgroundColor: colors.border, flex: 1, height: 1 },
  dividerText: { color: colors.textMuted, ...typography.small },
  googleButton: { alignItems: "center", backgroundColor: colors.inputSurface, borderColor: colors.border, borderRadius: radius.button, borderWidth: 1, flexDirection: "row", minHeight: control.buttonHeight, justifyContent: "center" },
  googleIcon: { height: 19, marginRight: 11, resizeMode: "contain", width: 19 },
  googleText: { color: ink, ...typography.button },
  loginLink: { alignItems: "center", paddingTop: 32, paddingBottom: 4 },
  loginText: { color: colors.textMuted, ...typography.body },
  loginTextStrong: { color: bronze, fontFamily: "Inter-SemiBold" },
});
