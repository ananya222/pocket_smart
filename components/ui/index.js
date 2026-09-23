import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { colors, control, formatMoney, radius, shadows, spacing, typography } from "../../theme/theme";

export { formatMoney };

export const Screen = ({ children, style, scroll = false, contentContainerStyle, edges = ["top", "bottom", "left", "right"] }) => {
  const Container = scroll ? ScrollView : View;
  return (
    <SafeAreaView edges={edges} style={[styles.screen, style]}>
      <Container
        style={scroll ? styles.scroll : undefined}
        contentContainerStyle={scroll ? [styles.scrollContent, contentContainerStyle] : undefined}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </Container>
    </SafeAreaView>
  );
};

export const AppText = ({ children, style, muted = false, ...props }) => (
  <Text style={[styles.body, muted && styles.muted, style]} {...props}>{children}</Text>
);

export const Card = ({ children, style, elevated = false }) => (
  <View style={[styles.card, elevated && styles.elevatedCard, style]}>{children}</View>
);

export const PrimaryButton = ({ children, onPress, loading = false, disabled = false, style }) => (
  <Pressable
    onPress={onPress}
    disabled={disabled || loading}
    accessibilityRole="button"
    style={({ pressed }) => [styles.primaryButton, (pressed || disabled) && styles.primaryButtonPressed, style]}
  >
    {loading ? <ActivityIndicator color={colors.white} /> : <AppText style={styles.primaryButtonText}>{children}</AppText>}
  </Pressable>
);

export const SecondaryButton = ({ children, onPress, style, loading = false, disabled = false, destructive = false }) => (
  <Pressable onPress={onPress} disabled={disabled || loading} accessibilityRole="button" style={({ pressed }) => [styles.secondaryButton, destructive && styles.destructiveButton, (pressed || disabled) && styles.pressed, style]}>
    {loading ? <ActivityIndicator color={destructive ? colors.danger : colors.accent} /> : typeof children === "string" ? <AppText style={[styles.secondaryButtonText, destructive && styles.destructiveButtonText]}>{children}</AppText> : children}
  </Pressable>
);

export const DestructiveButton = (props) => <SecondaryButton {...props} destructive />;

export const Field = ({ label, value, onChangeText, placeholder, keyboardType = "default", secureTextEntry = false, showPasswordToggle = false, style, autoFocus = false, error }) => {
  const [focused, setFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  return (
    <View style={style}>
      {label ? <AppText style={styles.fieldLabel}>{label}</AppText> : null}
      <View style={styles.fieldWrap}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textSubtle}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry && !passwordVisible}
          autoFocus={autoFocus}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[styles.field, showPasswordToggle && styles.fieldWithToggle, focused && styles.fieldFocused, error && styles.fieldError]}
          selectionColor={colors.primary}
          accessibilityLabel={label}
        />
        {showPasswordToggle ? <Pressable
          onPress={() => setPasswordVisible((visible) => !visible)}
          style={styles.fieldToggle}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel={passwordVisible ? `Hide ${label || "password"}` : `Show ${label || "password"}`}
        >
          <Feather name={passwordVisible ? "eye-off" : "eye"} size={18} color={colors.textMuted} />
        </Pressable> : null}
      </View>
      {error ? <AppText style={styles.fieldErrorText}>{error}</AppText> : null}
    </View>
  );
};

export const SegmentedControl = ({ options, value, onChange }) => (
  <View style={styles.segmentedControl}>
    {options.map((option) => {
      const active = option === value;
      return (
        <Pressable key={option} onPress={() => onChange(option)} accessibilityRole="radio" accessibilityState={{ selected: active }} style={[styles.segment, active && styles.segmentActive]}>
          <AppText style={[styles.segmentText, active && styles.segmentTextActive]}>{option}</AppText>
        </Pressable>
      );
    })}
  </View>
);

export const ProgressBar = ({ progress = 0, style, color = colors.primary, trackColor = colors.border }) => (
  <View style={[styles.progressTrack, { backgroundColor: trackColor }, style]}>
    <View style={[styles.progressFill, { width: `${Math.max(0, Math.min(100, progress))}%`, backgroundColor: color }]} />
  </View>
);

