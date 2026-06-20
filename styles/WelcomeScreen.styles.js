import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },

  scrollContainer: {
    flex: 1,
    backgroundColor: "transparent",
  },

  headerWrapper: {
    flex: 1, // Expands to push the card flush to the bottom
    backgroundColor: "transparent",
    position: "relative",
    alignItems: "center",
    paddingBottom: 0,
  },

  buttonScaleWrapper: {
    flex: 1,
  },

  headerTextContainer: {
    width: "100%",
    paddingHorizontal: 24,
    alignItems: "flex-start", // Left align items inside container
    marginTop: 0,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 42,
    textAlign: "left",
    lineHeight: 48,
    fontFamily: "DMSerifDisplay-Regular",
  },

  highlightText: {
    color: "#FFC529", // Gold/yellow brand color
  },

  headerDescription: {
    color: "rgba(255, 255, 255, 0.85)", // Premium soft white
    marginTop: 10,
    fontSize: 16,
    textAlign: "left", // Left align description
    lineHeight: 22,
    fontFamily: "DMSerifDisplay-Regular",
  },

  heroImage: {
    position: "absolute",
    alignSelf: "center",
    resizeMode: "contain",
  },

  card: {
    backgroundColor: "rgba(255, 255, 255, 0.93)", // Semi-transparent white to inherit background gradient
    borderTopLeftRadius: 36, 
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 32, 
    paddingBottom: 32, // Margin below button to clear screen bottom/home bar
    width: "100%", // Takes full screen width
    shadowColor: "#000000",
    shadowOpacity: 0.12, // Elegant, softer upward drop shadow
    shadowRadius: 20, // Wide ambient blur
    shadowOffset: { width: 0, height: -8 },
    elevation: 10,
    zIndex: 10,
  },

  pointsCard: {
    width: "100%",
    backgroundColor: "#FFFFFF", // Solid white to match Pocket Money sub-cards
    borderWidth: 1,
    borderColor: "#F3F4F6", // Soft grey border
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 4, // Symmetric offset with minimalRow marginBottom
    paddingHorizontal: 16,
    marginBottom: 20, // Clear space before CTA button
    // Drop shadow matching Pocket Money ratioContainer:
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
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
    backgroundColor: "#7B2CBF", 
    marginRight: 12,
  },

  bulletText: {
    fontSize: 17, // Clean minimalist text size
    color: "#374151", // Dark slate gray text for high contrast on white background
    fontFamily: "DMSerifDisplay-Regular",
  },

  buttonContainer: {
    height: 52, // Taller button for a solid premium feel
    borderRadius: 26, // Keep capsule matching new height
    shadowColor: "#3C096C", // Deep purple shadow
    shadowOpacity: 0.35, // Deeper premium shadow
    shadowRadius: 12, // More soft spread
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
    marginTop: 8, // Clear space from the last glass card
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 26, // Fully rounded capsule to match container
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5, // Expanded letter spacing for premium look
  },

  sectionTitle: {
    fontSize: 11, // Slightly smaller uppercase title
    color: "#4B5563", // Subtle slate grey matching Pocket Money section titles
    marginBottom: 16,
    fontFamily: "DMSerifDisplay-Regular",
    textTransform: "uppercase",
    letterSpacing: 1.5, // Sleek letter spacing
    alignSelf: "flex-start",
    paddingHorizontal: 12,
  },

  backButtonContainer: {
    position: "absolute",
    left: 14,
    zIndex: 10,
    padding: 10,
    backgroundColor: "transparent",
  },
});
