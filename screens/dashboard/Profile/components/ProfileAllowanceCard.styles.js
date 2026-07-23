import { StyleSheet } from "react-native";

export const getStyles = (isSmallDevice, isDarkMode) => {
  const colors = {
    cardBg: isDarkMode ? "rgba(255, 255, 255, 0.03)" : "#FFFFFF",
    cardBorder: isDarkMode ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.06)",
    textPrimary: isDarkMode ? "#FFFFFF" : "#111210",
    textSecondary: isDarkMode ? "#8A90A8" : "#5A607F",
    divider: isDarkMode ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.06)",
  };

  return StyleSheet.create({
    sectionTitle: {
      fontSize: 10,
      color: colors.textSecondary,
      fontFamily: "DMSerifDisplay-Regular",
      letterSpacing: 1,
      marginBottom: 8,
      marginLeft: 4,
      textTransform: "uppercase",
    },
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
  });
};
