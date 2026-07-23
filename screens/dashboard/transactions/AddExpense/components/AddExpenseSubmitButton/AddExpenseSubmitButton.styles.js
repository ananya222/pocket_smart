import { StyleSheet } from 'react-native';

export const getStyles = (isSmallDevice) => StyleSheet.create({
  addButton: {
    height: 48,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(157, 78, 221, 0.65)",
    backgroundColor: "rgba(157, 78, 221, 0.28)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    fontSize: 14,
    color: "#FFFFFF",
    fontFamily: "DMSerifDisplay-Regular",
    letterSpacing: 0.5,
  },
});
