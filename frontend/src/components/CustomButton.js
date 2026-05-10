import React from "react";

import {
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";

import colors from "../theme/colors/theme";

export default function CustomButton({
                                         title,
                                         onPress,
                                         variant = "primary",
                                     }) {
    return (
        <TouchableOpacity
            activeOpacity={0.8}

            onPress={() => {
                if (onPress) {
                    onPress();
                }
            }}

            style={[
                styles.button,

                variant === "secondary" &&
                styles.secondaryButton,
            ]}
        >
            <Text
                style={[
                    styles.text,

                    variant === "secondary" &&
                    styles.secondaryText,
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        width: "100%",

        height: 56,

        backgroundColor: colors.red,

        borderWidth: 3,
        borderColor: colors.black,

        borderRadius: 10,

        alignItems: "center",
        justifyContent: "center",

        marginTop: 12,
    },

    secondaryButton: {
        backgroundColor: colors.gold,
    },

    text: {
        color: colors.white,

        fontSize: 15,

        fontWeight: "900",

        letterSpacing: 1.5,
    },

    secondaryText: {
        color: colors.black,
    },
});