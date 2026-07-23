import { StyleSheet, Platform } from "react-native";

export const getStyles = (isSmallDevice, isDarkMode) => {
  const colors = {
    cardBg: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
    cardBorder: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111210",
  };

  return StyleSheet.create({
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
  });
};
