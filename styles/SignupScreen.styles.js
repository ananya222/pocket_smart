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

  headerTextContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
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

  buttonContainer: {
    height: 48,
    borderRadius: 24,
    marginTop: 14,
    marginBottom: 18,
  },

  buttonSolid: {
    flex: 1,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },

  loginContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 8,
  },

  loginTextSub: {
    color: "#8A90A8",
    fontSize: 13,
    textAlign: "center",
    fontFamily: "DMSerifDisplay-Regular",
  },

  loginTextHighlight: {
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

  backButtonContainer: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
});
