import { StyleSheet } from 'react-native';

export const getStyles = (isSmallDevice) => StyleSheet.create({
  impactCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    paddingVertical: isSmallDevice ? 16 : 22,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  futureValueCard: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    paddingVertical: isSmallDevice ? 16 : 22,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: isSmallDevice ? 24 : 32,
  },
  impactValue: {
    fontSize: isSmallDevice ? 30 : 36,
    color: "#FF6B6B",
    fontFamily: "Geist-SemiBold",
    marginBottom: 6,
    textAlign: "center",
  },
  futureValueText: {
    fontSize: isSmallDevice ? 30 : 36,
    color: "#6AC97A",
    fontFamily: "Geist-SemiBold",
    marginBottom: 6,
    textAlign: "center",
  },
  impactSublabel: {
    fontSize: isSmallDevice ? 14 : 16,
    color: "#8A90A8",
    fontFamily: "Geist-Regular",
    textAlign: "center",
    marginBottom: 6,
  },
  impactDetail: {
    fontSize: isSmallDevice ? 12 : 13,
    color: "rgba(255, 255, 255, 0.4)",
    fontFamily: "Geist-Regular",
    textAlign: "center",
  }
});
