import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF", 
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },

  headerWrapper: {
    backgroundColor: "#7B2CBF", 
    position: "relative",
    overflow: "hidden",
  },

  buttonScaleWrapper: {
    flex: 1,
  },

  headerTextContainer: {
    width: "55%",
    paddingLeft: 24,
    paddingBottom: 25, // Lifted text slightly for visual balance
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 38,
    fontFamily: "DMSerifDisplay-Regular",
  },

  highlightText: {
    color: "#FFC529", // Bright brand yellow
  },

  headerDescription: {
    color: "#FFFFFF",
    opacity: 0.9,
    marginTop: 8,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: "DMSerifDisplay-Regular",
  },

  heroImage: {
    position: "absolute",
    right: 12,
    resizeMode: "contain",
  },

  card: {
    flex: 1,
    backgroundColor: "#F5F3FF",
    borderTopLeftRadius: 36, 
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
    marginTop: -32, // Seamless overlay on the header
  },

  cardTitle: {
    fontSize: 24,
    color: "#111827",
    marginBottom: 8, // Tighter margin matching Welcome title style
    fontFamily: "DMSerifDisplay-Regular",
  },

  cardSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 16, // Equal spacing
    fontFamily: "DMSerifDisplay-Regular",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14, // Equal spacing
    borderWidth: 1, // Integer width for maximum stability
    borderColor: "#E5E7EB",
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  inputContainerFocused: {
    borderColor: "#7B2CBF", 
  },

  icon: {
    marginRight: 10,
  },

  inputFlex: {
    flex: 1,
    height: "100%",
    fontSize: 15,
    color: "#1F2937",
    fontFamily: "DMSerifDisplay-Regular",
  },

  eyeIcon: {
    padding: 8,
  },

  button: {
    height: 52,
    borderRadius: 26,
    backgroundColor: "#7B2CBF", 
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 14,
    shadowColor: "#3C096C",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  buttonContainer: {
    height: 52,
    borderRadius: 26,
    marginTop: 0, // Reset to keep gap equal to 14px
    marginBottom: 14, // Equal spacing
    shadowColor: "#3C096C",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },

  loginContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14, // Equal spacing
  },

  loginTextSub: {
    color: "#6B7280",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "DMSerifDisplay-Regular",
  },

  loginTextHighlight: {
    color: "#7B2CBF",
    fontFamily: "DMSerifDisplay-Regular",
  },

  trustBadgeContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 4,
  },

  trustIcon: {
    marginRight: 5,
  },

  trustBadgeText: {
    fontSize: 12,
    color: "#6B7280",
    fontFamily: "DMSerifDisplay-Regular",
  },

  backButtonContainer: {
    position: "absolute",
    left: 14,
    zIndex: 10,
    padding: 10,
    backgroundColor: "transparent",
  },

  inputContainerError: {
    borderColor: "#EF4444",
  },

  errorText: {
    fontSize: 12,
    color: "#EF4444",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: -10,
    marginBottom: 10,
    paddingLeft: 4,
  },
});
