import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  buttonContainer: {
    height: 48,
    borderRadius: 24,
    marginTop: 8,
    marginBottom: 14,
  },
  buttonScaleWrapper: {
    flex: 1,
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
});
