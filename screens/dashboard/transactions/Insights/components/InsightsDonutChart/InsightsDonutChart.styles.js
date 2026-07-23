import { StyleSheet } from "react-native";

export const getStyles = (isSmallDevice) => StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    height: 160,
    width: 160
  },
  centralValueContainer: {
    position: "absolute",
    alignItems: "center"
  },
  centralValueLabel: {
    fontSize: 9,
    color: "#8A90A8",
    fontFamily: "Geist-Regular",
    letterSpacing: 0.5
  },
  centralValueText: {
    fontSize: isSmallDevice ? 18 : 20,
    color: "#FFFFFF",
    fontFamily: "Geist-SemiBold",
    marginTop: 2
  }
});
