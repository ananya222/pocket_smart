import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet
} from "react-native";

export default function BudgetScreen({ navigation }) {
  const [budget, setBudget] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your Budget</Text>

      <Text style={styles.label}>What is your budget amount?</Text>

      <TextInput
        placeholder="Enter budget"
        keyboardType="numeric"
        value={budget}
        onChangeText={setBudget}
        style={styles.input}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => alert("Finished")}
      >
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});