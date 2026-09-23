import { auth, firestore } from "../../../../config";
import React, { useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./ConfirmGoalScreen.styles";

export default function ConfirmGoalScreen({ navigation, route }) {
  const { user = {}, goalName = "Savings goal", targetAmount = "0", timeToReach = 0 } = route.params || {};
  const [isUpdating, setIsUpdating] = useState(false);
  const frequency = user.onboarding?.frequency || "Monthly";
  const confirm = async () => {
    setIsUpdating(true);
    try {
      const userId = user.id || user.userId || auth().currentUser?.uid;
      if (!userId) throw new Error("No session");
      const target = parseFloat(String(targetAmount).replace(/,/g, "")) || 0;
      await firestore().collection("users").doc(userId).collection("goals").add({ name: goalName, target_amount: String(target), time_to_reach: Number(timeToReach) || 6, progress: 0, priority: 3, is_active: 1, created_at: firestore.FieldValue.serverTimestamp() });
      navigation.navigate("Dashboard", { user: { ...user, onboarding: { ...user.onboarding, goalName, targetAmount, timeToReach, savingsProgressAmount: 0 } } });
    } catch (_) { Alert.alert("Could not save goal", "Please check your connection and try again."); }
    finally { setIsUpdating(false); }
  };
  return <SafeAreaView style={styles.safeArea}><StatusBar barStyle="dark-content" backgroundColor="#F7F3EB" /><View style={styles.content}><TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><Feather name="arrow-left" size={20} color="#302C27" /></TouchableOpacity><View style={styles.intro}><Text style={styles.eyebrow}>SAVINGS GOAL</Text><Text style={styles.title}>Ready to start{`\n`}saving?</Text><Text style={styles.subtitle}>Your goal is set. You can change it later.</Text></View><View style={styles.summary}><Text style={styles.summaryLabel}>GOAL</Text><Text style={styles.goalName}>{goalName}</Text><Text style={styles.amount}>₹{Number(String(targetAmount).replace(/,/g, "") || 0).toLocaleString("en-IN")}</Text><Text style={styles.meta}>{timeToReach || 6} {frequency === "Weekly" ? "weeks" : "months"} to reach it</Text></View><View style={styles.actions}><TouchableOpacity onPress={confirm} disabled={isUpdating} style={styles.primary}>{isUpdating ? <ActivityIndicator color="#F8F5EE" /> : <Text style={styles.primaryText}>Confirm goal</Text>}</TouchableOpacity><TouchableOpacity onPress={() => navigation.goBack()} style={styles.secondary}><Text style={styles.secondaryText}>Edit details</Text></TouchableOpacity></View></View></SafeAreaView>;
}
