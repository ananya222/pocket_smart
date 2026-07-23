import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#111210",
  },

  headerWrapper: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    paddingVertical: 16,
  },

  /* Hero Image */
  heroImageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },

  heroImage: {
    resizeMode: "contain",
  },

  /* Bottom Card */
  card: {
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 24,
    paddingHorizontal: 20,
    overflow: "hidden",
    marginHorizontal: 16,
  },

  title: {
    fontSize: 24,
    color: "#FFFFFF",
    textAlign: "center",
    fontFamily: "DMSerifDisplay-Regular",
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 14,
    color: "#8A90A8",
    textAlign: "center",
    fontFamily: "DMSerifDisplay-Regular",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },

  /* Button styles */

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
