import { auth, firestore } from "../../../../config";
import React, { useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./GoalAchievedScreen.styles";

export default function GoalAchievedScreen({ navigation, route }) {
  const { user = {}, achievedGoal = {}, overflowAmount = 0, newAllowance = 0 } = route.params || {};
  const [saving, setSaving] = useState(false);
  const complete = async () => { setSaving(true); try { const userId=user.id||user.userId||auth().currentUser?.uid; if(!userId) throw new Error("No session"); await firestore().collection("users").doc(userId).collection("goals").doc(String(achievedGoal.id)).update({progress:achievedGoal.target,is_active:0}); await firestore().collection("users").doc(userId).update({"onboarding.current_balance":String(Number(newAllowance)+Number(overflowAmount||0))}); navigation.navigate("Dashboard",{user:{...user,onboarding:{...user.onboarding,currentBalance:Number(newAllowance)+Number(overflowAmount||0)}}}); } catch (_) { Alert.alert("Could not finish goal","Please check your connection and try again."); } finally { setSaving(false); } };
  return <SafeAreaView style={styles.safeArea}><StatusBar barStyle="dark-content" backgroundColor="#F7F3EB" /><View style={styles.content}><View style={styles.mark}><Feather name="check" size={28} color="#F8F5EE" /></View><Text style={styles.eyebrow}>GOAL ACHIEVED</Text><Text style={styles.title}>{achievedGoal.name || "Your goal"}{`\n`}is complete.</Text><Text style={styles.subtitle}>You saved ₹{Number(achievedGoal.target || 0).toLocaleString("en-IN")} for this goal.</Text>{Number(overflowAmount)>0&&<View style={styles.overflow}><Text style={styles.overflowLabel}>EXTRA SAVINGS</Text><Text style={styles.overflowAmount}>₹{Number(overflowAmount).toLocaleString("en-IN")}</Text><Text style={styles.overflowCopy}>This will remain available in your next allowance.</Text></View>}<TouchableOpacity onPress={complete} disabled={saving} style={styles.primary}>{saving?<ActivityIndicator color="#F8F5EE"/>:<Text style={styles.primaryText}>Continue</Text>}</TouchableOpacity></View></SafeAreaView>;
}
