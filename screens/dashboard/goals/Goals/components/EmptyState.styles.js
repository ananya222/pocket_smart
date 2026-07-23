import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  emptyCard: {
    backgroundColor: "rgba(26, 28, 25, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  icon: {
    marginBottom: 8,
  },
  title: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
  subtitle: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 2,
    textAlign: "center",
    paddingHorizontal: 12,
  }
});
