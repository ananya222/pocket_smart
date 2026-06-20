// InsightsScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  SafeAreaView,
  useWindowDimensions,
} from "react-native";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import Svg, { Circle, G } from "react-native-svg";
import { getStyles } from "../styles/InsightsScreen.styles";
import BackgroundGrid from "../components/BackgroundGrid";

// Custom premium SVG Donut Chart component - Minimalist thin ring design
function DonutChart({ data, totalSpent, isSmallDevice }) {
  const radius = 55;
  const strokeWidth = 8; // Elegant thin ring
  const circumference = 2 * Math.PI * radius; // ~345.575

  let accumulatedPercent = 0;

  return (
    <View style={{ alignItems: "center", justifyContent: "center", position: "relative", height: 160, width: 160 }}>
      <Svg width={160} height={160} viewBox="0 0 160 160">
        <G rotation="-90" origin="80, 80">
          {/* Base circle background */}
          <Circle
            cx={80}
            cy={80}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.04)"
            strokeWidth={strokeWidth}
          />
          {data.map((item, idx) => {
            const percent = (item.value / totalSpent) * 100;
            if (percent <= 0) return null;

            const strokeDashoffset = circumference - (circumference * percent) / 100;
            const strokeDasharray = `${circumference} ${circumference}`;
            const rotationAngle = (accumulatedPercent * 360) / 100;
            accumulatedPercent += percent;

            return (
              <Circle
                key={idx}
                cx={80}
                cy={80}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform={`rotate(${rotationAngle} 80 80)`}
                strokeLinecap="round"
              />
            );
          })}
        </G>
      </Svg>

      {/* Central Value */}
      <View style={{ position: "absolute", alignItems: "center" }}>
        <Text style={{ fontSize: 9, color: "#8A90A8", fontFamily: "Geist-Regular", letterSpacing: 0.5 }}>
          TOTAL SPENT
        </Text>
        <Text style={{ fontSize: isSmallDevice ? 18 : 20, color: "#FFFFFF", fontFamily: "Geist-SemiBold", marginTop: 2 }}>
          ₹{totalSpent.toLocaleString("en-IN")}
        </Text>
      </View>
    </View>
  );
}// Define monthsData outside component to prevent re-creation and reference errors during dynamic index initialization
const monthsData = [
  {
    monthLabel: "December 2026",
    totalSpent: 3500,
    categories: [
      { name: "Food & Drinks", value: 1300, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 900, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 700, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 400, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 200, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "Pizza Hut Party", category: "Food & Drinks", amount: -650, date: "25 Dec", icon: "coffee" },
      { title: "Netflix Premium", category: "Entertainment", amount: -649, date: "15 Dec", icon: "film" },
      { title: "Metro Card Load", category: "Transport", amount: -400, date: "10 Dec", icon: "map-pin" },
      { title: "Warm Winter Jacket", category: "Shopping", amount: -700, date: "05 Dec", icon: "shopping-bag" },
      { title: "Cafe Latte", category: "Food & Drinks", amount: -250, date: "02 Dec", icon: "coffee" },
      { title: "Pharmacy Store", category: "Others", amount: -200, date: "01 Dec", icon: "grid" },
    ],
  },
  {
    monthLabel: "November 2026",
    totalSpent: 2900,
    categories: [
      { name: "Food & Drinks", value: 1000, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 800, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 500, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 400, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 200, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "Burger King", category: "Food & Drinks", amount: -350, date: "22 Nov", icon: "coffee" },
      { title: "Concert Ticket", category: "Entertainment", amount: -600, date: "15 Nov", icon: "film" },
      { title: "Auto Rickshaw Fare", category: "Transport", amount: -100, date: "10 Nov", icon: "map-pin" },
      { title: "New Sneakers", category: "Shopping", amount: -500, date: "05 Nov", icon: "shopping-bag" },
      { title: "College Tea Stall", category: "Food & Drinks", amount: -150, date: "02 Nov", icon: "coffee" },
      { title: "Stationery Notebooks", category: "Others", amount: -200, date: "01 Nov", icon: "grid" },
    ],
  },
  {
    monthLabel: "October 2026",
    totalSpent: 3200,
    categories: [
      { name: "Food & Drinks", value: 1200, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 800, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 600, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 400, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 200, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "Subway Meal", category: "Food & Drinks", amount: -450, date: "26 Oct", icon: "coffee" },
      { title: "Cinema Movie Ticket", category: "Entertainment", amount: -350, date: "20 Oct", icon: "film" },
      { title: "Cab Ride", category: "Transport", amount: -400, date: "15 Oct", icon: "map-pin" },
      { title: "College Backpack", category: "Shopping", amount: -600, date: "10 Oct", icon: "shopping-bag" },
      { title: "Soda & Snacks", category: "Food & Drinks", amount: -200, date: "08 Oct", icon: "coffee" },
      { title: "Stationery Shop", category: "Others", amount: -200, date: "02 Oct", icon: "grid" },
    ],
  },
  {
    monthLabel: "September 2026",
    totalSpent: 2700,
    categories: [
      { name: "Food & Drinks", value: 900, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 700, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 500, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 400, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 200, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "Canteen Lunch", category: "Food & Drinks", amount: -300, date: "24 Sep", icon: "coffee" },
      { title: "Spotify Premium", category: "Entertainment", amount: -179, date: "15 Sep", icon: "film" },
      { title: "Metro Pass Load", category: "Transport", amount: -400, date: "10 Sep", icon: "map-pin" },
      { title: "Casual T-Shirt", category: "Shopping", amount: -500, date: "05 Sep", icon: "shopping-bag" },
      { title: "Bubble Tea", category: "Food & Drinks", amount: -150, date: "02 Sep", icon: "coffee" },
      { title: "Barber Shop Haircut", category: "Others", amount: -200, date: "01 Sep", icon: "grid" },
    ],
  },
  {
    monthLabel: "August 2026",
    totalSpent: 3100,
    categories: [
      { name: "Food & Drinks", value: 1100, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 900, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 500, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 400, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 200, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "McDonald's Meal", category: "Food & Drinks", amount: -450, date: "28 Aug", icon: "coffee" },
      { title: "Bowling Alley", category: "Entertainment", amount: -500, date: "24 Aug", icon: "film" },
      { title: "Metro Ride Pass", category: "Transport", amount: -400, date: "20 Aug", icon: "map-pin" },
      { title: "Jeans Denim", category: "Shopping", amount: -500, date: "15 Aug", icon: "shopping-bag" },
      { title: "Frappe Coffee", category: "Food & Drinks", amount: -200, date: "10 Aug", icon: "coffee" },
      { title: "Birthday Gift", category: "Others", amount: -200, date: "05 Aug", icon: "grid" },
    ],
  },
  {
    monthLabel: "July 2026",
    totalSpent: 2600,
    categories: [
      { name: "Food & Drinks", value: 900, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 600, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 500, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 400, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 200, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "Cafe Bistro", category: "Food & Drinks", amount: -350, date: "25 Jul", icon: "coffee" },
      { title: "Netflix Subscription", category: "Entertainment", amount: -199, date: "15 Jul", icon: "film" },
      { title: "Auto Rides", category: "Transport", amount: -300, date: "10 Jul", icon: "map-pin" },
      { title: "Summer Sneakers", category: "Shopping", amount: -500, date: "05 Jul", icon: "shopping-bag" },
      { title: "Canteen Snacks", category: "Food & Drinks", amount: -150, date: "02 Jul", icon: "coffee" },
      { title: "Phone Case", category: "Others", amount: -200, date: "01 Jul", icon: "grid" },
    ],
  },
  {
    monthLabel: "June 2026",
    totalSpent: 3120,
    categories: [
      { name: "Food & Drinks", value: 1200, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 850, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 500, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 450, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 120, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "Starbucks Coffee", category: "Food & Drinks", amount: -180, date: "14 Jun", icon: "coffee" },
      { title: "Netflix Subscription", category: "Entertainment", amount: -199, date: "10 Jun", icon: "film" },
      { title: "Metro Ride", category: "Transport", amount: -40, date: "08 Jun", icon: "map-pin" },
      { title: "Nike Sneakers Co", category: "Shopping", amount: -500, date: "05 Jun", icon: "shopping-bag" },
      { title: "College Canteen", category: "Food & Drinks", amount: -350, date: "02 Jun", icon: "coffee" },
      { title: "Stationery Shop", category: "Others", amount: -120, date: "01 Jun", icon: "grid" },
    ],
  },
  {
    monthLabel: "May 2026",
    totalSpent: 2450,
    categories: [
      { name: "Food & Drinks", value: 950, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 600, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 400, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 350, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 150, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "McDonalds Lunch", category: "Food & Drinks", amount: -290, date: "28 May", icon: "coffee" },
      { title: "Cinema Movie Ticket", category: "Entertainment", amount: -250, date: "24 May", icon: "film" },
      { title: "Uber Cab Ride", category: "Transport", amount: -180, date: "20 May", icon: "map-pin" },
      { title: "H&M Casual T-Shirt", category: "Shopping", amount: -400, date: "15 May", icon: "shopping-bag" },
      { title: "Boba Bubble Tea", category: "Food & Drinks", amount: -120, date: "10 May", icon: "coffee" },
      { title: "Novel Purchase", category: "Others", amount: -150, date: "05 May", icon: "grid" },
    ],
  },
  {
    monthLabel: "April 2026",
    totalSpent: 4100,
    categories: [
      { name: "Food & Drinks", value: 1500, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 1200, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 700, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 500, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 200, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "Pizza Hut Party", category: "Food & Drinks", amount: -850, date: "26 Apr", icon: "coffee" },
      { title: "Steam Wallet Top-up", category: "Entertainment", amount: -800, date: "20 Apr", icon: "film" },
      { title: "Local Metro Pass", category: "Transport", amount: -500, date: "18 Apr", icon: "map-pin" },
      { title: "Gaming Mouse Redgear", category: "Shopping", amount: -700, date: "12 Apr", icon: "shopping-bag" },
      { title: "Burger King Combo", category: "Food & Drinks", amount: -310, date: "08 Apr", icon: "coffee" },
      { title: "Gift for Friend", category: "Others", amount: -200, date: "02 Apr", icon: "grid" },
    ],
  },
  {
    monthLabel: "March 2026",
    totalSpent: 2900,
    categories: [
      { name: "Food & Drinks", value: 1100, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 700, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 500, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 400, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 200, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "Subway Meal", category: "Food & Drinks", amount: -320, date: "25 Mar", icon: "coffee" },
      { title: "BookMyShow Movie Ticket", category: "Entertainment", amount: -380, date: "18 Mar", icon: "film" },
      { title: "Local Train Pass", category: "Transport", amount: -400, date: "12 Mar", icon: "map-pin" },
      { title: "Jacket Purchase", category: "Shopping", amount: -500, date: "06 Mar", icon: "shopping-bag" },
      { title: "Canteen Snacks", category: "Food & Drinks", amount: -200, date: "03 Mar", icon: "coffee" },
      { title: "Medical Store", category: "Others", amount: -200, date: "01 Mar", icon: "grid" },
    ],
  },
  {
    monthLabel: "February 2026",
    totalSpent: 3400,
    categories: [
      { name: "Food & Drinks", value: 1300, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 900, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 600, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 400, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 200, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "KFC Bucket", category: "Food & Drinks", amount: -650, date: "22 Feb", icon: "coffee" },
      { title: "Prime Video Renew", category: "Entertainment", amount: -299, date: "15 Feb", icon: "film" },
      { title: "Metro Card Recharge", category: "Transport", amount: -400, date: "10 Feb", icon: "map-pin" },
      { title: "Casual Backpack", category: "Shopping", amount: -600, date: "05 Feb", icon: "shopping-bag" },
      { title: "Coffee Shop Date", category: "Food & Drinks", amount: -250, date: "02 Feb", icon: "coffee" },
      { title: "Gym Supplement", category: "Others", amount: -200, date: "01 Feb", icon: "grid" },
    ],
  },
  {
    monthLabel: "January 2026",
    totalSpent: 2800,
    categories: [
      { name: "Food & Drinks", value: 1000, color: "#5A189A", icon: "coffee" },
      { name: "Entertainment", value: 600, color: "#7B2CBF", icon: "film" },
      { name: "Shopping", value: 500, color: "#9D4EDD", icon: "shopping-bag" },
      { name: "Transport", value: 500, color: "#BE8CFA", icon: "map-pin" },
      { name: "Others", value: 200, color: "#D8B4F8", icon: "grid" },
    ],
    transactions: [
      { title: "Dominoes Pizza", category: "Food & Drinks", amount: -450, date: "25 Jan", icon: "coffee" },
      { title: "Spotify Premium", category: "Entertainment", amount: -179, date: "15 Jan", icon: "film" },
      { title: "Auto Rickshaw Fare", category: "Transport", amount: -70, date: "10 Jan", icon: "map-pin" },
      { title: "Warm Winter Hoodie", category: "Shopping", amount: -500, date: "05 Jan", icon: "shopping-bag" },
      { title: "Chai & Samosa Stall", category: "Food & Drinks", amount: -150, date: "02 Jan", icon: "coffee" },
      { title: "Pen & Notebooks", category: "Others", amount: -200, date: "01 Jan", icon: "grid" },
    ],
  },
];

