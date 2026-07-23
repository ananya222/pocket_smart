import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { getStyles } from './AddExpenseAmountInput.styles';

export default function AddExpenseAmountInput({ amount, setAmount, isSmallDevice }) {
  const styles = getStyles(isSmallDevice);

  return (
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
  );
}
