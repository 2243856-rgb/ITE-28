import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";

// NOTE: Removed colors import because the file does not exist
export default function InputField({
    label,
    placeholder,
    value,
    onChangeText,
    secureTextEntry,
    autoCapitalize,
}) {
    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                autoCapitalize={autoCapitalize || "none"}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: "100%",
    },
    label: {
        fontSize: 14,
        fontWeight: "bold",
        marginBottom: 5,
        color: "#333",
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        color: "#000",
        backgroundColor: "#F9F9F9",
    },
});
