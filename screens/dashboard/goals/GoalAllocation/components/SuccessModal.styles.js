import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
