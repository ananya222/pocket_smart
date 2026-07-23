// ProfileScreen.styles.js
import { StyleSheet, Platform } from "react-native";

export const getStyles = (isSmallDevice, isDarkMode) => {
  const colors = {
    bg: isDarkMode ? "#111210" : "#F4F5F7",
    cardBg: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
    cardBorder: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111210",
    textSecondary: isDarkMode ? "#8A90A8" : "#5A607F",
    innerItemBg: isDarkMode ? "rgba(255, 255, 255, 0.04)" : "#F4F5F7",
    divider: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)",
    navBg: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.02)",
    navBorder: isDarkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.06)",
    navContainerBg: isDarkMode ? "#111210" : "#FFFFFF",
    buttonBg: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
    logoutButtonBg: isDarkMode ? "rgba(255, 107, 107, 0.1)" : "rgba(255, 107, 107, 0.08)",
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
      marginBottom: isSmallDevice ? 12 : 16,
      marginTop: Platform.OS === "ios" ? 10 : (isSmallDevice ? 6 : 10),
    },

    backButton: {
      width: isSmallDevice ? 38 : 42,
      height: isSmallDevice ? 38 : 42,
      borderRadius: 10,
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      alignItems: "center",
      justifyContent: "center",
    },

    headerTitle: {
      fontSize: isSmallDevice ? 18 : 20,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
      textAlign: "center",
    },

    placeholderButton: {
      width: isSmallDevice ? 38 : 42,
      height: isSmallDevice ? 38 : 42,
      opacity: 0,
    },

    /* Profile Header Card */
    profileCard: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 24,
      padding: isSmallDevice ? 16 : 20,
      alignItems: "center",
      marginBottom: 20,
    },

    avatarContainer: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: "#9D4EDD",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },

    avatarText: {
      color: "#FFFFFF",
      fontSize: 24,
      fontWeight: "bold",
    },

    userName: {
      fontSize: isSmallDevice ? 18 : 20,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
      textAlign: "center",
    },

    userEmail: {
      fontSize: 12,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      marginTop: 2,
      textAlign: "center",
    },

    /* Section Title */
    sectionTitle: {
      fontSize: 10,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      letterSpacing: 1,
      marginBottom: 8,
      marginLeft: 4,
      textTransform: "uppercase",
    },

    /* Detail Card */
    detailCard: {
      backgroundColor: colors.cardBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      borderRadius: 20,
      paddingHorizontal: 16,
      paddingVertical: 4,
      marginBottom: 20,
    },

    detailItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: isSmallDevice ? 10 : 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },

    detailItemLast: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: isSmallDevice ? 10 : 12,
    },

    detailLabelContainer: {
      flexDirection: "row",
      alignItems: "center",
    },

    detailIcon: {
      marginRight: 10,
    },

    detailLabel: {
      fontSize: 13,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
    },

    detailValue: {
      fontSize: 13,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      textAlign: "right",
    },

    /* Preferences Switch Item */
    prefItem: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: isSmallDevice ? 10 : 12,
      borderBottomWidth: 1,
      borderBottomColor: colors.divider,
    },

    prefItemLast: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingVertical: isSmallDevice ? 10 : 12,
    },

    prefTextContainer: {
      flex: 1,
      marginRight: 10,
    },

    prefTitle: {
      fontSize: 13,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
    },

    prefSubtitle: {
      fontSize: 10,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      marginTop: 2,
    },

    toggleContainer: {
      width: 32,
      height: 18,
      borderRadius: 9,
      backgroundColor: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.08)",
      justifyContent: "center",
      paddingHorizontal: 2,
    },

    toggleActive: {
      backgroundColor: "#9D4EDD",
    },

    toggleDot: {
      width: 14,
      height: 14,
      borderRadius: 7,
      backgroundColor: colors.textSecondary,
    },

    toggleDotActive: {
      backgroundColor: "#FFFFFF",
      alignSelf: "flex-end",
    },

    /* Action Buttons */
    actionButtonsContainer: {
      marginBottom: 20,
    },

    actionButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.buttonBg,
      borderWidth: 1,
      borderColor: colors.cardBorder,
      height: 48,
      borderRadius: 24,
      marginBottom: 12,
    },

    actionButtonIcon: {
      marginRight: 8,
    },

    actionButtonText: {
      fontSize: 13,
      color: colors.textPrimary,
      fontFamily: "DMSerifDisplay-Regular",
    },

    logoutButton: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: colors.logoutButtonBg,
      borderWidth: 1,
      borderColor: "rgba(255, 107, 107, 0.15)",
      height: 48,
      borderRadius: 24,
      marginBottom: 12,
    },

    logoutButtonText: {
      fontSize: 13,
      color: "#FF6B6B",
      fontFamily: "DMSerifDisplay-Regular",
    },
  });
};
