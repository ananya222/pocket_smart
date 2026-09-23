import { auth, firestore } from "../../config";
import React, { useEffect, useState } from "react";
import { Pressable, ScrollView, StatusBar, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppText, SectionHeader } from "../../components/ui";
import { colors, formatMoney, parseMoney, spacing } from "../../theme/theme";
import { UI_PREVIEW_MODE } from "../../config/uiPreview";
import { styles } from "./v2Styles";

export default function ProfileScreenV2({ navigation, route }) {
  const user = route?.params?.user || {};
  const insets = useSafeAreaInsets();
  const previewData = route?.params?.previewData;
  const userId = UI_PREVIEW_MODE ? null : user.id || user.userId || auth().currentUser?.uid;
  const fullName = user.fullName || "PocketSmart user";
  const [onboarding, setOnboarding] = useState(previewData?.user?.onboarding || user.onboarding || {});
  const [goalsCount, setGoalsCount] = useState(() => previewData?.goals?.length || 0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("dailyRemindersEnabled").then((saved) => { if (saved !== null) setNotificationsEnabled(saved === "true"); }).catch(() => {});
    if (!userId) return undefined;
    const userUnsubscribe = firestore().collection("users").doc(userId).onSnapshot((snapshot) => { if (snapshot.exists) setOnboarding(snapshot.data().onboarding || {}); }, (error) => console.error("V2 profile user listener:", error));
    const goalsUnsubscribe = firestore().collection("users").doc(userId).collection("goals").onSnapshot((snapshot) => setGoalsCount(snapshot.size), (error) => console.error("V2 profile goals listener:", error));
    return () => { userUnsubscribe(); goalsUnsubscribe(); };
  }, [userId]);

  const setNotifications = async () => { const next = !notificationsEnabled; setNotificationsEnabled(next); await AsyncStorage.setItem("dailyRemindersEnabled", String(next)).catch(() => {}); };
  const handleLogout = async () => { if (!UI_PREVIEW_MODE) await auth().signOut().catch(() => {}); navigation.reset({ index: 0, routes: [{ name: UI_PREVIEW_MODE ? "DevGallery" : "Login" }] }); };

  const allowance = parseMoney(onboarding.cycle_limit || onboarding.allowance_amount || onboarding.allowance);
  const balance = parseMoney(onboarding.current_balance || onboarding.currentBalance);
  const frequency = onboarding.allowance_frequency || onboarding.frequency || "Monthly";
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.dashboardShell}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.referenceBackground} />
      <View style={styles.dashboardFixedHeader}><AppText style={styles.goalsTitle}>Profile</AppText></View>
      <ScrollView contentContainerStyle={[styles.profileContent, { paddingBottom: spacing.massive + insets.bottom }]} showsVerticalScrollIndicator={false}>
        <View style={styles.profileIdentity}><View style={styles.profileAvatar}><AppText style={styles.profileAvatarText}>{fullName[0]?.toUpperCase() || "P"}</AppText></View><View><AppText style={styles.profileName}>{fullName}</AppText><AppText style={styles.profileEmail}>{user.email || ""}</AppText></View></View>
        <SectionHeader title="Your plan" />
        <View style={styles.profileList}><View style={styles.detailRow}><AppText style={styles.detailLabel}>Allowance</AppText><AppText style={styles.detailValue}>₹{formatMoney(allowance)}</AppText></View><View style={styles.detailRow}><AppText style={styles.detailLabel}>Available balance</AppText><AppText style={styles.detailValue}>₹{formatMoney(balance)}</AppText></View><View style={[styles.detailRow, styles.detailRowLast]}><AppText style={styles.detailLabel}>Frequency</AppText><AppText style={styles.detailValue}>{frequency}</AppText></View></View>
        <View style={styles.pageSection}><SectionHeader title="Preferences" /></View>
        <View style={styles.profileList}><View style={[styles.preferenceRow, styles.detailRowLast]}><View style={styles.flex}><AppText style={styles.preferenceTitle}>Daily reminders</AppText><AppText style={styles.preferenceSubtitle}>A nudge to log spending.</AppText></View><Pressable style={[styles.toggle, notificationsEnabled && styles.toggleActive]} onPress={setNotifications} accessibilityRole="switch" accessibilityState={{ checked: notificationsEnabled }}><View style={[styles.toggleKnob, notificationsEnabled && styles.toggleKnobActive]} /></Pressable></View></View>
        <View style={styles.pageSection}><SectionHeader title="Account" /></View>
        <View style={styles.profileList}><Pressable onPress={() => navigation.navigate("ChangePassword", { user })} style={styles.profileActionRow}><AppText style={styles.preferenceTitle}>Change password</AppText><AppText style={styles.profileActionArrow}>›</AppText></Pressable><View style={[styles.detailRow, styles.detailRowLast]}><AppText style={styles.detailLabel}>Savings goals</AppText><AppText style={styles.detailValue}>{goalsCount}</AppText></View></View>
        <Pressable onPress={handleLogout} style={styles.profileLogout}><AppText style={styles.profileLogoutText}>Log out</AppText></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}
