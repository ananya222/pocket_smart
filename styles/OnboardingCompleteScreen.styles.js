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

  buttonScaleWrapper: {
    flex: 1,
  },

  profileRightAlign: {
    alignItems: "flex-end",
  },

  proceedButtonWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  proceedArrowIcon: {
    marginLeft: 8,
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

  /* Unified Premium Money Profile Summary Widget */
  profileCard: {
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    padding: 16,
    marginBottom: 24,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },

  profileDetails: {
    flex: 1,
  },

  profileLabel: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },

  profileSubLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 1,
  },

  profileValue: {
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "right",
  },

  profileValueSubtitle: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 1,
    textAlign: "right",
  },

  profileDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    marginVertical: 12,
  },

  statusBadge: {
    backgroundColor: "rgba(157, 78, 221, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusBadgeText: {
    fontSize: 10,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },

  /* Button styles */
  buttonContainer: {
    width: "100%",
    height: 52,
    borderRadius: 26,
  },

  buttonSolid: {
    flex: 1,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
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
