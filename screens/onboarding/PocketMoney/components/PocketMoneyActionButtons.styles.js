import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 40,
    width: "100%",
  },
  backButton: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  backButtonText: {
    color: "#8A90A8",
    fontSize: 15,
    fontFamily: "DMSerifDisplay-Regular",
  },
  nextButton: {
    flex: 2,
    height: 48,
    borderRadius: 24,
    marginLeft: 8,
  },
  nextButtonSolid: {
    flex: 1,
    borderRadius: 24,
    backgroundColor: "#9D4EDD",
    justifyContent: "center",
    alignItems: "center",
  },
  nextButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: "DMSerifDisplay-Regular",
  },
});
