import { auth, firestore } from "../../../../config";
import React, { useState } from "react";
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { styles } from "./AllocationScreen.styles";

const number = (value) => Number(String(value ?? 0).replace(/[^0-9.-]/g, "")) || 0;

export default function AllocationScreen({ navigation, route }) {
  const { user = {}, savedAmount = 0, newAllowance = 0, newFrequency, goals: rawGoals = [] } = route.params || {};
  const goals = rawGoals.map((goal) => ({ ...goal, id: String(goal.id ?? goal.goal_id ?? ""), target: number(goal.target ?? goal.targetAmount ?? goal.target_amount), progress: number(goal.progressAmount ?? goal.progress) })).filter((goal) => goal.target > goal.progress);
  const [mode, setMode] = useState("equal");
  const [selectedId, setSelectedId] = useState("");
  const [saving, setSaving] = useState(false);
  const amount = number(savedAmount);
  const confirm = async () => {
    if (mode === "one" && !selectedId) return Alert.alert("Choose a goal", "Select where you want to put this money.");
    setSaving(true);
    try {
      const userId = user.id || user.userId || auth().currentUser?.uid;
      if (!userId) throw new Error("No session");
      const allocations = goals.map((goal) => ({ ...goal, add: mode === "one" ? (goal.id === selectedId ? amount : 0) : Math.floor(amount / Math.max(1, goals.length)) }));
      const finalBalance = goals.length ? number(newAllowance) : number(newAllowance) + amount;
      await firestore().collection("users").doc(userId).update({ "onboarding.current_balance": String(finalBalance), "onboarding.allowance_amount": String(newAllowance), "onboarding.allowance_frequency": newFrequency || user.onboarding?.frequency || "Monthly", "onboarding.cycle_limit": String(finalBalance), "onboarding.last_refreshed": firestore.FieldValue.serverTimestamp() });
      for (const goal of allocations) if (goal.add) await firestore().collection("users").doc(userId).collection("goals").doc(goal.id).update({ progress: goal.progress + goal.add });
      navigation.navigate("Dashboard", { user: { ...user, onboarding: { ...user.onboarding, currentBalance: finalBalance, allowance: Number(newAllowance).toLocaleString("en-IN"), frequency: newFrequency || user.onboarding?.frequency } } });
    } catch (_) { Alert.alert("Could not save allocation", "Please check your connection and try again."); }
    finally { setSaving(false); }
  };
  return <SafeAreaView style={styles.safeArea}><StatusBar barStyle="dark-content" backgroundColor="#F7F3EB" /><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><TouchableOpacity onPress={() => navigation.goBack()} style={styles.back}><Feather name="arrow-left" size={20} color="#302C27" /></TouchableOpacity><Text style={styles.eyebrow}>ALLOWANCE REFRESHED</Text><Text style={styles.title}>Put your savings{`\n`}to work.</Text><Text style={styles.subtitle}>₹{amount.toLocaleString("en-IN")} is ready to allocate.</Text>{goals.length ? <><Text style={styles.label}>How should it be allocated?</Text><TouchableOpacity onPress={() => { setMode("equal"); setSelectedId(""); }} style={[styles.option, mode === "equal" && styles.optionActive]}><Text style={styles.optionTitle}>Divide equally</Text><Text style={styles.optionCopy}>Share it between your active goals.</Text></TouchableOpacity><TouchableOpacity onPress={() => setMode("one")} style={[styles.option, mode === "one" && styles.optionActive]}><Text style={styles.optionTitle}>Choose one goal</Text><Text style={styles.optionCopy}>Put the full amount towards a single goal.</Text></TouchableOpacity>{mode === "one" && <View style={styles.goalList}>{goals.map((goal) => <TouchableOpacity key={goal.id} onPress={() => setSelectedId(goal.id)} style={[styles.goalRow, selectedId === goal.id && styles.goalRowActive]}><Text style={styles.goalName}>{goal.name}</Text><Text style={styles.goalMeta}>₹{goal.target.toLocaleString("en-IN")} target</Text></TouchableOpacity>)}</View>}</> : <Text style={styles.empty}>You have no active goals, so this amount will remain available in your next allowance.</Text>}<TouchableOpacity onPress={confirm} disabled={saving} style={styles.primary}>{saving ? <ActivityIndicator color="#F8F5EE" /> : <Text style={styles.primaryText}>Save allocation</Text>}</TouchableOpacity></ScrollView></SafeAreaView>;
}
