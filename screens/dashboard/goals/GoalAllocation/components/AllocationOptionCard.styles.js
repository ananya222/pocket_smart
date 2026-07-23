import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  optionCard: {
    width: "100%",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    overflow: "hidden"
  },
  optionCardSelected: {
    borderColor: "rgba(106, 201, 122, 0.4)",
    backgroundColor: "rgba(106, 201, 122, 0.04)"
  },
  optionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  optionTitleBlock: {
    flexDirection: "row",
    alignItems: "center"
  },
  optionTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    marginLeft: 8
  },
  optionTitleActive: {
    color: "#9D4EDD"
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#8A90A8",
    justifyContent: "center",
    alignItems: "center"
  },
  radioCircleActive: {
    borderColor: "#9D4EDD"
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9D4EDD"
  },
  optionDescription: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    lineHeight: 16,
    marginTop: 4
  }
});
