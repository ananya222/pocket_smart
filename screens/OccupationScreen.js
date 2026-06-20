import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet
} from "react-native";

export default function OccupationScreen({ navigation }) {
  const [selected, setSelected] = useState("");

  const occupations = [
    "Student",
    "Self Employed",
    "Salaried",
    "Business Owner",
    "Other",
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Occupation</Text>

      <Text style={styles.label}>What best describes you?</Text>

      {occupations.map((item) => (
        <TouchableOpacity
          key={item}
          style={[
            styles.option,
            selected === item && styles.selected,
          ]}
          onPress={() => setSelected(item)}
        >
          <Text style={styles.optionText}>{item}</Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("BudgetFrequency")}
      >
        <Text style={styles.buttonText}>Continue</Text>
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
    marginBottom: 20,
  },
  option: {
    padding: 16,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
  },
  selected: {
    backgroundColor: "#dbeafe",
    borderColor: "#2563eb",
  },
  optionText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});