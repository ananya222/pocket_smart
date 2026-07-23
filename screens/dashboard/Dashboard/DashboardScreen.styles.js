// DashboardScreen.styles.js
import { StyleSheet, Platform } from "react-native";

export const getStyles = (isSmallDevice, isDarkMode = true) => {
  const colors = {
    bg: isDarkMode ? "#111210" : "#F4F5F7",
    cardBg: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
    cardBorder: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111210",
    textSecondary: isDarkMode ? "#8A90A8" : "#5A607F",
    innerItemBg: isDarkMode ? "rgba(255, 255, 255, 0.04)" : "#F4F5F7",
    progressBarBg: isDarkMode ? "#2C2D35" : "#E5E7EB",
    divider: isDarkMode ? "#2C2D35" : "#E5E7EB",
    navBg: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
    navBorder: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    navContainerBg: isDarkMode ? "#111210" : "#FFFFFF",
    notificationButtonBg: isDarkMode ? "rgba(17, 18, 16, 0.68)" : "#FFFFFF",
    goalIconBg: isDarkMode ? "#111210" : "#F4F5F7",
  };

  return StyleSheet.create({
    mainContainer: {
      flex: 1,
      backgroundColor: colors.bg,
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
      marginBottom: isSmallDevice ? 6 : 10,
      marginTop: Platform.OS === "ios" ? 10 : (isSmallDevice ? 6 : 10),
    },

    headerTextContainer: {
      flex: 1,
    },

    welcomeText: {
      fontSize: isSmallDevice ? 22 : 24,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
      lineHeight: isSmallDevice ? 26 : 28,
    },

    subtitleText: {
      fontSize: isSmallDevice ? 12 : 13,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      marginTop: 2,
    },

    notificationButton: {
      width: isSmallDevice ? 38 : 42,
      height: isSmallDevice ? 38 : 42,
      borderRadius: 10,
      backgroundColor: colors.notificationButtonBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      alignItems: "center",
      justifyContent: "center",
    },

    /* Available Balance Card */
    balanceCard: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
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
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      letterSpacing: 1,
      marginLeft: 6,
    },

    balanceAmount: {
      fontSize: isSmallDevice ? 28 : 32,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
      lineHeight: isSmallDevice ? 32 : 36,
    },

    topUpButton: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.innerItemBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 12,
      paddingHorizontal: 10,
      paddingVertical: 5,
    },

    topUpText: {
      color: colors.textPrimary,
      fontSize: 10,
      fontFamily: "DMSerifDisplay-Regular",
    },

    balanceSubtitle: {
      fontSize: 11,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      marginTop: 2,
      marginBottom: isSmallDevice ? 6 : 8,
    },

    progressBarBg: {
      height: 6,
      backgroundColor: colors.progressBarBg,
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
      color: colors.textSecondary,
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
      color: colors.textSecondary,
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
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 20,
      overflow: "hidden",
      padding: isSmallDevice ? 10 : 12,
      marginBottom: isSmallDevice ? 8 : 12,
      height: isSmallDevice ? 106 : 118,
      justifyContent: "space-between",
    },

    goalMainRow: {
      flexDirection: "row",
      alignItems: "center",
    },

    goalIconWrapper: {
      width: isSmallDevice ? 38 : 44,
      height: isSmallDevice ? 38 : 44,
      borderRadius: 8,
      backgroundColor: colors.goalIconBg,
      borderWidth: 1,
      borderColor: colors.progressBarBg,
      alignItems: "center",
      justifyContent: "center",
      marginRight: isSmallDevice ? 10 : 12,
    },

    goalInfoContainer: {
      flex: 1,
    },

    goalTitle: {
      fontSize: isSmallDevice ? 13 : 14,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
    },

    goalProgressText: {
      fontSize: 12,
      color: colors.textSecondary,
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
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      marginLeft: 4,
    },

    goalPercentText: {
      fontSize: 11,
      color: "#9D4EDD",
      fontFamily: "DMSerifDisplay-Regular",
    },

    /* Recent Transactions */
    transactionCard: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 20,
      overflow: "hidden",
      paddingHorizontal: isSmallDevice ? 12 : 16,
      paddingVertical: 2,
      marginBottom: 10,
    },

    transactionItem: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: isSmallDevice ? 9 : 11,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },

    transactionItemLast: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: isSmallDevice ? 9 : 11,
    },

    transactionIconWrapper: {
      width: isSmallDevice ? 32 : 36,
      height: isSmallDevice ? 32 : 36,
      borderRadius: 8,
      backgroundColor: colors.goalIconBg,
      borderWidth: 1,
      borderColor: colors.progressBarBg,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },

    transactionDetails: {
      flex: 1,
    },

    transactionTitle: {
      fontSize: isSmallDevice ? 13 : 14,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
    },

    transactionCategory: {
      fontSize: 11,
      color: colors.textSecondary,
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
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      marginTop: 1,
    },
  });
};
