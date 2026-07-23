import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  productImageContainer: {
    width: 180,
    height: 180,
    borderRadius: 16,
    backgroundColor: "#111210",
    borderWidth: 1,
    borderColor: "#2C2D35",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 20,
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  productTitle: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 22,
  },
  productPrice: {
    fontSize: 24,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 4,
  },
  timeEstimate: {
    fontSize: 13,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 8,
  },
});
