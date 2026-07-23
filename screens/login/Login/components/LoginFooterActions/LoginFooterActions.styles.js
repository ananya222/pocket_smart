import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  signupContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 8,
  },
  signupTextSub: {
    color: "#8A90A8",
    fontSize: 13,
    textAlign: "center",
    fontFamily: "DMSerifDisplay-Regular",
  },
  signupTextHighlight: {
    color: "#9D4EDD",
    fontWeight: "700",
    fontFamily: "DMSerifDisplay-Regular",
  },
  devBypassButton: {
    alignSelf: "center",
    marginTop: 4,
    marginBottom: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: "#1C1D24",
    borderWidth: 1,
    borderColor: "#2C2D35",
  },
  devBypassText: {
    fontSize: 12,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
  },
});