export const SectionHeader = ({ title, action, onAction }) => (
  <View style={styles.sectionHeader}>
    <AppText style={styles.sectionTitle}>{title}</AppText>
    {action ? onAction ? <Pressable onPress={onAction} hitSlop={8}><AppText style={styles.sectionAction}>{action}</AppText></Pressable> : <AppText style={styles.sectionMeta}>{action}</AppText> : null}
  </View>
);

export const MoneyDisplay = ({ value, style, prefix = "₹" }) => (
  <AppText style={[styles.money, style]}>{prefix}{formatMoney(value)}</AppText>
);

export const EmptyState = ({ title, description, action, onAction }) => (
  <View style={styles.emptyState}>
    <AppText style={styles.emptyTitle}>{title}</AppText>
    {description ? <AppText muted style={styles.emptyDescription}>{description}</AppText> : null}
    {action ? <SecondaryButton onPress={onAction} style={styles.emptyButton}>{action}</SecondaryButton> : null}
  </View>
);

export const CATEGORY_META = {
  "Food & Drinks": { icon: "coffee", color: colors.coral, soft: colors.coralSoft },
  Food: { icon: "coffee", color: colors.coral, soft: colors.coralSoft },
  Transport: { icon: "map-pin", color: colors.blue, soft: colors.blueSoft },
  Shopping: { icon: "shopping-bag", color: colors.primary, soft: colors.primarySoft },
  Entertainment: { icon: "film", color: colors.coral, soft: colors.coralSoft },
  Education: { icon: "book-open", color: colors.success, soft: colors.successSoft },
  "Bills & Utilities": { icon: "file-text", color: colors.amber, soft: colors.amberSoft },
  Bills: { icon: "file-text", color: colors.amber, soft: colors.amberSoft },
  Misc: { icon: "grid", color: colors.textSubtle, soft: colors.surfaceMuted },
  Other: { icon: "grid", color: colors.textSubtle, soft: colors.surfaceMuted },
};

export const getCategoryMeta = (category = "Other") => CATEGORY_META[category] || CATEGORY_META.Other;

const MONZO_CATEGORY_META = {
  "Food & Drinks": { icon: "coffee", color: colors.semantic.food, soft: colors.semantic.foodSoft },
  Food: { icon: "coffee", color: colors.semantic.food, soft: colors.semantic.foodSoft },
  Transport: { icon: "map-pin", color: colors.semantic.transport, soft: colors.semantic.transportSoft },
  Shopping: { icon: "shopping-bag", color: colors.semantic.primary, soft: colors.semantic.primarySoft },
  Entertainment: { icon: "film", color: colors.semantic.food, soft: colors.semantic.foodSoft },
  Education: { icon: "book-open", color: colors.semantic.education, soft: colors.semantic.educationSoft },
  "Bills & Utilities": { icon: "file-text", color: colors.semantic.warning, soft: colors.semantic.warningSoft },
  Bills: { icon: "file-text", color: colors.semantic.warning, soft: colors.semantic.warningSoft },
  Misc: { icon: "grid", color: colors.textSubtle, soft: colors.surfaceMuted },
  Other: { icon: "grid", color: colors.textSubtle, soft: colors.surfaceMuted },
};

export const getMonzoCategoryMeta = (category = "Other") => MONZO_CATEGORY_META[category] || MONZO_CATEGORY_META.Other;

export const CategoryIcon = ({ category, size = 19, style, strong = false, semantic = false }) => {
  const meta = semantic ? getMonzoCategoryMeta(category) : getCategoryMeta(category);
  return <View style={[styles.categoryIcon, { backgroundColor: strong ? meta.color : meta.soft }, style]}><Feather name={meta.icon} size={size} color={strong ? colors.white : meta.color} /></View>;
};

