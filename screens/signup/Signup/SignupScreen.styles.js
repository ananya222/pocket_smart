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
    paddingVertical: 16,
  },

  card: {
    backgroundColor: "rgba(17, 18, 16, 0.68)", 
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)", 
    borderRadius: 24,
    overflow: "hidden", 
    paddingHorizontal: 20,
    paddingTop: 28,
    paddingBottom: 22,
    marginHorizontal: 16,
    marginBottom: 14,
  },

  inputLabel: {
    color: "#8A90A8",
    fontSize: 12,
    fontFamily: "DMSerifDisplay-Regular",
    marginBottom: 4,
    alignSelf: "flex-start",
    marginTop: 6,
  },
});
