import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  frequencyLabel: {
    fontSize: 13,
    color: "#8A90A8",
    marginRight: 12,
    fontFamily: "DMSerifDisplay-Regular",
    textTransform: "uppercase",
  },
  pillContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  frequencyPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
  },
  activePillWeekly: {
    backgroundColor: "#0088FF",
  },
  activePillMonthly: {
    backgroundColor: "#9D4EDD",
  },
  frequencyPillText: {
    fontSize: 13,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
  },
  activePillText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
