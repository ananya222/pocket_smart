import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  pointsCard: {
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.02)", 
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)", 
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 4, 
    paddingHorizontal: 16,
    marginBottom: 20, 
  },
  minimalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingLeft: 4,
  },
  minimalDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#9D4EDD", 
    marginRight: 12,
  },
  bulletText: {
    fontSize: 17, // Clean minimalist text size
    color: "#FFFFFF", // White contrast text
    fontFamily: "DMSerifDisplay-Regular",
  },
});
