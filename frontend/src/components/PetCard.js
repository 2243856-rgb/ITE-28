import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import colors from "../theme/colors/theme";

export default function PetCard({ petName, species, level, imageUrl }) {
    return (
        <View style={styles.card}>
            <View style={styles.accentBar} />
            <Image source={{ uri: imageUrl }} style={styles.image} />
            <View style={styles.info}>
                <Text style={styles.name}>{petName}</Text>
                <Text style={styles.details}>
                    {species} · Level {level}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: colors.surfaceElevated,
        borderRadius: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
        overflow: "hidden",
    },
    accentBar: {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: colors.red,
    },
    image: {
        width: 56,
        height: 56,
        borderRadius: 28,
        marginLeft: 8,
        borderWidth: 2,
        borderColor: colors.goldMuted,
    },
    info: {
        marginLeft: 16,
        flex: 1,
        justifyContent: "center",
    },
    name: {
        color: colors.textPrimary,
        fontSize: 17,
        fontWeight: "800",
        letterSpacing: 0.3,
    },
    details: {
        color: colors.textSecondary,
        fontSize: 14,
        marginTop: 4,
        fontWeight: "600",
    },
});
