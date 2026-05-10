import React from "react";

import {
    View,
    TextInput,
    Text,
    StyleSheet,
} from "react-native";

import colors from "../theme/colors/theme";

export default function InputField({
                                       label,
                                       ...props
                                   }) {
    return (
        <View style={styles.container}>
            {label && (
                <Text style={styles.label}>
                    {label}
                </Text>
            )}

            <TextInput
                placeholderTextColor="#777"
                {...props}
                style={styles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 14,
    },

    label: {
        marginBottom: 8,

        color: colors.darkRed,

        fontWeight: "800",

        letterSpacing: 1,
    },

    input: {
        height: 56,

        backgroundColor: colors.white,

        borderWidth: 3,
        borderColor: colors.black,

        borderRadius: 10,

        paddingHorizontal: 16,

        color: colors.black,

        fontSize: 15,
        fontWeight: "700",
    },
});