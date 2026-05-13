import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

export default function InputField({ label, placeholder, value, onChangeText, secureTextEntry, ...rest }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label} :</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#555555"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        width: '100%',
    },
    label: {
        fontFamily: 'monospace',
        color: '#FF007F', // Neon Pink
        fontSize: 14,
        marginBottom: 5,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    input: {
        backgroundColor: '#000000',
        borderWidth: 3,
        borderColor: '#FF007F',
        color: '#FFFFFF',
        fontFamily: 'monospace',
        fontSize: 16,
        padding: 12,
    },
});