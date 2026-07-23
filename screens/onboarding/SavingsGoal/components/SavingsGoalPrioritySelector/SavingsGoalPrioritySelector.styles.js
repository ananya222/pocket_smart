import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 10,
    color: "#8A90A8",
    marginBottom: 6,
    fontFamily: "DMSerifDisplay-Regular",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityButton: {
    flex: 1,
    marginHorizontal: 2,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  priorityNum: {
    fontSize: 14,
    fontFamily: "Geist-SemiBold",
  },
  priorityLabel: {
    fontSize: 8,
    fontFamily: "Geist-Regular",
    marginTop: 2,
    textAlign: "center",
  },
});
