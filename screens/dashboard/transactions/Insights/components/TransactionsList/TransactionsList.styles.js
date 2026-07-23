import { StyleSheet } from "react-native";

export const getStyles = (isSmallDevice) => StyleSheet.create({
  transactionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    paddingHorizontal: isSmallDevice ? 12 : 16,
    paddingVertical: 4,
    marginBottom: isSmallDevice ? 16 : 20,
  },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: isSmallDevice ? 8 : 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2D35",
  },
  transactionItemLast: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: isSmallDevice ? 8 : 10,
  },
  transactionIconWrapper: {
    width: isSmallDevice ? 32 : 36,
    height: isSmallDevice ? 32 : 36,
    borderRadius: 8,
    backgroundColor: "#111210",
    borderWidth: 1,
    borderColor: "#2C2D35",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
  transactionCategory: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 1,
  },
  transactionAmountContainer: {
    alignItems: "flex-end",
  },
  transactionAmount: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "#FF6B6B",
    fontFamily: "DMSerifDisplay-Regular",
  },
  transactionDate: {
    fontSize: 9,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 1,
  },
  viewAllButton: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.06)",
    marginHorizontal: isSmallDevice ? -12 : -16,
    marginTop: 4,
  },
  viewAllText: {
    fontSize: 12,
    color: "#9D4EDD",
    fontFamily: "Geist-Medium",
  },
});
