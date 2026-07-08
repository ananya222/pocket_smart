import { API_BASE_URL } from "../config";
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
import Svg, { Circle, G, Rect, Text as SvgText } from "react-native-svg";
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
          {totalSpent > 0 && data.map((item, idx) => {
            const percent = (item.value / totalSpent) * 100;
            if (isNaN(percent) || percent <= 0) return null;

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
}

// Custom premium SVG Bar Chart component
function BarChart({ data, categoryColorMap, isSmallDevice }) {
  const chartHeight = 90; // Height of the bar chart area
  const graphHeight = 150;
  const graphWidth = 320;
  const paddingLeft = 15;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 20;

  const maxSpent = Math.max(...data.map(d => d.totalSpent), 1000);
  const N = data.length;
  const containerWidth = graphWidth - paddingLeft - paddingRight;
  const spacing = 12;
  const barWidth = Math.max(16, (containerWidth - (N - 1) * spacing) / N);

  const formatAmount = (amt) => {
    if (amt === 0) return "₹0";
    if (amt >= 1000) return `₹${(amt / 1000).toFixed(1)}k`.replace(".0", "");
    return `₹${amt}`;
  };

  const categoriesList = ["Food & Drinks", "Entertainment", "Shopping", "Transport", "Misc", "Bills & Utilities"];

  return (
    <View style={{ alignItems: "center", justifyContent: "center", height: 160, width: "100%", paddingVertical: 5 }}>
      <Svg width={graphWidth} height={graphHeight} viewBox={`0 0 ${graphWidth} ${graphHeight}`}>
        {/* Subtle baseline */}
        <Rect
          x={paddingLeft}
          y={paddingTop + chartHeight}
          width={containerWidth}
          height={1}
          fill="rgba(255, 255, 255, 0.08)"
        />

        {data.map((item, idx) => {
          const x = paddingLeft + idx * (barWidth + spacing) + (containerWidth - (N * barWidth + (N - 1) * spacing)) / 2;
          
          // Calculate category spent for this specific month
          const categorySpend = {};
          categoriesList.forEach(name => { categorySpend[name] = 0; });
          
          if (item.transactions) {
            item.transactions.forEach(tx => {
              const category = tx.category === "Others" ? "Misc" : tx.category;
              if (categorySpend[category] !== undefined) {
                categorySpend[category] += Math.abs(tx.amount);
              }
            });
          }

          let currentY = paddingTop + chartHeight;
          const segments = [];

          categoriesList.forEach((catName) => {
            const spentAmt = categorySpend[catName] || 0;
            if (spentAmt > 0) {
              const segmentHeight = (spentAmt / maxSpent) * chartHeight;
              const segY = currentY - segmentHeight;
              const color = (categoryColorMap && categoryColorMap[catName]) || "#9D4EDD";
              segments.push({
                y: segY,
                height: segmentHeight,
                color,
              });
              currentY -= segmentHeight;
            }
          });

          // The total height of the stack (y position of the top segment)
          const topY = segments.length > 0 ? segments[segments.length - 1].y : (paddingTop + chartHeight);

          return (
            <G key={idx}>
              {/* Stacked Bar Segments */}
              {segments.map((seg, sIdx) => {
                const isTop = sIdx === segments.length - 1;
                return (
                  <Rect
                    key={sIdx}
                    x={x}
                    y={seg.y}
                    width={barWidth}
                    height={seg.height}
                    fill={seg.color}
                    rx={isTop ? Math.min(barWidth / 2, 4) : 0}
                    ry={isTop ? Math.min(barWidth / 2, 4) : 0}
                  />
                );
              })}

              {/* Value Label above Bar */}
              <SvgText
                x={x + barWidth / 2}
                y={topY - 6}
                fill="#FFFFFF"
                fontSize={8}
                fontFamily="Geist-Regular"
                textAnchor="middle"
              >
                {formatAmount(item.totalSpent)}
              </SvgText>

              {/* Month Label below Bar */}
              <SvgText
                x={x + barWidth / 2}
                y={paddingTop + chartHeight + 16}
                fill="#8A90A8"
                fontSize={9}
                fontFamily="Geist-Regular"
                textAnchor="middle"
              >
                {item.shortLabel}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}

// Define monthsData outside component to prevent re-creation and reference errors during dynamic index initialization
const CATEGORY_TEMPLATES = [
  { name: "Food & Drinks", icon: "coffee" },
  { name: "Entertainment", icon: "film" },
  { name: "Shopping", icon: "shopping-bag" },
  { name: "Transport", icon: "map-pin" },
  { name: "Misc", icon: "grid" },
  { name: "Bills & Utilities", icon: "file-text" },
];

const monthsData = [
  { monthLabel: "All Time" },
  { monthLabel: "December 2026" },
  { monthLabel: "November 2026" },
  { monthLabel: "October 2026" },
  { monthLabel: "September 2026" },
  { monthLabel: "August 2026" },
  { monthLabel: "July 2026" },
  { monthLabel: "June 2026" },
  { monthLabel: "May 2026" },
  { monthLabel: "April 2026" },
  { monthLabel: "March 2026" },
  { monthLabel: "February 2026" },
  { monthLabel: "January 2026" },
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
    return idx !== -1 ? idx : 0; // Fallback to "All Time" (index 0) if current month is not found
  });
  const [isMonthPickerVisible, setIsMonthPickerVisible] = useState(false);
  const [analysisMode, setAnalysisMode] = useState("single"); // "single" | "range"
  const [startMonthIndex, setStartMonthIndex] = useState(12); // January 2026 (oldest in range example, shifted)
  const [endMonthIndex, setEndMonthIndex] = useState(7);      // June 2026 (newest in range example, shifted)
  const [isStartPickerVisible, setIsStartPickerVisible] = useState(false);
  const [isEndPickerVisible, setIsEndPickerVisible] = useState(false);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const accentColor = "#9D4EDD";
  const [dbTransactions, setDbTransactions] = useState([]);

  const fetchTransactions = async () => {
    try {
      const userId = user.id || user.userId || route.params?.user?.id;
      if (!userId) return;
      const response = await fetch(`${API_BASE_URL}/get_transactions?userId=${userId}`);
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
    .filter(tx => currentMonthData.monthLabel === "All Time" || tx.monthLabel === currentMonthData.monthLabel);

  // Combine custom transactions only (exclude mock transactions)
  const monthlyTransactionsSingle = customMonthTransactions;

  // Dynamically map standard categories setting base value to 0
  const baseCategories = CATEGORY_TEMPLATES.map(cat => {
    return { name: cat.name, value: 0, icon: cat.icon };
  });

  // Recalculate category spending amounts dynamically including user custom transactions
  const categoryValues = baseCategories.map(cat => {
    const customSum = customMonthTransactions
      .filter(tx => tx.category === cat.name)
      .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    return {
      ...cat,
      value: customSum
    };
  });

  // Calculate dynamic total spent for the active month
  const totalSpentSingle = categoryValues.reduce((sum, cat) => sum + cat.value, 0);

  // Vibrant contrasting multi-color palette (Blue, Green, Yellow, Red, Neon Cyan, Orange):
  const VIBRANT_PALETTE = ["#3A86FF", "#06D6A0", "#FFBE0B", "#FF006E", "#00F5D4", "#FF9F1C"];

  // Dynamically sort categories by value in descending order and assign colors
  const sortedCategoriesSingle = [...categoryValues]
    .sort((a, b) => b.value - a.value)
    .map((cat, idx) => ({
      ...cat,
      color: VIBRANT_PALETTE[idx] || VIBRANT_PALETTE[VIBRANT_PALETTE.length - 1],
    }));

  // Range Calculations
  const minIdx = Math.min(startMonthIndex, endMonthIndex);
  const maxIdx = Math.max(startMonthIndex, endMonthIndex);
  const rangeMonths = monthsData.slice(minIdx, maxIdx + 1).reverse();
  const uniqueAllTransactions = getUniqueTransactions(dbTransactions, user.customTransactions);

  const rangeMonthsData = rangeMonths.map(month => {
    const monthTxs = uniqueAllTransactions.filter(tx => tx.monthLabel === month.monthLabel);
    const baseCats = CATEGORY_TEMPLATES.map(cat => ({
      name: cat.name,
      value: 0
    }));
    const catVals = baseCats.map(cat => {
      const customSum = monthTxs
        .filter(tx => tx.category === cat.name)
        .reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
      return { ...cat, value: customSum };
    });
    const mTotalSpent = catVals.reduce((sum, cat) => sum + cat.value, 0);
    return {
      monthLabel: month.monthLabel,
      shortLabel: month.monthLabel.split(" ")[0].substring(0, 3),
      totalSpent: mTotalSpent,
      transactions: monthTxs
    };
  });

  const aggregatedCategoriesMap = {};
  const categoriesList = ["Food & Drinks", "Entertainment", "Shopping", "Transport", "Misc", "Bills & Utilities"];
  categoriesList.forEach(name => {
    aggregatedCategoriesMap[name] = 0;
  });

  rangeMonthsData.forEach(rm => {
    rm.transactions.forEach(tx => {
      const category = tx.category === "Others" ? "Misc" : tx.category;
      if (aggregatedCategoriesMap[category] !== undefined) {
        aggregatedCategoriesMap[category] += Math.abs(tx.amount);
      }
    });
  });

  const rangeCategoryValues = Object.keys(aggregatedCategoriesMap).map(name => {
    let icon = "grid";
    if (name === "Food & Drinks") icon = "coffee";
    else if (name === "Entertainment") icon = "film";
    else if (name === "Shopping") icon = "shopping-bag";
    else if (name === "Transport") icon = "map-pin";
    else if (name === "Bills & Utilities") icon = "file-text";
    return {
      name,
      value: aggregatedCategoriesMap[name],
      icon
    };
  });

  const totalSpentRange = rangeCategoryValues.reduce((sum, cat) => sum + cat.value, 0);

  const sortedCategoriesRange = [...rangeCategoryValues]
    .sort((a, b) => b.value - a.value)
    .map((cat, idx) => ({
      ...cat,
      color: VIBRANT_PALETTE[idx] || VIBRANT_PALETTE[VIBRANT_PALETTE.length - 1],
    }));

  const monthlyTransactionsRange = rangeMonthsData.reduce((all, rm) => {
    return [...all, ...rm.transactions];
  }, []);

  // Dynamic conditional displays
  const totalSpent = analysisMode === "single" ? totalSpentSingle : totalSpentRange;
  const sortedCategories = analysisMode === "single" ? sortedCategoriesSingle : sortedCategoriesRange;
  const monthlyTransactions = analysisMode === "single" ? monthlyTransactionsSingle : monthlyTransactionsRange;
  const displayedTransactions = showAllTransactions ? monthlyTransactions : monthlyTransactions.slice(0, 5);

  // Map category name to its color
  const categoryColorMap = React.useMemo(() => {
    const mapping = {};
    sortedCategories.forEach(cat => {
      mapping[cat.name] = cat.color;
    });
    return mapping;
  }, [sortedCategories]);

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
          scrollEnabled={!isMonthPickerVisible && !isStartPickerVisible && !isEndPickerVisible}
        >
          {/* Header Row */}
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => navigation.goBack()} activeOpacity={0.7} style={styles.backButton}>
              <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Spending Insights</Text>
            <View style={styles.placeholderButton} />
          </View>

          {/* Mode Toggle Selector */}
          <View style={styles.toggleContainer}>
            <TouchableOpacity
              onPress={() => {
                setAnalysisMode("single");
                setIsStartPickerVisible(false);
                setIsEndPickerVisible(false);
              }}
              style={[styles.togglePill, analysisMode === "single" && styles.togglePillActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, analysisMode === "single" && styles.toggleTextActive]}>
                Single Month
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setAnalysisMode("range");
                setIsMonthPickerVisible(false);
              }}
              style={[styles.togglePill, analysisMode === "range" && styles.togglePillActive]}
              activeOpacity={0.7}
            >
              <Text style={[styles.toggleText, analysisMode === "range" && styles.toggleTextActive]}>
                Monthly Range
              </Text>
            </TouchableOpacity>
          </View>

          {/* Month Picker Dropdown Container */}
          {analysisMode === "single" ? (
            <View style={{ marginBottom: isSmallDevice ? 12 : 16 }}>
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
          ) : (
            <View style={{ marginBottom: isSmallDevice ? 12 : 16 }}>
              <View style={styles.rangePickersRow}>
                <View style={{ flex: 1, marginRight: 6 }}>
                  <Text style={styles.pickerLabel}>FROM</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsStartPickerVisible(!isStartPickerVisible);
                      setIsEndPickerVisible(false);
                    }}
                    style={styles.monthPickerButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.monthPickerText} numberOfLines={1}>
                      {monthsData[startMonthIndex].monthLabel}
                    </Text>
                    <Feather name={isStartPickerVisible ? "chevron-up" : "chevron-down"} size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>

                <View style={{ flex: 1, marginLeft: 6 }}>
                  <Text style={styles.pickerLabel}>TO</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setIsEndPickerVisible(!isEndPickerVisible);
                      setIsStartPickerVisible(false);
                    }}
                    style={styles.monthPickerButton}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.monthPickerText} numberOfLines={1}>
                      {monthsData[endMonthIndex].monthLabel}
                    </Text>
                    <Feather name={isEndPickerVisible ? "chevron-up" : "chevron-down"} size={18} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Start Picker Dropdown */}
              {isStartPickerVisible && (
                <BlurView intensity={95} tint="dark" style={styles.dropdownListCard}>
                  <ScrollView style={{ maxHeight: 176 }} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                    {monthsData.map((month, idx) => {
                      if (month.monthLabel === "All Time") return null;
                      const isLast = idx === monthsData.length - 1;
                      const isActive = startMonthIndex === idx;
                      return (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => {
                            setStartMonthIndex(idx);
                            setIsStartPickerVisible(false);
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

              {/* End Picker Dropdown */}
              {isEndPickerVisible && (
                <BlurView intensity={95} tint="dark" style={styles.dropdownListCard}>
                  <ScrollView style={{ maxHeight: 176 }} nestedScrollEnabled={true} showsVerticalScrollIndicator={true}>
                    {monthsData.map((month, idx) => {
                      if (month.monthLabel === "All Time") return null;
                      const isLast = idx === monthsData.length - 1;
                      const isActive = endMonthIndex === idx;
                      return (
                        <TouchableOpacity
                          key={idx}
                          onPress={() => {
                            setEndMonthIndex(idx);
                            setIsEndPickerVisible(false);
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
          )}

          {/* Chart Card */}
          <BlurView intensity={90} tint="dark" style={styles.chartCard}>
            {analysisMode === "single" ? (
              <DonutChart
                data={sortedCategories}
                totalSpent={totalSpent}
                isSmallDevice={isSmallDevice}
              />
            ) : (
              <BarChart
                data={rangeMonthsData}
                categoryColorMap={categoryColorMap}
                isSmallDevice={isSmallDevice}
              />
            )}
          </BlurView>

          {/* Category Breakdown */}
          <Text style={styles.sectionTitle}>Category Breakdown</Text>
          <BlurView intensity={90} tint="dark" style={styles.breakdownCard}>
            {sortedCategories.map((cat, idx) => {
              const isLast = idx === sortedCategories.length - 1;
              const percent = totalSpent > 0 ? Math.round((cat.value / totalSpent) * 100) : 0;
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
          <Text style={styles.sectionTitle}>
            {currentMonthData.monthLabel === "All Time" ? "All Transactions" : `Transactions for ${currentMonthData.monthLabel.split(" ")[0]}`}
          </Text>
          <BlurView intensity={90} tint="dark" style={styles.transactionCard}>
            {displayedTransactions.length === 0 ? (
              <View style={{ paddingVertical: 24, alignItems: "center" }}>
                <Text style={{ color: "#8A90A8", fontSize: 13, fontFamily: "Geist-Regular" }}>
                  No transactions recorded this month.
                </Text>
              </View>
            ) : (
              <>
                {displayedTransactions.map((tx, idx) => {
                  const isLast = idx === displayedTransactions.length - 1;
                  return (
                    <View key={idx} style={isLast && !showAllTransactions ? styles.transactionItemLast : styles.transactionItem}>
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

                {monthlyTransactions.length > 5 && (
                  <TouchableOpacity
                    onPress={() => setShowAllTransactions(!showAllTransactions)}
                    style={styles.viewAllButton}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.viewAllText}>
                      {showAllTransactions ? "Show Less" : `View All (${monthlyTransactions.length})`}
                    </Text>
                    <Feather
                      name={showAllTransactions ? "chevron-up" : "chevron-down"}
                      size={14}
                      color={accentColor}
                      style={{ marginLeft: 4 }}
                    />
                  </TouchableOpacity>
                )}
              </>
            )}
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

        <TouchableOpacity 
          style={styles.navItem} 
          activeOpacity={0.7} 
          onPress={() => navigation.navigate("Profile", { user })}
        >
          <Feather name="user" size={21} color="#8A90A8" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
