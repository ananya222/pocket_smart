import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#111210",
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
  },

  card: {
    backgroundColor: "rgba(17, 18, 16, 0.68)", // Dark semi-transparent
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 28, 
    paddingBottom: 22, 
    marginHorizontal: 16,
    zIndex: 10,
    overflow: "hidden",
  },
});
