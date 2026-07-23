import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 18, 16, 0.8)", 
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    height: 48,
  },
  inputContainerFocused: {
    borderColor: "#9D4EDD", 
  },
  icon: {
    marginRight: 10,
  },
  inputFlex: {
    flex: 1,
    height: "100%",
    fontSize: 20,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 12,
    textAlign: "center",
  },
});
