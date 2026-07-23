import { StyleSheet, Platform } from "react-native";

export const getStyles = () => StyleSheet.create({
  bottomNavBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 28 : 18,
    left: 20,
    right: 20,
    height: 64,
    borderRadius: 32,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 10,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  navBlurView: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.03)",
  },
  navItem: {
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: 50,
  },
  centerNavItem: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#9D4EDD",
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#9D4EDD",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
