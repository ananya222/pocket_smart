import { StyleSheet } from 'react-native';

export const getStyles = (isSmallDevice) => StyleSheet.create({
  amountHeroContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: isSmallDevice ? 16 : 24,
  },
  currencyHero: {
    fontSize: isSmallDevice ? 44 : 54,
    color: "#FFFFFF",
    fontFamily: "Geist-SemiBold",
    marginRight: 4,
  },
  amountHeroInput: {
    fontSize: isSmallDevice ? 44 : 54,
    color: "#FFFFFF",
    fontFamily: "Geist-SemiBold",
    minWidth: 120,
    textAlign: "left",
  },
});