export const getGoalIconName = (name = "") => {
  const q = name.toLowerCase();
  if (q.includes("headphone") || q.includes("music") || q.includes("earphone")) return "headphones";
  if (q.includes("laptop") || q.includes("computer")) return "monitor";
  if (q.includes("phone")) return "smartphone";
  if (q.includes("book") || q.includes("study") || q.includes("course") || q.includes("education")) return "book-open";
  if (q.includes("travel") || q.includes("trip") || q.includes("flight")) return "navigation";
  if (q.includes("game") || q.includes("console")) return "play-circle";
  if (q.includes("bike") || q.includes("cycle")) return "activity";
  return "target";
};

export const getGoalMeta = (name = "") => {
  const q = name.toLowerCase();
  if (q.includes("travel") || q.includes("trip") || q.includes("flight")) return { color: colors.semantic.transport, soft: colors.semantic.transportSoft, track: colors.semantic.transportTrack };
  if (q.includes("emergency")) return { color: colors.semantic.success, soft: colors.semantic.successSoft, track: colors.semantic.successTrack };
  if (q.includes("laptop") || q.includes("computer") || q.includes("education") || q.includes("study")) return { color: colors.semantic.education, soft: colors.semantic.educationSoft, track: colors.semantic.educationTrack };
  if (q.includes("shopping") || q.includes("phone") || q.includes("headphone")) return { color: colors.semantic.primary, soft: colors.semantic.primarySoft, track: colors.semantic.primaryTrack };
  return { color: colors.semantic.primary, soft: colors.semantic.primarySoft, track: colors.semantic.primaryTrack };
};

export const getSolidGoalMeta = (name = "") => {
  const q = name.toLowerCase();
  if (q.includes("travel") || q.includes("trip") || q.includes("flight")) return { color: colors.semantic.goalBlue, track: colors.semantic.goalBlueTrack, border: colors.semantic.goalBlueBorder };
  if (q.includes("emergency")) return { color: colors.semantic.goalGreen, track: colors.semantic.goalGreenTrack, border: colors.semantic.goalGreenBorder };
  if (q.includes("laptop") || q.includes("computer") || q.includes("education") || q.includes("study")) return { color: colors.semantic.goalTeal, track: colors.semantic.goalTealTrack, border: colors.semantic.goalTealBorder };
  return { color: colors.semantic.goalCoral, track: colors.semantic.goalCoralTrack, border: colors.semantic.goalCoralBorder };
};

export const GoalIcon = ({ name, size = 21, color = colors.primary }) => <Feather name={getGoalIconName(name)} size={size} color={color} />;

export const IconTile = ({ children, style }) => <View style={[styles.iconTile, style]}>{children}</View>;

export const QuickAction = ({ icon, label, onPress, tone = "primary", strong = false }) => {
  const toneMeta = {
    primary: { backgroundColor: colors.semantic.primary, iconColor: colors.white },
    success: { backgroundColor: colors.semantic.success, iconColor: colors.white },
    coral: { backgroundColor: colors.semantic.food, iconColor: colors.white },
    blue: { backgroundColor: colors.semantic.transport, iconColor: colors.white },
  }[tone] || { backgroundColor: colors.semantic.primary, iconColor: colors.white };
  return (
  <SecondaryButton onPress={onPress} style={styles.quickAction}>
    <View style={[styles.quickActionIcon, !strong && tone === "success" && styles.quickActionIconSuccess, strong && { backgroundColor: toneMeta.backgroundColor }]}><Feather name={icon} size={18} color={strong ? toneMeta.iconColor : toneMeta.backgroundColor} /></View>
    <AppText style={styles.secondaryButtonText}>{label}</AppText>
  </SecondaryButton>
  );
};

