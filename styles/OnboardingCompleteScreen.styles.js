import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  headerWrapper: {
    flex: 1,
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
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

  /* Bottom White Card */
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.93)",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
    elevation: 5,
  },

  title: {
    fontSize: 24,
    color: "#111827",
    textAlign: "center",
    fontFamily: "DMSerifDisplay-Regular",
    marginBottom: 8,
    letterSpacing: 0.3,
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    fontFamily: "DMSerifDisplay-Regular",
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 10,
  },

  /* Unified Premium Money Profile Summary Widget */
  profileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    padding: 16,
    marginBottom: 24,
    // Smooth elevation drop shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
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
    color: "#9CA3AF",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },

  profileSubLabel: {
    fontSize: 14,
    color: "#1F2937",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 1,
  },

  profileValue: {
    fontSize: 16,
    color: "#111827",
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "right",
  },

  profileValueSubtitle: {
    fontSize: 11,
    color: "#6B7280",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 1,
    textAlign: "right",
  },

  profileDivider: {
    height: 1,
    backgroundColor: "#F3F4F6",
    marginVertical: 12,
  },

  statusBadge: {
    backgroundColor: "#F3F0FF",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },

  statusBadgeText: {
    fontSize: 10,
    color: "#7B2CBF",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },

  /* Button styles */
  buttonContainer: {
    width: "100%",
    height: 52,
    borderRadius: 26,
    shadowColor: "#3C096C",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  buttonGradient: {
    flex: 1,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },

  backButtonContainer: {
    position: "absolute",
    left: 14,
    zIndex: 10,
    padding: 10,
    backgroundColor: "transparent",
  },
});
