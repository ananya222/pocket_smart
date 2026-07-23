import React from "react";
import { View, Image } from "react-native";
import { styles } from "./BackgroundGrid.styles";

const BackgroundGrid = () => {
  return (
    <View style={styles.fill} pointerEvents="none">
      <Image
        source={require("../../assets/images/abstract_pattern.png")}
        style={styles.image}
        resizeMode="cover"
      />
    </View>
  );
};

export default React.memo(BackgroundGrid);
