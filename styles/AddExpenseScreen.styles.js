// AddExpenseScreen.styles.js
import { StyleSheet, Platform } from "react-native";

export const getStyles = (isSmallDevice) => StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#111210",
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: isSmallDevice ? 20 : 24,
    paddingTop: isSmallDevice ? 10 : 16,
    paddingBottom: 40,
  },

  /* Header Section */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: isSmallDevice ? 20 : 32,
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
  },

  /* Hero Amount Input */
  amountHeroContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: isSmallDevice ? 16 : 24,
  },

  currencyHero: {
    fontSize: isSmallDevice ? 44 : 54,
    color: "#FFFFFF",
    fontFamily: "Geist-SemiBold",
    marginRight: 4,
  },

  amountHeroInput: {
    fontSize: isSmallDevice ? 44 : 54,
    color: "#FFFFFF",
    fontFamily: "Geist-SemiBold",
    minWidth: 120,
    textAlign: "left",
  },

  /* Form Section */
  formContainer: {
    width: "100%",
    marginBottom: isSmallDevice ? 16 : 20,
  },

  /* Minimalist Input Row (iOS style) */
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.06)",
    paddingVertical: isSmallDevice ? 12 : 14,
    marginBottom: 8,
  },

  inputRowField: {
    flex: 1,
    height: 32,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Geist-Regular",
    textAlign: "left",
    padding: 0,
  },

  /* Labels */
  sectionLabel: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "Geist-SemiBold",
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginTop: 10,
    marginBottom: 8,
  },

  /* Category Container */
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
    fontFamily: "Geist-Regular",
  },

  categoryChipLabelActive: {
    color: "#FFFFFF",
    fontFamily: "Geist-SemiBold",
  },

  /* Minimalist Add Button */
  addButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#9D4EDD",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#9D4EDD",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  addButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Geist-SemiBold",
    letterSpacing: 0.5,
  },

  /* Balance Preview Styles */
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
