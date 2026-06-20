import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FFFFFF",
  },

  headerWrapper: {
    backgroundColor: "#7B2CBF",
    position: "relative",
    overflow: "hidden",
  },

  buttonScaleWrapper: {
    flex: 1,
  },
  sliderActiveTrackFill: {
    backgroundColor: "#0088FF",
    top: 0,
  },

  headerTextContainer: {
    width: "100%",
    paddingHorizontal: 24,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 15,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 42,
    lineHeight: 48,
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "left",
  },

  headerDescription: {
    color: "#FFFFFF",
    opacity: 0.85,
    marginTop: 8,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "right",
  },

  card: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.93)",
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 24,
    marginTop: 120,
  },

  sectionTitle: {
    fontSize: 12,
    color: "#4B5563", // Subtle grey label color
    marginBottom: 8,
    fontFamily: "DMSerifDisplay-Regular",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  /* Input Container */
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    height: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },

  inputContainerFocused: {
    borderColor: "#7B2CBF",
  },

  currencySymbol: {
    fontSize: 18,
    color: "#1F2937",
    marginRight: 8,
    fontFamily: "DMSerifDisplay-Regular",
  },

  inputFlex: {
    flex: 1,
    height: "100%",
    fontSize: 16,
    color: "#1F2937",
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
    color: "#4B5563",
    marginRight: 12,
    fontFamily: "DMSerifDisplay-Regular",
    textTransform: "uppercase",
  },

  pillContainer: {
    flexDirection: "row",
    backgroundColor: "#F3F4F6",
    borderRadius: 20,
    padding: 3,
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
    backgroundColor: "#7B2CBF",
  },

  frequencyPillText: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "DMSerifDisplay-Regular",
  },

  activePillText: {
    color: "#FFFFFF",
  },

  /* Spending vs Saving Section */
  ratioContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },

  /* Vertical Slider Styles */
  sliderColumn: {
    width: "30%",
    height: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  sliderLabel: {
    fontSize: 11,
    color: "#4B5563",
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
    backgroundColor: "#E5E7EB",
    position: "relative",
    overflow: "hidden",
  },

  sliderActiveTrack: {
    width: "100%",
    position: "absolute",
    left: 0,
  },

  sliderThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 3,
    borderColor: "#7B2CBF",
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
    backgroundColor: "#7B2CBF",
  },

  /* Pie Chart Column */
  chartColumn: {
    width: "65%",
    height: "100%",
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
    backgroundColor: "#7B2CBF",
  },

  chartLabelText: {
    fontSize: 13,
    color: "#4B5563",
    fontFamily: "DMSerifDisplay-Regular",
    flex: 1,
  },

  chartLabelBold: {
    fontFamily: "DMSerifDisplay-Regular",
  },

  /* Buttons Row */
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: "auto",
    paddingBottom: Platform.OS === "ios" ? 10 : 10,
    width: "100%",
  },

  backButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.3)",
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
    shadowColor: "#3C096C",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  nextButtonGradient: {
    flex: 1,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },

  nextButtonText: {
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

export const chartStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: 150,
    height: 150,
  },
  circleBlue: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#0088FF",
    position: "relative",
    overflow: "hidden",
  },
  rightHalfContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    width: 77,
    height: 150,
    overflow: "hidden",
  },
  leftHalfContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: 77,
    height: 150,
    overflow: "hidden",
  },
  halfCircleContainer: {
    width: 150,
    height: 150,
    backgroundColor: "transparent",
    position: "absolute",
  },
  halfCirclePurpleLeft: {
    width: 77,
    height: 150,
    backgroundColor: "#7B2CBF",
    borderTopLeftRadius: 75,
    borderBottomLeftRadius: 75,
    position: "absolute",
    left: 0,
    top: 0,
  },
  leftHalfPurple: {
    left: 0,
  },
  rightHalfPurple: {
    left: -73,
  },
});
