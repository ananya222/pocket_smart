import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  headerRow: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "center", 
    width: "100%", 
    height: 40 
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
  headerTextContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 20,
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
  },
  headerDescription: {
    color: "#8A90A8",
    marginTop: 6,
    fontSize: 13,
    lineHeight: 16,
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "center",
  },
});
