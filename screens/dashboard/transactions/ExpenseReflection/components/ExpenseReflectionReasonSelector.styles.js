import { StyleSheet } from 'react-native';

export const getStyles = (isSmallDevice) => StyleSheet.create({
  reasonContainer: {
    marginTop: 8,
    marginBottom: 16,
  },
  instructionsText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 13,
    fontFamily: "Geist-Regular",
    marginBottom: 12,
    paddingLeft: 4
  },
  optionsList: {
    marginBottom: 20
  },
  optionItem: {
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  optionItemActive: {
    borderColor: "rgba(157, 78, 221, 0.8)",
    backgroundColor: "rgba(157, 78, 221, 0.15)",
  },
  optionText: {
    color: "#8A90A8",
    fontSize: 13,
    fontFamily: "Geist-Regular",
    flex: 1,
    marginRight: 10
  },
  optionTextActive: {
    color: "#FFFFFF",
  },
  radioCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center"
  },
  radioCircleActive: {
    borderColor: "#9D4EDD",
  },
  radioInnerCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9D4EDD"
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
  }
});
