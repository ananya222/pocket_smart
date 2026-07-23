import { StyleSheet } from "react-native";

export const getStyles = (isSmallDevice, isDarkMode) => {
  const colors = {
    cardBorder: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111210",
    buttonBg: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "#FFFFFF",
    logoutButtonBg: isDarkMode ? "rgba(255, 107, 107, 0.1)" : "rgba(255, 107, 107, 0.08)",
  };

  return StyleSheet.create({
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
