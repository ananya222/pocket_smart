import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  buttonScaleWrapper: {
    flex: 1,
  },
  buttonContainer: {
    height: 52, // Taller button for a solid premium feel
    borderRadius: 26, // Keep capsule matching new height
    marginTop: 8, // Clear space from the last glass card
  },
  buttonSolid: {
    flex: 1,
    borderRadius: 26, // Fully rounded capsule to match container
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },
  buttonText: {
    color: "#FFFFFF", // White text
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5, // Expanded letter spacing for premium look
  },
});
