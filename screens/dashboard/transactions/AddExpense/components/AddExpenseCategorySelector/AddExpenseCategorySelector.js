import React from 'react';
import { View, Text, TouchableOpacity, Keyboard } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { getStyles } from './AddExpenseCategorySelector.styles';

const CATEGORIES = [
  { name: "Food & Drinks", icon: "coffee" },
  { name: "Shopping", icon: "shopping-bag" },
  { name: "Transport", icon: "map-pin" },
  { name: "Bills & Utilities", icon: "file-text" },
  { name: "Entertainment", icon: "film" },
  { name: "Misc", icon: "grid" }
];

export default function AddExpenseCategorySelector({ selectedCategory, setSelectedCategory, isSmallDevice }) {
  const styles = getStyles(isSmallDevice);

  return (
    <>
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
    </>
  );
}
