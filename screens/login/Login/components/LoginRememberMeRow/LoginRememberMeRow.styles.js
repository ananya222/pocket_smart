import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
    marginBottom: 16,
  },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  checkboxActive: {
    borderColor: "#9D4EDD",
    backgroundColor: "rgba(157, 78, 221, 0.15)",
  },
  checkboxLabel: {
    color: "#8A90A8",
    fontSize: 12,
    fontFamily: "SFProDisplay-Regular",
  },
  forgotPasswordContainer: {
    alignSelf: "auto",
    marginBottom: 0,
  },
  forgotPasswordText: {
    color: "#9D4EDD",
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "DMSerifDisplay-Regular",
  },
});
