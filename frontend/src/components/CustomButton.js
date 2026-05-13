import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    View,
} from "react-native";
import colors from "../theme/colors/theme";

/**
 * @param {"primary" | "secondary"} [variant]
 * @param {string} [color] — optional override for primary fill
 */
export default function CustomButton({
    title,
    onPress,
    variant = "primary",
    color,
}) {
    const isSecondary = variant === "secondary";

    return (
        <TouchableOpacity
            activeOpacity={0.88}
            onPress={onPress}
            style={[
                styles.touch,
                isSecondary ? styles.secondaryOuter : styles.primaryOuter,
                !isSecondary && color
                    ? { backgroundColor: color }
                    : null,
            ]}
        >
            {isSecondary ? (
                <View style={styles.secondaryInner}>
                    <Text style={styles.secondaryText}>{title}</Text>
                </View>
            ) : (
                <Text style={styles.primaryText}>{title}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    touch: {
        borderRadius: 12,
        marginVertical: 8,
        minHeight: 52,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },
    primaryOuter: {
        backgroundColor: colors.red,
        borderWidth: 1,
        borderColor: colors.darkRed,
        borderBottomWidth: 3,
        borderBottomColor: colors.darkRed,
    },
    primaryText: {
        color: colors.white,
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 1.5,
    },
    secondaryOuter: {
        backgroundColor: colors.surfaceElevated,
        borderWidth: 2,
        borderColor: colors.gold,
        borderBottomWidth: 3,
        borderBottomColor: colors.darkRed,
    },
    secondaryInner: {
        paddingVertical: 14,
        paddingHorizontal: 20,
        width: "100%",
        alignItems: "center",
    },
    secondaryText: {
        color: colors.darkRed,
        fontSize: 15,
        fontWeight: "800",
        letterSpacing: 1.5,
    },
});
