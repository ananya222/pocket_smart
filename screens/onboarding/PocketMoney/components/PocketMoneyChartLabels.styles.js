import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  chartLabelsContainer: {
    marginTop: 18,
    paddingHorizontal: 8,
  },
  chartLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  dotBlue: {
    backgroundColor: "#4EA8DE",
  },
  dotPurple: {
    backgroundColor: "#9D4EDD",
  },
  chartLabelText: {
    fontSize: 12,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
  },
  chartLabelBold: {
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
});