export default function InsightsScreen({ navigation, route }) {
  const { height } = useWindowDimensions();
  const isSmallDevice = height < 700;
  const styles = getStyles(isSmallDevice);

  // Extract user details
  const user = route.params?.user || {};
  const onboarding = user.onboarding || {};
  const allowance = onboarding.allowance || "5,000";
  const frequency = onboarding.frequency || "Monthly";

  const [activeMonthIndex, setActiveMonthIndex] = useState(() => {
    const now = new Date();
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const currentLabel = `${monthNames[now.getMonth()]} 2026`;
    const idx = monthsData.findIndex(m => m.monthLabel === currentLabel);
    return idx !== -1 ? idx : 0;
  });
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);
  const accentColor = "#9D4EDD";
  const [dbTransactions, setDbTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const userId = user.id || user.userId || route.params?.user?.id;
      if (!userId) return;
      const response = await fetch(`http://192.168.1.4:5000/get_transactions?userId=${userId}`);
      const data = await response.json();
      if (response.ok && data.transactions) {
        setDbTransactions(data.transactions);
      }
    } catch (err) {
      console.log("Fetch transactions failed:", err);
    }
  };

  React.useEffect(() => {
    fetchTransactions();
    const unsubscribe = navigation.addListener("focus", () => {
      fetchTransactions();
    });
    return unsubscribe;
  }, [navigation, user.id]);

  const currentMonthData = monthsData[activeMonthIndex];

  // Helper to deduplicate local and DB transactions
  const getUniqueTransactions = (dbList, localList) => {
    const combined = [...(dbList || [])];
    (localList || []).forEach(localTx => {
      const exists = combined.some(dbTx => 
        dbTx.title === localTx.title &&
        Math.abs(dbTx.amount) === Math.abs(localTx.amount) &&
        dbTx.date === localTx.date &&
        dbTx.category === localTx.category
      );
      if (!exists) {
        combined.push(localTx);
      }
    });
    return combined;
  };

  // Extract custom transactions for the currently viewed month, using robust deduplication
  const customMonthTransactions = getUniqueTransactions(dbTransactions, user.customTransactions)
    .filter(tx => tx.monthLabel === currentMonthData.monthLabel);

  // Combine custom transactions with mock transaction logs
  const monthlyTransactions = [
    ...customMonthTransactions,
    ...currentMonthData.transactions
  ];

  // Dynamically map and clean mock categories: Rename "Others" -> "Misc"
  const baseCategories = currentMonthData.categories.map(cat => {
    if (cat.name === "Others") {
      return { ...cat, name: "Misc", icon: "grid" };
    }
    return cat;
  });

  // Ensure "Bills & Utilities" is present in base categories
  if (!baseCategories.some(cat => cat.name === "Bills & Utilities")) {
    baseCategories.push({ name: "Bills & Utilities", value: 0, icon: "file-text" });
  }

  // Recalculate category spending amounts dynamically including user custom transactions
  const categoryValues = baseCategories.map(cat => {
    const customSum = customMonthTransactions
      .filter(tx => tx.category === cat.name)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    return {
      ...cat,
      value: cat.value + customSum
    };
  });

  // Calculate dynamic total spent for the active month
  const totalSpent = categoryValues.reduce((sum, cat) => sum + cat.value, 0);

  // Monochromatic Purple Gradient Palette of 6 shades (ordered Darkest -> Lightest based on spent amount):
  const PURPLE_SHADES = ["#3C096C", "#5A189A", "#7B2CBF", "#9D4EDD", "#BE8CFA", "#E0AAFF"];

  // Dynamically sort categories by value in descending order and assign monochromatic colors
  const sortedCategories = [...categoryValues]
    .sort((a, b) => b.value - a.value)
    .map((cat, idx) => ({
      ...cat,
      color: PURPLE_SHADES[idx] || PURPLE_SHADES[PURPLE_SHADES.length - 1],
    }));

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }]
    });
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
          scrollEnabled={!isMonthPickerVisible}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Spending Insights</Text>
            <View style={styles.placeholderButton} />
          </View>

          {/* Month Picker Dropdown Container */}
          <View>
            <TouchableOpacity
              onPress={() => setIsMonthPickerVisible(!isMonthPickerVisible)}
              style={styles.monthPickerButton}
              activeOpacity={0.8}
            >
              <Text style={styles.monthPickerText}>{currentMonthData.monthLabel}</Text>
              <Feather name={isMonthPickerVisible ? "chevron-up" : "chevron-down"} size={18} color="#FFFFFF" />
            </TouchableOpacity>

            {/* Inline Dropdown List Container */}
            {isMonthPickerVisible && (
              <BlurView intensity={95} tint="dark" style={styles.dropdownListCard}>
                <ScrollView style={{ maxHeight: 176 }} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                  {monthsData.map((month, idx) => {
                    const isLast = idx === monthsData.length - 1;
                    const isActive = activeMonthIndex === idx;
                    return (
                      <TouchableOpacity
                        key={idx}
                        onPress={() => {
                          setActiveMonthIndex(idx);
                          setIsMonthPickerVisible(false);
                        }}
                        style={isLast ? styles.dropdownListItemLast : styles.dropdownListItem}
                        activeOpacity={0.7}
                      >
                        <Text style={[styles.dropdownListItemText, isActive && styles.dropdownListItemTextActive]}>
                          {month.monthLabel}
                        </Text>
                        {isActive && <Feather name="check" size={14} color={accentColor} />}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </BlurView>
            )}
          </View>

          {/* Pie/Donut Chart Card */}
          <BlurView intensity={90} tint="dark" style={styles.chartCard}>
            <DonutChart
              data={sortedCategories}
              totalSpent={totalSpent}
              isSmallDevice={isSmallDevice}
            />
          </BlurView>

          {/* Category Breakdown */}
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          <BlurView intensity={90} tint="dark" style={styles.breakdownCard}>
            {sortedCategories.map((cat, idx) => {
              const isLast = idx === sortedCategories.length - 1;
              const percent = Math.round((cat.value / totalSpent) * 100);
              return (
                <View key={idx} style={isLast ? styles.breakdownItemLast : styles.breakdownItem}>
                  <View style={styles.categoryLeft}>
                    <View style={[styles.colorIndicator, { backgroundColor: cat.color }]} />
                    <Text style={styles.categoryName}>{cat.name}</Text>
                  </View>
                  <View style={styles.categoryRight}>
                    <Text style={styles.categoryAmount}>₹{cat.value.toLocaleString("en-IN")}</Text>
                    <Text style={styles.categoryPercent}>{percent}%</Text>
                  </View>
                </View>
              );
            })}
          </BlurView>

          {/* Monthly Transactions List */}
          <Text style={styles.sectionTitle}>Transactions for {currentMonthData.monthLabel.split(" ")[0]}</Text>
          <BlurView intensity={90} tint="dark" style={styles.transactionCard}>
            {monthlyTransactions.map((tx, idx) => {
              const isLast = idx === monthlyTransactions.length - 1;
              return (
                <View key={idx} style={isLast ? styles.transactionItemLast : styles.transactionItem}>
                  <View style={styles.transactionIconWrapper}>
                    <Feather name={tx.icon} size={15} color={accentColor} />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{tx.title}</Text>
                    <Text style={styles.transactionCategory}>
                      {tx.category === "Others" ? "Misc" : tx.category}
                    </Text>
                  </View>
                  <View style={styles.transactionAmountContainer}>
                    <Text style={styles.transactionAmount}>
                      -₹{Math.abs(tx.amount).toLocaleString("en-IN")}
                    </Text>
                    <Text style={styles.transactionDate}>{tx.date}</Text>
                  </View>
                </View>
              );
            })}
          </BlurView>
        </ScrollView>
      </SafeAreaView>

      {/* Consistent Footer Bottom Nav Bar */}
      <View style={styles.bottomNavBar}>
        <BlurView
          intensity={100}
          tint="dark"
          style={styles.navBlurView}
        />
        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Dashboard", { user })}
        >
          <Feather name="home" size={21} color="#8A90A8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          activeOpacity={0.7}
          onPress={() => navigation.navigate("Goals", { user })}
        >
          <Feather name="target" size={21} color="#8A90A8" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.centerNavItem}
          activeOpacity={0.8}
          onPress={() => navigation.navigate("AddExpense", { user })}
        >
          <Feather name="plus" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7}>
          <Feather name="bar-chart-2" size={21} color={accentColor} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} activeOpacity={0.7} onPress={handleLogout}>
          <Feather name="user" size={21} color="#8A90A8" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
