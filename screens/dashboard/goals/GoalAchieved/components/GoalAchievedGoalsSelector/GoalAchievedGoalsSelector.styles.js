import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  goalRow: {
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
  goalRowActive: {
    borderColor: "rgba(106, 201, 122, 0.4)",
    backgroundColor: "rgba(106, 201, 122, 0.02)"
  },
  goalInfo: {
    flex: 1
  },
  goalName: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular"
  },
  goalPrice: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 2
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center"
  },
  checkboxActive: {
    borderColor: "#9D4EDD",
    backgroundColor: "#9D4EDD"
  }
});
