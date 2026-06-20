import React from "react";
import { View, Image, StyleSheet } from "react-native";

const BackgroundGrid = () => {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Image
        source={require("../assets/images/abstract_pattern.png")}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0.035,
        }}
        resizeMode="cover"
      />
    </View>
  );
};

export default React.memo(BackgroundGrid);
