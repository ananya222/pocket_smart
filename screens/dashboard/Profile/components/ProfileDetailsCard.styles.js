import { StyleSheet } from "react-native";

export const getStyles = (isSmallDevice, isDarkMode) => {
  const colors = {
    cardBg: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
    cardBorder: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111210",
    textSecondary: isDarkMode ? "#8A90A8" : "#5A607F",
  };

  return StyleSheet.create({
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
  });
};
