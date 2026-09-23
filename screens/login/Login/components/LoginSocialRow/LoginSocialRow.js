import React from "react";
import { View, Text, TouchableOpacity, Animated, Image, ActivityIndicator } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { styles } from "./LoginSocialRow.styles";

export default function LoginSocialRow({ 
  onGooglePress,
  onApplePress,
  showApple = false,
  googleLoading = false,
  appleLoading = false,
  disabled = false,
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
            onPress={onGooglePress}
            disabled={disabled}
            accessibilityRole="button"
            accessibilityLabel="Sign in with Google"
            accessibilityState={{ disabled, busy: googleLoading }}
            onPressIn={() => handlePressIn(googleScale)}
            onPressOut={() => handlePressOut(googleScale)}
            activeOpacity={1}
            style={styles.socialCircle}
          >
            <Animated.View style={[styles.socialCircleScaleWrapper, googleScaleStyle]}>
              {googleLoading ? <ActivityIndicator color="#FFFFFF" /> : <Image source={require("../../../../../assets/images/google_logo_transparent.png")} style={styles.socialIcon} />}
            </Animated.View>
          </TouchableOpacity>
          <Text style={styles.socialText}>Google</Text>
        </View>

        {showApple && (
          <View style={styles.socialButtonWrapper}>
            <TouchableOpacity
              onPress={onApplePress}
              disabled={disabled}
              onPressIn={() => handlePressIn(appleScale)}
              onPressOut={() => handlePressOut(appleScale)}
              activeOpacity={1}
              style={styles.socialCircle}
              accessibilityRole="button"
              accessibilityLabel="Continue with Apple"
              accessibilityState={{ disabled, busy: appleLoading }}
            >
              <Animated.View style={[styles.socialCircleScaleWrapper, appleScaleStyle]}>
                {appleLoading ? <ActivityIndicator color="#FFFFFF" /> : <FontAwesome name="apple" size={20} color="#FFFFFF" />}
              </Animated.View>
            </TouchableOpacity>
            <Text style={styles.socialText}>Apple</Text>
          </View>
        )}
      </View>
    </>
  );
}
