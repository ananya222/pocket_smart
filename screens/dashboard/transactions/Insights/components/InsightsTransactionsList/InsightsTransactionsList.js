import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { getStyles } from "./InsightsTransactionsList.styles";

export default function InsightsTransactionsList({ 
  displayedTransactions, 
  monthlyTransactions, 
  showAllTransactions, 
  setShowAllTransactions, 
  accentColor, 
  isSmallDevice 
}) {
  const styles = getStyles(isSmallDevice);

  return (
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
  );
}
