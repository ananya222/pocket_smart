import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 12,
    color: "#8A90A8",
    marginBottom: 10,
    fontFamily: "DMSerifDisplay-Regular",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 18, 16, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    height: 50,
  },
  inputContainerFocused: {
    borderColor: "#9D4EDD",
  },
  currencySymbol: {
    fontSize: 18,
    color: "#FFFFFF",
    marginRight: 8,
    fontFamily: "DMSerifDisplay-Regular",
  },
  inputFlex: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
});
