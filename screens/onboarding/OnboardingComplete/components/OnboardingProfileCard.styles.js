import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
  profileRightAlign: {
    alignItems: "flex-end",
  },
});
