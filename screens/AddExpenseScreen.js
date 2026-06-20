// AddExpenseScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Platform,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  useWindowDimensions,
  Keyboard,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { getStyles } from "../styles/AddExpenseScreen.styles";
import BackgroundGrid from "../components/BackgroundGrid";

const CATEGORIES = [
  { name: "Food & Drinks", icon: "coffee" },
  { name: "Shopping", icon: "shopping-bag" },
  { name: "Transport", icon: "map-pin" },
  { name: "Bills & Utilities", icon: "file-text" },
  { name: "Entertainment", icon: "film" },
  { name: "Misc", icon: "grid" }
];

export default function AddExpenseScreen({ navigation, route }) {
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 700;
  const styles = getStyles(isSmallDevice);

  const user = route.params?.user || {};
  const onboarding = user.onboarding || {};
  const accentColor = "#9D4EDD";

  // Form States
  const [amount, setAmount] = useState("");
  const [merchant, setMerchant] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Balance calculations for dynamic live preview
  const currentBalanceStr = typeof onboarding.currentBalance === "string" 
    ? onboarding.currentBalance 
    : String(onboarding.currentBalance !== undefined && onboarding.currentBalance !== null ? onboarding.currentBalance : "5000");
  const currentBalance = parseFloat(currentBalanceStr.replace(/,/g, "")) || 0;

  const allowanceStr = typeof onboarding.allowance === "string" 
    ? onboarding.allowance 
    : String(onboarding.allowance !== undefined && onboarding.allowance !== null ? onboarding.allowance : "5000");
  const parsedAllowance = parseFloat(allowanceStr.replace(/,/g, ""));
  const cleanAllowance = !isNaN(parsedAllowance) ? parsedAllowance : 5000;
  const dynamicAllowanceLimit = Math.max(cleanAllowance, currentBalance);

  const expenseAmount = parseFloat(amount.replace(/,/g, "")) || 0;
  const newBalance = Math.max(0, currentBalance - expenseAmount);

  const handleAddExpense = () => {
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount greater than 0.");
      return;
    }

    if (!merchant.trim()) {
      Alert.alert("Missing Name", "Please enter a merchant or expense name.");
      return;
    }

    if (!selectedCategory) {
      Alert.alert("Select Category", "Please select a spending category.");
      return;
    }

    if (expenseAmount > currentBalance) {
      Alert.alert(
        "Insufficient Balance",
        `This expense (₹${expenseAmount.toLocaleString("en-IN")}) exceeds your available balance (₹${currentBalance.toLocaleString("en-IN")}). Proceed anyway?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Proceed", onPress: () => executeExpenseUpdate(expenseAmount, currentBalance) }
        ]
      );
    } else {
      executeExpenseUpdate(expenseAmount, currentBalance);
    }
  };
  const executeExpenseUpdate = (expenseAmount, currentBalance) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate("ExpenseReflection", {
        user,
        expenseAmount,
        merchant: merchant.trim(),
        category: selectedCategory,
        currentBalance,
        newBalance,
        cleanAllowance,
      });
    }, 450);
  };
  const STATUS_BAR_HEIGHT = Platform.OS === "ios" ? 47 : (StatusBar.currentHeight || 24);

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <BackgroundGrid />

      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={[styles.scrollContainer, { paddingTop: STATUS_BAR_HEIGHT + 10 }]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Add Expense</Text>
            <View style={styles.placeholderButton} />
          </View>

          {/* Hero Centered Amount Input */}
          <View style={styles.amountHeroContainer}>
            <Text style={styles.currencyHero}>₹</Text>
            <TextInput
              style={styles.amountHeroInput}
              placeholder="0"
              placeholderTextColor="rgba(255, 255, 255, 0.15)"
              keyboardType="numeric"
              value={amount}
              onChangeText={(text) => {
                const clean = text.replace(/[^0-9]/g, "");
                if (!clean) {
                  setAmount("");
                  return;
                }
                const num = parseInt(clean, 10);
                setAmount(num.toLocaleString("en-IN"));
              }}
              autoFocus={true}
            />
          </View>

          {/* Form Rows */}
          <View style={styles.formContainer}>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.inputRowField}
                placeholder="Merchant name"
                placeholderTextColor="rgba(255, 255, 255, 0.2)"
                value={merchant}
                onChangeText={setMerchant}
                maxLength={30}
              />
            </View>
          </View>

          {/* Category Chip Selector */}
          <Text style={styles.sectionLabel}>Category</Text>
          <View style={styles.categoryContainer}>
            {CATEGORIES.map((cat, idx) => {
              const isActive = selectedCategory === cat.name;
              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setSelectedCategory(cat.name);
                    Keyboard.dismiss();
                  }}
                  style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                  activeOpacity={0.8}
                >
                  <Feather
                    name={cat.icon}
                    size={13}
                    color={isActive ? "#FFFFFF" : "#8A90A8"}
                    style={{ marginRight: 6 }}
                  />
                  <Text style={[styles.categoryChipLabel, isActive && styles.categoryChipLabelActive]}>
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Balance Preview Card */}
          <View style={styles.previewSection}>
            <Text style={styles.sectionLabel}>Balance Impact</Text>
            <BlurView intensity={100} tint="dark" style={styles.previewCard}>
              <View style={styles.previewRow}>
                <View style={styles.previewCol}>
                  <Text style={styles.previewColLabel}>Available</Text>
                  <Text style={styles.previewColAmount}>₹{currentBalance.toLocaleString("en-IN")}</Text>
                </View>
                <Feather name="arrow-right" size={14} color="rgba(255, 255, 255, 0.25)" style={{ marginHorizontal: 8 }} />
                <View style={styles.previewCol}>
                  <Text style={styles.previewColLabel}>Remaining</Text>
                  <Text style={[
                    styles.previewColAmount,
                    expenseAmount > currentBalance && { color: "#FF6B6B" }
                  ]}>
                    ₹{newBalance.toLocaleString("en-IN")}
                  </Text>
                </View>
              </View>
              {/* Progress bar preview */}
              <View style={styles.previewBarContainer}>
                <View style={styles.previewBarBg}>
                  <View 
                    style={[
                      styles.previewBarFill, 
                      { 
                        width: `${Math.min(100, Math.max(0, ((dynamicAllowanceLimit - newBalance) / (dynamicAllowanceLimit || 1)) * 100))}%`,
                        backgroundColor: expenseAmount > currentBalance ? "#FF6B6B" : "#9D4EDD"
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.previewBarLabel}>
                  {expenseAmount > currentBalance 
                    ? `Overdraft by ₹${(expenseAmount - currentBalance).toLocaleString("en-IN")}` 
                    : `${Math.round((newBalance / (dynamicAllowanceLimit || 1)) * 100)}% of allowance left`
                  }
                </Text>
              </View>
            </BlurView>
          </View>


          {/* Submit Button */}
          {isLoading ? (
            <View style={[styles.addButton, { backgroundColor: "rgba(157, 78, 221, 0.4)" }]}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          ) : (
            <TouchableOpacity 
              onPress={handleAddExpense} 
              activeOpacity={0.8}
              style={styles.addButton}
            >
              <Text style={styles.addButtonText}>Add Expense</Text>
            </TouchableOpacity>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
