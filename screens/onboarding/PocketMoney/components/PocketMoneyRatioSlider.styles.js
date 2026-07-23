import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
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
});
