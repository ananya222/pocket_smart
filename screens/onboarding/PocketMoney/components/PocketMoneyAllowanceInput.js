import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "./PocketMoneyAllowanceInput.styles";

export default function PocketMoneyAllowanceInput({ allowance, onChange }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <>
      <Text style={styles.sectionTitle}>Allowance Amount</Text>
      <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
        <Text style={styles.currencySymbol}>₹</Text>
        <TextInput
          style={styles.inputFlex}
          placeholder="5,000"
          placeholderTextColor="#6C6F8F"
          keyboardType="numeric"
          value={allowance}
          onChangeText={onChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </>
  );
}
