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
  categoryContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: isSmallDevice ? 16 : 20,
  },
  categoryChip: {
    width: "48%", // Perfect symmetrical 2-column layout
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12, // Matches header buttons for design cohesion
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    marginBottom: 10,
  },
  categoryChipActive: {
    borderColor: "#9D4EDD",
    backgroundColor: "rgba(157, 78, 221, 0.15)",
  },
  categoryChipLabel: {
    fontSize: 12,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
  },
  categoryChipLabelActive: {
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
});
