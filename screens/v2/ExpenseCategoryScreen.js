import React, { useState } from "react";
import { Pressable, StatusBar, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppText, Screen } from "../../components/ui";
import { colors } from "../../theme/theme";
import { GoalFlowHeader } from "./GoalFlowScreens";
import { styles } from "./v2Styles";
import { CATEGORIES } from "./AddExpenseScreen";

const ICONS = { "Food & Drinks": "coffee", Transport: "map-pin", Shopping: "shopping-bag", Entertainment: "film", "Bills & Utilities": "file-text", Misc: "layers" };

export default function ExpenseCategoryScreenV2({ navigation, route }) {
  const params = route?.params || {};
  const user = params.user || {};
  const [selectedCategory, setSelectedCategory] = useState(params.selectedCategory || "Food & Drinks");
  const choose = (category) => {
    setSelectedCategory(category);
    navigation.navigate("AddExpense", { user, previewData: params.previewData, amount: params.amount, merchant: params.merchant, selectedCategory: category });
  };
  return (
    <Screen scroll contentContainerStyle={styles.categoryFlowContent}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      <GoalFlowHeader navigation={navigation} user={user} title="Choose a category" eyebrow="NEW TRANSACTION" />
      <View style={styles.categoryList}>
        {CATEGORIES.map((category) => {
          const active = category.value === selectedCategory;
          return <Pressable key={category.value} onPress={() => choose(category.value)} style={[styles.categoryListRow, active && styles.categoryListRowActive]} accessibilityRole="radio" accessibilityState={{ selected: active }}>
            <View style={styles.categoryListCopy}><Feather name={ICONS[category.value] || "layers"} size={19} color={colors.accent} /><AppText style={active && styles.categoryListActiveText}>{category.label}</AppText></View>
            {active ? <Feather name="check" size={18} color={colors.accent} /> : null}
          </Pressable>;
        })}
      </View>
    </Screen>
  );
}
