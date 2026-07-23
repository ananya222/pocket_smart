import React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "./SavingsGoalInput.styles";

export default function SavingsGoalInput({ searchQuery, handleSearchChange, isSearchFocused, setIsSearchFocused, marginSpacing, inputHeight }) {
  return (
    <>
      <Text style={styles.sectionTitle}>Goal Name:</Text>
      <View
        style={[
          styles.searchBarContainer,
          isSearchFocused && styles.searchBarContainerFocused,
          { marginBottom: marginSpacing, height: inputHeight },
        ]}
      >
        <TextInput
          style={[styles.searchInput, { paddingLeft: 14 }]}
          placeholder="e.g. Sony Headphones"
          placeholderTextColor="#8A90A8"
          value={searchQuery}
          onChangeText={handleSearchChange}
          onFocus={() => setIsSearchFocused(true)}
          onBlur={() => setIsSearchFocused(false)}
        />
      </View>
    </>
  );
}
