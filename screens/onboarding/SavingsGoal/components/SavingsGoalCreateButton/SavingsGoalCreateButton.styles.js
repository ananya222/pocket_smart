import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  buttonContainer: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    marginTop: "auto",
    marginBottom: 8,
  },
  buttonScaleWrapper: {
    flex: 1,
  },
  buttonSolid: {
    flex: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },
});
