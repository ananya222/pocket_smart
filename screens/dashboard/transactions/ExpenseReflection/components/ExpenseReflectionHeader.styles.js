import { StyleSheet, Platform } from 'react-native';

export const getStyles = (isSmallDevice) => StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isSmallDevice ? 24 : 36,
    marginTop: Platform.OS === "ios" ? 10 : (isSmallDevice ? 6 : 10),
  },
  backButton: {
    width: isSmallDevice ? 38 : 42,
    height: isSmallDevice ? 38 : 42,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: isSmallDevice ? 17 : 19,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
  },
  placeholderButton: {
    width: isSmallDevice ? 38 : 42,
    height: isSmallDevice ? 38 : 42,
    opacity: 0,
  }
});
