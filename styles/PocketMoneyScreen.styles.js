import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#111210",
  },

  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },

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

  sectionTitle: {
    fontSize: 12,
    color: "#8A90A8",
    marginBottom: 10,
    fontFamily: "DMSerifDisplay-Regular",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  /* Input Container */
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 18, 16, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
    height: 50,
  },

  inputContainerFocused: {
    borderColor: "#9D4EDD",
  },

  currencySymbol: {
    fontSize: 18,
    color: "#FFFFFF",
    marginRight: 8,
    fontFamily: "DMSerifDisplay-Regular",
  },

  inputFlex: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },

  /* Frequency Select */
  frequencyRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },

  frequencyLabel: {
    fontSize: 13,
    color: "#8A90A8",
    marginRight: 12,
    fontFamily: "DMSerifDisplay-Regular",
    textTransform: "uppercase",
  },

  pillContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 20,
    padding: 3,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.05)",
  },

  frequencyPill: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 18,
  },

  activePillWeekly: {
    backgroundColor: "#0088FF",
  },

  activePillMonthly: {
    backgroundColor: "#9D4EDD",
  },

  frequencyPillText: {
    fontSize: 13,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
  },

  activePillText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  /* Spending vs Saving Section */
  ratioContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },

  /* Vertical Slider Styles */
  sliderColumn: {
    width: "30%",
    height: 240,
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  sliderLabel: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    textTransform: "uppercase",
    marginVertical: 4,
  },

  sliderTrackContainer: {
    flex: 1,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginVertical: 4,
  },

  sliderTrack: {
    width: 6,
    height: "100%",
    borderRadius: 3,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    position: "relative",
    overflow: "hidden",
  },

  sliderActiveTrack: {
    width: "100%",
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: "#0088FF",
  },

  sliderThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#9D4EDD",
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },

  sliderThumbInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#9D4EDD",
  },

  /* Pie Chart Column */
  chartColumn: {
    width: "65%",
    height: 240,
    alignItems: "center",
    justifyContent: "center",
  },

  chartLabelsContainer: {
    marginTop: 16,
    width: "100%",
  },

  chartLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
  },

  dotBlue: {
    backgroundColor: "#0088FF",
  },

  dotPurple: {
    backgroundColor: "#9D4EDD",
  },

  chartLabelText: {
    fontSize: 12,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    flex: 1,
  },

  chartLabelBold: {
    fontFamily: "DMSerifDisplay-Regular",
    color: "#FFFFFF",
  },

  /* Buttons Row */
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingBottom: Platform.OS === "ios" ? 10 : 10,
    width: "100%",
  },

  backButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: "DMSerifDisplay-Regular",
  },

  nextButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    marginLeft: 8,
  },

  nextButtonSolid: {
    flex: 1,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },

  nextButtonText: {
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

export const chartStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 130,
    height: 130,
  },
  circleBlue: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#0088FF",
    position: "relative",
    overflow: "hidden",
  },
  rightHalfContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 65,
    height: 130,
    overflow: "hidden",
  },
  leftHalfContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 65,
    height: 130,
    overflow: "hidden",
  },
  halfCircleContainer: {
    width: 130,
    height: 130,
    backgroundColor: "transparent",
    position: "absolute",
  },
  halfCirclePurpleLeft: {
    width: 65,
    height: 130,
    backgroundColor: "#9D4EDD",
    borderTopLeftRadius: 65,
    borderBottomLeftRadius: 65,
    position: "absolute",
    left: 0,
    top: 0,
  },
  leftHalfPurple: {
    left: 0,
  },
  rightHalfPurple: {
    left: -65,
  },
});
