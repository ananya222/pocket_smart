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
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderRadius: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  inputContainerFocused: {
    borderColor: "#9D4EDD",
  },
  inputFlex: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
  currencySymbol: {
    fontSize: 14,
    color: "#8A90A8",
    marginRight: 4,
    fontFamily: "DMSerifDisplay-Regular",
  },
});
