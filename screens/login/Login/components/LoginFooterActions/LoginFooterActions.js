import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./LoginFooterActions.styles";

export default function LoginFooterActions({ navigation, onDevBypass }) {
  return (
    <>
      <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.signupContainer}>
        <Text style={styles.signupTextSub}>
          Don't have an account? <Text style={styles.signupTextHighlight}>Sign Up</Text>
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onDevBypass}
        style={styles.devBypassButton}
      >
        <Text style={styles.devBypassText}>
          Test Offline (Dev Mode)
        </Text>
      </TouchableOpacity>
    </>
  );
}
