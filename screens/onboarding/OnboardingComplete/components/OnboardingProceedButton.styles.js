import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: 52,
    borderRadius: 26,
  },
  buttonSolid: {
    flex: 1,
    borderRadius: 26,
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
  proceedButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  proceedArrowIcon: {
    marginLeft: 8,
  },
});
