import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import colors from "../theme/colors/theme";

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
            {label ? (
                <Text style={styles.label}>{label}</Text>
            ) : null}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor={colors.textMuted}
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
        marginBottom: 16,
        width: "100%",
    },
    label: {
        fontSize: 12,
        fontWeight: "800",
        marginBottom: 8,
        color: colors.textSecondary,
        letterSpacing: 1.2,
    },
    input: {
        height: 52,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 16,
        color: colors.textPrimary,
        backgroundColor: colors.surfaceElevated,
    },
});
