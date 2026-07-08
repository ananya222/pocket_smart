// ExpenseReflectionScreen.styles.js
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
  },

  /* Simplified Impact Card */
  impactCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    paddingVertical: isSmallDevice ? 16 : 22,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  futureValueCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    paddingVertical: isSmallDevice ? 16 : 22,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: isSmallDevice ? 24 : 32,
  },

  impactValue: {
    fontSize: isSmallDevice ? 30 : 36,
    color: "#FF6B6B", // soft warning red
    fontFamily: "Geist-SemiBold",
    marginBottom: 6,
    textAlign: "center",
  },

  futureValueText: {
    fontSize: isSmallDevice ? 30 : 36,
    color: "#6AC97A", // growth green (shows the potential future value of saved money)
    fontFamily: "Geist-SemiBold",
    marginBottom: 6,
    textAlign: "center",
  },

  impactSublabel: {
    fontSize: isSmallDevice ? 14 : 16,
    color: "#8A90A8",
    fontFamily: "Geist-Regular",
    textAlign: "center",
    marginBottom: 6,
  },

  impactDetail: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "rgba(255, 255, 255, 0.4)",
    fontFamily: "Geist-Regular",
    textAlign: "center",
  },

  /* Question Section */
  questionContainer: {
    marginBottom: isSmallDevice ? 24 : 32,
  },

  questionText: {
    fontSize: isSmallDevice ? 17 : 19,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    marginBottom: 16,
    textAlign: "center",
  },

  choiceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  choiceButton: {
    flex: 1,
    height: 46,
    borderRadius: 23,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 6,
  },
  choiceButtonActive: {
    backgroundColor: "rgba(157, 78, 221, 0.28)",
    borderColor: "rgba(157, 78, 221, 0.65)",
  },

  choiceButtonText: {
    fontSize: 14,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.2,
  },

  choiceButtonTextActive: {
    color: "#FFFFFF",
  },

  /* Reason Section */
  reasonContainer: {
    marginTop: 8,
    marginBottom: 16,
  },

  reasonInputContainer: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 80,
    marginBottom: 20,
  },

  reasonInput: {
    flex: 1,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Geist-Regular",
    textAlignVertical: "top",
    padding: 0,
  },

  submitButton: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },

  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "DMSerifDisplay-Regular",
  },
});
