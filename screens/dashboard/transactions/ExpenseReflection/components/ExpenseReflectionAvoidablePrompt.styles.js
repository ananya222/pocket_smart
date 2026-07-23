import { StyleSheet } from 'react-native';

export const getStyles = (isSmallDevice) => StyleSheet.create({
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
  }
});
