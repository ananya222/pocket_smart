import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { getStyles } from "../../DashboardScreen.styles";

export default function DashboardRecentTransactions({ transactions, darkModeEnabled, isSmallDevice, accentColor, navigation, user }) {
  const styles = getStyles(isSmallDevice, darkModeEnabled);

  return (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>RECENT TRANSACTIONS</Text>
        <TouchableOpacity activeOpacity={0.7} onPress={() => navigation.navigate("Insights", { user })}>
          <Text style={[styles.viewAllText, { color: accentColor }]}>View all </Text>
        </TouchableOpacity>
      </View>

      <BlurView intensity={100} tint={darkModeEnabled ? "dark" : "light"} style={styles.transactionCard}>
        {transactions.length === 0 ? (
          <View style={{ paddingVertical: 28, alignItems: "center", justifyContent: "center" }}>
            <Feather name="activity" size={24} color={darkModeEnabled ? "rgba(255, 255, 255, 0.25)" : "rgba(0, 0, 0, 0.25)"} style={{ marginBottom: 8 }} />
            <Text style={{ color: darkModeEnabled ? "#8A90A8" : "#5A607F", fontSize: 13, fontFamily: "Geist-Regular", textAlign: "center" }}>
              No transactions yet
            </Text>
          </View>
        ) : (
          transactions.map((tx, idx) => (
            <View 
              key={`${tx.id}-${idx}`} 
              style={idx === transactions.length - 1 ? styles.transactionItemLast : styles.transactionItem}
            >
              <View style={styles.transactionIconWrapper}>
                <Feather name={tx.icon || "shopping-cart"} size={isSmallDevice ? 14 : 18} color={tx.iconColor} />
              </View>
              <View style={styles.transactionDetails}>
                <Text style={styles.transactionTitle}>{tx.title}</Text>
                <Text style={styles.transactionCategory}>{tx.category}</Text>
              </View>
              <View style={styles.transactionAmountContainer}>
                <Text 
                  style={
                    tx.amount < 0 
                      ? styles.transactionAmountNegative 
                      : [styles.transactionAmountPositive, { color: accentColor }]
                  }
                >
                  {tx.amount < 0 ? "-" : "+"}₹{Math.abs(tx.amount).toLocaleString("en-IN")}
                </Text>
                <Text style={styles.transactionDate}>{tx.date}</Text>
              </View>
            </View>
          ))
        )}
      </BlurView>
    </>
  );
}
