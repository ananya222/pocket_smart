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
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
  },
  previewImageContainer: {
    borderRadius: 10,
    backgroundColor: "#111210",
    borderWidth: 1,
    borderColor: "#2C2D35",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  previewText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
});