export const GoalCard = ({ goal, onDelete, compact = false, featured = false, grouped = false, tinted = false, completed = false, solid = false, minimal = false, style }) => {
  const target = Number(goal.target) || 0;
  const progress = Number(goal.progressAmount) || 0;
  const percent = target > 0 ? Math.min(100, Math.round((progress / target) * 100)) : 0;
  const goalMeta = solid ? getSolidGoalMeta(goal.name) : getGoalMeta(goal.name);
  const completedMeta = solid ? { color: colors.semantic.goalGreen, track: colors.semantic.goalGreenTrack, border: colors.semantic.goalGreenBorder } : { color: colors.semantic.success, soft: colors.semantic.successSoft, track: colors.semantic.successTrack };
  const meta = completed ? completedMeta : goalMeta;
  const shouldTint = !minimal && (tinted || grouped);
  const titleStyle = solid ? styles.solidGoalName : undefined;
  const metaStyle = solid ? styles.solidGoalMeta : undefined;
  const progressColor = solid ? colors.white : minimal ? colors.accent : meta.color;
  const progressTrack = solid ? meta.track : minimal ? colors.divider : meta.soft;
  return (
    <Card style={[styles.goalCardSurface, minimal && styles.minimalGoalCard, featured && styles.featuredGoalCard, grouped && styles.groupedGoalCard, compact && styles.compactGoalCard, solid && styles.solidGoalCard, shouldTint && { backgroundColor: meta.soft }, solid && { backgroundColor: meta.color, borderColor: meta.border }, style]}>
      <View style={[styles.row, solid && styles.solidGoalHeader]}>
        <View style={styles.flex}>
          <AppText style={[styles.goalName, featured && styles.featuredGoalName, titleStyle]} numberOfLines={1}>{goal.name || "Savings goal"}</AppText>
          {solid ? <><AppText style={styles.solidGoalSavedAmount}>₹{formatMoney(progress)}</AppText><AppText style={metaStyle}>of ₹{formatMoney(target)}</AppText></> : <AppText muted style={[styles.goalMeta, featured && styles.featuredGoalMeta]}>₹{formatMoney(progress)} saved of ₹{formatMoney(target)}</AppText>}
        </View>
        {onDelete ? <Pressable style={solid && styles.solidGoalMenu} onPress={() => onDelete(goal.id, goal.name)} hitSlop={10} accessibilityLabel={`Manage ${goal.name || "goal"}`}><Feather name="more-horizontal" size={18} color={solid ? colors.text : colors.textMuted} /></Pressable> : null}
      </View>
      <ProgressBar progress={percent} style={[styles.goalProgress, featured && styles.featuredGoalProgress, solid && styles.solidGoalProgress]} color={minimal ? colors.primary : progressColor} trackColor={minimal ? colors.divider : progressTrack} />
      <View style={styles.rowBetween}>
        <AppText muted style={[styles.smallText, featured && styles.featuredGoalFooterText, (featured || completed) && { color: meta.color }, solid && styles.solidGoalFooterText]}>{percent}% saved</AppText>
        <AppText muted style={[styles.smallText, featured && styles.featuredGoalFooterText, solid && styles.solidGoalFooterText]}>₹{formatMoney(Math.max(0, target - progress))} left</AppText>
      </View>
    </Card>
  );
};

export const TransactionRow = React.memo(function TransactionRow({ transaction, last = false, strong = false, semantic = false, minimal = false }) {
  const amount = Number(transaction.amount) || 0;
  const category = String(transaction.category || "").toLowerCase();
  const icon = category.includes("food") ? "coffee" : category.includes("transport") ? "map-pin" : category.includes("entertainment") ? "film" : category.includes("income") ? "arrow-down-left" : "shopping-bag";
  return (
    <View style={[styles.transactionRow, strong && styles.transactionRowStrong, last && styles.transactionRowLast]}>
      <View style={styles.transactionIcon}><Feather name={icon} size={17} color={colors.textMuted} /></View>
      <View style={styles.flex}>
        <AppText style={[styles.transactionTitle, strong && styles.transactionTitleStrong]} numberOfLines={1}>{transaction.title || "Expense"}</AppText>
        <AppText muted style={styles.smallText}>{transaction.category || "Other"} · {transaction.date || "Recently"}</AppText>
      </View>
      <AppText style={[styles.transactionAmount, strong && styles.transactionAmountStrong, amount < 0 ? styles.expense : styles.income]}>{amount < 0 ? "-" : "+"}₹{formatMoney(Math.abs(amount))}</AppText>
    </View>
  );
});

