import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  goalCard: {
    backgroundColor: "rgba(26, 28, 25, 0.75)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 20,
    overflow: "hidden",
    padding: 12,
    marginBottom: 12,
  },
  completedGoalCard: {
    opacity: 0.8,
  },
  goalMainRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: "#111210",
    borderWidth: 1,
    borderColor: "#2C2D35",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  goalInfoContainer: {
    flex: 1,
  },
  goalTitle: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
  },
  goalProgressText: {
    fontSize: 12,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
    marginTop: 2,
  },
  goalProgressBarContainer: {
    marginTop: 8,
    marginBottom: 8,
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#2C2D35",
    borderRadius: 3,
    width: "100%",
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
  },
  goalFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalTimeText: {
    fontSize: 11,
    color: "#8A90A8",
    fontFamily: "DMSerifDisplay-Regular",
  },
  goalPercentText: {
    fontSize: 11,
    fontFamily: "DMSerifDisplay-Regular",
  },
  achievedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(106, 201, 122, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  achievedBadgeText: {
    fontSize: 11,
    fontFamily: "DMSerifDisplay-Regular",
  },
  deleteButton: {
    padding: 6,
    marginLeft: 8,
  }
});
