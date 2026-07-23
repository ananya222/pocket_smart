import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  confirmButtonContainer: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 16
  },
  buttonScaleWrapper: {
    flex: 1
  },
  confirmButtonSolid: {
    flex: 1,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5
  }
});
