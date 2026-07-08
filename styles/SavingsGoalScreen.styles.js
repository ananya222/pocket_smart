import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#111210",
  },

  headerWrapper: {
    backgroundColor: "transparent",
    position: "relative",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonScaleWrapper: {
    flex: 1,
  },

  backButtonContainer: {
    position: "absolute",
    left: 16,
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextContainer: {
    width: "100%",
    paddingHorizontal: 20,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingTop: 15,
    paddingBottom: 10,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    lineHeight: 34,
    fontFamily: "DMSerifDisplay-Regular",
    textAlign: "left",
  },

  /* Card Container */
  card: {
    flex: 1,
    backgroundColor: "transparent",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 16,
  },

  /* Preview Card */
  previewCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    padding: 12,
    marginBottom: 12,
  },

  previewImageContainer: {
    width: 76,
    height: 76,
    borderRadius: 10,
    backgroundColor: "#111210",
    borderWidth: 1,
    borderColor: "#2C2D35",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },

  previewText: {
    fontSize: 15,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },

  /* Input Fields */
  sectionTitle: {
    fontSize: 10,
    color: "#8A90A8",
    marginBottom: 6,
    fontFamily: "DMSerifDisplay-Regular",
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    height: 46,
  },

  searchBarContainerFocused: {
    borderColor: "#9D4EDD",
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(17, 18, 16, 0.68)",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    height: 46,
  },

  inputContainerFocused: {
    borderColor: "#9D4EDD",
  },

  inputFlex: {
    flex: 1,
    height: "100%",
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },

  currencySymbol: {
    fontSize: 14,
    color: "#8A90A8",
    marginRight: 4,
    fontFamily: "DMSerifDisplay-Regular",
  },

  /* Progress Section */
  progressWrapper: {
    marginBottom: 12,
  },

  progressText: {
    fontSize: 12,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    lineHeight: 16,
  },

  progressBold: {
    color: "#9D4EDD",
    fontWeight: "bold",
  },

  /* CTA Button */
  buttonContainer: {
    width: "100%",
    height: 50,
    borderRadius: 25,
    marginTop: "auto",
    marginBottom: 8,
  },

  buttonSolid: {
    flex: 1,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
  },

  buttonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 15,
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },

  /* Search Results List */
  searchResultsContainer: {
    backgroundColor: "rgba(26, 28, 25, 0.95)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    maxHeight: 200,
    overflow: "hidden",
    marginBottom: 12,
  },
  searchResultItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#2C2D35",
  },
  searchResultImage: {
    width: 38,
    height: 38,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#2C2D35",
  },
  searchResultInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  searchResultTitle: {
    fontSize: 13,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
  searchResultSource: {
    fontSize: 10,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 2,
  },
  searchResultPrice: {
    fontSize: 13,
    color: "#9D4EDD",
    fontFamily: "DMSerifDisplay-Regular",
    marginLeft: 8,
  },
});
