import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  headerTextContainer: {
    width: "100%",
    paddingHorizontal: 24,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 15,
    marginBottom: 20,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 32,
    lineHeight: 38,
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "left",
  },
  backButtonContainer: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    width: 40,
    height: 40,
  },
});
