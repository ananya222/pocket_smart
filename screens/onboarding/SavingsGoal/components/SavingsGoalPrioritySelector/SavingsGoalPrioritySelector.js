import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { styles } from "./SavingsGoalPrioritySelector.styles";

export default function SavingsGoalPrioritySelector({ priority, setPriority, marginSpacing }) {
  return (
    <>
      <Text style={styles.sectionTitle}>Goal Priority:</Text>
      <View style={[styles.priorityContainer, { marginBottom: marginSpacing }]}>
        {[1, 2, 3, 4, 5].map((num) => {
          const isSelected = priority === num;
          
          let label = "Medium";
          let activeColor = "#9D4EDD";
          if (num === 1) { label = "Critical"; activeColor = "#EF476F"; }
          else if (num === 2) { label = "High"; activeColor = "#F77F00"; }
          else if (num === 3) { label = "Medium"; activeColor = "#FFD166"; }
          else if (num === 4) { label = "Low"; activeColor = "#06D6A0"; }
          else if (num === 5) { label = "Wishlist"; activeColor = "#118AB2"; }

          return (
            <TouchableOpacity
              key={num}
              onPress={() => setPriority(num)}
              activeOpacity={0.8}
              style={[
                styles.priorityButton,
                {
                  borderColor: isSelected ? activeColor : "rgba(255, 255, 255, 0.08)",
                  backgroundColor: isSelected ? `${activeColor}1F` : "rgba(255, 255, 255, 0.03)",
                }
              ]}
            >
              <Text style={[styles.priorityNum, { color: isSelected ? "#FFFFFF" : "#8A90A8" }]}>
                {num}
              </Text>
              <Text style={[styles.priorityLabel, { color: isSelected ? "#FFFFFF" : "#8A90A8" }]}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </>
  );
}
