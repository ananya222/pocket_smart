import React, { useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from "react-native";
import { Feather } from "@expo/vector-icons";
import {
  AppText,
  Card,
  CategoryIcon,
  EmptyState,
  Field,
  GoalCard,
  GoalIcon,
  MoneyDisplay,
  PrimaryButton,
  ProgressBar,
  SecondaryButton,
  SegmentedControl,
  Screen,
  TransactionRow,
} from "../../components/ui";
import { colors, formatMoney, radius, spacing, typography } from "../../theme/theme";
import { getPreviewScenario } from "./previewData";
import WelcomeScreenV2 from "../v2/WelcomeScreen";
import PocketMoneyScreenV2 from "../v2/PocketMoneyScreen";
import SavingsGoalScreenV2 from "../v2/SavingsGoalScreen";
import OnboardingCompleteScreenV2 from "../v2/OnboardingCompleteScreen";
import DashboardScreenV2 from "../v2/DashboardScreen";
import AddMoneyScreenV2 from "../v2/AddMoneyScreen";
import GoalsScreenV2 from "../v2/GoalsScreen";
import AddExpenseScreenV2 from "../v2/AddExpenseScreen";
import ExpenseCategoryScreenV2 from "../v2/ExpenseCategoryScreen";
import ExpenseReflectionScreenV2 from "../v2/ExpenseReflectionScreen";
import InsightsScreenV2 from "../v2/InsightsScreen";
import ProfileScreenV2 from "../v2/ProfileScreen";
import ChangePasswordScreenV2 from "../v2/ChangePasswordScreen";
import RevolutDashboardScreen from "./revolut/RevolutDashboardScreen";
import RevolutGoalsScreen from "./revolut/RevolutGoalsScreen";
import NubankDashboardScreen from "./nubank/NubankDashboardScreen";
import NubankGoalsScreen from "./nubank/NubankGoalsScreen";
import CopilotDashboardScreen from "./copilot/CopilotDashboardScreen";
import CopilotGoalsScreen from "./copilot/CopilotGoalsScreen";
import CashAppDashboardScreen from "./cashapp/CashAppDashboardScreen";
import CashAppGoalsScreen from "./cashapp/CashAppGoalsScreen";

const SCREENS = [
  { key: "welcome", label: "Welcome", group: "Onboarding" },
  { key: "allowance", label: "Allowance setup", group: "Onboarding" },
  { key: "split", label: "Spending / saving split", group: "Onboarding" },
  { key: "goal-category", label: "Goal category", group: "Onboarding" },
  { key: "goal-details", label: "Goal details", group: "Onboarding" },
  { key: "completion", label: "Completion", group: "Onboarding" },
  { key: "dashboard", label: "Dashboard", group: "Dashboard" },
  { key: "add-money", label: "Add money", group: "Dashboard" },
  { key: "goals-empty", label: "Goals empty", group: "Other screens" },
  { key: "goals-populated", label: "Goals populated", group: "Other screens" },
  { key: "add-expense", label: "Add expense", group: "Other screens" },
  { key: "add-expense-invalid", label: "Add expense · validation", group: "Other screens" },
  { key: "expense-category", label: "Choose category", group: "Other screens" },
  { key: "reflection", label: "Expense reflection", group: "Other screens" },
  { key: "insights", label: "Insights", group: "Other screens" },
  { key: "profile", label: "Profile", group: "Other screens" },
  { key: "change-password", label: "Change password", group: "Other screens" },
  { key: "components", label: "Component states", group: "Components" },
];

const SCENARIO_KEYS = ["normal", "empty", "low", "overspent", "multipleGoals", "longName", "largeAmounts"];
const SCENARIO_LABELS = {
  normal: "Normal",
  empty: "Empty",
  low: "Low budget",
  overspent: "Overspent",
  multipleGoals: "Many goals",
  longName: "Long name",
  largeAmounts: "Large amounts",
};
const GOAL_SCENARIO_KEYS = ["oneGoal", "multipleGoals", "longGoalName", "largeAmounts"];
const GOAL_SCENARIO_LABELS = { oneGoal: "One goal", multipleGoals: "Many goals", longGoalName: "Long goal names", largeAmounts: "Large amounts" };

const COMPONENT_CATEGORIES = ["Food & Drinks", "Transport", "Shopping", "Entertainment", "Education"];

function PreviewComponents({ scenario }) {
  const goal = scenario.goals[0] || { id: "component-goal", name: "Sony Headphones", target: 8000, progressAmount: 2650, active: true };
  const transaction = scenario.transactions[0] || { title: "Lunch", category: "Food & Drinks", amount: -180, date: "Today" };

  return (
    <Screen scroll contentContainerStyle={styles.componentContent}>
      <AppText style={styles.previewScreenTitle}>Component states</AppText>
      <AppText muted style={styles.previewScreenSubtitle}>A small catalogue of the building blocks used across V2.</AppText>

      <AppText style={styles.componentLabel}>Buttons</AppText>
      <PrimaryButton onPress={() => {}}>Primary action</PrimaryButton>
      <SecondaryButton onPress={() => {}} style={styles.componentButton}>Secondary action</SecondaryButton>

      <AppText style={styles.componentLabel}>Inputs and controls</AppText>
      <Field label="Example input" value="₹10,000" onChangeText={() => {}} placeholder="Enter an amount" />
      <View style={styles.componentGap} />
      <SegmentedControl options={["Weekly", "Monthly"]} value="Monthly" onChange={() => {}} />

      <AppText style={styles.componentLabel}>Category chips</AppText>
      <View style={styles.categoryPreviewGrid}>
        {COMPONENT_CATEGORIES.map((category) => (
          <View key={category} style={styles.categoryPreviewChip}><CategoryIcon category={category} size={17} /><AppText style={styles.categoryPreviewText}>{category === "Food & Drinks" ? "Food" : category}</AppText></View>
        ))}
      </View>

      <AppText style={styles.componentLabel}>Progress and safe-to-spend</AppText>
      <Card style={styles.previewSafeCard}><AppText style={styles.previewSafeLabel}>Safe to spend today</AppText><MoneyDisplay value={214} style={styles.previewSafeAmount} /><AppText muted style={styles.previewSafeCopy}>A daily guide based on ₹{formatMoney(6420)} remaining.</AppText><ProgressBar progress={36} style={styles.componentProgress} /></Card>

      <AppText style={styles.componentLabel}>Goal card</AppText>
      <GoalCard goal={goal} />

      <AppText style={styles.componentLabel}>Transaction row</AppText>
      <Card><TransactionRow transaction={transaction} /></Card>

      <AppText style={styles.componentLabel}>Empty state</AppText>
      <Card><EmptyState icon="target" title="No active goals" description="Create a goal and keep it visible." action="Create goal" onAction={() => {}} /></Card>
    </Screen>
  );
}

export default function UIDevGallery({ navigation }) {
  const { width: windowWidth } = useWindowDimensions();
  const [screenKey, setScreenKey] = useState("dashboard");
  const [scenarioKey, setScenarioKey] = useState("normal");
  const [goalScenarioKey, setGoalScenarioKey] = useState("multipleGoals");
  const [phoneWidth, setPhoneWidth] = useState(390);
  const [designKey, setDesignKey] = useState("monzo");
  const isGoalsScreen = screenKey === "goals-empty" || screenKey === "goals-populated";
  const selectedScenarioKey = screenKey === "goals-empty" ? "empty" : screenKey === "goals-populated" ? goalScenarioKey : scenarioKey;
  const scenario = getPreviewScenario(selectedScenarioKey);
  const normalScenario = useMemo(() => getPreviewScenario("normal"), []);
  const screen = SCREENS.find((item) => item.key === screenKey) || SCREENS[6];
  const isNarrow = windowWidth < 900;
  const showScenarioPicker = screen.group === "Dashboard" || screen.group === "Other screens";
  const showDesignPicker = screenKey === "dashboard" || screenKey === "goals-empty" || screenKey === "goals-populated";

  const previewNavigation = useMemo(() => ({
    navigate: (target) => {
      if (target === "DevNormalApp" || target === "DevGallery" || target === "Login") {
        navigation.navigate(target);
        return;
      }
      const targetMap = {
        Welcome: "welcome",
        PocketMoney: "allowance",
        SavingsGoal: "goal-category",
        OnboardingComplete: "completion",
        Dashboard: "dashboard",
        AddMoney: "add-money",
        Home: "dashboard",
        Goals: "goals-populated",
        AddExpense: "add-expense",
        ExpenseCategory: "expense-category",
        Impact: "reflection",
        Insights: "insights",
        Profile: "profile",
        ChangePassword: "change-password",
      };
      if (targetMap[target]) setScreenKey(targetMap[target]);
    },
    goBack: () => setScreenKey("dashboard"),
    reset: () => navigation.navigate("DevGallery"),
  }), [navigation]);

  const previewRoute = { params: { user: scenario.user, previewData: scenario } };
  const onboardingRoute = { params: { user: normalScenario.user, previewData: normalScenario } };
  const completionRoute = {
    params: {
      ...onboardingRoute.params,
      allowance: normalScenario.user.onboarding.allowance_amount,
      frequency: normalScenario.user.onboarding.allowance_frequency,
      goalName: normalScenario.goals[0].name,
      targetAmount: String(normalScenario.goals[0].target),
      savingRatio: Number(normalScenario.user.onboarding.saving_ratio),
      timeToReach: 3,
    },
  };

  const renderPreviewScreen = () => {
    switch (screenKey) {
      case "welcome": return <WelcomeScreenV2 navigation={previewNavigation} route={onboardingRoute} />;
      case "allowance":
      case "split": return <PocketMoneyScreenV2 navigation={previewNavigation} route={onboardingRoute} />;
      case "goal-category": return <SavingsGoalScreenV2 navigation={previewNavigation} route={{ params: { ...onboardingRoute.params, allowance: "10,000", frequency: "Monthly", savingRatio: 30, previewStage: "choose" } }} />;
      case "goal-details": return <SavingsGoalScreenV2 navigation={previewNavigation} route={{ params: { ...onboardingRoute.params, allowance: "10,000", frequency: "Monthly", savingRatio: 30, previewStage: "details" } }} />;
      case "completion": return <OnboardingCompleteScreenV2 navigation={previewNavigation} route={completionRoute} />;
      case "dashboard": return designKey === "revolut" ? <RevolutDashboardScreen key={`${screenKey}-${scenario.key}-${designKey}`} navigation={previewNavigation} route={previewRoute} /> : designKey === "nubank" ? <NubankDashboardScreen key={`${screenKey}-${scenario.key}-${designKey}`} navigation={previewNavigation} route={previewRoute} /> : designKey === "copilot" ? <CopilotDashboardScreen key={`${screenKey}-${scenario.key}-${designKey}`} navigation={previewNavigation} route={previewRoute} /> : designKey === "cashapp" ? <CashAppDashboardScreen key={`${screenKey}-${scenario.key}-${designKey}`} navigation={previewNavigation} route={previewRoute} /> : <DashboardScreenV2 key={`${screenKey}-${scenario.key}-${designKey}`} navigation={previewNavigation} route={previewRoute} />;
      case "add-money": return <AddMoneyScreenV2 key={`${screenKey}-${scenario.key}`} navigation={previewNavigation} route={previewRoute} />;
      case "goals-empty":
      case "goals-populated": return designKey === "revolut" ? <RevolutGoalsScreen key={`${screenKey}-${scenario.key}-${designKey}`} navigation={previewNavigation} route={previewRoute} /> : designKey === "nubank" ? <NubankGoalsScreen key={`${screenKey}-${scenario.key}-${designKey}`} navigation={previewNavigation} route={previewRoute} /> : designKey === "copilot" ? <CopilotGoalsScreen key={`${screenKey}-${scenario.key}-${designKey}`} navigation={previewNavigation} route={previewRoute} /> : designKey === "cashapp" ? <CashAppGoalsScreen key={`${screenKey}-${scenario.key}-${designKey}`} navigation={previewNavigation} route={previewRoute} /> : <GoalsScreenV2 key={`${screenKey}-${scenario.key}-${designKey}`} navigation={previewNavigation} route={previewRoute} />;
      case "add-expense": return <AddExpenseScreenV2 key={`${screenKey}-${scenario.key}`} navigation={previewNavigation} route={previewRoute} />;
      case "add-expense-invalid": return <AddExpenseScreenV2 key={`${screenKey}-${scenario.key}`} navigation={previewNavigation} route={{ params: { ...previewRoute.params, invalid: true } }} />;
      case "expense-category": return <ExpenseCategoryScreenV2 key={`${screenKey}-${scenario.key}`} navigation={previewNavigation} route={previewRoute} />;
      case "reflection": return <ExpenseReflectionScreenV2 key={`${screenKey}-${scenario.key}`} navigation={previewNavigation} route={{ params: { ...previewRoute.params, expenseAmount: 280, merchant: "Blue Tokai", category: "Food & Drinks", currentBalance: 3250, newBalance: 2970 } }} />;
      case "insights": return <InsightsScreenV2 key={`${screenKey}-${scenario.key}`} navigation={previewNavigation} route={previewRoute} />;
      case "profile": return <ProfileScreenV2 key={`${screenKey}-${scenario.key}`} navigation={previewNavigation} route={previewRoute} />;
      case "change-password": return <ChangePasswordScreenV2 key={`${screenKey}-${scenario.key}`} navigation={previewNavigation} route={previewRoute} />;
      case "components": return <PreviewComponents key={`components-${scenario.key}`} scenario={scenario} />;
      default: return null;
    }
  };

  return (
    <View style={styles.galleryRoot}>
      <View style={styles.galleryTopbar}>
        <View style={styles.galleryBrand}><View style={styles.galleryBrandMark}><Feather name="pie-chart" size={16} color={colors.primary} /></View><View><AppText style={styles.galleryTitle}>PocketSmart V2</AppText><AppText style={styles.gallerySubtitle}>UI PREVIEW · DEVELOPMENT ONLY</AppText></View></View>
        <Pressable style={styles.normalAppButton} onPress={() => navigation.navigate("DevNormalApp")} accessibilityLabel="Switch to normal app"><Feather name="smartphone" size={15} color={colors.text} /><AppText style={styles.normalAppButtonText}>NORMAL APP</AppText></Pressable>
      </View>

      <View style={[styles.galleryBody, isNarrow && styles.galleryBodyNarrow]}>
        <View style={[styles.sidebar, isNarrow && styles.sidebarNarrow]}>
          <View style={styles.sidebarHeadingRow}><AppText style={styles.sidebarHeading}>Screens</AppText><AppText muted style={styles.sidebarCount}>{SCREENS.length}</AppText></View>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sidebarScroll}>
            {["Onboarding", "Dashboard", "Other screens", "Components"].map((group) => (
              <View key={group} style={styles.screenGroup}>
                <AppText style={styles.groupLabel}>{group}</AppText>
                {SCREENS.filter((item) => item.group === group).map((item) => <Pressable key={item.key} onPress={() => setScreenKey(item.key)} style={[styles.screenButton, screenKey === item.key && styles.screenButtonActive]}><AppText style={[styles.screenButtonText, screenKey === item.key && styles.screenButtonTextActive]}>{item.label}</AppText></Pressable>)}
              </View>
            ))}
          </ScrollView>
        </View>

        <View style={styles.previewStage}>
          <View style={styles.stageHeader}>
            <View><AppText style={styles.stageTitle}>{screen.label}</AppText><AppText muted style={styles.stageSubtitle}>{showScenarioPicker ? scenario.description : "Interactive V2 screen preview"}</AppText></View>
            <View style={styles.widthPicker}><AppText muted style={styles.widthLabel}>Phone width</AppText>{[360, 390, 412].map((width) => <Pressable key={width} onPress={() => setPhoneWidth(width)} style={[styles.widthButton, phoneWidth === width && styles.widthButtonActive]}><AppText style={[styles.widthButtonText, phoneWidth === width && styles.widthButtonTextActive]}>{width}</AppText></Pressable>)}</View>
          </View>

          {showDesignPicker ? <View style={styles.designRow}><AppText style={styles.designLabel}>Design</AppText><View style={styles.designPicker}>{[{ key: "monzo", label: "Monzo" }, { key: "revolut", label: "Revolut" }, { key: "nubank", label: "Nubank" }, { key: "copilot", label: "Copilot" }, { key: "cashapp", label: "Cash App" }].map((design) => <Pressable key={design.key} onPress={() => setDesignKey(design.key)} style={[styles.designButton, designKey === design.key && styles.designButtonActive]}><AppText style={[styles.designButtonText, designKey === design.key && styles.designButtonTextActive]}>{design.label}</AppText></Pressable>)}</View><AppText muted style={styles.designHint}>{designKey === "revolut" ? "Cooler · sharper · more analytical" : designKey === "nubank" ? "Purple · open · minimal" : designKey === "copilot" ? "Dark navy · data-rich · visual" : designKey === "cashapp" ? "Black · bold · simple" : "Warm · friendly · colourful"}</AppText></View> : null}

          {showScenarioPicker ? <View style={styles.scenarioRow}><AppText style={styles.scenarioLabel}>Mock state</AppText><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scenarioScroll}>{(isGoalsScreen ? GOAL_SCENARIO_KEYS : SCENARIO_KEYS).map((key) => <Pressable key={key} onPress={() => isGoalsScreen ? setGoalScenarioKey(key) : setScenarioKey(key)} style={[styles.scenarioButton, (isGoalsScreen ? goalScenarioKey : scenarioKey) === key && styles.scenarioButtonActive]}><AppText style={[styles.scenarioButtonText, (isGoalsScreen ? goalScenarioKey : scenarioKey) === key && styles.scenarioButtonTextActive]}>{isGoalsScreen ? GOAL_SCENARIO_LABELS[key] : SCENARIO_LABELS[key]}</AppText></Pressable>)}</ScrollView></View> : null}

          <View style={styles.phoneStage}>
            <View style={[styles.phoneFrame, { width: Math.min(phoneWidth, Math.max(280, windowWidth - 64)) }]}>
              {renderPreviewScreen()}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  galleryRoot: { flex: 1, minHeight: "100vh", backgroundColor: "#EEEFEA" },
  galleryTopbar: { minHeight: 72, paddingHorizontal: spacing.xl, paddingVertical: spacing.md, backgroundColor: colors.surface, borderBottomWidth: 1, borderBottomColor: colors.border, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: spacing.lg },
  galleryBrand: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  galleryBrandMark: { width: 34, height: 34, borderRadius: 11, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  galleryTitle: { fontFamily: "SourceSansPro-SemiBold", fontSize: 17, color: colors.text },
  gallerySubtitle: { ...typography.label, color: colors.primary, fontSize: 10, marginTop: 1 },
  normalAppButton: { minHeight: 40, flexDirection: "row", alignItems: "center", gap: spacing.sm, borderWidth: 1, borderColor: colors.border, borderRadius: 999, paddingHorizontal: spacing.md, backgroundColor: colors.surface },
  normalAppButtonText: { fontFamily: "SourceSansPro-SemiBold", fontSize: 12, color: colors.text },
  galleryBody: { flex: 1, flexDirection: "row" },
  galleryBodyNarrow: { flexDirection: "column" },
  sidebar: { width: 250, backgroundColor: colors.surface, borderRightWidth: 1, borderRightColor: colors.border, paddingHorizontal: spacing.lg, paddingTop: spacing.xl },
  sidebarNarrow: { width: "100%", maxHeight: 250, borderRightWidth: 0, borderBottomWidth: 1, borderBottomColor: colors.border, paddingTop: spacing.md },
  sidebarHeadingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sidebarHeading: { fontFamily: "SourceSansPro-SemiBold", fontSize: 16, color: colors.text },
  sidebarCount: { ...typography.small },
  sidebarScroll: { paddingBottom: spacing.xl },
  screenGroup: { marginBottom: spacing.lg },
  groupLabel: { ...typography.label, color: colors.textSubtle, marginBottom: spacing.xs },
  screenButton: { minHeight: 36, justifyContent: "center", borderRadius: 9, paddingHorizontal: spacing.md, marginBottom: 2 },
  screenButtonActive: { backgroundColor: colors.primarySoft },
  screenButtonText: { ...typography.small, color: colors.textMuted },
  screenButtonTextActive: { color: colors.primary, fontFamily: "SourceSansPro-SemiBold" },
  previewStage: { flex: 1, paddingHorizontal: spacing.xl, paddingTop: spacing.lg, minWidth: 0 },
  stageHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: spacing.lg, marginBottom: spacing.md },
  stageTitle: { fontFamily: "SourceSansPro-SemiBold", fontSize: 22, color: colors.text },
  stageSubtitle: { ...typography.small, marginTop: 3, maxWidth: 500 },
  widthPicker: { flexDirection: "row", alignItems: "center", gap: spacing.xs },
  widthLabel: { ...typography.small, marginRight: spacing.xs },
  widthButton: { minWidth: 38, height: 30, borderRadius: 8, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", backgroundColor: colors.surface },
  widthButtonActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  widthButtonText: { ...typography.small, color: colors.textMuted },
  widthButtonTextActive: { color: colors.primary, fontFamily: "SourceSansPro-SemiBold" },
  designRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm, marginBottom: spacing.sm },
  designLabel: { ...typography.label, color: colors.textMuted },
  designPicker: { flexDirection: "row", gap: spacing.xs, padding: 3, borderRadius: 10, backgroundColor: colors.surfaceMuted },
  designButton: { minHeight: 30, minWidth: 68, paddingHorizontal: spacing.md, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  designButtonActive: { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border },
  designButtonText: { ...typography.small, color: colors.textMuted },
  designButtonTextActive: { color: colors.primary, fontFamily: "SourceSansPro-SemiBold" },
  designHint: { ...typography.small, flexShrink: 1 },
  scenarioRow: { flexDirection: "row", alignItems: "center", marginBottom: spacing.md, gap: spacing.sm },
  scenarioLabel: { ...typography.label, color: colors.textMuted },
  scenarioScroll: { gap: spacing.sm },
  scenarioButton: { borderWidth: 1, borderColor: colors.border, borderRadius: 999, backgroundColor: colors.surface, paddingHorizontal: spacing.md, paddingVertical: spacing.xs },
  scenarioButtonActive: { backgroundColor: colors.primarySoft, borderColor: colors.primary },
  scenarioButtonText: { ...typography.small, color: colors.textMuted },
  scenarioButtonTextActive: { color: colors.primary, fontFamily: "SourceSansPro-SemiBold" },
  phoneStage: { flex: 1, alignItems: "center", justifyContent: "flex-start", paddingBottom: spacing.xl, overflow: "hidden" },
  phoneFrame: { height: 760, maxWidth: "100%", borderRadius: 22, borderWidth: 8, borderColor: "#D9DAD5", backgroundColor: colors.background, overflow: "hidden", shadowColor: "#222", shadowOpacity: 0.16, shadowRadius: 20, shadowOffset: { width: 0, height: 8 }, elevation: 8 },
  componentContent: { paddingTop: spacing.xl },
  previewScreenTitle: { ...typography.heading, color: colors.text, marginBottom: spacing.xs },
  previewScreenSubtitle: { ...typography.body, marginBottom: spacing.xl },
  componentLabel: { ...typography.label, color: colors.textMuted, marginTop: spacing.xl, marginBottom: spacing.sm },
  componentButton: { marginTop: spacing.sm },
  componentGap: { height: spacing.md },
  categoryPreviewGrid: { flexDirection: "row", flexWrap: "wrap", gap: spacing.sm },
  categoryPreviewChip: { width: "31%", minHeight: 70, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: colors.border, borderRadius: radius.input, backgroundColor: colors.surface, padding: spacing.xs },
  categoryPreviewText: { ...typography.small, color: colors.textMuted, textAlign: "center", marginTop: spacing.xs },
  previewSafeCard: { backgroundColor: colors.primarySoft, borderColor: colors.primarySoft },
  previewSafeLabel: { ...typography.label, color: colors.primary },
  previewSafeAmount: { fontSize: 34, marginTop: spacing.xs },
  previewSafeCopy: { ...typography.small, marginTop: spacing.xs },
  componentProgress: { marginTop: spacing.lg },
});
