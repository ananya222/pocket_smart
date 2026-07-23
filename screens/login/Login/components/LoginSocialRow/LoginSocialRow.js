import React from "react";
import { View, Text, TouchableOpacity, Animated, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { styles } from "./LoginSocialRow.styles";

export default function LoginSocialRow({ 
  handlePressIn, 
  handlePressOut, 
  googleScale, 
  googleScaleStyle, 
  appleScale, 
  appleScaleStyle 
}) {
  return (
    <>
      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or continue with</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialRow}>
        <View style={styles.socialButtonWrapper}>
          <TouchableOpacity
            onPressIn={() => handlePressIn(googleScale)}
            onPressOut={() => handlePressOut(googleScale)}
            activeOpacity={1}
            style={styles.socialCircle}
          >
            <Animated.View style={[styles.socialCircleScaleWrapper, googleScaleStyle]}>
              <Image source={require("../../../../../assets/images/google_logo_transparent.png")} style={styles.socialIcon} />
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.socialText}>Google</Text>
        </View>

        <View style={styles.socialButtonWrapper}>
          <TouchableOpacity
            onPressIn={() => handlePressIn(appleScale)}
            onPressOut={() => handlePressOut(appleScale)}
            activeOpacity={1}
            style={styles.socialCircle}
          >
            <Animated.View style={[styles.socialCircleScaleWrapper, appleScaleStyle]}>
              <FontAwesome name="apple" size={20} color="#FFFFFF" />
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.socialText}>Apple</Text>
        </View>
      </View>
    </>
  );
}
