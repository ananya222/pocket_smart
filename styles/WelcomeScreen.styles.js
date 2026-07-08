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

  buttonScaleWrapper: {
    flex: 1,
  },

  headerTextContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    textAlign: "center",
    lineHeight: 34,
    fontFamily: "DMSerifDisplay-Regular",
  },

  highlightText: {
    color: "#9D4EDD", // Brand purple
  },

  headerDescription: {
    color: "#8A90A8", // Premium soft white/slate
    marginTop: 6,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 16,
    fontFamily: "DMSerifDisplay-Regular",
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

  buttonContainer: {
    height: 52, // Taller button for a solid premium feel
    borderRadius: 26, // Keep capsule matching new height
    marginTop: 8, // Clear space from the last glass card
  },

  buttonSolid: {
    flex: 1,
    borderRadius: 26, // Fully rounded capsule to match container
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },

  buttonText: {
    color: "#FFFFFF", // White text
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5, // Expanded letter spacing for premium look
  },

  sectionTitle: {
    fontSize: 11, // Slightly smaller uppercase title
    color: "#8A90A8", // Slate grey
    marginBottom: 16,
    fontFamily: "DMSerifDisplay-Regular",
    textTransform: "uppercase",
    letterSpacing: 1.5, // Sleek letter spacing
    alignSelf: "flex-start",
    paddingHorizontal: 12,
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