export const BackButton = ({ onPress, style }) => (
  <Pressable onPress={onPress} style={[styles.backButton, style]} hitSlop={8} accessibilityRole="button" accessibilityLabel="Go back"><Feather name="arrow-left" size={20} color={colors.text} /></Pressable>
);

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: spacing.xl, paddingBottom: spacing.massive },
  body: { ...typography.body, color: colors.text },
  muted: { color: colors.textMuted },
  card: { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1, borderRadius: radius.card, padding: spacing.lg },
  goalCardSurface: { backgroundColor: colors.surface, borderColor: colors.referenceBorder },
  minimalGoalCard: { backgroundColor: "transparent", borderWidth: 0, borderRadius: 0, paddingHorizontal: 0, paddingVertical: spacing.md },
  featuredGoalCard: { padding: spacing.lg, borderRadius: radius.input },
  groupedGoalCard: { backgroundColor: "transparent", borderWidth: 0, borderRadius: 0, paddingHorizontal: 0, paddingVertical: spacing.lg, marginBottom: 0, borderBottomWidth: 1, borderBottomColor: colors.referenceDivider },
  elevatedCard: { backgroundColor: colors.elevated },
  primaryButton: { minHeight: control.buttonHeight, borderRadius: radius.button, backgroundColor: colors.primary, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.xl },
  primaryButtonPressed: { opacity: 0.9, transform: [{ scale: 0.985 }] },
  primaryButtonText: { ...typography.button, color: colors.white },
  secondaryButton: { minHeight: 48, borderRadius: radius.button, borderWidth: 1, borderColor: colors.border, alignItems: "center", justifyContent: "center", paddingHorizontal: spacing.lg, backgroundColor: colors.surfaceMuted },
  secondaryButtonText: { ...typography.button, color: colors.accent },
  destructiveButton: { borderColor: "rgba(223,98,98,0.3)", backgroundColor: colors.dangerSoft },
  destructiveButtonText: { color: colors.danger },
  pressed: { opacity: 0.9, transform: [{ scale: 0.985 }] },
  fieldLabel: { ...typography.label, color: colors.textMuted, marginBottom: spacing.sm },
  fieldWrap: { position: "relative" },
  field: { height: control.inputHeight, borderRadius: radius.input, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.inputSurface, color: colors.text, paddingHorizontal: spacing.lg, ...typography.input },
  fieldWithToggle: { paddingRight: 52 },
  fieldToggle: { position: "absolute", right: 0, top: 0, width: 48, height: control.inputHeight, alignItems: "center", justifyContent: "center" },
  fieldFocused: { borderColor: colors.primary },
  fieldError: { borderColor: "#A1433D" },
  fieldErrorText: { fontFamily: "Inter-Regular", fontSize: 12, lineHeight: 18, color: "#A1433D", marginTop: spacing.xs },
  segmentedControl: { flexDirection: "row", gap: spacing.xs, padding: 3, borderRadius: radius.input, backgroundColor: colors.surfaceMuted },
  segment: { flex: 1, minHeight: 44, borderRadius: radius.chip, borderWidth: 1, borderColor: "transparent", alignItems: "center", justifyContent: "center", backgroundColor: "transparent" },
  segmentActive: { backgroundColor: colors.surface, borderColor: colors.border, ...shadows.subtle },
  segmentText: { fontFamily: "Inter-SemiBold", fontSize: 14, color: colors.textMuted },
  segmentTextActive: { color: colors.primary },
  progressTrack: { height: control.progressHeight, borderRadius: control.progressHeight / 2, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: control.progressHeight / 2 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: spacing.md },
  sectionTitle: { ...typography.section, color: colors.text },
  sectionAction: { ...typography.small, fontSize: 12, color: colors.accent, fontFamily: "Inter-SemiBold" },
  sectionMeta: { ...typography.small, fontSize: 12, color: colors.textMuted },
  money: { ...typography.money, color: colors.text },
  emptyState: { alignItems: "center", paddingVertical: spacing.xxl, paddingHorizontal: spacing.lg },
  emptyIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center", marginBottom: spacing.md },
  emptyTitle: { fontFamily: "Inter-SemiBold", fontSize: 17, color: colors.text, marginBottom: spacing.xs },
  emptyDescription: { ...typography.small, textAlign: "center", maxWidth: 260 },
  emptyButton: { marginTop: spacing.lg, minHeight: 42 },
  row: { flexDirection: "row", alignItems: "center", gap: spacing.md },
  rowBetween: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  flex: { flex: 1, minWidth: 0 },
  iconTile: { width: control.iconSize, height: control.iconSize, borderRadius: radius.icon, backgroundColor: colors.primarySoft, alignItems: "center", justifyContent: "center" },
  categoryIcon: { width: control.iconSize, height: control.iconSize, borderRadius: radius.icon, alignItems: "center", justifyContent: "center" },
  goalName: { fontFamily: "Inter-SemiBold", fontSize: 17, color: colors.text },
  goalMeta: { ...typography.small, fontSize: 13, lineHeight: 18, color: colors.text, marginTop: 2 },
  featuredGoalName: { fontSize: 18 },
  featuredGoalMeta: { fontSize: 14, lineHeight: 19 },
  goalProgress: { height: 7, borderRadius: 4, marginTop: spacing.md, marginBottom: spacing.sm },
  featuredGoalProgress: { height: 8, borderRadius: 4, marginTop: spacing.lg },
  featuredGoalFooterText: { fontFamily: "Inter-SemiBold", fontSize: 13 },
  compactGoalCard: { marginBottom: spacing.md },
  solidGoalCard: { borderWidth: 1, borderRadius: radius.input, paddingVertical: 14, paddingHorizontal: spacing.md, marginBottom: 0 },
  solidGoalHeader: { alignItems: "flex-start", gap: spacing.sm },
  solidGoalMenu: { width: 40, height: 40, alignItems: "center", justifyContent: "center", marginTop: -10, marginRight: -8 },
  solidGoalName: { color: colors.text, fontSize: 16, lineHeight: 19 },
  solidGoalSavedAmount: { fontFamily: "Inter-Bold", fontSize: 22, lineHeight: 25, letterSpacing: -0.2, color: colors.text, marginTop: 5 },
  solidGoalMeta: { fontFamily: "Inter-SemiBold", fontSize: 12, lineHeight: 15, color: colors.text, marginTop: 2 },
  solidGoalProgress: { height: 3, borderRadius: 2, marginTop: 11, marginBottom: 7 },
  solidGoalFooterText: { color: colors.text, fontFamily: "Inter-SemiBold", fontSize: 12, lineHeight: 15 },
  smallText: { ...typography.small, fontSize: 13, lineHeight: 18 },
  transactionRow: { flexDirection: "row", alignItems: "center", paddingVertical: 15, borderBottomWidth: 1, borderBottomColor: colors.divider, gap: spacing.md },
  transactionRowStrong: { paddingVertical: spacing.sm + 2, borderBottomColor: colors.referenceDivider },
  transactionRowLast: { borderBottomWidth: 0 },
  transactionTitle: { fontFamily: "Inter-SemiBold", fontSize: 14, color: colors.text },
  transactionTitleStrong: { fontSize: 16 },
  transactionAmount: { fontFamily: "Inter-SemiBold", fontSize: 13, minWidth: 70, textAlign: "right" },
  transactionAmountStrong: { fontSize: 15 },
  transactionIcon: { width: 37, height: 37, borderRadius: radius.circle, backgroundColor: colors.surfaceMuted, alignItems: "center", justifyContent: "center" },
  expense: { color: colors.text },
  income: { color: colors.success },
  quickAction: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  quickActionIcon: { height: 23, alignItems: "center", justifyContent: "center" },
  quickActionIconSuccess: {},
  backButton: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.surface, alignItems: "center", justifyContent: "center", marginBottom: spacing.xxl },
});
