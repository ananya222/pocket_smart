import { StyleSheet } from "react-native";

export const getStyles = (isSmallDevice) => StyleSheet.create({
  breakdownCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    padding: isSmallDevice ? 14 : 18,
    marginBottom: isSmallDevice ? 12 : 16,
  },
  breakdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },
  breakdownItemLast: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  categoryLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  categoryName: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "#FFFFFF",
    fontFamily: "Geist-Regular",
  },
  categoryRight: {
    alignItems: "flex-end",
  },
  categoryAmount: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "#FFFFFF",
    fontFamily: "Geist-SemiBold",
  },
  categoryPercent: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "Geist-Regular",
    marginTop: 2,
  },
});
