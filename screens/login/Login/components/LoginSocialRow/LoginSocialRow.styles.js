import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
  },
  dividerText: {
    marginHorizontal: 12,
    color: "#8A90A8",
    fontSize: 12,
    fontFamily: "DMSerifDisplay-Regular",
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  socialButtonWrapper: {
    alignItems: "center",
    marginHorizontal: 14,
  },
  socialCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    backgroundColor: "rgba(26, 28, 25, 0.6)",
    alignItems: "center",
    justifyContent: "center",
  },
  socialCircleScaleWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  socialIcon: {
    width: 18,
    height: 18,
    resizeMode: "contain",
  },
  socialText: {
    color: "#8A90A8",
    fontSize: 11,
    marginTop: 4,
    fontFamily: "DMSerifDisplay-Regular",
  },
});
