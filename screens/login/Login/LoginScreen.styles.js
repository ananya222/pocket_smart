import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#111210", 
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "transparent", 
    justifyContent: "center",
    paddingVertical: 16,
  },

  buttonScaleWrapper: {
    flex: 1,
  },

  /* Glowing background shape blobs for glassmorphism depth */
  bgBlobLavender: {
    position: "absolute",
    top: "12%",
    right: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: "#9D4EDD",
    opacity: 0.22,
  },

  bgBlobPurple: {
    position: "absolute",
    bottom: "20%",
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#7B2CBF",
    opacity: 0.22,
  },

  bgBlobSoftLavender: {
    position: "absolute",
    top: "42%",
    left: "15%",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#9D4EDD",
    opacity: 0.08,
  },

  /* Abstract vector rings to add geometric detail & fill the background */
  bgRingLarge: {
    position: "absolute",
    top: "8%",
    left: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.055)",
    backgroundColor: "transparent",
  },

  bgRingLargeInner: {
    position: "absolute",
    top: "12%",
    left: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.035)",
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },

  bgRingMedium: {
    position: "absolute",
    bottom: "15%",
    right: -60,
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1.2,
    borderColor: "rgba(255, 255, 255, 0.055)",
    backgroundColor: "transparent",
  },

  bgRingMediumInner: {
    position: "absolute",
    bottom: "18%",
    right: -35,
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.035)",
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },

  headerTextContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
  },

  headerDescription: {
    color: "#8A90A8",
    marginTop: 6,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
  },

  card: {
    backgroundColor: "rgba(17, 18, 16, 0.68)", 
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)", 
    borderRadius: 24,
    overflow: "hidden", 
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 22,
    marginHorizontal: 16,
    marginBottom: 14,
  },

  inputLabel: {
    color: "#8A90A8",
    fontSize: 12,
    fontFamily: "DMSerifDisplay-Regular",
    marginBottom: 4,
    alignSelf: "flex-start",
    marginTop: 6,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 18, 16, 0.8)", 
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    height: 46,
  },

  inputContainerFocused: {
    borderColor: "#9D4EDD", 
  },

  icon: {
    marginRight: 10,
  },

  inputFlex: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },

  eyeIcon: {
    padding: 8,
  },

  forgotPasswordContainer: {
    alignSelf: "flex-end",
    marginBottom: 16,
  },

  forgotPasswordText: {
    color: "#9D4EDD",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "DMSerifDisplay-Regular",
  },

  loginButtonContainer: {
    height: 48,
    borderRadius: 24,
    marginBottom: 18,
  },

  loginButtonSolid: {
    flex: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },

  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },

  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },

  dividerText: {
    marginHorizontal: 12,
    color: "#8A90A8",
    fontSize: 12,
    fontFamily: "DMSerifDisplay-Regular",
  },

  /* Mockup Circular Social Row */
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  socialButtonWrapper: {
    alignItems: "center",
    marginHorizontal: 14,
  },

  socialCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(26, 28, 25, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },

  socialCircleScaleWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },

  socialIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },

  socialText: {
    color: "#8A90A8",
    fontSize: 11,
    marginTop: 4,
    fontFamily: "DMSerifDisplay-Regular",
  },

  signupContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 8,
  },

  signupTextSub: {
    color: "#8A90A8",
    fontSize: 13,
    textAlign: "center",
    fontFamily: "DMSerifDisplay-Regular",
  },

  signupTextHighlight: {
    color: "#9D4EDD",
    fontWeight: "700",
    fontFamily: "DMSerifDisplay-Regular",
  },

  trustBadgeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
    marginBottom: 10,
  },

  trustIcon: {
    marginRight: 6,
  },

  trustBadgeText: {
    fontSize: 12,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
  },
});
