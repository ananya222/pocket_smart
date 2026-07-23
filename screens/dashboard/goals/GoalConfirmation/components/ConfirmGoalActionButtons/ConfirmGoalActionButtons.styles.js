import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    height: 50,
  },
  cancelButtonContainer: {
    flex: 1,
    marginRight: 8,
    height: "100%",
  },
  cancelButton: {
    flex: 1,
    borderRadius: 25,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#8A90A8",
    fontSize: 15,
    fontFamily: "DMSerifDisplay-Regular",
  },
  confirmButtonContainer: {
    flex: 1,
    marginLeft: 8,
    height: "100%",
  },
  buttonScaleWrapper: {
    flex: 1,
  },
  confirmButtonSolid: {
    flex: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "DMSerifDisplay-Regular",
  },
});
