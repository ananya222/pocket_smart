import { StyleSheet } from 'react-native';

export const getStyles = (isSmallDevice) => StyleSheet.create({
  sectionLabel: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 10,
    marginBottom: 8,
  },
  previewSection: {
    marginBottom: isSmallDevice ? 16 : 20,
  },
  previewCard: {
    padding: 14,
    borderRadius: 14,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    overflow: "hidden",
  },
  previewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  previewCol: {
    flex: 1,
  },
  previewColLabel: {
    fontSize: 9,
    color: "#8A90A8",
    fontFamily: "Geist-Regular",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  previewColAmount: {
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "Geist-SemiBold",
  },
  previewBarContainer: {
    marginTop: 4,
  },
  previewBarBg: {
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    overflow: "hidden",
    marginBottom: 6,
  },
  previewBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  previewBarLabel: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "Geist-Regular",
  },
});
