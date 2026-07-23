import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./LoginRememberMeRow.styles";

export default function LoginRememberMeRow({ keepLoggedIn, setKeepLoggedIn, onForgotPassword }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setKeepLoggedIn(!keepLoggedIn)}
        activeOpacity={0.8}
        style={styles.checkboxWrapper}
      >
        <View style={[styles.checkbox, keepLoggedIn && styles.checkboxActive]}>
          {keepLoggedIn && <Feather name="check" size={10} color="#9D4EDD" />}
        </View>
        <Text style={styles.checkboxLabel}>
          Keep me logged in
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.forgotPasswordContainer} activeOpacity={0.7} onPress={onForgotPassword}>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>
    </View>
  );
}
