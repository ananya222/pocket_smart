// InsightsScreen.styles.js
import { StyleSheet, Platform } from "react-native";

export const getStyles = (isSmallDevice) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#111210",
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingTop: isSmallDevice ? 6 : 10,
  },

  /* Header Section */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isSmallDevice ? 12 : 16,
    marginTop: Platform.OS === "ios" ? 10 : (isSmallDevice ? 6 : 10),
  },

  backButton: {
    width: isSmallDevice ? 38 : 42,
    height: isSmallDevice ? 38 : 42,
    borderRadius: 10,
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
  },

  placeholderButton: {
    width: isSmallDevice ? 38 : 42,
    height: isSmallDevice ? 38 : 42,
    opacity: 0,
  },

  /* Month Picker Dropdown */
  monthPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    paddingHorizontal: 16,
    paddingVertical: isSmallDevice ? 10 : 12,
    marginBottom: isSmallDevice ? 12 : 16,
  },

  monthPickerText: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#FFFFFF",
    fontFamily: "Geist-SemiBold",
  },

  /* Dropdown List Card Inline */
  dropdownListCard: {
    backgroundColor: "rgba(26, 28, 25, 0.98)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    paddingVertical: 4,
    marginTop: 4,
    marginBottom: isSmallDevice ? 12 : 16,
  },

  dropdownListItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.04)",
  },

  dropdownListItemLast: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  dropdownListItemText: {
    fontSize: 13,
    color: "#8A90A8",
    fontFamily: "Geist-Regular",
  },

  dropdownListItemTextActive: {
    color: "#9D4EDD",
  },

  /* Donut Chart Card */
  chartCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    padding: isSmallDevice ? 16 : 20,
    alignItems: "center",
    marginBottom: isSmallDevice ? 12 : 16,
  },

  /* Category Breakdown Section */
  breakdownCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    padding: isSmallDevice ? 14 : 18,
    marginBottom: isSmallDevice ? 12 : 16,
  },

  sectionTitle: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 1.2,
    marginBottom: 12,
    textTransform: "uppercase",
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

  /* Recent Transactions Section */
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
    paddingVertical: isSmallDevice ? 11 : 13,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2D35",
  },

  transactionItemLast: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: isSmallDevice ? 11 : 13,
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

  /* Mode Toggle selector */
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    padding: 3,
    marginBottom: isSmallDevice ? 14 : 18,
  },

  togglePill: {
    flex: 1,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  togglePillActive: {
    backgroundColor: "rgba(157, 78, 221, 0.28)",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
  },

  toggleText: {
    fontSize: 12,
    color: "#8A90A8",
    fontFamily: "Geist-Medium",
  },

  toggleTextActive: {
    color: "#FFFFFF",
  },

  /* Range Selector pickers side-by-side */
  rangePickersRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pickerLabel: {
    fontSize: 9,
    color: "#8A90A8",
    fontFamily: "Geist-Regular",
    letterSpacing: 0.5,
    marginBottom: 4,
    marginLeft: 4,
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
