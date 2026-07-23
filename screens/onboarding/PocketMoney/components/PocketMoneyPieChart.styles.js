import { StyleSheet } from "react-native";

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
