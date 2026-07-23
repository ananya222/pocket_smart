import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#111210"
  },
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: "center"
  },
  heading: {
    fontSize: 24,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
    marginBottom: 8,
    marginTop: 10
  },
  subtitle: {
    fontSize: 13,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 18,
    paddingHorizontal: 10
  },
  optionCard: {
    width: "100%",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 16,
    padding: 16,
    overflow: "hidden"
  },
  optionCardSelected: {
    borderColor: "rgba(106, 201, 122, 0.4)",
    backgroundColor: "rgba(106, 201, 122, 0.04)"
  },
  optionHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  optionTitleBlock: {
    flexDirection: "row",
    alignItems: "center"
  },
  optionTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    marginLeft: 8
  },
  optionTitleActive: {
    color: "#9D4EDD"
  },
  radioCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: "#8A90A8",
    justifyContent: "center",
    alignItems: "center"
  },
  radioCircleActive: {
    borderColor: "#9D4EDD"
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9D4EDD"
  },
  optionDescription: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    lineHeight: 16,
    marginTop: 4
  },
  goalsSelectorContainer: {
    width: "100%",
    marginTop: 8,
    marginBottom: 16
  },
  goalsSelectorLabel: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4
  },
  goalSelectRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8
  },
  goalSelectRowActive: {
    borderColor: "rgba(106, 201, 122, 0.4)",
    backgroundColor: "rgba(106, 201, 122, 0.02)"
  },
  goalSelectInfo: {
    flex: 1
  },
  goalSelectName: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular"
  },
  goalSelectPrice: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 2
  },
  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center"
  },
  checkCircleActive: {
    borderColor: "#9D4EDD",
    backgroundColor: "#9D4EDD"
  },
  confirmButtonContainer: {
    width: "100%",
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
    marginTop: 16
  },
  buttonScaleWrapper: {
    flex: 1
  },
  confirmButtonSolid: {
    flex: 1,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5
  },
  modalBg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)"
  },
  modalContent: {
    width: "80%",
    borderRadius: 24,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(26, 28, 25, 0.9)"
  },
  modalTitle: {
    fontSize: 18,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    marginBottom: 8,
    textAlign: "center"
  },
  modalMessage: {
    fontSize: 13,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20
  },
  modalButton: {
    width: "100%",
    height: 40,
    borderRadius: 20,
    backgroundColor: "#9D4EDD",
    justifyContent: "center",
    alignItems: "center"
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontFamily: "DMSerifDisplay-Regular"
  }
});
