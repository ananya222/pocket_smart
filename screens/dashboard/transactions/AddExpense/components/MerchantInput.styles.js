import { StyleSheet } from 'react-native';

export const getStyles = (isSmallDevice) => StyleSheet.create({
  formContainer: {
    width: "100%",
    marginBottom: isSmallDevice ? 16 : 20,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.06)",
    paddingVertical: isSmallDevice ? 12 : 14,
    marginBottom: 8,
  },
  inputRowField: {
    flex: 1,
    height: 32,
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "Geist-Regular",
    textAlign: "left",
    padding: 0,
  },
});
