import React from "react";
import { View, Text, TextInput } from "react-native";
import { styles } from "./SavingsGoalAmountInput.styles";

export default function SavingsGoalAmountInput({ targetAmount, handleAmountChange, isAmountFocused, setIsAmountFocused, marginSpacing, inputHeight }) {
  return (
    <>
      <Text style={styles.sectionTitle}>Target Amount:</Text>
      <View
        style={[
          styles.inputContainer,
          isAmountFocused && styles.inputContainerFocused,
          { marginBottom: marginSpacing, height: inputHeight },
        ]}
      >
        <Text style={styles.currencySymbol}>₹</Text>
        <TextInput
          style={styles.inputFlex}
          placeholder="8,000"
          placeholderTextColor="#8A90A8"
          keyboardType="numeric"
          value={targetAmount}
          onChangeText={handleAmountChange}
          onFocus={() => setIsAmountFocused(true)}
          onBlur={() => setIsAmountFocused(false)}
        />
      </View>
    </>
  );
}
