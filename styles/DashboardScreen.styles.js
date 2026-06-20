// DashboardScreen.styles.js
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
    paddingBottom: 110,
  },

  /* Header Section */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isSmallDevice ? 6 : 10,
    marginTop: Platform.OS === "ios" ? 10 : (isSmallDevice ? 6 : 10),
  },

  headerTextContainer: {
    flex: 1,
  },

  welcomeText: {
    fontSize: isSmallDevice ? 22 : 24,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    lineHeight: isSmallDevice ? 26 : 28,
  },

  subtitleText: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 2,
  },

  notificationButton: {
    width: isSmallDevice ? 38 : 42,
    height: isSmallDevice ? 38 : 42,
    borderRadius: 10,
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Available Balance Card */
  balanceCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    padding: isSmallDevice ? 12 : 14,
    marginBottom: isSmallDevice ? 8 : 12,
    position: "relative",
  },

  balanceHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  balanceHeaderText: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 1,
    marginLeft: 6,
  },

  balanceAmount: {
    fontSize: isSmallDevice ? 28 : 32,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    lineHeight: isSmallDevice ? 32 : 36,
  },

  topUpButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },

  topUpText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontFamily: "Geist-SemiBold",
  },

  balanceSubtitle: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 2,
    marginBottom: isSmallDevice ? 6 : 8,
  },

  progressBarBg: {
    height: 6,
    backgroundColor: "#2C2D35",
    borderRadius: 3,
    width: "100%",
    overflow: "hidden",
    marginBottom: isSmallDevice ? 6 : 8,
  },

  progressBarFill: {
    height: "100%",
    backgroundColor: "#9D4EDD",
  },

  balanceFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  balanceFooterTextAccent: {
    fontSize: 11,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
  },

  balanceFooterTextMuted: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
  },


  /* Section Header */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isSmallDevice ? 4 : 6,
  },

  sectionTitle: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 1,
  },

  viewAllText: {
    fontSize: 10,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
  },

  /* Current Goal Card */
  goalCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    padding: isSmallDevice ? 10 : 12,
    marginBottom: isSmallDevice ? 8 : 12,
  },

  goalMainRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  goalIconWrapper: {
    width: isSmallDevice ? 38 : 44,
    height: isSmallDevice ? 38 : 44,
    borderRadius: 8,
    backgroundColor: "#111210",
    borderWidth: 1,
    borderColor: "#2C2D35",
    alignItems: "center",
    justifyContent: "center",
    marginRight: isSmallDevice ? 10 : 12,
  },

  goalInfoContainer: {
    flex: 1,
  },

  goalTitle: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },

  goalProgressText: {
    fontSize: 12,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 2,
  },

  goalProgressBarContainer: {
    marginTop: isSmallDevice ? 6 : 8,
    marginBottom: isSmallDevice ? 6 : 8,
  },

  goalFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  goalTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  goalTimeText: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginLeft: 4,
  },

  goalPercentText: {
    fontSize: 11,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
  },

  /* Removed Quick Actions to streamline layout */

  /* Recent Transactions */
  transactionCard: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    paddingHorizontal: isSmallDevice ? 12 : 16,
    paddingVertical: 2,
    marginBottom: 10, // Safe tight spacing
  },

  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: isSmallDevice ? 6 : 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2D35",
  },

  transactionItemLast: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: isSmallDevice ? 6 : 8,
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
    fontSize: isSmallDevice ? 13 : 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },

  transactionCategory: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 1,
  },

  transactionAmountContainer: {
    alignItems: "flex-end",
  },

  transactionAmountNegative: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#FF6B6B",
    fontFamily: "DMSerifDisplay-Regular",
  },

  transactionAmountPositive: {
    fontSize: isSmallDevice ? 13 : 14,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
  },

  transactionDate: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 1,
  },

  /* Bottom Navigation Bar */
  bottomNavBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 28 : 18,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },

  navBlurView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },

  navItem: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: 50,
  },

  centerNavItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#9D4EDD",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#9D4EDD",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
