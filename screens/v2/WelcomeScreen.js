import React from "react";
import { StatusBar, View } from "react-native";
import { AppText, PrimaryButton, Screen } from "../../components/ui";
import { colors } from "../../theme/theme";
import { styles } from "./v2Styles";

export default function WelcomeScreenV2({ navigation, route }) {
  return (
    <Screen scroll contentContainerStyle={styles.welcomeContent}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <View style={styles.welcomeIntro}>
        <View style={styles.welcomeMark}><AppText style={styles.welcomeMarkText}>p.</AppText></View>
        <AppText style={styles.welcomeTitle}>Welcome to{`\n`}PocketSmart</AppText>
        <AppText muted style={styles.welcomeSubtitle}>A calmer way to manage your money.</AppText>
      </View>
      <View style={styles.welcomeActions}>
        <PrimaryButton onPress={() => navigation.navigate("PocketMoney", { user: route?.params?.user })} style={styles.fullWidthButton}>Get started</PrimaryButton>
      </View>
    </Screen>
  );
}
