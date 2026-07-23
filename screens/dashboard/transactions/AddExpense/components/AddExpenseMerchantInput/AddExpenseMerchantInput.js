import React from 'react';
import { View, TextInput } from 'react-native';
import { getStyles } from './AddExpenseMerchantInput.styles';

export default function AddExpenseMerchantInput({ merchant, setMerchant, isSmallDevice }) {
  const styles = getStyles(isSmallDevice);

  return (
    <View style={styles.formContainer}>
      <View style={styles.inputRow}>
        <TextInput
          style={styles.inputRowField}
          placeholder="Merchant name"
          placeholderTextColor="rgba(255, 255, 255, 0.2)"
          value={merchant}
          onChangeText={setMerchant}
          maxLength={30}
        />
      </View>
    </View>
  );
}
